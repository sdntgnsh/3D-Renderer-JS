export class Vertex {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
