# Tasks Component Structure

## Component Hierarchy

```
Tasks.jsx (Main Container)
├── TasksHeader.jsx
│   ├── Search Input
│   ├── Filter Button
│   └── New Task Button
│
├── FilterPanel.jsx
│   ├── Status Filters (In Progress, Pending, Completed)
│   └── Priority Filters (High, Medium, Low)
│
├── TaskGrid.jsx
│   ├── TaskCard.jsx (multiple instances)
│   │   ├── StatusBadge.jsx
│   │   └── PriorityIndicator.jsx
│   └── Create New Task Placeholder
│
└── NewTaskModal.jsx
    ├── Modal Header (with close button)
    ├── Form Fields
    │   ├── Title Input
    │   ├── Description Textarea
    │   ├── Status Dropdown
    │   ├── Priority Dropdown
    │   ├── Due Date Input
    │   └── Tags Input
    └── Modal Footer (Cancel & Create buttons)
```

## Component Responsibilities

### Tasks.jsx (Main Container)

- **State Management**: Manages all state (tasks, filters, search, modal)
- **Business Logic**: Handles filtering and searching logic
- **Orchestration**: Coordinates child components via props

### TasksHeader.jsx

- **UI**: Renders header with title and action buttons
- **Props**: Receives callbacks for search, filter toggle, and new task

### FilterPanel.jsx

- **UI**: Animated collapsible filter panel
- **Props**: Receives filter state and change handler
- **Animation**: Uses Framer Motion for smooth transitions

### TaskGrid.jsx

- **Layout**: Grid container for task cards
- **Props**: Receives filtered tasks array
- **Rendering**: Maps tasks to TaskCard components

### TaskCard.jsx

- **UI**: Individual task card display
- **Composition**: Uses StatusBadge and PriorityIndicator
- **Animation**: Hover effects and transitions

### StatusBadge.jsx

- **UI**: Color-coded status badge
- **Pure Component**: No internal state

### PriorityIndicator.jsx

- **UI**: Priority indicator with colored dot
- **Pure Component**: No internal state

### NewTaskModal.jsx

- **UI**: Full-featured modal for task creation
- **Form**: Controlled form with validation
- **Animation**: Smooth modal entrance/exit

## Data Flow

```
User Action → Tasks.jsx (state update) → Child Components (re-render)
```

Example:

1. User clicks "New Task" button
2. TasksHeader calls `onNewTaskClick` callback
3. Tasks.jsx updates `isNewTaskOpen` state
4. NewTaskModal receives `isOpen={true}` prop
5. Modal animates into view
