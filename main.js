import { Matrix3 } from "./matrix.js";
import { Vertex } from "./vertex.js";

let ct = 0;

// === Input Event Listener from controls.js ===
document.addEventListener("controlInput", (e) => {
  const direction = e.detail?.direction;
  const key = e.detail?.key;

  switch (direction || key) {
    case "UP":
      console.log("Move up in 3D engine");
      ct++;
      break;
    case "DOWN":
      console.log("Move down in 3D engine");
      break;
    case "LEFT":
      console.log("Move left in 3D engine");
      break;
    case "RIGHT":
      console.log("Move right in 3D engine");
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

// // Set canvas size (you can also do this with CSS)
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

function drawFrame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Example: Draw a red rectangle that moves over time
  const time = Date.now() * 0.002; // in seconds
  const x = canvas.width / 2 + Math.sin(time) * 100;
  const y = canvas.height / 2;

  if (ct % 2 === 0) {
    ctx.fillStyle = "red";
    ctx.fillRect(x - 25, y - 25, 50, 50); // center at (x, y)
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(x - 25, y - 25, 50, 50); // center at (x, y)
  }

  // Loop again on the next frame
  requestAnimationFrame(drawFrame);
}

// Start the loop
drawFrame();
