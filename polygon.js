import { Vertex } from "./vertex.js";

export class Polygon {
  vertex_arr = [];
  color;
  sides;

  constructor(vertex_arr, color) {
    if (!Array.isArray(vertex_arr)) {
      throw new Error("vertex_arr must be an array");
    }

    for (let v of vertex_arr) {
      if (!(v instanceof Vertex)) {
        throw new Error(
          "All elements of vertex_arr must be instances of Vertex"
        );
      }
    }

    this.vertex_arr = vertex_arr;
    this.color = color;
    this.sides = vertex_arr.length;
  }
}
