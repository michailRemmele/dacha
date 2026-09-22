// Starlight builds its configuration into a virtual module at build time and ships no
// ambient types for it. Component overrides that read the configuration need this
// declaration, or TypeScript cannot resolve the import.
declare module 'virtual:starlight/user-config' {
  const config: import('@astrojs/starlight/types').StarlightConfig;
  export default config;
}
