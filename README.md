
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>

# 🥬 lettuce
> *flexible layout ui for web apps*

### 🥗 splitty-panelly tabby draggy-droppy leafy layout ui
- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- pane splitting, resizing, vertical, horizontal — you get it
- dude, it's web components
- uses [@e280/sly](https://github.com/e280/sly#readme) and [lit](https://lit.dev/) for ui rendering, [@e280/strata](https://github.com/e280/strata#readme) for state management
- you can drag-and-drop tabs between panes
  - done efficiently with *slots,* tab doesn't remount to move
  - that's actually *legit neato* if you have heavy-weight stuff in your tabs



<br/><br/>

## 🥬 make a quick layout salad
> *how to setup lettuce in your app*

### 🥗 lettuce installation, html, and css
1. **install**
    ```sh
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
	    --highlight: yellow;
	    --special: aqua;
	    --dropcover: 10%;
	    --warn: red;
	    --warntext: white;
	    --dock: #181818;
	    --taskbar: #181818;
	    --tab: transparent;
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
1. **setup your panels**
    ```ts
    const panels = lettuce.asPanels({
      alpha: {
        label: "Alpha",
        icon: () => html`🇦`,
        render: () => html`alpha content`,
      },
      bravo: {
        label: "Bravo",
        icon: () => html`🇧`,
        render: () => html`bravo content`,
      },
      charlie: {
        label: "Charlie",
        icon: () => html`🇨`,
        render: () => html`charlie content`,
      },
    })
    ```
1. **setup your layout**
    ```ts
    const layout = new lettuce.Layout({
      stock: lettuce.buildStock<keyof typeof panels>(b => ({
        empty: () => b.blank(),
        default: () => b.cell(b.tabs("alpha", "bravo", "charlie")),
      })),
    })
    ```
1. **enable localstorage persistence (optional)**
    ```ts
    await lettuce.Persistence.setup({
      layout,
      kv: lettuce.Persistence.localStorageKv(),
      key: "lettuceBlueprint",
      debounceMs: 250,
      loadOnStorageEvent: true,
    })
    ```
1. **setup a studio for displaying the layout in browser**
    ```ts
    const studio = new lettuce.Studio({panels, layout})
    ```
1. **register the web components to the dom**
    ```ts
    studio.ui.registerComponents()
    ```



<br/><br/>

## 🥬 layout
> *layout engine with serializable state*

### 🥗 layout package export path
- **import directly to avoid browser concerns (for running under node etc)**
    ```ts
    import * as lettuce from "@e280/lettuce/layout"
    ```

### 🥗 layout concepts explained
- **`Cell`**
    - a cell is a group that arranges its children either vertically or horizontally.
    - this is where splits are expressed.
    - a cell's children can be docks or more cells.
- **`Dock`**
    - a dock contains the ui with the little tab buttons, splitting buttons, x button, etc.
    - a dock's children must be surfaces.
- **`Surface`**
    - a surface is the rendering target location of where a panel will be rendered.
    - it uses a `<slot>` to magically render your panel into the location of this surface.

### 🥗 layout [explorer.ts](./s/layout/parts/explorer.ts) — read and query immutable state
- *read the source code for the real details*
- `layout.explorer.root`
- `layout.explorer.walk()`
- `layout.explorer.all`
- `layout.explorer.cells`
- `layout.explorer.docks`
- `layout.explorer.surfaces`

### 🥗 layout [actions.ts](./s/layout/parts/actions.ts) — mutate state
- *read the source code for the real details*
- `layout.actions.mutate()`
- `layout.actions.reset(cell?)`
- `layout.actions.addSurface(dockId, panel)`
- `layout.actions.activateSurface(surfaceId)`
- `layout.actions.setDockActiveSurface(dockId, activeSurfaceIndex)`
- `layout.actions.resize(id, size)`
- `layout.actions.deleteSurface(id)`
- `layout.actions.deleteDock(id)`
- `layout.actions.splitDock(id, vertical)`
- `layout.actions.moveSurface(id, dockId, destinationIndex)`

### 🥗 layout state management, using [strata](https://github.com/e280/strata#readme)
- **layout contains a serializable data structure called a `Blueprint`**
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

## 🥬 studio
> *in-browser layout user-experience*

### 🥗 studio [ui.ts](./s/studio/ui/ui.ts) — control how the ui is deployed
- *read the source code for the real details*
- `studio.ui.registerComponents()` — shortcut to register the components with their default names
- `studio.ui.views` — access to ui in the form of sly views
    ```ts
    import {html} from "lit"

    html`
      <div>
        ${studio.ui.views.Desk()}
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

## 🥬 i made this open sourcedly just for you
pay your respects, gimmie a github star.  

