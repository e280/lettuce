
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>

# 🥬 lettuce

### splitty-panelly tabby draggy-droppy leafy layout ui

- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- dude, it's web components
- pane splitting, resizing, vertical, horizontal — you get it
- it's like for editor apps and stuff like https://omniclip.app/
- uses [@e280/sly](https://github.com/e280/sly#readme) and [lit](https://lit.dev/) for ui rendering
- uses [@e280/strata](https://github.com/e280/strata#readme) for state management
- you can drag-and-drop tabs between panes
  - done efficiently with *slots,* tab doesn't remount to move
  - that's actually *legit neato* if you have heavy-weight stuff in your tabs



<br/><br/>

## 🥬 make a quick layout salad
> *how to setup lettuce in your app*
1. **install it down**
    ```sh
    npm install @e280/lettuce lit
    ```
1. **html it up**
    ```html
    <lettuce-desk></lettuce-desk>
    ```
1. **css like this**
    ```css
    lettuce-layout {
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
1. **typescript like that**
    - import stuff
        ```ts
        import {html} from "lit"
        import * as lettuce from "@e280/lettuce"
        ```
    - setup your panels
        ```ts
        const panels = lettuce.asPanels({
          alpha: {
            label: "alpha",
            icon: () => html`a`,
            render: () => html`Alpha`,
          },
          bravo: {
            label: "bravo",
            icon: () => html`b`,
            render: () => html`bravo`,
          },
          delta: {
            label: "delta",
            icon: () => html`d`,
            render: () => html`delta`,
          },
        })
        ```
    - setup your layout (builder is a handy helper)
        ```ts
        const b = new lettuce.Builder<keyof typeof panels>()

        const layout = new lettuce.Layout({
          stock: {
            empty: () => b.blank(),
            default: () => b.cell(b.tabs("about", "gnu", "brotein")),
          },
        })
        ```
    - enable localstorage persistence (optional)
        ```ts
        await lettuce.Persistence.setup({
          layout,
          debounceMs: 250,
          loadOnStorageEvent: true,
          kv: lettuce.Persistence.localStorageKv(),
        })
        ```
    - setup a studio for displaying the layout in browser
        ```ts
        const studio = new lettuce.Studio({panels, layout})
        ```
    - register the web components to the dom
        ```ts
        studio.ui.registerComponents()
        ```



<br/><br/>

## 🥬 layout
> *layout engine with serializable state*

### 🌱 layout direct import
> *environment agnostic, can run in node or whatever*
- **direct import avoids browser concerns**
    ```ts
    import * as lettuce from "@e280/lettuce/layout"
    ```

### 🌱 layout [seeker.ts](./s/layout/parts/seeker.ts)
> *read and query the layout state*
- `layout.seeker.root`
- `layout.seeker.list()`
- `layout.seeker.find(id)`
- `layout.seeker.cells`
- `layout.seeker.docks`
- `layout.seeker.surfaces`

### 🌱 layout [actions.ts](./s/layout/parts/actions.ts)
> *mutate the layout state*
- `layout.actions.reset()`
- `layout.actions.addSurface(dockId, panel)`
- `layout.actions.setDockActiveSurface(dockId, activeSurfaceIndex)`
- `layout.actions.resize(id, size)`
- `layout.actions.deleteSurface(id)`
- `layout.actions.deleteDock(id)`
- `layout.actions.splitDock(id, vertical)`
- `layout.actions.moveSurface(id, dockId, destinationIndex)`

### 🌱 layout state management
> *uses [@e280/strata](https://github.com/e280/strata#readme) for state management*
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
      <p>root id: ${layout.seeker.root.id}</p>
    `)
    ```
- **you can use strata effects to magically respond to changes**
    ```ts
    import {effect} from "@e280/strata"

    effect(() => {
      console.log("layout node count", [...layout.seeker.list()].length)
    })
    ```



## 🥬 studio
> *in-browser layout user-experience*

### 🌱 studio [ui.ts](./s/studio/ui/ui.ts)
> more control over how to deploy the ui
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

