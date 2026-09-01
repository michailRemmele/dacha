const stub = new Proxy(
  {},
  {
    get: (target, key) => {
      if (key === '__esModule') {
        return true;
      }
      if (key === 'default') {
        return stub;
      }
      return typeof key === 'string' ? key : undefined;
    },
  },
);

module.exports = stub;
