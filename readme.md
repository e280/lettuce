
<div align="center"><img alt="" width=256 src="./assets/lettuce.avif"/></div>

# 🥬 lettuce

### splitty-panelly tabby draggy-droppy leafy layout ui

- 👉 **https://lettuce.e280.org/** 👈 *try it, nerd!*
- it's web components bruh
- pane splitting, resizing, vertical, horizontal, you get it
- it's like for editor apps and stuff like https://omniclip.app/
- you can drag-and-drop tabs between panels
  - done efficiently with *slots,* tab doesn't reinitialize or rerender to move
  - that's actually legit neato if you have heavy-weight stuff in tabs

### 📦 `npm install @e280/lettuce`

### do it like this

```ts
import {Lettuce} from "@e280/lettuce"
import {html, nexus, cssReset} from "@benev/slate"

const salad = Lettuce
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

