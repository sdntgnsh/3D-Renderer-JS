(function () {
  // Global active keys set for momentary keys (arrow keys, A, B)
  window.activeKeys = new Set();
  // State for toggle keys to track when a key is held down
  const toggleKeysDown = {};

  // Emit custom controlInput event with provided details.
  // The 'active' property indicates toggle status: true means on, false means off.
  function emitControlInput({ direction = null, key = null, active = true }) {
    document.dispatchEvent(
      new CustomEvent("controlInput", { detail: { direction, key, active } })
    );
  }
  window.emitControlInput = emitControlInput;

  // -----------------------------------------------------------
  // Momentary keys: arrow keys and A, B handled via pointer and keyboard.
  function addPointerKeyHandlers(selector, keyCode, directionName) {
    const activate = (e) => {
      e.preventDefault();
      if (!window.activeKeys.has(keyCode)) {
        window.activeKeys.add(keyCode);
        emitControlInput({
          direction: directionName.toUpperCase(),
          active: true,
        });
      }
      $(selector).addClass("pressed").css("transform", "translate(0, 2px)");
      $(`.${directionName}text`).text(directionName.toUpperCase());
    };

    const deactivate = (e) => {
      e.preventDefault();
      window.activeKeys.delete(keyCode);
      emitControlInput({
        direction: directionName.toUpperCase(),
        active: false,
      });
      $(selector).removeClass("pressed").css("transform", "translate(0, 0)");
      $(`.${directionName}text`).text("");
    };

    $(selector)
      .on("pointerdown", activate)
      .on("pointerup pointerleave", deactivate);
  }

  // Bind arrow key buttons
  addPointerKeyHandlers(".up", 38, "up");
  addPointerKeyHandlers(".down", 40, "down");
  addPointerKeyHandlers(".left", 37, "left");
  addPointerKeyHandlers(".right", 39, "right");

  // -----------------------------------------------------------
  // Toggle buttons for control keys (Q, F, C) via pointer.
  function bindToggleButton(selector, keyCode, keyChar) {
    $(selector).on("pointerup", function (e) {
      e.preventDefault();
      // Toggle the button state
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        emitControlInput({ key: keyChar, active: false });
      } else {
        $(this).addClass("active");
        emitControlInput({ key: keyChar, active: true });
      }
    });
  }

  // Bind toggle control buttons: Q, F, and C
  bindToggleButton(".shape-btn", 81, "Q");
  bindToggleButton(".wireframe-btn", 70, "F");
  bindToggleButton(".color-btn", 67, "C");

  // -----------------------------------------------------------
  // Shape selector dropdown change
  $("#shape-list").on("change", (e) => {
    const shape = e.target.value;
    emitControlInput({ key: shape.toUpperCase() });
  });

  // -----------------------------------------------------------
  // Keyboard support
  $(document)
    .on("keydown", function (e) {
      const keyCode = e.which;

      // Handle momentary keys (arrow keys, A, B)
      if ([37, 38, 39, 40, 65, 66].includes(keyCode)) {
        if (!window.activeKeys.has(keyCode)) {
          window.activeKeys.add(keyCode);
          switch (keyCode) {
            case 37:
              emitControlInput({ direction: "LEFT", active: true });
              break;
            case 38:
              emitControlInput({ direction: "UP", active: true });
              break;
            case 39:
              emitControlInput({ direction: "RIGHT", active: true });
              break;
            case 40:
              emitControlInput({ direction: "DOWN", active: true });
              break;
            case 65:
              emitControlInput({ key: "A", active: true });
              break;
            case 66:
              emitControlInput({ key: "B", active: true });
              break;
          }
        }
        // Visual feedback for momentary keys
        switch (keyCode) {
          case 37:
            $(".left")
              .addClass("pressed")
              .css("transform", "translate(0, 2px)");
            $(".lefttext").text("LEFT");
            break;
          case 38:
            $(".up").addClass("pressed").css("transform", "translate(0, 2px)");
            $(".uptext").text("UP");
            break;
          case 39:
            $(".right")
              .addClass("pressed")
              .css("transform", "translate(0, 2px)");
            $(".righttext").text("RIGHT");
            break;
          case 40:
            $(".down")
              .addClass("pressed")
              .css("transform", "translate(0, 2px)");
            $(".downtext").text("DOWN");
            break;
          case 65:
            $(".a").text("A");
            break;
          case 66:
            $(".b").text("B");
            break;
        }
      }
      // Handle toggle keys (Q, F, C) via keyboard.
      else if ([81, 70, 67].includes(keyCode)) {
        // Prevent default to capture key (such as F) properly.
        e.preventDefault();
        // Use our own toggleKey state to prevent repeated toggles while held down.
        if (!toggleKeysDown[keyCode]) {
          toggleKeysDown[keyCode] = true; // mark key as down

          let selector, keyChar;
          switch (keyCode) {
            case 81:
              selector = ".shape-btn";
              keyChar = "Q";
              break;
            case 70:
              selector = ".wireframe-btn";
              keyChar = "F";
              break;
            case 67:
              selector = ".color-btn";
              keyChar = "C";
              break;
          }
          // Toggle the button state: if not active, activate; if active, deactivate.
          if (!$(selector).hasClass("active")) {
            $(selector).addClass("active");
            emitControlInput({ key: keyChar, active: true });
          } else {
            $(selector).removeClass("active");
            emitControlInput({ key: keyChar, active: false });
          }
        }
      }
    })
    .on("keyup", function (e) {
      const keyCode = e.which;
      // For momentary keys: remove key from active set and clear visual feedback.
      if ([37, 38, 39, 40, 65, 66].includes(keyCode)) {
        window.activeKeys.delete(keyCode);
        switch (keyCode) {
          case 37:
            $(".left")
              .removeClass("pressed")
              .css("transform", "translate(0,0)");
            $(".lefttext").text("");
            emitControlInput({ direction: "LEFT", active: false });
            break;
          case 38:
            $(".up").removeClass("pressed").css("transform", "translate(0,0)");
            $(".uptext").text("");
            emitControlInput({ direction: "UP", active: false });
            break;
          case 39:
            $(".right")
              .removeClass("pressed")
              .css("transform", "translate(0,0)");
            $(".righttext").text("");
            emitControlInput({ direction: "RIGHT", active: false });
            break;
          case 40:
            $(".down")
              .removeClass("pressed")
              .css("transform", "translate(0,0)");
            $(".downtext").text("");
            emitControlInput({ direction: "DOWN", active: false });
            break;
          case 65:
            $(".a").text("");
            emitControlInput({ key: "A", active: false });
            break;
          case 66:
            $(".b").text("");
            emitControlInput({ key: "B", active: false });
            break;
        }
      }
      // Clear toggle key state on keyup so subsequent keydowns will register
      if ([81, 70, 67].includes(keyCode)) {
        toggleKeysDown[keyCode] = false;
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

window.emitControlInput = emitControlInput;

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
