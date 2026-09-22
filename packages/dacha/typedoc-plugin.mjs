// @ts-check
/*
 * Local typedoc plugin for the API reference.
 *
 * Built-in systems override the lifecycle hooks of WorldSystem and SceneSystem.
 * The engine calls these hooks and the constructor, never the game. On a page
 * like Renderer they pushed the useful part (systemName, the class
 * description) under nine methods nobody calls. The plugin removes them from
 * every class that extends WorldSystem or SceneSystem. The base classes keep
 * the hooks documented, because that is where someone writing a system reads
 * about them.
 *
 * `componentName`, `assetName` and `behaviorName` are the same kind of
 * metadata: the decorators of dacha-workbench set them, and a game does not
 * assign or read them. The plugin keeps them on the base class, where they
 * explain the contract, and drops the inherited copy from every subclass.
 * `systemName` stays, because a game reads it as the key of `resources`.
 *
 * A component class and its config interface (Sprite and SpriteConfig) share
 * most field names, and the class documents them. The plugin copies the
 * comment of the class member to a config field that has no comment of its
 * own, so each field is written once, on the class, and shows on both pages.
 *
 * An accessor pair is documented once in the source, on the getter or on the
 * setter. Typedoc renders the two signatures separately and leaves the other
 * one blank, so the plugin copies the comment across.
 *
 * The `dacha` theme drops the code block typedoc prints at the top of every
 * interface and object type page (`interface World { ... }` with every member).
 * World, Scene and the other classes exported only as types render as
 * interfaces, and for them that block filled a screen before the description
 * of any member. The member list below it shows the same members, documented.
 */
import {
  Converter,
  DeclarationReflection,
  DefaultTheme,
  DefaultThemeRenderContext,
  ReflectionKind,
} from 'typedoc';

const SYSTEM_BASES = new Set(['WorldSystem', 'SceneSystem']);

const NAMED_BASES = new Set([
  'Component',
  'Asset',
  'Behavior',
  'Shader',
  'FilterEffect',
]);

const CLASS_NAME_FIELDS = new Set([
  'componentName',
  'assetName',
  'behaviorName',
]);

const LIFECYCLE_HOOKS = new Set([
  'onWorldLoad',
  'onWorldReady',
  'onWorldDestroy',
  'onSceneLoad',
  'onSceneEnter',
  'onSceneExit',
  'onSceneDestroy',
  'update',
  'fixedUpdate',
]);

/** Config interfaces whose name is not the component name plus `Config`. */
const CONFIG_OWNERS = {
  BaseShapeConfig: 'Shape',
  BaseColliderConfig: 'Collider',
};

/**
 * @param {import('typedoc').DeclarationReflection} member
 * @returns {import('typedoc').Comment | undefined}
 */
const getMemberComment = (member) =>
  member.comment ??
  member.getSignature?.comment ??
  member.setSignature?.comment ??
  member.signatures?.[0]?.comment;

/**
 * @param {import('typedoc').ProjectReflection} project
 */
const hideSystemInternals = (project) => {
  for (const reflection of project.getReflectionsByKind(ReflectionKind.Class)) {
    const cls = /** @type {import('typedoc').DeclarationReflection} */ (
      reflection
    );
    const extendsNamedBase = (cls.extendedTypes ?? []).some(
      (type) => 'name' in type && NAMED_BASES.has(type.name),
    );
    if (!extendsNamedBase) {
      continue;
    }

    for (const child of [...(cls.children ?? [])]) {
      if (CLASS_NAME_FIELDS.has(child.name)) {
        project.removeReflection(child);
      }
    }
  }

  for (const reflection of project.getReflectionsByKind(ReflectionKind.Class)) {
    const cls = /** @type {import('typedoc').DeclarationReflection} */ (
      reflection
    );
    const isSystem = (cls.extendedTypes ?? []).some(
      (type) => 'name' in type && SYSTEM_BASES.has(type.name),
    );
    if (!isSystem) {
      continue;
    }

    for (const child of [...(cls.children ?? [])]) {
      if (
        child.kindOf(ReflectionKind.Constructor) ||
        LIFECYCLE_HOOKS.has(child.name)
      ) {
        project.removeReflection(child);
      }
    }
  }
};

/**
 * @param {import('typedoc').ProjectReflection} project
 */
const copyConfigComments = (project) => {
  for (const reflection of project.getReflectionsByKind(
    ReflectionKind.Interface,
  )) {
    const config = /** @type {import('typedoc').DeclarationReflection} */ (
      reflection
    );
    const ownerName =
      CONFIG_OWNERS[/** @type {keyof typeof CONFIG_OWNERS} */ (config.name)] ??
      config.name.replace(/Config$/, '');
    if (ownerName === config.name) {
      continue;
    }

    const owner = project
      .getReflectionsByKind(ReflectionKind.Class)
      .find((cls) => cls.name === ownerName);
    const isComponent =
      owner instanceof DeclarationReflection &&
      (owner.extendedTypes ?? []).some(
        (type) => 'name' in type && type.name === 'Component',
      );
    if (!isComponent) {
      continue;
    }

    for (const field of config.children ?? []) {
      if (field.comment) {
        continue;
      }
      const source = owner.getChildByName(field.name);
      const comment =
        source instanceof DeclarationReflection
          ? getMemberComment(source)
          : undefined;
      if (comment) {
        field.comment = comment.clone();
      }
    }
  }
};

/**
 * @param {import('typedoc').ProjectReflection} project
 */
const shareAccessorComments = (project) => {
  for (const reflection of project.getReflectionsByKind(
    ReflectionKind.Accessor,
  )) {
    const accessor = /** @type {import('typedoc').DeclarationReflection} */ (
      reflection
    );
    const { getSignature, setSignature } = accessor;
    if (!getSignature || !setSignature) {
      continue;
    }
    if (getSignature.comment && !setSignature.comment) {
      setSignature.comment = getSignature.comment.clone();
    } else if (setSignature.comment && !getSignature.comment) {
      getSignature.comment = setSignature.comment.clone();
    }
  }
};

class DachaThemeRenderContext extends DefaultThemeRenderContext {
  /** @param {ConstructorParameters<typeof DefaultThemeRenderContext>} args */
  constructor(...args) {
    super(...args);
    this.reflectionPreview = () => undefined;
  }
}

class DachaTheme extends DefaultTheme {
  ContextClass = DachaThemeRenderContext;
}

/** @param {import('typedoc').Application} app */
export function load(app) {
  app.renderer.defineTheme('dacha', DachaTheme);

  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    hideSystemInternals(context.project);
    shareAccessorComments(context.project);
    copyConfigComments(context.project);
  });
}
