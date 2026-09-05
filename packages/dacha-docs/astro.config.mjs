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
            { slug: 'introduction/glossary' },
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
          label: 'Tutorials',
          items: [{ slug: 'tutorials/garden' }],
        },
        {
          label: 'Core Concepts',
          items: [
            { slug: 'concepts/ecs' },
            { slug: 'concepts/configuration' },
            { slug: 'concepts/actors' },
            { slug: 'concepts/scenes-and-world' },
            { slug: 'concepts/systems' },
            { slug: 'concepts/game-loop' },
            { slug: 'concepts/events' },
            { slug: 'concepts/editor-role' },
          ],
        },
        {
          label: 'Writing Game Code',
          items: [
            { slug: 'writing-game-code/auto-registration' },
            { slug: 'writing-game-code/components' },
            { slug: 'writing-game-code/systems' },
            { slug: 'writing-game-code/behaviors' },
            { slug: 'writing-game-code/inspector-fields' },
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
            { slug: 'editor/running-and-debugging' },
            { slug: 'editor/config-reference' },
          ],
        },
        {
          label: 'Built-in Systems',
          items: [
            { slug: 'systems/behaviors' },
            { slug: 'systems/rendering' },
            { slug: 'systems/physics' },
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
          label: 'Shipping Your Game',
          items: [
            { slug: 'shipping/performance' },
            { slug: 'shipping/building' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'reference/components' },
            { slug: 'reference/migration' },
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
