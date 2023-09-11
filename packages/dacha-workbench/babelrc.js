module.exports = {
  plugins: [
    '@emotion/babel-plugin',
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  ],
}
