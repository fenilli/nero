# Nero

> [!WARNING]
> Nero is an experimental project created for learning purposes, it is **not intended for production use**. The focus is on exploring how reactivity libraries and compilers work internally, not on building a stable or feature-complete framework.

Nero is a **runtime** and **compiler** for reactive frontend apps, focused on fine-grained reactivity, context-based lifecycles, and minimal DOM updates.

## Features

- Reactive state with **signals** and **effects**
- Scoped lifecycles using **contexts** and cleanup hooks
- DOM helpers for html creation and manipulation
- Built-in support for **conditionals** and **lists**
- Fine-grained updates without a virtual DOM
- Planned **DSL compiler** to generate components from the runtime and dom helpers.

## Roadmap

### Runtime

- [ ] Improved errors and warnings.
- [ ] Built-in event delegation.
- [x] Event listener and cleanup.
- [x] More helpers for attributes and properties.
- [ ] Support for async resources.
- [x] Factory from html for easier dom creation.
- [ ] Untrack for getting value without dependency creation.

### Compiler

- [ ] A custom DSL compiler that transforms a higher-level declarative syntax into runtime calls.
- [ ] Support for declarative template syntax.

### Tooling

- [ ] Vite plugin integration.
- [ ] Playground to show code compilationd and generation.
- [ ] Hot reload for the compiler and runtime.
- [ ] Instropection of context, signals and effects.

### Documentation

- [ ] Runtime usage documentation to be used manually.
- [ ] Clear documentation about the DSL features and transformation.
- [ ] Tutorials for how to write components using signals and effects.
- [ ] Examples of using the controls for conditionals and lists.
- [ ] Showcase of a complete application.