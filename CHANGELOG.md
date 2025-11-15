
# `@e280/lettuce` changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement



<br/><br/>

## v0.1

### v0.2.0
- 🟥 studio now requires `renderer`, which can be obtained via `litSetup` or `litRenderer`
- 🟥 rename `studio.ui.views.Desk` to `studio.ui.views.LettuceDesk` for consistency
- 🟥 blueprint `size` properties are now expressed in 0-1 fractions, and null isn't valid anymore (all panels must have a specified size)
- 🟥 builder changes
  - 🟥 builder fns now require `size` as first param
  - 🟥 builder `.tabs` renamed to `.dock` for more consistent terminology
  - 🟥 builder `.cell` renamed to `.horizontal` for more consistent terminology
- 🍏 added react compat via `reactIntegration`, see readme
- 🍏 improved behaviors and bug fixes
- 🍏 added `--gutter-size: 0.7em;` css variable
- 🍏 added optional `panel.limit` so apps can cap how many copies of a panel can be opened at once

### v0.1.2
- 🍏 update deps

### v0.1.1
- 🍏 add desk view name `<sly-view view="lettuce-desk">`
- 🍏 update deps
- 🍏 improve readme

### v0.1.0
- 🟥 big 'ol rewrite



<br/><br/>

## v0.0

### v0.0.3
- 🍏 updated npm dependencies

### v0.0.2
- 🔶 i deleted `panelStyles`, now they're baked into layout `::slotted(*)`.

### v0.0.1
- 🔶 okay okay i renamed `PanelHelper` to `Pan`. maybe some other crap.  
  before i have users, first breaking change *doesn't count in semver!*  
  it's like the 5 second rule.  
  i think i didn't break anything documented in the readme tho.  

### v0.0.0
- 🟥 totally new installation patterns, see readme
- 🟥 redo css variables
- 🍏 improved slate/nexus integration
- 🍏 way better system for specifying panels and layouts

### v0.0.0-1
- 🍏 update dependencies

### v0.0.0-0
- 🍏 first release

