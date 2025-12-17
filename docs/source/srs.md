# Software Requirements Specification (SRS)

# Project Requirement Document (PRD)

**Project Name:** TesJor (Working Title)
**Platform:** Web Application (Responsive & PWA supported)
**Date:** December 16, 2025

## 1. Executive Summary

**Objective:** To build a gamified travel web application that guides tourists in Cambodia beyond the standard landmarks (like Angkor Wat) into local villages, hidden culinary spots, and cultural activities. The app encourages exploration through a "Checklist/Passport" system.

**The Problem:** Tourists often lack knowledge of where to go after visiting major temples. They rely heavily on standard tour packages and miss the authentic Cambodian experience (villages, local products, hidden foods), resulting in concentrated tourism and less economic benefit for rural communities.

**The Solution:** A curated "Quest" application where users discover specific locations/items, bookmark them for planning, and "check them off" physically to earn digital achievements.

---

## 2. Product Scope & Technical Approach

- **Type:** Responsive Web Application (Mobile-First Design).
- **Core Behavior:**
  - **On Mobile:** Acts as a native app with a fixed bottom navigation bar and touch-friendly interface.
  - **On Desktop:** Adapts to a wide-screen layout with top/side navigation and split-screen views (Map + Content).
- **Authentication:** **Google Sign-In (Gmail) Only**. No email/password registration to keep onboarding instant.
- **Content Strategy:** 100% Admin-curated content (User uploads/reviews are out of scope for Phase 1).

---

## 3. User Features (Functional Requirements)

### 3.1 Authentication

- **Sign Up / Login:** Simple "Continue with Google" button.
- **Session Management:** Keep users logged in for long periods to avoid friction while traveling.

### 3.2 Navigation Structure

- **Mobile View:** Fixed Bottom Navigation Bar with 4 Tabs:
  1.  **Explore** (Home)
  2.  **Map**
  3.  **Saved** (Bookmarks)
  4.  **Passport** (Profile)
- **Desktop View:** Top Navigation Bar or Left Sidebar. The "Map" should ideally be visible alongside the list of places (Split View).

### 3.3 Feature: Explore (Home Tab)

- **Categories:** The home screen displays clear category buttons:
  - _Villages_ (Community tourism, Homestays)
  - _Food & Drink_ (Specific dishes like Num Banh Chok, Palm Juice)
  - _Souvenirs_ (Local products, Krama, Pottery)
  - _Activities_ (Ox-cart rides, Silk weaving classes)
  - _Festivals_ (Seasonal events)
- **Search:** A search bar to find specific places or items by name.
- **Detail View:** Clicking an item opens a detailed page/modal with:
  - Image, Description, Location Address, "Get Directions" button (links to Google Maps).

### 3.4 Feature: Interactive Map

- **Map Interface:** A full-screen map of Cambodia.
- **Pins:** Different colored icons representing different categories (e.g., Green for Nature, Orange for Food).
- **User Location:** Shows user's current position to identify "Quests" nearby.
- **Interaction:** Tapping a pin shows a summary card at the bottom of the screen. Clicking the card goes to the Detail View.

### 3.5 Feature: Saved (Bookmarks)

- **Function:** Users can click a "Bookmark/Heart" icon on any item in the Explore or Map view.
- **The "Saved" Tab:** A dedicated list showing all bookmarked items.
- **Filtering:** Users can filter their saved list by category (e.g., "Show me only the Food I saved").

### 3.6 Feature: The Passport (Gamification)

- **Check-in Action:** On any Detail View, users can tap a "Mark as Complete" or "Check-in" button.
- **Progress Tracking:** The Passport tab shows:
  - **Stats:** "You have visited 5/20 Villages."
  - **History:** A chronological list of completed items.
  - **Badges (Future-proofing):** Placeholder UI for achievements (e.g., "Foodie Level 1").

---

## 4. UI/UX Guidelines

### Mobile Experience (Priority)

- **Touch Targets:** Buttons must be large enough for easy tapping while walking/traveling.
- **Minimal Typing:** Rely on tapping and scrolling.
- **Visual Heavy:** High-quality images of the places/food are the main focus.

### Desktop Experience

- **Space Utilization:** Don't just stretch the mobile view. Use the width to show the Map and the List side-by-side.

---

## 5. Non-Functional Requirements

- **Performance:** The site must load fast (under 3 seconds on 4G networks).
- **PWA (Progressive Web App):**
  - Users should be prompted to "Add to Home Screen."
  - Basic caching should be implemented so the app shell loads even with poor internet connection.
- **Scalability:** Database structure (PostgreSQL/MongoDB) should be designed to handle thousands of locations in the future.

---

## 6. Future Roadmap (Not in MVP)

- _Monetization:_ Ad integration and Commission/Affiliate links for bookings.
- _Community:_ User reviews and photo uploads.
- _Social:_ Sharing achievements on social media.

---
