import { Matrix3 } from "./matrix.js";
import { Vertex } from "./vertex.js";
import { Polygon } from "./polygon.js";
import { CoordinateCreator } from "./CoordinateCreator.js";
import { renderSolidPolygons } from "./rasterization.js";
// import { Rasterizer } from "./rasterization.js";
import {Color} from "./color.js";
let ct = 0;


window.totalRotationAngleXZ = 0.0;
window.totalRotationAngleXY = 0.0;
const speed = 2;


let wireframe_tog = true;
let canToggleWireframe = true;

const wireframeCooldown = 200; // milliseconds

function toggleWireframe() {
  if (!canToggleWireframe) return;

  wireframe_tog = !wireframe_tog;
  canToggleWireframe = false;

  // Re-enable toggling after cooldown
  setTimeout(() => {
    canToggleWireframe = true;
  }, wireframeCooldown);
}
// === Input Event Listener from controls.js ===
document.addEventListener("controlInput", (e) => {
  const direction = e.detail?.direction;
  const key = e.detail?.key;

  switch (direction || key) {
    case "UP":
      // console.log("Move up in 3D engine");
      ct++;
      totalRotationAngleXY++;
      break;
    case "DOWN":
      // console.log("Move down in 3D engine");
      totalRotationAngleXY--;
      break;
    case "LEFT":
      // console.log("Move left in 3D engine");
      totalRotationAngleXZ--;
      break;
    case "RIGHT":
      // console.log("Move right in 3D engine");
      totalRotationAngleXZ++;
      break;
    case "A":
      // console.log("Action A triggered");
      break;
    case "B":
      // console.log("Action B triggered");
      break;

    case "Q":
      console.log("Shape mode triggered");
      break;
    case "F":
      // console.log("Wireframe mode toggled");
      toggleWireframe();
      break;
    case "C":
      // console.log("Color change triggered");
      break;
    case "CUBE":
    case "TETRAHEDRON":
    case "ICOSAHEDRON":
    case "MOBIUS-STRIP":
      // console.log(`Shape selected: ${key}`);
      break;
    default:
      break;
  }
});


  function updatePauseButton() {
    const $btn = $(".pause-toggle");
    const $icon = $btn.find("ion-icon");

    if (window.isPaused) {
      $btn.addClass("green").removeClass("red");
      $icon.attr("name", "play");
    } else {
      $btn.addClass("red").removeClass("green");
      $icon.attr("name", "pause");
    }
  }
// === Vertex Class ===

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


let autoRotationPaused = false;
let autoRotationTimeout;

function pauseAutoRotationTemporarily(delay = 1000) {
  window.isPaused = true;
  console.log("Auto-rotation paused");
  autoRotationPaused = true;

  if (autoRotationTimeout) {
    clearTimeout(autoRotationTimeout);
  }

  autoRotationTimeout = setTimeout(() => {
    autoRotationPaused = false;
    window.isPaused = false; // ← move it here
    console.log("Auto-rotation resumed");
  }, delay);
}


window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // once at start

function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

let lastTime = performance.now();
function drawFrame(currentTime) {
  // updatePauseButton();
  // Clear the canvas to remove afterimages
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate time delta
  const delta = (currentTime - lastTime) / 1000; // seconds
  lastTime = currentTime;
  
  // Handle keyboard input

  const hasInput = window.activeKeys.has(38) || // UP
                 window.activeKeys.has(40) || // DOWN
                 window.activeKeys.has(37) || // LEFT
                 window.activeKeys.has(39);   // RIGHT

  if (hasInput) {
    pauseAutoRotationTemporarily();

    if (window.activeKeys.has(38)) totalRotationAngleXY += speed * 1; // UP
    if (window.activeKeys.has(40)) totalRotationAngleXY -= speed * 1; // DOWN
    if (window.activeKeys.has(37)) totalRotationAngleXZ -= speed * 1; // LEFT
    if (window.activeKeys.has(39)) totalRotationAngleXZ += speed * 1; // RIGHT
  }

  

  if(!window.isPaused && !autoRotationPaused){
    totalRotationAngleXY += speed * 0.1;
    totalRotationAngleXZ += speed * 0.15;
  }
  
  // Normalize angles to prevent numeric overflow
  function normalizeAngle(angle) {
    return ((((angle + 180) % 360) + 360) % 360) - 180;
  }
  
  // Normalize angles when they get too large
  if (Math.abs(totalRotationAngleXY) > 3600)
    totalRotationAngleXY = normalizeAngle(totalRotationAngleXY);
  if (Math.abs(totalRotationAngleXZ) > 3600)
    totalRotationAngleXZ = normalizeAngle(totalRotationAngleXZ);
  
  // Generate fresh cube coordinates each frame
  const Shape_Coords = CoordinateCreator.createCubeCoords(150);
  const color_list = [
    new Color(255, 0, 0),     // Red
    new Color(0, 255, 0),     // Green
    new Color(0, 0, 255),     // Blue
    new Color(255, 255, 0),   // Yellow
    new Color(255, 0, 255),   // Magenta
    new Color(0, 255, 255),   // Cyan
    new Color(255, 255, 255), // White
  ];
  
  // Create a fresh polygon list each frame (important!)
  let poly_list = [];
  for (let i = 0; i < Shape_Coords.length; i++) {
    poly_list.push(
      new Polygon(Shape_Coords[i], color_list[i % color_list.length])
    );
  }
  
  // Calculate transformation matrices
  const heading = (totalRotationAngleXZ * Math.PI) / 180; // Convert to radians
  const pitch = (totalRotationAngleXY * Math.PI) / 180;   // Convert to radians
  
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
 
  // Render based on wireframe toggle
  if (!wireframe_tog) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = "white";
    
    for (const poly of poly_list) {
      // Create transformed copies of vertices without modifying originals
      const transformedVerts = poly.vertex_arr.map(v => {
        const copy = new Vertex(v.x, v.y, v.z);
        return transform.transform(copy);
      });
      
      ctx.beginPath();
      ctx.moveTo(transformedVerts[0].x, transformedVerts[0].y);
      
      for (let i = 1; i < transformedVerts.length; i++) {
        const v = transformedVerts[i];
        ctx.lineTo(v.x, v.y);
      }
      
      // Close the shape
      ctx.lineTo(transformedVerts[0].x, transformedVerts[0].y);
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  } else {
    // Use the fixed renderSolidPolygons function
    renderSolidPolygons(ctx, canvas, poly_list, transform);
  }
  
  // Continue animation loop
  requestAnimationFrame(drawFrame);
}

// Start the loop
requestAnimationFrame(drawFrame);