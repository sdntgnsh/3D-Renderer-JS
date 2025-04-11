// controls.js
(function () {
  // Global active keys set
  window.activeKeys = new Set();

  // Dispatch a custom controlInput event
  function emitControlInput({ direction = null, key = null }) {
    document.dispatchEvent(
      new CustomEvent("controlInput", { detail: { direction, key } })
    );
  }

  // Helper to add mouse event handlers for a button that represents a key control
  function addMouseKeyHandlers(selector, keyCode) {
    $(selector).on("mousedown", () => {
      window.activeKeys.add(keyCode);
      emitKeyChange();
    });
    $(selector).on("mouseup mouseleave", () => {
      window.activeKeys.delete(keyCode);
    });
  }

  // Add mouse events for arrow controls
  addMouseKeyHandlers(".up", 38);
  addMouseKeyHandlers(".down", 40);
  addMouseKeyHandlers(".left", 37);
  addMouseKeyHandlers(".right", 39);

  // Optional control button click handlers for keys Q, F, C.
  // These could represent shape, wireframe, and color controls.
  $(".shape-btn").on("click", () => {
    emitControlInput({ key: "Q" });
    window.activeKeys.add(81);
    emitKeyChange();
  });
  $(".wireframe-btn").on("click", () => {
    emitControlInput({ key: "F" });
    window.activeKeys.add(70);
    emitKeyChange();
  });
  $(".color-btn").on("click", () => {
    emitControlInput({ key: "C" });
    window.activeKeys.add(67);
    emitKeyChange();
  });

  // If using a select list for shape changes, handle that change here
  $("#shape-list").on("change", (e) => {
    const shape = e.target.value;
    emitControlInput({ key: shape.toUpperCase() }); // e.g. "CUBE"
  });

  // Update all keys in the activeKeys set.
  // This iterates through currently held keys and emits a controlInput event for each.
  function emitKeyChange() {
    window.activeKeys.forEach((code) => {
      let detail = {};
      switch (code) {
        case 37:
          detail.direction = "LEFT";
          break;
        case 38:
          detail.direction = "UP";
          break;
        case 39:
          detail.direction = "RIGHT";
          break;
        case 40:
          detail.direction = "DOWN";
          break;
        case 65:
          detail.key = "A";
          break;
        case 66:
          detail.key = "B";
          break;
        case 81:
          detail.key = "Q";
          break;
        case 70:
          detail.key = "F";
          break;
        case 67:
          detail.key = "C";
          break;
      }
      if (detail.direction || detail.key) {
        emitControlInput(detail);
      }
    });
  }

  // Handle keyboard events on the document
  $(document)
    .on("keydown", function (e) {
      const keyCode = e.which;
      // If this key isn't already active, add it and emit an update.
      if (!window.activeKeys.has(keyCode)) {
        window.activeKeys.add(keyCode);
        emitKeyChange();
      }
      // Visual feedback for specific keys
      switch (keyCode) {
        case 37:
          $(".left").addClass("pressed").css("transform", "translate(0, 2px)");
          $(".lefttext").text("LEFT");
          break;
        case 38:
          $(".up").addClass("pressed").css("transform", "translate(0, 2px)");
          $(".uptext").text("UP");
          break;
        case 39:
          $(".right").addClass("pressed").css("transform", "translate(0, 2px)");
          $(".righttext").text("RIGHT");
          break;
        case 40:
          $(".down").addClass("pressed").css("transform", "translate(0, 2px)");
          $(".downtext").text("DOWN");
          break;
        case 65:
          $(".a").text("A");
          break;
        case 66:
          $(".b").text("B");
          break;
        case 81:
          $(".shape-btn").addClass("active");
          break;
        case 70:
          $(".wireframe-btn").addClass("active");
          break;
        case 67:
          $(".color-btn").addClass("active");
          break;
      }

      // Optionally, for arrow keys and certain letters, emit controlInput immediately.
      if ([37, 38, 39, 40, 65, 66].includes(keyCode)) {
        let detail = {};
        switch (keyCode) {
          case 37:
            detail.direction = "LEFT";
            break;
          case 38:
            detail.direction = "UP";
            break;
          case 39:
            detail.direction = "RIGHT";
            break;
          case 40:
            detail.direction = "DOWN";
            break;
          case 65:
            detail.key = "A";
            break;
          case 66:
            detail.key = "B";
            break;
        }
        if (detail.direction || detail.key) {
          emitControlInput(detail);
        }
      }
    })
    .on("keyup", function (e) {
      const keyCode = e.which;
      // Remove key from the active set on keyup.
      window.activeKeys.delete(keyCode);
      // Remove visual feedback.
      switch (keyCode) {
        case 37:
          $(".left").removeClass("pressed").css("transform", "translate(0, 0)");
          $(".lefttext").text("");
          break;
        case 38:
          $(".up").removeClass("pressed").css("transform", "translate(0, 0)");
          $(".uptext").text("");
          break;
        case 39:
          $(".right")
            .removeClass("pressed")
            .css("transform", "translate(0, 0)");
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
        case 81:
          $(".shape-btn").removeClass("active");
          break;
        case 70:
          $(".wireframe-btn").removeClass("active");
          break;
        case 67:
          $(".color-btn").removeClass("active");
          break;
      }
    });
})();

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
