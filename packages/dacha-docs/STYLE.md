# Documentation writing style

This guide applies to everything under `src/content/docs/`.

Write in **clear, simple technical English**. The target reader is a software developer who
understands programming concepts but may not be a fluent English speaker.

The goal is not to make the prose sound sophisticated or elegant. The goal is to make the
technical meaning immediately clear.

## Core principles

### 1. Prefer simple English

Use common words and simple grammatical structures.

Prefer:

- `The engine creates the actor.`
- `The actor gets its behavior from components.`
- `You can add or remove components at runtime.`

Avoid:

- `The engine is responsible for instantiating the actor.`
- `An actor derives its behavior entirely from the composition of its attached components.`
- `Components may be dynamically attached or detached during runtime.`

Use the simpler version whenever both express the same idea.

### 2. Keep sentences short

Aim for one main idea per sentence. Split long sentences when they contain multiple actions,
conditions, or concepts.

Do not compress several ideas into one sentence just to make the prose sound polished.

Prefer:

> An actor always has a `Transform`. Everything else comes from its components.

Over:

> An actor always has a `Transform` and is otherwise defined entirely by the components
> attached to it.

### 3. Prefer active voice

Prefer:

> The engine creates the actor.

Over:

> The actor is created by the engine.

Prefer:

> You provide the systems your game needs.

Over:

> The systems required by the game are provided by the application.

### 4. Prefer concrete verbs

Use verbs such as `create`, `add`, `remove`, `read`, `change`, `find`, `move`, `load`, `run`,
`start`, `stop`, `build`, `configure`.

Avoid abstract phrases such as `is responsible for`, `provides the ability to`, `serves as`,
`facilitates`, `allows for`, `is used for`.

For example:

> You can find an actor by its ID.

not:

> The actor API provides the ability to find actors by their IDs.

### 5. One paragraph should have one clear purpose

Do not use a paragraph to introduce a concept, explain its implementation, describe its API,
and discuss an edge case at the same time.

Introduce the idea first. Explain details afterward.

### 6. Do not over-explain obvious things

Assume the reader is a developer. Explain how Dacha works, what is different about it, and
what the reader needs to know to use it.

Do not add prose merely to make a section feel complete.

### 7. Use terminology consistently

Once a concept has a name, use that name consistently.

The engine calls something an `actor`. Do not alternate between `actor`, `object`, `entity`
and `game object` unless those are actually different concepts.

Do not introduce synonyms just to avoid repeating a word.

The project `create-dacha` writes is the **starter project**. Not "the generated project" and
not "the scaffolded project". Never "the template" either, because a template is an actor
template, which is a different thing. Link the first mention on a page to
`/getting-started/installation/`. A reader who arrives from a search engine then knows which
project the page means.

### 8. Prefer direct explanations over abstract descriptions

Prefer:

> A component stores data for an actor.

Over:

> Components represent the data-oriented aspects of an actor's state.

Prefer:

> Systems update actors every frame.

Over:

> Systems are responsible for processing the state of actors during the game loop.

## Structure and readability

Use short paragraphs.

Use lists when describing several independent things.

Use code examples when they explain an idea better than prose.

Do not put several independent concepts into a single long sentence separated by commas or
em dashes.

Headings should describe the idea the reader is about to learn, using simple language.

Page titles inside one sidebar section should not repeat the same leading word. Three pages
called "Writing a component", "Writing a system" and "Writing a behavior" put the noise first
and the subject last. Name the subject: "Components", "Systems", "Behaviors". The section
heading above them already says what the group is about.

## Who the reader is

Write to one developer building their own game. Do not split the audience into roles and
address them separately.

Prefer:

> You edit it in the inspector.

Over:

> A designer edits it in the inspector.

"A designer", "the team", "your artist" all assume a division of labour the reader probably
does not have.

## Document what exists

Describe the engine as it is today. Do not write about planned changes, deprecations or
migrations from earlier versions.

There are no users on older versions yet, so migration notes describe a problem nobody has.
A note saying an API is "planned to move" ages badly in both directions: it is noise while it
is true, and wrong the moment the move lands. Update the documentation when the change
lands, not before.

## Important distinction

Do not simplify technical meaning.

Simple language does **not** mean vague language. Preserve important distinctions in the
architecture.

For example, the engine creates runtime instances from JSON configuration. Do not say that
"JSON is the actor" when JSON is only the actor's configuration.

The user configures the engine by selecting systems and components. Explain that clearly
rather than reducing it to "configure the engine".

## Self-review: act as an editor

After writing a section, read it again as a technical editor before considering it finished.

For every paragraph, check:

1. Can I understand the main point on the first read?
2. Does each sentence express one main idea?
3. Can I replace a complicated word with a simpler one?
4. Can I split a long sentence into two shorter sentences?
5. Am I using active voice where it makes the sentence clearer?
6. Am I using concrete verbs instead of abstract phrases?
7. Am I repeating the same idea in different words?
8. Am I using terminology consistently?
9. Could a developer with intermediate English understand this without rereading it?
10. Did simplifying the text accidentally change the technical meaning?

If a sentence fails these checks, rewrite it.

## Style target

The desired style is similar to high-quality modern developer documentation: **direct, calm,
concise, approachable, and technically precise**.

Do not try to sound academic, literary, marketing-oriented, or overly polished.

When choosing between "elegant but complex" and "simple but precise", always choose **simple
but precise**.

Do not make the documentation sound like it was written by an English teacher. Make it sound
like it was written by a very good developer who knows how to explain things.

## Spelling

British `-ise` endings (`organise`, `serialise`, `initialise`), matching the existing pages.

The one exception is **behavior**, spelled with `-or`, because it is the name of an engine
concept and of the `Behavior` class. Never write `behaviour`.
