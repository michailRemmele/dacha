module.exports = new Proxy(
  {},
  {
    get: (target, key) => {
      if (key === '__esModule') {
        return false;
      }
      return typeof key === 'string' ? key : undefined;
    },
  },
);
