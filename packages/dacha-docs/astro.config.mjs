// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const site = process.env.SITE_URL ?? 'https://dachajs.org';

export default defineConfig({
  site,
  base: '/',
  integrations: [
    starlight({
      title: 'dacha',
      description:
        'A data-driven, ECS-flavored game engine for the browser, with a visual editor.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
      },
      logo: {
        src: './src/assets/logo.png',
        alt: 'dacha',
        replacesTitle: false,
      },
      favicon: '/favicon.png',
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&text=dacha&display=swap',
          },
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/michailRemmele/dacha',
        },
      ],
      plugins: [
        starlightLinksValidator({
          exclude: ['/api/**'],
        }),
      ],
      sidebar: [
        {
          label: 'Introduction',
          items: [
            { slug: 'introduction/what-is-dacha' },
            { slug: 'introduction/how-it-works' },
          ],
        },
        {
          label: 'Getting Started',
          items: [
            { slug: 'getting-started/installation' },
            { slug: 'getting-started/first-scene' },
            { slug: 'getting-started/project-structure' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { slug: 'concepts/ecs' },
            { slug: 'concepts/actors' },
            { slug: 'concepts/scenes-and-world' },
            { slug: 'concepts/events' },
            { slug: 'concepts/systems' },
            { slug: 'concepts/game-loop' },
            { slug: 'concepts/configuration' },
          ],
        },
        {
          label: 'The Editor',
          items: [
            { slug: 'editor/interface-tour' },
            { slug: 'editor/building-a-scene' },
            { slug: 'editor/templates' },
            { slug: 'editor/systems-and-options' },
            { slug: 'editor/generating-scripts' },
            { slug: 'editor/config-reference' },
          ],
        },
        {
          label: 'Game Code',
          items: [
            { slug: 'game-code/auto-registration' },
            { slug: 'game-code/components' },
            { slug: 'game-code/systems' },
            { slug: 'game-code/behaviors' },
            { slug: 'game-code/inspector-fields' },
            { slug: 'game-code/custom-widgets' },
          ],
        },
        {
          label: 'Built-in Systems',
          items: [
            { slug: 'systems/behaviors' },
            {
              label: 'Rendering',
              items: [
                { label: 'Overview', slug: 'systems/rendering' },
                { slug: 'systems/rendering/components' },
                { slug: 'systems/rendering/shaders' },
                { slug: 'systems/rendering/filter-effects' },
              ],
            },
            {
              label: 'Physics',
              items: [
                { label: 'Overview', slug: 'systems/physics' },
                { slug: 'systems/physics/bodies-and-colliders' },
                { slug: 'systems/physics/collisions' },
                { slug: 'systems/physics/queries' },
              ],
            },
            { slug: 'systems/character-controller' },
            { slug: 'systems/interpolation' },
            { slug: 'systems/animation' },
            { slug: 'systems/audio' },
            { slug: 'systems/input' },
            { slug: 'systems/camera' },
            { slug: 'systems/game-ui' },
          ],
        },
        {
          label: 'Tutorials',
          items: [{ slug: 'tutorials/garden' }],
        },
        {
          label: 'Shipping Your Game',
          items: [
            { slug: 'shipping/performance' },
            { slug: 'shipping/building' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'reference/glossary' },
            { slug: 'reference/components' },
            { slug: 'reference/troubleshooting' },
            { label: 'API Reference', link: '/api/' },
          ],
        },
        {
          label: 'Resources',
          items: [{ slug: 'resources/examples' }, { slug: 'resources/blog' }],
        },
      ],
    }),
  ],
});
