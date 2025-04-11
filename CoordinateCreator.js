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
}
