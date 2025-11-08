# Staff Dashboard Design Guidelines - Super-U

## Design Approach

**Selected Framework: Utility-Focused Dashboard System**
Drawing inspiration from Linear's clean data presentation, Notion's organizational clarity, and Material Design's data visualization principles, adapted for a staff management and order processing platform.

**Core Principles:**
- Information density without overwhelming users
- Role-specific workflows with clear visual hierarchy
- Real-time data visibility and status indicators
- Efficient task completion over visual flourish
- Scannable interfaces for quick decision-making

**Visual Theme:** Professional admin interface with black dominant background and red accent system as specified, creating high contrast for data readability and status indicators.

---

## Typography System

**Font Stack:**
- Primary: Inter or IBM Plex Sans (via Google Fonts CDN)
- Monospace: JetBrains Mono (for codes, timestamps, order IDs)

**Hierarchy:**
- Dashboard Headers: `text-2xl font-bold` (Admin overview, role titles)
- Section Titles: `text-xl font-semibold` (Orders, Activity Log, Staff Management)
- Card Headers: `text-lg font-medium` (Individual order cards, metric cards)
- Body Text: `text-base font-normal` (Order details, descriptions)
- Labels/Meta: `text-sm font-medium` (Status badges, timestamps, user names)
- Small Text: `text-xs` (Helper text, footnotes, secondary info)

---

## Layout System

**Spacing Primitives:**
Primary spacing units: `2, 4, 6, 8, 12, 16` (Tailwind scale)
- Component padding: `p-4` to `p-6`
- Section spacing: `space-y-6` to `space-y-8`
- Card gaps: `gap-4`
- Page margins: `px-6` to `px-8`

**Grid Structure:**
```
Sidebar: 64px (collapsed) or 240px (expanded)
Main Content: Fluid with max-w-7xl container
Dashboard Layout: 12-column grid system

Admin Dashboard: 3-4 column KPI cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
Order Lists: 2-column layout (grid-cols-1 lg:grid-cols-2)
Activity Logs: Single column with max-w-4xl
Staff Management: Table layout with action columns
```

---

## Component Library

### A. Navigation & Layout Components

**Sidebar Navigation:**
- Fixed left sidebar with role-based menu items
- Icon + label format with active state indicators
- Collapsible on mobile, persistent on desktop
- Role badge at top (Admin/Caissier/Préparateur)
- Logout action at bottom

**Top Bar:**
- User profile with avatar and name
- Real-time notification bell with badge count
- Quick actions dropdown
- Current page breadcrumb
- Height: `h-16`

### B. Dashboard Components

**KPI Metric Cards:**
- 4-card row for key metrics (Total Orders, Pending, Completed, Active Staff)
- Icon, large number, label, trend indicator (↑/↓ percentage)
- Minimal padding `p-6`, rounded corners `rounded-lg`
- Hover elevation effect

**Activity Timeline:**
- Vertical timeline with dots and connecting lines
- Avatar + staff name + action + timestamp
- Grouped by date with date headers
- Infinite scroll or pagination
- Real-time updates with subtle animation

**Order Cards:**
- Order ID (monospace font)
- Customer name and phone
- Items list (expandable if > 3 items)
- Status badge (Pending/In Preparation/Ready/Completed)
- Action buttons based on role
- Timestamp metadata
- Spacing: `p-4` with `space-y-3` internal

**Charts & Visualizations:**
- Line chart: Orders over time (7-day, 30-day views)
- Bar chart: Orders by staff member
- Donut chart: Order status distribution
- Use Chart.js or Recharts library via CDN
- Height: `h-64` to `h-80`

### C. Data Display Components

**Data Tables:**
- Staff management table (Admin only)
- Sticky header with sorting indicators
- Row actions (Edit, Delete, View Activity)
- Pagination with items per page selector
- Responsive: Convert to cards on mobile
- Zebra striping for readability

**Status Badges:**
```
Pending: Neutral tone
In Preparation: Working state
Ready for Pickup: Success state  
Completed: Muted success
Cancelled: Alert state
```
Consistent styling: `px-3 py-1 rounded-full text-xs font-medium`

**Code Display Blocks:**
- Temporary codes (6-digit, large, centered)
- Final codes (alphanumeric, copyable)
- Monospace font with background contrast
- Copy-to-clipboard button
- Display: `text-3xl tracking-wider font-mono`

### D. Form Components

**Staff Creation Form (Admin):**
- Two-column layout on desktop
- Input fields: Name, Email, Phone, Role selector
- Password generation toggle
- Submit + Cancel buttons
- Inline validation messages

**Code Input Field (Cashier):**
- Large 6-digit input with auto-focus
- Visual feedback per digit
- Submit on complete entry
- Clear/Reset option
- Centered with `max-w-md mx-auto`

**Order Status Updater (Preparer):**
- Current status display
- Next status button (large, primary)
- Notes textarea (optional issues/delays)
- Timestamp of last update

### E. Modal & Overlay Components

**Confirmation Modals:**
- Action confirmation (Delete staff, Cancel order)
- Centered overlay with backdrop blur
- Clear title, description, action buttons
- Max width: `max-w-md`

**Order Detail Panel:**
- Slide-out drawer from right
- Full order information
- Action history timeline
- Staff assignments
- Width: `w-96` on desktop

**Notification Toasts:**
- Top-right positioning
- Auto-dismiss (3-5 seconds)
- Success/Error/Info variants
- Stack multiple notifications

### F. Role-Specific Interfaces

**Admin Dashboard:**
- Multi-metric overview (4+ KPI cards)
- Staff activity feed (central column)
- Quick actions panel (Create staff, View reports)
- System alerts/notifications
- Charts: Orders trend, Staff performance

**Cashier Interface:**
- Active orders queue (card grid)
- Code input interface (prominent, centered)
- Order validation status
- Recent confirmations list
- Simple, focused layout with large touch targets

**Preparer Dashboard:**
- Assigned orders (kanban-style columns: To Prepare, In Progress, Ready)
- Order detail cards with item checklists
- Status update buttons (large, clear)
- Preparation timer/timestamp
- Filtered views: My orders, All orders

---

## Interactions & States

**Button States:**
- Default: Solid background
- Hover: Slightly elevated with subtle shadow
- Active: Pressed appearance
- Disabled: Reduced opacity (50%)
- Loading: Spinner icon with disabled state

**Data Refresh:**
- Auto-refresh indicators for real-time data
- Manual refresh button in top bar
- Last updated timestamp display
- Subtle pulse animation on new activity

**Responsive Behavior:**
- Desktop (lg): Full sidebar, multi-column grids
- Tablet (md): Collapsible sidebar, 2-column max
- Mobile (base): Hidden sidebar (hamburger menu), single column, bottom navigation option

---

## Accessibility & Usability

- High contrast ratios for text readability
- Focus indicators on all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader labels for icons and actions
- Clear loading and error states
- Confirmation steps for destructive actions

---

## Animation Guidelines

**Minimal & Purposeful:**
- Page transitions: None (instant)
- Modal entry/exit: `duration-200` fade + scale
- Toast notifications: Slide from top-right
- Real-time updates: Subtle highlight flash
- Loading states: Spinner or skeleton screens
- Avoid: Elaborate animations, parallax, scroll effects

---

## Images & Icons

**Icons:**
- Use Lucide Icons (React) or Heroicons via CDN
- Consistent 20px-24px size for navigation
- 16px for inline icons in text
- 32px+ for empty states and illustrations

**Staff Avatars:**
- Circular format, 32px-40px standard
- Initials fallback if no image
- 64px in profile header

**Empty States:**
- Simple illustration or large icon
- Helpful message text
- Call-to-action button
- No images needed - icon-based designs

**No Hero Images:** Dashboard applications don't require hero sections. Focus on data density and functional layouts.