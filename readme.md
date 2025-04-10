
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>

# 🥬 lettuce

### splitty-panelly tabby draggy-droppy leafy layout ui

- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- it's web components bruh
- pane splitting, resizing, vertical, horizontal, you get it
- it's like for editor apps and stuff like https://omniclip.app/
- uses [@benev/slate](https://github.com/benevolent-games/slate) and [lit](https://lit.dev/)
- you can drag-and-drop tabs between panels
  - done efficiently with *slots,* tab doesn't reinitialize or rerender to move
  - that's actually *legit neato* if you have heavy-weight stuff in tabs

<br/>

## make a layout salad

- **install it down**
  ```sh
  npm install @e280/lettuce
  ```
- **html it up**
  ```html
  <lettuce-layout></lettuce-layout>
  ```
- **css it this way**
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
	  --pane: #181818;
	  --taskbar: #181818;
	  --tab: transparent;
	  --gutter: #000;
	  --focal: transparent;
	  --pointerlock: yellow;
  }
  ```
- **javascript it that way**
  ```ts
  import {Salad} from "@e280/lettuce"
  import {html, nexus, cssReset} from "@benev/slate"

  const lettuce = Salad
    .panels(pan => ({

      // example panel using @benev/slate shadowView
      about: pan.shadowView({
        label: "about",
        icon: () => html`🥬`,
        render: use => panel => {
          use.styles(css`h1 {color: skyblue;}`)
          return html`
            <h1>hello</h1>
          `
        },
      }),

      // example panel just using lit html
      lit: pan.plain({
        label: "lit",
        icon: () => html`🔥`,
        render: () => html`
          <p>this is an example</p>
        `,
      }),
    }))

    // layout configuration
    .layout(layout => ({
      default: layout.single("about"), // when user firsts visits
      empty: layout.single("about"), // when user deletes all panes
    }))

    // set lettuce context and register elements to dom
    .setup()
  ```

### keep yourself organized

- keep each of your panels in its own file
- you can use `Salad.pan` to help with making panels in a type-happy way
  ```ts
  import {Salad} from "@e280/lettuce"

  export const aboutPanel = Salad.pan.shadowView({
    label: "about",
    icon: () => html`🥬`,
    render: use => panel => {
      use.styles(css`h1 {color: skyblue;}`)
      return html`
        <h1>hello</h1>
      `
    },
  })
  ```

### you can do stuff with that `lettuce` instance
that `lettuce` instance you get is the context for the layout system.  
it has a bunch of facilities and stuff for manipulating the layout and stuff.  
i literally don't have time to exhaustively document it rn... *plz help.*  
use your lsp or read [lettuce.ts](./s/context/lettuce.ts)  

### i made this open sourcedly just for you
pay your respects, gimmie a github star.  

