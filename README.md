
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>



<br/><br/>

> [!IMPORTANT]  
> *lettuce is just an early prototype.*  
> *more work is yet to be done in terms of features, extensibility, and customizability.*  



<br/><br/>

# 🥬 lettuce
> *flexible layout ui for web apps*

### 🥗 splitty-panelly tabby draggy-droppy leafy layout ui
- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- pane splitting, resizing, vertical, horizontal — you get it
- dude, it's web components — universal compatibility
- you can drag-and-drop tabs between panes
  - done efficiently with *slots,* tab doesn't remount to move
  - that's actually *legit neato* if you have heavy-weight stuff in your tabs
- using
  - [@e280/sly](https://github.com/e280/sly#readme) and [lit](https://lit.dev/) for ui rendering
  - [@e280/strata](https://github.com/e280/strata#readme) for auto-reactive state management
  - [@e280/kv](https://github.com/e280/kv#readme) for persistence

### 🥗 what you're about to read
- [**#quickstart**](#quickstart) — full install for lit apps
- [**#layout**](#layout) — about the layout engine
- [**#studio**](#studio) — about the ui systems
- [**#react**](#react) — react app compatibility



<br/><br/>

<a id="quickstart"></a>

## 🥬 quickstart your layout salad
> *how to setup lettuce in your lit app*

### 🥗 lettuce installation, html, and css
1. **install**
    ```bash
    npm install @e280/lettuce lit
    ```
1. **html**
    ```html
    <lettuce-desk></lettuce-desk>
    ```
1. **css**
    ```css
    lettuce-desk {
      color: #fff8;
      background: #111;

      --scale: 1.5em;
      --gutter-size: 0.7em;
      --highlight: yellow;
      --special: aqua;
      --dropcover: 10%;
      --warn: red;
      --warntext: white;
      --dock: #181818;
      --taskbar: #181818;
      --tab: transparent;
      --tab-active: var(--dock);
      --gutter: #000;
      --focal: transparent;
      --pointerlock: yellow;
    }
    ```

### 🥗 lettuce typescript
1. **imports**
    ```ts
    import {html} from "lit"
    import * as lettuce from "@e280/lettuce"
    ```
1. **setup your panels** — these panels are available for the user to open
    ```ts
    const {panels, renderer} = lettuce.litSetup({
      alpha: {
        label: "Alpha",
        icon: () => html`A`,
        render: () => html`alpha content`,
        limit: 1, // optional max open instances
      },
      bravo: {
        label: "Bravo",
        icon: () => html`B`,
        render: () => html`bravo content`,
      },
      charlie: {
        label: "Charlie",
        icon: () => html`C`,
        render: () => html`charlie content`,
      },
    })
    ```
1. **setup your layout**
    ```ts
    const layout = new lettuce.Layout({
      stock: lettuce.Builder.fn<keyof typeof panels>()(b => ({
        default: () => b.horizontal(1, b.dock(1, "alpha", "bravo", "charlie")),
        empty: () => b.blank(),
      })),
      defaultPanel: "alpha", // optional default panel for new splits
    })
    ```
    - panels are referenced by their string keys.
    - optional `limit` restricts how many copies of a panel can exist at the same time (default unlimited). once saturated, the adder buttons disable.
    - optional `defaultPanel` opens a default panel on new split docks (pick one that can open another instance).
    - `Layout` is a facility for reading and manipulating.
    - `Builder.fn` helps you build a tree of layout nodes with less verbosity (note the spooky-typing double-invocation).
    - `stock.empty` defines the fallback state for when a user closes everything.
    - `stock.default` defines the initial state for a first-time user.
1. **enable localstorage persistence (optional)**
    ```ts
    const persistence = new lettuce.Persistence({
      layout,
      key: "lettuceLayoutBlueprint",
      kv: lettuce.Persistence.localStorageKv(),
      broadcastChannel: new BroadcastChannel("lettuceBroadcast"),
    })

    await persistence.load()
    persistence.setupAutoSave()
    persistence.setupLoadOnBroadcast()
    ```
    - see [@e280/kv](https://github.com/e280/kv#readme) to learn how to control where the data is saved
1. **setup a studio for displaying the layout in browser**
    ```ts
    const studio = new lettuce.Studio({
      panels,
      layout,
      renderer,
      // controls - optional
    })
    ```
    - `controls` uses `standardControls(ctx)` by default. Override it to render custom taskbar controls (see [customize studio](#studio)).
1. **register the web components to the dom**
    ```ts
    studio.ui.registerComponents()
    ```



<br/><br/>

<a id="layout"></a>

## 🥬 layout
> *layout engine with serializable state*

### 🥗 layout package export path
- **import directly to avoid browser concerns (for running under node etc)**
    ```ts
    import * as lettuce from "@e280/lettuce/layout"
    ```

### 🥗 layout concepts explained
- **`Blueprint`**
    - serializable layout data.
    - contains a `version` number and a `root` cell.
- **`LayoutNode`**
    - any cell, dock, or surface.
    - all nodes have a unique string `id`.
    - all nodes have a `kind` string that is "cell", "dock", or "surface".
- **`Cell`**
    - a cell is a group that arranges its children either vertically or horizontally.
    - this is where splits are expressed.
    - a cell's children can be docks or more cells.
- **`Dock`**
	- a dock contains the ui with the little tab buttons, splitting buttons, x button, etc.
	- a dock's children must be surfaces.
	- each dock stores a `taskbarAlignment` (`"top" | "right" | "bottom" | "left"`) which dictates where its taskbar renders and how the tabs orient themselves.
- **`Surface`**
    - a surface is the rendering target location of where a panel will be rendered.
    - it uses a `<slot>` to magically render your panel into the location of this surface.

### 🥗 layout [explorer.ts](./s/layout/parts/explorer.ts) — read and query immutable state
- *read the source code for the real details*
- the state that explorer returns is all immutable and readonly, if you try to mutate it, an error will be thrown
- `layout.explorer.root`
- `layout.explorer.walk()`
- `layout.explorer.all` — is a "scout"
- `layout.explorer.cells` — is a "scout"
- `layout.explorer.docks` — is a "scout"
- `layout.explorer.surfaces` — is a "scout"
- all scouts have:
  - `.getReport(id)`
  - `.requireReport(id)`
  - `.get(id)`
  - `.require(id)`
  - `.parent(id)`
  - `.reports`
  - `.nodes`
  - `.count`

### 🥗 layout [actions.ts](./s/layout/parts/actions.ts) — mutate state
- *read the source code for the real details*
- these actions are the only way you can mutate or modify the state
- `layout.actions.mutate()`
- `layout.actions.reset(cell?)`
- `layout.actions.addSurface(dockId, panel)`
- `layout.actions.activateSurface(surfaceId)`
- `layout.actions.setDockActiveSurface(dockId, activeSurfaceIndex)`
- `layout.actions.setDockTaskbarAlignment(dockId, alignment)`
- `layout.actions.resize(id, size)`
- `layout.actions.deleteSurface(id)`
- `layout.actions.deleteDock(id)`
- `layout.actions.splitDock(id, vertical)`
- `layout.actions.moveSurface(id, dockId, destinationIndex)`

### 🥗 layout state management, using [strata](https://github.com/e280/strata#readme)
- **get/set the data**
    ```ts
    const blueprint = layout.getBlueprint()
    ```
    ```ts
    layout.setBlueprint(blueprint)
    ```
- **you can manually subscribe to changes like this**
    ```ts
    layout.on(blueprint => {
      console.log("layout changed", blueprint)
    })
    ```
- **any strata-compatible ui (like [sly](https://github.com/e280/sly#readme)) will magically auto-rerender**
    ```ts
    import {view} from "@e280/sly"

    view(use => () => html`
      <p>node count: ${layout.explorer.all.count}</p>
    `)
    ```
- **you can use strata effects to magically respond to changes**
    ```ts
    import {effect} from "@e280/strata"

    effect(() => {
      console.log("node count changed", layout.explorer.all.count)
    })
    ```



<br/><br/>

<a id="studio"></a>

## 🥬 studio
> *in-browser layout user-experience*

### 🥗 studio [ui.ts](./s/studio/ui/ui.ts) — control how the ui is deployed
```ts
const studio = new lettuce.Studio({
  panels,
  layout,
  renderer,
  controls: context => {
    const standard = lettuce.standardControlsParts(context)
    return html`
      ${standard.spawnPanel()}
      ${standard.closeDock()}
      ${standard.splitHorizontal()}
      ${standard.splitVertical()}
      // customize non standard taskbar controls as you wish
      <button @click=${() => context.meta.studio.layout.actions.reset()}>Reset</button>
      // add your own action button
      <button @click=${() => someAction()}>whatever</button>
    `
  },
})
```
- *read the source code for the real details*
- `standardControls(ctx)` is the default taskbar controls (close, split, alignment, spawn panel, etc.).
- import `standardControlsParts` instead when you need individual controls.
- `lettuce.listPanelsChoices(meta, dock)` returns available panels for a dock, including icon, disabled state, and an open() handler.
- `studio.ui.registerComponents()` — shortcut to register the components with their default names
- `studio.ui.views` — access to ui in the form of sly views
    ```ts
    import {html} from "lit"

    html`
      <div>
        ${studio.ui.views.LettuceDesk()}
      </div>
    `
    ```
- `studio.ui.components` — access to ui in the form of web components
    ```ts
    import {dom} from "@e280/sly"

    // manually registering the web components to the dom
    dom.register({

      // renaming the web component as an example
      LolDesk: studio.ui.components.LettuceDesk,
    })
    ```
    ```html
    <lol-desk></lol-desk>
    ```



<br/><br/>

<a id="react"></a>

## 🥬 react
> *lettuce for your react app*

### 🥗 install `react` and `sly-react`
- sly-react allows you to turn any sly view into a react component
    ```sh
    npm install @e280/sly-react react
    ```

### 🥗 setup your panels and layout
- but this time, with jsx render fns
    ```ts
    const panels = {
      alpha: {
        label: "Alpha",
        icon: () => html`A`,
        render: () => <div>alpha content</div>, // 👈 jsx
      },
    }
    ```
    - note: your icons still have to be lit-html
- and an ordinary layout
    ```ts
    const layout = new lettuce.Layout({
      stock: lettuce.Builder.fn<keyof typeof panels>()(b => ({
        default: () => b.horizontal(1, b.dock(1, "alpha")),
        empty: () => b.blank(),
      })),
    })
    ```

### 🥗 make your studio and the hook
- we literally provide sly-react's `reactify` and various react fns to `reactIntegration`
    ```ts
    import * as lettuce from "@e280/lettuce"
    import {reactify} from "@e280/sly-react"
    import {useRef, useState, useEffect, createElement} from "react"

    const {renderer, makeDeskComponent} = lettuce.reactIntegration({
      reactify,
      useRef,
      useState,
      useEffect,
      createElement,
    })

    const studio = new lettuce.Studio({renderer, panels, layout})
    const LettuceDesk = makeDeskComponent(studio)
    ```
    - lettuce does not depend on react, but accepts react-shaped stuff to perform the integration
    - studio requires the `renderer` that the react integration gives you

### 🥗 LettuceDesk component usage
- now you can use the component
    ```ts
    const MyReactComponent = () => {
      return (
        <div>
          <LettuceDesk render={surface => panels[surface.panel].render()} />
        </div>
      )
    }
    ```



<br/><br/>

## 🥬 i made this open sourcedly just for you
pay your respects, gimmie a github star.
