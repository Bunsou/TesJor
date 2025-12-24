# Mobile UI Quick Reference Guide

**TesJor Travel App - Mobile Development Standards**

---

## Responsive Patterns

### Text Sizing

```tsx
// Always use responsive text classes
className = "text-xs md:text-sm"; // Small text
className = "text-sm md:text-base"; // Body text
className = "text-base md:text-lg"; // Subheadings
className = "text-lg md:text-xl"; // Section titles
className = "text-xl md:text-2xl"; // Page titles
className = "text-2xl md:text-3xl lg:text-4xl"; // Hero titles
```

### Spacing

```tsx
// Padding
className = "p-3 md:p-4"; // Standard padding
className = "p-4 md:p-6"; // Generous padding
className = "px-3 md:px-6"; // Horizontal padding

// Gaps
className = "gap-3 md:gap-4"; // Standard gap
className = "gap-4 md:gap-6"; // Section gap
className = "gap-6 md:gap-8"; // Page gap
```

### Icons

```tsx
// Use responsive icon sizes
<Icon className="w-4 h-4 md:w-5 md:h-5" />      // Standard
<Icon className="w-5 h-5 md:w-6 md:h-6" />      // Large
<Icon size={16} className="md:w-5 md:h-5" />    // With size prop
```

### Touch Targets

```tsx
// Minimum 44-48px for touch elements
className = "min-h-[48px]"; // Button minimum height
className = "py-3 px-4"; // Button padding (48px total)
className = "h-9 md:h-10"; // Filter/small buttons (36px mobile)
```

---

## Common Patterns

### Card Components

```tsx
// Horizontal layout mobile, vertical desktop
<div className="flex md:block">
  {/* Mobile: flex-row, Desktop: block */}
  <div className="w-24 md:w-full">{/* Image */}</div>
  <div className="flex-1">{/* Content */}</div>
</div>
```

### Grid Layouts

```tsx
// Responsive grids
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4";
className = "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3";
```

### Padding for Bottom Nav

```tsx
// Always add bottom padding on mobile pages
className = "pb-20 md:pb-8"; // Pages with bottom nav
```

### Form Inputs

```tsx
// Prevent iOS zoom (16px minimum)
<input style={{ fontSize: "16px" }} className="..." />
```

### Sticky Headers

```tsx
// Mobile sticky positioning
className = "sticky top-0 z-10 bg-background";
```

---

## Component Checklist

When creating/updating mobile components:

- [ ] Text is 16px minimum on inputs (iOS zoom)
- [ ] Touch targets are 44-48px minimum
- [ ] Spacing scales with breakpoints (md:, lg:)
- [ ] Icons scale responsively
- [ ] Bottom nav clearance on mobile pages (pb-20)
- [ ] Dark mode classes included
- [ ] Horizontal scroll uses snap points
- [ ] Images have responsive aspect ratios
- [ ] Long text truncates on mobile
- [ ] Gaps/padding reduce on mobile

---

## Breakpoint Reference

```tsx
// Tailwind breakpoints
sm:   640px   // Small tablets
md:   768px   // Tablets
lg:   1024px  // Desktop
xl:   1280px  // Large desktop
2xl:  1536px  // Extra large

// Mobile-first approach
className="p-3"           // 0px+     (mobile)
className="md:p-4"        // 768px+   (tablet)
className="lg:p-6"        // 1024px+  (desktop)
```

---

## Testing Checklist

```bash
# Chrome DevTools Device Emulation
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPhone 14 Pro Max (430px)
- iPad Mini (768px)

# Real Device Testing
- Test on iOS Safari
- Test on Chrome Android
- Check touch interactions
- Verify dark mode
- Test form inputs (no zoom)
```

---

## Common Issues & Solutions

### Issue: iOS zooms on input focus

```tsx
// Solution: 16px minimum font
<input style={{ fontSize: "16px" }} />
```

### Issue: Bottom nav overlaps content

```tsx
// Solution: Add bottom padding
className = "pb-20 md:pb-8";
```

### Issue: Icons too small to tap

```tsx
// Solution: Use larger touch area
<button className="p-2 min-h-[44px]">
  <Icon className="w-5 h-5" />
</button>
```

### Issue: Text too small on mobile

```tsx
// Solution: Responsive text sizing
className = "text-xs md:text-sm";
```

### Issue: Horizontal scroll breaks layout

```tsx
// Solution: Add snap scrolling
className="overflow-x-auto snap-x snap-mandatory"
<div className="flex gap-2">
  <button className="flex-shrink-0 snap-start">...</button>
</div>
```

---

## Code Examples

### Responsive Button

```tsx
<button
  className="
    w-full
    px-4 md:px-5
    py-3 md:py-4
    min-h-[48px]
    text-sm md:text-base
    font-bold
    rounded-xl
    bg-primary
    hover:bg-primary/90
    transition-all
  "
>
  Action
</button>
```

### Responsive Card

```tsx
<div
  className="
    bg-white dark:bg-[#2A201D]
    p-4 md:p-6
    rounded-xl
    border border-gray-200 dark:border-gray-800
    gap-4 md:gap-6
  "
>
  <h3 className="text-lg md:text-xl font-bold">Title</h3>
  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
    Content
  </p>
</div>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
  {items.map((item) => (
    <Card key={item.id} />
  ))}
</div>
```

---

## Resources

- **Tailwind Docs:** https://tailwindcss.com/docs/responsive-design
- **iOS Guidelines:** 44pt minimum touch targets
- **Android Guidelines:** 48dp minimum touch targets
- **WCAG 2.1:** Target size minimum 44×44 CSS pixels

---

**Last Updated:** December 23, 2025
