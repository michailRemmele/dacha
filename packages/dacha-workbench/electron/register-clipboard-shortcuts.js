const menuActions = require('./menu-actions');

const CLIPBOARD_ACTIONS = {
  x: menuActions.cut,
  c: menuActions.copy,
  v: menuActions.paste,
};

// On Windows/Linux there's no native menu bar to attach to (frame: false),
// so Chromium's own built-in Ctrl+X/C/V edit commands win the race against
// the Menu accelerators in get-menu.js before they get a chance to fire.
// Undo/Redo/Save/Delete aren't affected — Chromium has no built-in binding
// for them outside a focused text field — so those keep working as-is.
module.exports = (win) => {
  win.webContents.on('before-input-event', (event, input) => {
    if (
      input.type !== 'keyDown' ||
      !input.control ||
      input.shift ||
      input.alt
    ) {
      return;
    }

    const action = CLIPBOARD_ACTIONS[input.key.toLowerCase()];
    if (action) {
      event.preventDefault();
      action(win);
    }
  });
};
