import { Matrix3 } from "./matrix.js";
import { Vertex } from "./vertex.js";
import { Polygon } from "./polygon.js";
import { CoordinateCreator } from "./CoordinateCreator.js";

let ct = 0;

  let totalRotationAngleXZ = 0.0;
  let totalRotationAngleXY = 0.0;
  const speed = 2;
// === Input Event Listener from controls.js ===
document.addEventListener("controlInput", (e) => {
  const direction = e.detail?.direction;
  const key = e.detail?.key;

  switch (direction || key) {
    case "UP":
      console.log("Move up in 3D engine");
      ct++;
      totalRotationAngleXY++;
      break;
    case "DOWN":
      console.log("Move down in 3D engine");
      totalRotationAngleXY--;
      break;
    case "LEFT":
      console.log("Move left in 3D engine");
      totalRotationAngleXZ--;
      break;
    case "RIGHT":
      console.log("Move right in 3D engine");
      totalRotationAngleXZ++;
      break;
    case "A":
      console.log("Action A triggered");
      break;
    case "B":
      console.log("Action B triggered");
      break;

    case "Q":
      console.log("Shape mode triggered");
      break;
    case "F":
      console.log("Wireframe mode toggled");
      break;
    case "C":
      console.log("Color change triggered");
      break;
    case "CUBE":
    case "TETRAHEDRON":
    case "ICOSAHEDRON":
    case "MOBIUS-STRIP":
      console.log(`Shape selected: ${key}`);
      break;
    default:
      break;
  }
});



 
// === Vertex Class ===

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

  
function drawFrame() {

  if (window.activeKeys.has(38)) totalRotationAngleXY++;  // UP
if (window.activeKeys.has(40)) totalRotationAngleXY--;  // DOWN
if (window.activeKeys.has(37)) totalRotationAngleXZ--;  // LEFT
if (window.activeKeys.has(39)) totalRotationAngleXZ++;  // RIGHT

  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const Shape_Coords = CoordinateCreator.createCubeCoords(200);

  let poly_list = new Array();

  let color_list = new Array("red");

  for (let i = 0; i < Shape_Coords.length; i++) {
    poly_list.push(
      new Polygon(Shape_Coords[i], color_list[i % color_list.length])
    );
  }



  // poly = poly_list;

const heading = (totalRotationAngleXZ * speed * Math.PI) / 180; // Convert to radians
const pitch = (totalRotationAngleXY * speed * Math.PI) / 180;   // Convert to radians

const headingTransform = new Matrix3([
  Math.cos(heading), 0, Math.sin(heading),
  0, 1, 0,
  -Math.sin(heading), 0, Math.cos(heading),
]);

const pitchTransform = new Matrix3([
  1, 0, 0,
  0, Math.cos(pitch), Math.sin(pitch),
  0, -Math.sin(pitch), Math.cos(pitch),
]);

const transform = headingTransform.multiply(pitchTransform);


if(true){
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.strokeStyle = "white";

for (const poly of poly_list) {
  // Apply the transformation to each vertex
  for (let i = 0; i < poly.vertex_arr.length; i++) {
    poly.vertex_arr[i] = transform.transform(poly.vertex_arr[i]);
  }

  ctx.beginPath();
  let prevVertex = poly.vertex_arr[0];
  ctx.moveTo(prevVertex.x, prevVertex.y);

  for (let i = 1; i < poly.vertex_arr.length; i++) {
    const v = poly.vertex_arr[i];
    ctx.lineTo(v.x, v.y);
  }

  // Close the shape
  ctx.lineTo(poly.vertex_arr[0].x, poly.vertex_arr[0].y);
  ctx.closePath();
  ctx.stroke();
}

ctx.restore();

}
else{

}


  // Loop again on the next frame
  requestAnimationFrame(drawFrame);
}

// Start the loop
drawFrame();
