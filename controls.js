// controls.js

function emitControlInput({ direction = null, key = null }) {
  document.dispatchEvent(
    new CustomEvent("controlInput", {
      detail: { direction, key },
    })
  );
}

$(document).keydown(function (e) {
  let direction = null;
  let key = null;

  switch (e.which) {
    case 37:
      direction = "LEFT";
      $(".left").addClass("pressed").css("transform", "translate(0, 2px)");
      $(".lefttext").text("LEFT");
      break;
    case 38:
      direction = "UP";
      $(".up").addClass("pressed").css("transform", "translate(0, 2px)");
      $(".uptext").text("UP");
      break;
    case 39:
      direction = "RIGHT";
      $(".right").addClass("pressed").css("transform", "translate(0, 2px)");
      $(".righttext").text("RIGHT");
      break;
    case 40:
      direction = "DOWN";
      $(".down").addClass("pressed").css("transform", "translate(0, 2px)");
      $(".downtext").text("DOWN");
      break;
    case 65:
      key = "A";
      $(".a").text("A");
      break;
    case 66:
      key = "B";
      $(".b").text("B");
      break;
  }

  if (direction || key) emitControlInput({ direction, key });
});

$(document).keyup(function (e) {
  switch (e.which) {
    case 37:
      $(".left").removeClass("pressed").css("transform", "translate(0, 0)");
      $(".lefttext").text("");
      break;
    case 38:
      $(".up").removeClass("pressed").css("transform", "translate(0, 0)");
      $(".uptext").text("");
      break;
    case 39:
      $(".right").removeClass("pressed").css("transform", "translate(0, 0)");
      $(".righttext").text("");
      break;
    case 40:
      $(".down").removeClass("pressed").css("transform", "translate(0, 0)");
      $(".downtext").text("");
      break;
    case 65:
      $(".a").text("");
      break;
    case 66:
      $(".b").text("");
      break;

    case 81: // Q
      $(".shape-btn").removeClass("active");
      break;
    case 70: // F
      $(".wireframe-btn").removeClass("active");
      break;
    case 67: // C
      $(".color-btn").removeClass("active");
      break;
  }
});

// Handle button clicks
$(".shape-btn").on("click", () => {
  emitControlInput({ key: "Q" });
});

$(".wireframe-btn").on("click", () => {
  emitControlInput({ key: "F" });
});

$(".color-btn").on("click", () => {
  emitControlInput({ key: "C" });
});

$("#shape-list").on("change", (e) => {
  const shape = e.target.value;
  emitControlInput({ key: shape.toUpperCase() }); // Example: "CUBE"
});

// Handle key presses (Q, F, C)
$(document).keydown(function (e) {
  let key = null;

  switch (e.which) {
    case 81: // Q
      key = "Q";
      $(".shape-btn").addClass("active");
      break;
    case 70: // F
      key = "F";
      $(".wireframe-btn").addClass("active");
      break;
    case 67: // C
      key = "C";
      $(".color-btn").addClass("active");
      break;
  }

  if (key) emitControlInput({ key });
});

// Konami code with UI feedback
var Konami = function (callback) {
  var konami = {
    input: "",
    pattern: "38384040373937396665", // Up, Up, Down, Down, Left, Right, Left, Right, B, A
    load: function (callback) {
      document.addEventListener("keydown", function (e) {
        konami.input += e.keyCode;
        if (konami.input.length > konami.pattern.length) {
          konami.input = konami.input.slice(-konami.pattern.length);
        }
        if (konami.input === konami.pattern) {
          konami.input = "";
          callback();
        }
      });
    },
  };
  konami.load(callback);
};

new Konami(function () {
  alert("Colors mode activated (Press A when you close this)!");

  $(".up").css({
    background: "orange",
    borderRight: "10px solid #996300",
    borderBottom: "10px solid #996300",
    borderLeft: "10px solid #b37300",
    borderTop: "10px solid #cc8400",
  });
  $(".uptext").css({
    color: "orange",
    textShadow: "0 0 10px orange, 0 0 10px orange",
  });

  $(".down").css({
    background: "tomato",
    borderRight: "10px solid #e02200",
    borderBottom: "10px solid #e02200",
    borderLeft: "10px solid #f92600",
    borderTop: "10px solid #ff3814",
  });
  $(".downtext").css({
    color: "tomato",
    textShadow: "0 0 10px tomato, 0 0 10px tomato",
  });

  $(".left").css({
    background: "skyblue",
    borderRight: "10px solid #30aadc",
    borderBottom: "10px solid #30aadc",
    borderLeft: "10px solid #45b3e0",
    borderTop: "10px solid #5bbce4",
  });
  $(".lefttext").css({
    color: "skyblue",
    textShadow: "0 0 10px skyblue, 0 0 10px skyblue",
  });

  $(".right").css({
    background: "red",
    borderRight: "10px solid #990000",
    borderBottom: "10px solid #990000",
    borderLeft: "10px solid #b30000",
    borderTop: "10px solid #cc0000",
  });
  $(".righttext").css({
    color: "red",
    textShadow: "0 0 10px red, 0 0 10px red",
  });
});

$(".up").on("click", function () {
  $(".uptext").text("UP");
  emitControlInput({ direction: "UP" });
});

$(".down").on("click", function () {
  $(".downtext").text("DOWN");
  emitControlInput({ direction: "DOWN" });
});

$(".left").on("click", function () {
  $(".lefttext").text("LEFT");
  emitControlInput({ direction: "LEFT" });
});

$(".right").on("click", function () {
  $(".righttext").text("RIGHT");
  emitControlInput({ direction: "RIGHT" });
});

$(".a").on("click", function () {
  $(".a").text("A");
  emitControlInput({ key: "A" });
});

$(".b").on("click", function () {
  $(".b").text("B");
  emitControlInput({ key: "B" });
});
