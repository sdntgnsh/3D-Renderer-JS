import { Vertex } from "./vertex.js";

export function renderSolidPolygons(ctx, canvas, polygon_list, transform) {
  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.createImageData(width, height);
  const buffer = imageData.data;
  const zBuffer = new Float32Array(width * height).fill(
    Number.NEGATIVE_INFINITY
  );

  const lightDir = { x: 0, y: 0, z: -1 };
  const lightMag = Math.sqrt(
    lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2
  );
  lightDir.x /= lightMag;
  lightDir.y /= lightMag;
  lightDir.z /= lightMag;

  for (const poly of polygon_list) {
    const transformedVerts = poly.vertex_arr.map((v) =>
      transform.transform(new Vertex(v.x, v.y, v.z))
    );

    if (transformedVerts.length < 3) continue;

    // Ensure consistent triangle winding using area
    const [tv0, tv1, tv2] = transformedVerts;
    const fixedVerts = ensureCounterClockwise(tv0, tv1, tv2);

    const edge1 = {
      x: fixedVerts[1].x - fixedVerts[0].x,
      y: fixedVerts[1].y - fixedVerts[0].y,
      z: fixedVerts[1].z - fixedVerts[0].z,
    };
    const edge2 = {
      x: fixedVerts[2].x - fixedVerts[0].x,
      y: fixedVerts[2].y - fixedVerts[0].y,
      z: fixedVerts[2].z - fixedVerts[0].z,
    };

    const normal = {
      x: edge1.y * edge2.z - edge1.z * edge2.y,
      y: edge1.z * edge2.x - edge1.x * edge2.z,
      z: edge1.x * edge2.y - edge1.y * edge2.x,
    };

    const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
    if (length < 0.0001) continue;
    normal.x /= length;
    normal.y /= length;
    normal.z /= length;

    const dotProduct =
      normal.x * lightDir.x + normal.y * lightDir.y + normal.z * lightDir.z;
    const lightIntensity = dotProduct <= 0 ? 0.4 : 0.4 + 0.6 * dotProduct;

    const shadedColor = {
      r: Math.floor(poly.color.r * lightIntensity),
      g: Math.floor(poly.color.g * lightIntensity),
      b: Math.floor(poly.color.b * lightIntensity),
      a: 255,
    };

    const screenVerts = transformedVerts.map(
      (v) => new Vertex(v.x + width / 2, v.y + height / 2, v.z)
    );

    let minX = width,
      maxX = 0,
      minY = height,
      maxY = 0;
    for (const v of screenVerts) {
      minX = Math.max(0, Math.min(minX, Math.floor(v.x)));
      maxX = Math.min(width - 1, Math.max(maxX, Math.ceil(v.x)));
      minY = Math.max(0, Math.min(minY, Math.floor(v.y)));
      maxY = Math.min(height - 1, Math.max(maxY, Math.ceil(v.y)));
    }

    if (minX >= maxX || minY >= maxY) continue;

    if (screenVerts.length === 3) {
      const [s0, s1, s2] = ensureCounterClockwise(
        screenVerts[0],
        screenVerts[1],
        screenVerts[2]
      );
      rasterizeTriangle(
        s0,
        s1,
        s2,
        shadedColor,
        zBuffer,
        buffer,
        width,
        minX,
        maxX,
        minY,
        maxY
      );
    } else if (screenVerts.length === 4) {
      const [s0, s1, s2, s3] = screenVerts;
      const [t0, t1, t2] = ensureCounterClockwise(s0, s1, s2);
      rasterizeTriangle(
        t0,
        t1,
        t2,
        shadedColor,
        zBuffer,
        buffer,
        width,
        minX,
        maxX,
        minY,
        maxY
      );
      const [t3, t4, t5] = ensureCounterClockwise(s0, s2, s3);
      rasterizeTriangle(
        t3,
        t4,
        t5,
        shadedColor,
        zBuffer,
        buffer,
        width,
        minX,
        maxX,
        minY,
        maxY
      );
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function edgeFunction(v0, v1, p) {
  return (p.x - v0.x) * (v1.y - v0.y) - (p.y - v0.y) * (v1.x - v0.x);
}

function rasterizeTriangle(
  v0,
  v1,
  v2,
  color,
  zBuffer,
  buffer,
  width,
  minX,
  maxX,
  minY,
  maxY
) {
  const area = edgeFunction(v0, v1, v2);
  if (Math.abs(area) < 0.0001) return;
  const invArea = 1 / area;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = { x: x + 0.5, y: y + 0.5 };

      const w0 = edgeFunction(v1, v2, p);
      const w1 = edgeFunction(v2, v0, p);
      const w2 = edgeFunction(v0, v1, p);

      const inside =
        area > 0
          ? w0 >= 0 && w1 >= 0 && w2 >= 0
          : w0 <= 0 && w1 <= 0 && w2 <= 0;
      if (inside) {
        const b0 = w0 * invArea;
        const b1 = w1 * invArea;
        const b2 = w2 * invArea;

        const depth = b0 * v0.z + b1 * v1.z + b2 * v2.z;
        const idx = y * width + x;

        if (depth > zBuffer[idx]) {
          zBuffer[idx] = depth;
          const offset = idx * 4;
          buffer[offset] = color.r;
          buffer[offset + 1] = color.g;
          buffer[offset + 2] = color.b;
          buffer[offset + 3] = color.a;
        }
      }
    }
  }
}

function ensureCounterClockwise(v0, v1, v2) {
  const area = edgeFunction(v0, v1, v2);
  return area < 0 ? [v0, v2, v1] : [v0, v1, v2];
}
