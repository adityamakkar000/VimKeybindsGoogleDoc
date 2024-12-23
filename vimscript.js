var iframe = document.querySelector(".docs-texteventtarget-iframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

var mode = "normal";

var store_num = 1;
var store_num_bool = false;
var previous_key = "";
var colon = false;
var colon_array = [];

const keyCodes = {
  j: 40,
  k: 38,
  h: 37,
  l: 39,
  i: 73,
  w: 87,
  ArrowUp: 38,
  ArrowDown: 40,
  ArrowLeft: 37,
  ArrowRight: 39,
  optionRight: 18,
};

function simEvent(event) {
  for (var i = 0; i < store_num; i++) {
    iframeDoc.dispatchEvent(event);
  }
  store_num = 1;
  store_num_bool = false;
  colon = false;
  previous_key = "";
  colon_array = [];
}

function simulateWordForward() {
  const ctrlRightEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 39,
    which: 39,
    altKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(ctrlRightEvent);
}

function simulateWordBackward() {
  const ctrlRightEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 37,
    which: 39,
    altKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(ctrlRightEvent);
}

function simLineEnd() {
  const endEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 39,
    which: 35,
    metaKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(endEvent);
}

function simLineStart() {
  const startEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 37,
    which: 36,
    metaKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(startEvent);
}

function simChar(character) {
  const downEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: keyCodes[character],
    which: 40,
    shiftKey: mode === "visual" ? true : false,
  });

  simEvent(downEvent);
}
function pageTop() {
  const pageTopEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 38,
    which: 36,
    metaKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(pageTopEvent);
}

function pageBottom() {
  const pageBottomEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 40,
    which: 35,
    metaKey: true,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(pageBottomEvent);
}

function del() {
  const deleteEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 46,
    which: 46,
    shiftKey: mode === "visual" ? true : false,
  });
  simEvent(deleteEvent);
}

function jmp(num) {
  pageTop();
  for (var i = 0; i < num; i++) {
    simChar("j");
  }
}

function deleteLine() {
  simChar("ArrowDown");
  simLineStart();
  mode = "visual";
  simChar("ArrowUp");
  del();
  mode = "normal";
}

function undo() {
  const undoEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 90,
    which: 90,
    metaKey: true,
  });
  simEvent(undoEvent);
}

function vimKeybinds(key) {
  if (key === "j") {
    simChar("ArrowDown");
  } else if (key === "k") {
    simChar("ArrowUp");
  } else if (key === "h") {
    simChar("ArrowLeft");
  } else if (key === "l") {
    simChar("ArrowRight");
  } else if (key === "w") {
    simulateWordForward();
    simChar("ArrowRight");
  } else if (key === "b") {
    simulateWordBackward();
  } else if (key === "$") {
    simLineEnd();
  } else if (key === "_") {
    simLineStart();
  } else if (key === "G") {
    pageBottom();
  } else if (key === "g" && previous_key === "g") {
    pageTop();
  } else if (key === "d" && previous_key === "d") {
    deleteLine();
  } else if (key === "x") {
    del();
  } else if (key === "u") {
    undo();
  } else if (key >= "0" && key <= "9") {
    if (store_num_bool) {
      store_num = store_num * 10 + parseInt(key);
    } else {
      store_num = parseInt(key);
      store_num_bool = true;
    }
  } else {
    previous_key = key;
  }
}

const styleSheet = document.createElement("style");

styleSheet.textContent = `
  #kix-current-user-cursor-caret.normal-mode {
    border-left: 6px solid black !important;
  }
  #kix-current-user-cursor-caret.insert-mode {
  }
`;

function updateCursorStyle(currentMode) {
  const cursor = document.getElementById("kix-current-user-cursor-caret");
  if (cursor) {
    cursor.classList.remove("normal-mode", "insert-mode");
    cursor.classList.add(`${currentMode}-mode`);
  }
}

document.head.appendChild(styleSheet);

iframeDoc.addEventListener("keydown", function (e) {
  const key = e.key;

  if (mode === "normal") {
    e.preventDefault();
    if (key === "i") {
      mode = "insert";
      updateCursorStyle("insert");
    } else if (key === "a") {
      simChar("ArrowRight");
      mode = "insert";
      updateCursorStyle("insert");
    } else if (key === "v") {
      mode = "visual";
    } else {
      vimKeybinds(key);
    }
  } else if (mode === "visual") {
    e.preventDefault();
    if (key === "Escape") {
      mode = "normal";
      simChar("ArrowLeft");
    } else {
      vimKeybinds(key);
    }
  } else {
    if (key === "Escape") {
      mode = "normal";
      updateCursorStyle("normal");
    }
  }
});

updateCursorStyle("normal");
