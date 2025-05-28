import { Vertex } from "./vertex.js";

export class CoordinateCreator {
  static createCubeCoords(size) {
    const cubeCoords = [];
    const baseSize = size * 0.6;

    cubeCoords.push([
      new Vertex(baseSize, baseSize, baseSize), // window wall
      new Vertex(baseSize, baseSize, -baseSize),
      new Vertex(baseSize, -baseSize, -baseSize),
      new Vertex(baseSize, -baseSize, baseSize),
    ]);

    cubeCoords.push([
      new Vertex(-baseSize, baseSize, baseSize), // door wall
      new Vertex(-baseSize, baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
    ]);

    cubeCoords.push([
      new Vertex(baseSize, baseSize, baseSize), // bathroom wall
      new Vertex(baseSize, -baseSize, baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
      new Vertex(-baseSize, baseSize, baseSize),
    ]);

    cubeCoords.push([
      new Vertex(baseSize, baseSize, -baseSize), // opposite to bathroom
      new Vertex(baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, baseSize, -baseSize),
    ]);

    cubeCoords.push([
      new Vertex(baseSize, baseSize, baseSize), // top
      new Vertex(baseSize, baseSize, -baseSize),
      new Vertex(-baseSize, baseSize, -baseSize),
      new Vertex(-baseSize, baseSize, baseSize),
    ]);

    cubeCoords.push([
      new Vertex(baseSize, -baseSize, baseSize), // bottom
      new Vertex(baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
    ]);

    return cubeCoords;
  }

  static createTetrahedronCoords(size) {
    const tetrahedronCoords = [];
    const baseSize = size * 0.6;

    tetrahedronCoords.push([
      new Vertex(baseSize, baseSize, baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
      new Vertex(-baseSize, baseSize, -baseSize),
    ]);

    tetrahedronCoords.push([
      new Vertex(baseSize, baseSize, baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
      new Vertex(baseSize, -baseSize, -baseSize),
    ]);

    tetrahedronCoords.push([
      new Vertex(-baseSize, baseSize, -baseSize),
      new Vertex(baseSize, -baseSize, -baseSize),
      new Vertex(baseSize, baseSize, baseSize),
    ]);

    tetrahedronCoords.push([
      new Vertex(-baseSize, baseSize, -baseSize),
      new Vertex(baseSize, -baseSize, -baseSize),
      new Vertex(-baseSize, -baseSize, baseSize),
    ]);

    return tetrahedronCoords;
  }

  static createOctahedronCoords(size) {
    const baseSize = size * 1;

    const top = new Vertex(0, 0, baseSize);
    const bottom = new Vertex(0, 0, -baseSize);
    const front = new Vertex(0, baseSize, 0);
    const back = new Vertex(0, -baseSize, 0);
    const left = new Vertex(-baseSize, 0, 0);
    const right = new Vertex(baseSize, 0, 0);

    const octahedronCoords = [];

    // Top pyramid
    octahedronCoords.push([top, front, right]);
    octahedronCoords.push([top, right, back]);
    octahedronCoords.push([top, back, left]);
    octahedronCoords.push([top, left, front]);

    // Bottom pyramid
    octahedronCoords.push([bottom, right, front]);
    octahedronCoords.push([bottom, back, right]);
    octahedronCoords.push([bottom, left, back]);
    octahedronCoords.push([bottom, front, left]);

    return octahedronCoords;
  }

  static createSphereCoords(size = 100) {
    const radius = size;
    const segments = Math.max(8, Math.floor(size / 10)); // Avoid too few segments
    const sphereFaces = [];

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const theta1 = (2 * Math.PI * i) / segments;
        const theta2 = (2 * Math.PI * (i + 1)) / segments;
        const phi1 = (Math.PI * j) / segments;
        const phi2 = (Math.PI * (j + 1)) / segments;

        const v1 = new Vertex(
          radius * Math.cos(theta1) * Math.sin(phi1),
          radius * Math.sin(theta1) * Math.sin(phi1),
          radius * Math.cos(phi1)
        );
        const v2 = new Vertex(
          radius * Math.cos(theta2) * Math.sin(phi1),
          radius * Math.sin(theta2) * Math.sin(phi1),
          radius * Math.cos(phi1)
        );
        const v3 = new Vertex(
          radius * Math.cos(theta1) * Math.sin(phi2),
          radius * Math.sin(theta1) * Math.sin(phi2),
          radius * Math.cos(phi2)
        );
        const v4 = new Vertex(
          radius * Math.cos(theta2) * Math.sin(phi2),
          radius * Math.sin(theta2) * Math.sin(phi2),
          radius * Math.cos(phi2)
        );

        // Two triangles per quad
        sphereFaces.push([v1, v2, v3]);
        sphereFaces.push([v3, v2, v4]);
      }
    }

    return sphereFaces;
  }

  static createIcosahedronCoords(size) {
    const icosahedronCoords = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const baseSize = size * 0.6;

    // Define 12 vertices
    const vertices = [
      new Vertex(-baseSize, phi * baseSize, 0),
      new Vertex(baseSize, phi * baseSize, 0),
      new Vertex(-baseSize, -phi * baseSize, 0),
      new Vertex(baseSize, -phi * baseSize, 0),
      new Vertex(0, -baseSize, phi * baseSize),
      new Vertex(0, baseSize, phi * baseSize),
      new Vertex(0, -baseSize, -phi * baseSize),
      new Vertex(0, baseSize, -phi * baseSize),
      new Vertex(phi * baseSize, 0, -baseSize),
      new Vertex(phi * baseSize, 0, baseSize),
      new Vertex(-phi * baseSize, 0, -baseSize),
      new Vertex(-phi * baseSize, 0, baseSize),
    ];

    const faces = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1],
    ];

    for (const face of faces) {
      icosahedronCoords.push([
        vertices[face[0]],
        vertices[face[1]],
        vertices[face[2]],
      ]);
    }

    return icosahedronCoords;
  }

  static createTesseractCoords(size) {
    const tesseractFaces = [];
    const halfSize = size / 2;
    const vertices = new Array(16);

    for (let i = 0; i < 8; i++) {
      const x = (i & 1) === 0 ? -halfSize : halfSize;
      const y = (i & 2) === 0 ? -halfSize : halfSize;
      const z = (i & 4) === 0 ? -halfSize : halfSize;
      vertices[i] = new Vertex(x, y, z);
    }

    for (let i = 0; i < 8; i++) {
      vertices[i + 8] = new Vertex(
        vertices[i].x * 0.7,
        vertices[i].y * 0.7,
        vertices[i].z * 0.7
      );
    }

    for (let i = 0; i < 8; i++) {
      tesseractFaces.push([vertices[i], vertices[i + 8]]);
    }

    const edges = [
      0, 1, 0, 2, 0, 4, 1, 3, 1, 5, 2, 3, 2, 6, 3, 7, 4, 5, 4, 6, 5, 7, 6, 7,
    ];
    for (let i = 0; i < edges.length; i += 2) {
      tesseractFaces.push([vertices[edges[i]], vertices[edges[i + 1]]]);
      tesseractFaces.push([vertices[edges[i] + 8], vertices[edges[i + 1] + 8]]);
    }

    return tesseractFaces;
  }

  static createTorusCoords(size) {
    const polygons = [];
    const baseSize = size * 0.6;
    const segMajor = 20,
      segMinor = 20;
    const R = baseSize;
    const r = baseSize / 2.0;
    const majorStep = (2 * Math.PI) / segMajor;
    const minorStep = (2 * Math.PI) / segMinor;

    const grid = Array.from({ length: segMajor }, () => new Array(segMinor));

    for (let i = 0; i < segMajor; i++) {
      const phi = i * majorStep;
      for (let j = 0; j < segMinor; j++) {
        const theta = j * minorStep;
        const x = (R + r * Math.cos(theta)) * Math.cos(phi);
        const y = (R + r * Math.cos(theta)) * Math.sin(phi);
        const z = r * Math.sin(theta);
        grid[i][j] = new Vertex(x, y, z);
      }
    }

    for (let i = 0; i < segMajor; i++) {
      const nextI = (i + 1) % segMajor;
      for (let j = 0; j < segMinor; j++) {
        const nextJ = (j + 1) % segMinor;
        polygons.push([
          grid[i][j],
          grid[nextI][j],
          grid[nextI][nextJ],
          grid[i][nextJ],
        ]);
      }
    }

    return polygons;
  }

  static createMobiusStripCoords(size) {
    size = size * 1.5;
    const polygons = [];
    const segU = 40;
    const segV = 10;
    const R = size * 0.6;
    const w = R / 3.0;
    const du = (2 * Math.PI) / segU;
    const dv = (2 * w) / segV;

    const grid = Array.from({ length: segU }, () => new Array(segV + 1));
    for (let i = 0; i < segU; i++) {
      const u = i * du;
      for (let j = 0; j <= segV; j++) {
        const v = -w + j * dv;
        const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        grid[i][j] = new Vertex(x, y, z);
      }
    }

    for (let i = 0; i < segU; i++) {
      const nextI = (i + 1) % segU;
      for (let j = 0; j < segV; j++) {
        const v00 = grid[i][j];
        const v01 = grid[i][j + 1];
        let v10, v11;
        if (i !== segU - 1) {
          v10 = grid[nextI][j];
          v11 = grid[nextI][j + 1];
        } else {
          v10 = grid[nextI][segV - j];
          v11 = grid[nextI][segV - (j + 1)];
        }
        polygons.push([v00, v01, v11, v10]);
      }
    }

    return polygons;
  }
}
