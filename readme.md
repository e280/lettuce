
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>

# 🥬 lettuce

### splitty-panelly tabby draggy-droppy leafy layout ui

- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- it's web components bruh
- pane splitting, resizing, vertical, horizontal, you get it
- it's like for editor apps and stuff like https://omniclip.app/
- you can drag-and-drop tabs between panels
  - done efficiently with *slots,* tab doesn't reinitialize or rerender to move
  - that's actually *legit neato* if you have heavy-weight stuff in tabs

<br/>

## how to make a big fat layout salad

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
	  background: #111;
	  color: #fff8;

	  --taskbar-size: 1.5em;
	  --highlight: yellow;
	  --special: aqua;
	  --pane: #181818;
	  --taskbar: #181818;
	  --tab: transparent;
	  --gutter: #000;
	  --focal: transparent;
	  --pointer-lock: yellow;
  }
  ```
- **javascript it that way**
  ```ts
  import {Salad} from "@e280/lettuce"
  import {html, nexus, cssReset} from "@benev/slate"

  const lettuce = Salad
    .panels(panel => ({

      // example panel using @benev/slate shadowView
      about: panel.shadowView({
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
      lit: {
        label: "lit",
        icon: () => html`🔥`,
        render: () => html`
          <p>this is an example</p>
        `,
      },
    }))

    // layout configuration
    .layout(layout => ({
      default: layout.single("about"), // when user firsts visits
      empty: layout.single("about"), // when user deletes all panes
    }))

    // set lettuce context and register elements to dom
    .setup()
  ```

### you can do stuff with that `lettuce` instance

that `lettuce` instance you get is the context for the layout system.

it has a bunch of facilities and stuff for manipulating the layout and stuff.

i literally don't have time to exhaustively document it rn... plz help

use your lsp or read [lettuce.ts](./s/context/lettuce.ts)

### i made this open sourcedly just for you

pay your respects and gimmie a github star

