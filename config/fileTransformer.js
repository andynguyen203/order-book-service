import path from 'node:path';

export default {
  process(_src, filename) {
    return `export default ${JSON.stringify(path.basename(filename))};`;
  }
};