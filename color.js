export class Color {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // Returns a CSS-style rgba() string (useful for canvas context if needed)
  toRGBA() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;
  }

  // Returns a copy of the color
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
