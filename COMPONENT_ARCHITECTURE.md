# Component Architecture Documentation

## Overview

This document outlines the componentized architecture for TesJor application, following the structure_template.md guidelines.

## Directory Structure

```
src/
├── components/
│   ├── shared/          # Reusable UI components used across features
│   │   ├── CategoryBadge.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ActionButton.tsx
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── map/             # Map-specific components
│       └── GoogleMapContainer.tsx
│
└── features/            # Feature-based component organization
    ├── listings/
    │   ├── components/
    │   │   ├── PlaceCard.tsx        # Standard place card for listings
    │   │   └── FeaturedCard.tsx     # Featured/trending place card
    │   ├── schemas/
    │   └── index.ts
    │
    ├── user/
    │   ├── components/
    │   │   ├── TripCard.tsx         # Card for saved/visited trips
    │   │   ├── StatsCard.tsx        # User stats display card
    │   │   ├── TravelHistoryItem.tsx # Timeline item for history
    │   │   ├── BadgeItem.tsx        # Achievement badge display
    │   │   ├── SavedItemCard.tsx    # Small saved item card
    │   │   └── ProfileStats.tsx     # LevelProgress & ProfileStatsGrid
    │   ├── schemas/
    │   └── index.ts
    │
    └── admin/
        ├── components/
        │   ├── StepIndicator.tsx    # Multi-step form indicator
        │   └── FormFields.tsx       # FormField, TextInput, TextArea, SelectField
        ├── schemas/
        └── index.ts
```

## Component Descriptions

### Shared Components

#### `CategoryBadge`

**Purpose**: Display category labels with consistent styling
**Props**:

- `category: string` - Category name
- `variant?: 'default' | 'compact'` - Size variant
- `className?: string` - Additional CSS classes

**Usage**:

```tsx
<CategoryBadge category="food" variant="compact" />
```

#### `SearchBar`

**Purpose**: Consistent search input across pages
**Props**:

- `value: string` - Current search value
- `onChange: (value: string) => void` - Change handler
- `placeholder?: string` - Placeholder text
- `className?: string` - Additional CSS classes

**Usage**:

```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search places..."
/>
```

#### `CategoryFilter`

**Purpose**: Category selection pills/buttons
**Props**:

- `categories: CategoryOption[]` - Array of category options
- `selected: string` - Currently selected category ID
- `onSelect: (category: string) => void` - Selection handler
- `variant?: 'pills' | 'buttons'` - Display style
- `className?: string` - Additional CSS classes

**Usage**:

```tsx
<CategoryFilter
  categories={[
    { id: "all", label: "All", icon: null },
    { id: "food", label: "Foods", icon: <Utensils /> },
  ]}
  selected={selectedCategory}
  onSelect={setSelectedCategory}
  variant="pills"
/>
```

#### `ActionButton`

**Purpose**: Reusable action button with icon (bookmark, visited, etc.)
**Props**:

- `icon: ReactNode` - Icon element
- `active?: boolean` - Active state
- `onClick?: (e: React.MouseEvent) => void` - Click handler
- `title?: string` - Tooltip text
- `variant?: 'default' | 'compact' | 'overlay'` - Style variant
- `activeColor?: string` - Color when active
- `className?: string` - Additional CSS classes

**Usage**:

```tsx
<ActionButton
  icon={<Heart />}
  active={isBookmarked}
  onClick={handleBookmark}
  title="Save to Favorites"
  variant="overlay"
/>
```

### Listings Feature Components

#### `PlaceCard`

**Purpose**: Standard place listing card with image, title, description, actions
**Props**:

- `item: Listing` - Listing data
- `isBookmarked?: boolean` - Bookmark state
- `isVisited?: boolean` - Visited state
- `onBookmark?: () => void` - Bookmark handler
- `onVisit?: () => void` - Visit handler
- `showDistance?: boolean` - Show distance info

**Usage**:

```tsx
<PlaceCard
  item={listing}
  isBookmarked={true}
  isVisited={false}
  onBookmark={() => toggleBookmark(listing.id)}
  showDistance={true}
/>
```

#### `FeaturedCard`

**Purpose**: Large featured/trending place card with overlay
**Props**:

- `item: Listing` - Listing data
- `isBookmarked?: boolean` - Bookmark state
- `isVisited?: boolean` - Visited state
- `onBookmark?: () => void` - Bookmark handler
- `onVisit?: () => void` - Visit handler

**Usage**:

```tsx
<FeaturedCard
  item={featuredListing}
  isBookmarked={false}
  onBookmark={() => toggleBookmark(featuredListing.id)}
/>
```

### User Feature Components

#### `TripCard`

**Purpose**: Display saved/visited trip with optional grayscale effect for visited
**Props**:

- `item: ListingWithProgress` - Listing with user progress data
- `showVisitedState?: boolean` - Show visited styling

**Usage**:

```tsx
<TripCard item={trip} showVisitedState={true} />
```

#### `StatsCard`

**Purpose**: Display a single user statistic
**Props**:

- `icon: ReactNode` - Icon element
- `label: string` - Stat label
- `value: string | number` - Stat value
- `subLabel?: string` - Secondary label
- `bgColor: string` - Background color class

**Usage**:

```tsx
<StatsCard
  icon={<Heart />}
  label="Bookmarked"
  value={25}
  subLabel="saved places"
  bgColor="bg-pink-100 dark:bg-pink-900/20 text-pink-600"
/>
```

#### `TravelHistoryItem`

**Purpose**: Timeline item for travel history
**Props**:

- `item: TravelHistoryItem` - History item data
- `icon: ReactNode` - Icon for timeline dot
- `iconColor: string` - Color class for icon

**Usage**:

```tsx
<TravelHistoryItem
  item={historyItem}
  icon={<CalendarCheck />}
  iconColor="bg-primary/10 text-primary"
/>
```

#### `BadgeItem`

**Purpose**: Display achievement badge
**Props**:

- `badge: Badge` - Badge data
- `colors: string` - Color class string

**Usage**:

```tsx
<BadgeItem
  badge={{ id: "1", name: "Explorer", icon: "🏆", earned: true, color: "blue" }}
  colors="bg-blue-100 text-blue-600"
/>
```

#### `SavedItemCard`

**Purpose**: Compact card for saved items list
**Props**:

- `id: string` - Item ID
- `title: string` - Item title
- `subtitle: string` - Item subtitle
- `image: string` - Image URL

**Usage**:

```tsx
<SavedItemCard
  id="1"
  title="Angkor Wat"
  subtitle="Place • Siem Reap"
  image="/images/angkor.jpg"
/>
```

#### `LevelProgress`

**Purpose**: Display user level and progress bar
**Props**:

- `level: number` - Current level
- `levelName: string` - Level name (e.g., "Explorer")
- `progress: number` - Progress percentage
- `xpToNext: number` - XP needed for next level

**Usage**:

```tsx
<LevelProgress level={5} levelName="Explorer" progress={65} xpToNext={350} />
```

#### `ProfileStatsGrid`

**Purpose**: Grid of user statistics
**Props**:

- `stats: { placesVisited, xpEarned, reviews, bookmarked }` - Stats object

**Usage**:

```tsx
<ProfileStatsGrid
  stats={{
    placesVisited: 12,
    xpEarned: 1500,
    reviews: 8,
    bookmarked: 25,
  }}
/>
```

### Admin Feature Components

#### `StepIndicator`

**Purpose**: Show progress in multi-step form
**Props**:

- `currentStep: number` - Current step (1-indexed)
- `totalSteps: number` - Total number of steps

**Usage**:

```tsx
<StepIndicator currentStep={2} totalSteps={4} />
```

#### `FormField`

**Purpose**: Consistent form field wrapper with label
**Props**:

- `label: string` - Field label
- `required?: boolean` - Show required indicator
- `children: ReactNode` - Field input

**Usage**:

```tsx
<FormField label="Title" required>
  <TextInput value={title} onChange={setTitle} />
</FormField>
```

#### `TextInput`, `TextArea`, `SelectField`

**Purpose**: Styled form inputs consistent with design system
**Usage**:

```tsx
<TextInput value={name} onChange={setName} placeholder="Enter name" />
<TextArea value={desc} onChange={setDesc} rows={6} />
<SelectField
  value={category}
  onChange={setCategory}
  options={[{ value: "food", label: "Food" }]}
/>
```

## Usage Patterns

### Explore Page Pattern

```tsx
// Import components
import { SearchBar, CategoryFilter } from "@/components/shared";
import { PlaceCard, FeaturedCard } from "@/features/listings";

// Use in page
<SearchBar value={query} onChange={setQuery} />
<CategoryFilter categories={cats} selected={cat} onSelect={setCat} />
<FeaturedCard item={featured} />
<div className="grid">
  {items.map(item => (
    <PlaceCard key={item.id} item={item} />
  ))}
</div>
```

### Profile Page Pattern

```tsx
import { ProfileStatsGrid, LevelProgress, TravelHistoryItem } from "@/features/user";

<ProfileStatsGrid stats={userStats} />
<LevelProgress level={5} levelName="Explorer" progress={65} xpToNext={350} />
{history.map(item => (
  <TravelHistoryItem key={item.id} item={item} icon={...} iconColor="..." />
))}
```

### My Trips Page Pattern

```tsx
import { StatsCard, TripCard } from "@/features/user";

<StatsCard icon={<Heart />} label="Bookmarked" value={stats.bookmarked} />;
{
  trips.map((trip) => (
    <TripCard key={trip.id} item={trip} showVisitedState={tab === "visited"} />
  ));
}
```

## Benefits

1. **Reusability**: Components can be used across multiple pages
2. **Consistency**: UI elements look and behave the same everywhere
3. **Maintainability**: Changes to a component automatically apply everywhere it's used
4. **Type Safety**: All components are fully typed with TypeScript
5. **Feature Organization**: Related components grouped by domain (listings, user, admin)
6. **Separation of Concerns**: Shared UI vs feature-specific components

## Next Steps

1. Refactor existing pages to use these components
2. Add unit tests for components
3. Create Storybook stories for component documentation
4. Add accessibility improvements (ARIA labels, keyboard navigation)
