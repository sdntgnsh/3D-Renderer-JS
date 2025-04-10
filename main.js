// main.js

// Listen for custom input events emitted from controls.js
document.addEventListener("controlInput", (e) => {
  const direction = e.detail?.direction;
  const key = e.detail?.key;

  switch (direction || key) {
    case "UP":
      console.log("Move up in 3D engine");
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
    default:
      break;
  }
});

