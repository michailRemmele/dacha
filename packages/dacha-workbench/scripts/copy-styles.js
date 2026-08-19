const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src');
const dest = path.join(__dirname, '..', 'esm');

const copyStyles = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const source = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      copyStyles(source);
      return;
    }

    if (!entry.name.endsWith('.module.css')) {
      return;
    }

    const target = path.join(dest, path.relative(src, source));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  });
};

copyStyles(src);
