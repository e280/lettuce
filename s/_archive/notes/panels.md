
# Panel and Layout System Report

## Core Components

### 1. Layout Structure
The layout system is organized in a hierarchical tree structure with three main node types:

- **Cell**: Container for organizing panes and other cells
  - Can be arranged vertically or horizontally
  - Contains panes or other cells as children

- **Pane**: Container for leaves (panels)
  - Has a taskbar with tabs
  - Supports splitting horizontally or vertically
  - Contains leaf nodes as children

- **Leaf**: The actual panel content
  - Represents a specific panel type (like ViewportPanel, OutlinerPanel, etc.)
  - Rendered within a pane

### 2. Panels
Panels are the content components that provide functionality:

- **PanelSpec**: Defines a panel with:
  - `label`: Display name
  - `icon`: SVG representation
  - `view`: Actual component rendering function

- **Available panels** include:
  - ViewportPanel
  - OutlinerPanel
  - CatalogPanel
  - SlotsPanel
  - InspectorPanel
  - HistoryPanel
  - SettingsPanel
  - AboutPanel

## Controllers and State Management

### 1. LayoutController
Central manager for layout operations:
- Maintains layout state tree
- Provides actions for manipulating layout
- Handles persistence with store
- Supports operations like:
  - Splitting panes
  - Moving tabs/leaves
  - Resizing elements
  - Adding/removing panels

### 2. LayoutSeeker
Utility for traversing and querying the layout tree:
- Finds nodes by ID
- Lists all cells/panes/leaves
- Provides parent-child relationship information

### 3. Supporting Components
- **TabDragger**: Handles drag-and-drop operations for tabs
- **Resizer**: Manages resizing of cells and panes
- **Layout actions**: Functions for manipulating the layout structure

## Rendering System

The rendering process follows these steps:

1. **Layout Renderer**: Recursively renders the layout tree
   - Takes the root node and traverses the structure
   - Dispatches to specific renderers based on node type

2. **Component Renderers**:
   - `render_cell`: Renders a cell with its children and resizers
   - `render_pane`: Renders a pane with its taskbar, tabs, and active leaf
   - `render_leaf`: Renders a leaf by providing a slot for the panel content
   - `render_tabs`: Creates tab buttons for each leaf in a pane
   - `render_adder_leaf`: Generates buttons to add new panels

3. **LayoutMeta**: Shared context for rendering with:
   - `resizer`: For handling resizing
   - `dragger`: For drag-and-drop operations
   - `layout`: Reference to the layout controller
   - `panels`: Available panel specifications
   - `render_layout`: The layout rendering function

## Interaction and Events

The system handles various user interactions:

1. **Tab management**:
   - Clicking tabs to switch between panels
   - Dragging tabs to move panels between panes
   - Adding new tabs via the "+" button

2. **Layout manipulation**:
   - Splitting panes horizontally/vertically
   - Resizing cells and panes via drag handles
   - Closing panes and tabs

3. **Focus handling**:
   - Tracking which pane/leaf is currently focused
   - Supporting pointer lock for specific interactions

## Persistence

The layout configuration is persisted through:

1. **Store**: Saves layout state to localStorage
2. **Layout.File**: Structure for stored layout with version and root node
3. **Automatic saving**: Debounced saving on layout changes
4. **Default layouts**: Predefined layouts like `empty` and `default`

## Connection Flow

1. **Initialization**:
   - `MiniContext` creates a `LayoutController` with panels and layouts
   - Initial layout is loaded from store or defaults

2. **Rendering**:
   - `ConstructEditor` element creates a layout renderer
   - The renderer traverses the layout tree and creates DOM elements

3. **Interaction**:
   - User actions trigger layout controller methods
   - Layout changes update the state tree
   - Changes are rendered and eventually persisted

4. **Panel Content**:
   - Leaf nodes use slots to render their panel content
   - Panel views are managed by the `leaf_management` system
   - Each panel implements the `PanelSpec` interface

## Extensibility

The system supports easy extension through:

1. Adding new panel types to the `panels` collection
2. Creating custom layout configurations
3. Adding new actions to the layout controller

This modular design allows the UI to be flexible while maintaining a consistent structure and interaction model.

<br/>

# Layout and Panel System File Structure

## Core Layout System

- **context/controllers/layout/controller.ts**
  - Implements `LayoutController` class
  - Manages layout state, persistence, and provides actions API

- **context/controllers/layout/parts/types.ts**
  - Defines core layout structures (Cell, Pane, Leaf)
  - Contains type definitions for the layout tree

- **context/controllers/layout/parts/actions.ts**
  - Implements all UI operations (split pane, move leaf, resize, etc.)
  - Contains logic for manipulating the layout tree

- **context/controllers/layout/parts/seeker.ts**
  - Provides traversal and query capabilities for the layout tree
  - Helps find nodes, relationships, and collect lists of elements

- **context/controllers/layout/single_panel_layout.ts**
  - Factory for creating simple one-panel layouts
  - Used for initializing default views

- **context/controllers/layout/parts/utils/stock_layouts.ts**
  - Defines interface for pre-configured layouts
  - Used for default and empty layout states

- **context/controllers/layout/game_editor_layouts.ts**
  - Concrete implementation of stock layouts for the editor
  - Defines default layouts for the application

## Layout Rendering

- **elements/construct-editor/element.ts**
  - Main editor component entry point
  - Initializes layout renderer and manages panel rendering

- **elements/construct-editor/rendering/utils/make_layout_renderer.ts**
  - Creates the renderer function for the layout tree
  - Connects node types to their rendering functions

- **elements/construct-editor/rendering/utils/layout_meta.ts**
  - Defines shared context for layout rendering
  - Connects renderers with controllers and utilities

- **elements/construct-editor/rendering/cell.ts**
  - Renders cell nodes with resizers between children
  - Handles vertical/horizontal arrangement

- **elements/construct-editor/rendering/pane.ts**
  - Renders panes with taskbar, tabs, and active leaf content
  - Includes UI for splitting/closing panes

- **elements/construct-editor/rendering/leaf.ts**
  - Creates slot for panel content
  - Links layout leaf to actual panel component

- **elements/construct-editor/rendering/tabs.ts**
  - Renders tab bar for panes
  - Manages tab selection and display

- **elements/construct-editor/rendering/utils/render_adder_leaf.ts**
  - Renders UI for adding new panels when no leaf is active
  - Creates buttons for available panel types

## Interaction Components

- **elements/construct-editor/resize/resizer.js**
  - Handles resizing operations for cells and panes
  - Manages mouse interactions for resize handles

- **elements/construct-editor/parts/tab_dragger.js**
  - Implements drag and drop for tabs
  - Allows moving panels between panes

- **elements/construct-editor/parts/leaf_management.ts**
  - Manages lifecycle of panel instances
  - Creates/removes DOM elements for panels

- **elements/construct-editor/parts/alternator.js**
  - Helper for rendering cells with resizers between items
  - Alternates between content and resizer elements

## Panel System

- **panels/panel_parts.ts**
  - Defines `PanelSpec` and `PanelProps` interfaces
  - Provides factory function for creating panels

- **panels/panels.ts**
  - Exports collection of all available panels
  - Central registry of panels for the application

- **panels/viewport/panel.ts**
  - Example panel implementation (3D viewport)
  - Demonstrates panel structure and integration

- **panels/settings/panel.ts**
  - Settings panel with layout reset functionality
  - Shows how panels interact with the layout system

## Context & State Management

- **context/mini_context.ts**
  - Creates and initializes the layout controller
  - Connects panels to the layout system

- **context/controllers/store/store.ts**
  - Defines storage interface for layout persistence
  - Handles serialization/deserialization of layout state

- **context/mini_slate.ts**
  - Provides context access to components
  - Makes controller instances available throughout the app

