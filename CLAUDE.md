# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Love Drop is a React Native mobile application built with Expo that provides a Tinder-style course matching experience. Users can swipe through available courses, match with courses they're interested in, chat about them, and manage their schedules.

## Tech Stack

- **Framework**: React Native with Expo (~52.0.25) with new architecture enabled
- **Routing**: expo-router (~4.0.16, file-based routing)
- **Styling**: NativeWind 4.x (TailwindCSS for React Native)
- **Backend**: Supabase (authentication, database)
- **Animations**: react-native-reanimated (~3.16.1)
- **Gestures**: react-native-gesture-handler (~2.20.2)
- **Icons**: lucide-react-native
- **State**: React Context API (no Redux/Zustand)
- **Testing**: Jest with jest-expo preset

## Development Commands

```bash
# Start the development server
npm start

# Start on specific platforms
npm run android
npm run ios
npm run web

# Run tests in watch mode
npm test

# Lint the codebase
npm run lint

# Reset project (clears generated files)
npm run reset-project
```

## Architecture

### Routing Structure

The app uses Expo Router with file-based routing:

- `app/index.tsx` - Landing/welcome screen
- `app/(auth)/` - Authentication group (login, etc.)
- `app/(tabs)/` - Main tab navigation group
  - `home.tsx` - Swipe/discover courses
  - `matches.tsx` - View matched courses
  - `schedule.tsx` - Calendar views (weekly, monthly, yearly)
  - `profile.tsx` - User profile with avatar builder
  - `settings.tsx` - App settings
- `app/chat.tsx` - Chat screen for matched courses

### Key Directories

- `components/` - Reusable UI components
  - `SwipeCard.tsx` - Course card with swipe gestures
  - `MatchModal.tsx` - Match notification modal with animations
  - `AvatarBuilder.tsx` - Custom avatar creation system
  - `CourseDetailsModal.tsx` - Full course information modal
  - `Toast.tsx` - Toast notification component
  - Calendar components: `WeeklyCalendar.tsx`, `MonthlyCalendar.tsx`, `YearlyCalendar.tsx`
  - `ViewSwitcher.tsx` - Switch between different calendar views
- `context/` - React Context providers
  - `ToastContext.tsx` - Global toast notification system
- `lib/` - Core utilities
  - `supabase.ts` - Supabase client configuration
- `types/` - TypeScript type definitions
  - `supabase.ts` - Auto-generated database types from Supabase

### Database Schema (Supabase)

**Tables:**
- `courses` - Course information (code, title, description, instructor_name, schedule, image_url, is_elective, match_probability)
- `matches` - User-course matches (user_id, course_id, status: "matched"|"pending"|"rejected")
- `messages` - Chat messages (match_id, sender_id, content)
- `profiles` - User profiles (id, email, full_name, avatar_url, avatar_config)

### Supabase Configuration

The Supabase client is configured in `lib/supabase.ts` and uses:
- AsyncStorage for session persistence
- Auto-refresh tokens
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- These variables are stored in `.env` (not committed to git)

### Swipe Mechanism

The swipe functionality in `app/(tabs)/home.tsx` uses:
- `react-native-reanimated` for smooth animations
- `react-native-gesture-handler` for pan gestures
- Swipe threshold of 25% screen width
- Automatic match probability simulation (configurable per course)
- Match status: "matched" (shows MatchModal), "pending", or "rejected"
- Filters courses by: all, elective only, or required only

### Avatar System

Users can create custom avatars using the `AvatarBuilder` component:
- Customizable features: `skinColor`, `eyeStyle`, `noseStyle`, `mouthStyle`, `hairStyle`, `hairColor`
- Uses SVG (react-native-svg) for rendering avatar components
- Avatar configuration stored in `profiles.avatar_config` as JSON
- `AvatarPreview` component renders the configured avatar at any size
- Default configuration available in `defaultAvatarConfig`

### Animation Patterns

The app extensively uses `react-native-reanimated` for:
- Swipe card animations with rotation
- Match modal entrance animations (ZoomIn, SlideInLeft, SlideInRight, BounceIn)
- Smooth spring-based transitions

### Context Providers & Root Layout

All context providers should be added to `app/_layout.tsx`:
- `ToastProvider` - Wraps the entire app for global toast notifications
- `GestureHandlerRootView` - Required for gesture handling
- Imports `global.css` for Tailwind base styles

### TypeScript

- Uses strict mode
- JSX mode: react-native
- Database types are auto-generated in `types/supabase.ts`
- Import database types: `import { Database } from '../types/supabase'`
- Use type aliases for tables: `type Course = Database['public']['Tables']['courses']['Row']`

## Key Patterns

### Authentication Flow

1. Users start at `app/index.tsx` (landing page)
2. Login via `app/(auth)/login.tsx`
3. Supabase handles auth state with AsyncStorage persistence
4. On successful login, redirect to `/(tabs)/home`
5. Protected routes check `supabase.auth.getUser()` and redirect to login if unauthenticated

### Match Flow

1. User swipes right on a course in home screen
2. Match probability determines if it's an instant match
3. If matched, `MatchModal` appears with animation
4. User can "Send a Message" (navigates to chat) or "Keep Swiping"
5. Match record is created in database with status
6. Matched courses are excluded from future swipes

### Styling Approach

- Uses NativeWind (TailwindCSS classes as className)
- Prefer className over StyleSheet.create
- Common pattern: `className="flex-1 items-center justify-center bg-white"`
- Custom shadows use style prop with shadow properties
- Pink color scheme: primary color is `#ec4899` (pink-500)

### Data Fetching

- Uses Supabase client directly in components (no separate data layer)
- Common pattern: Check auth, fetch user data, fetch related data
- Uses `useFocusEffect` from expo-router to refetch on tab focus
- Error handling with console.error and toast notifications

## Environment Setup

1. Create `.env` file with:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Testing

- Uses Jest with jest-expo preset
- Test files should follow pattern: `*.test.ts` or `*.test.tsx`
- Run tests in watch mode: `npm test`

## Updating Database Types

When the Supabase schema changes, regenerate types using the Supabase CLI:
```bash
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

## App Configuration

- **Bundle Identifiers**:
  - iOS: `com.anonymous.lovedrop`
  - Android: `com.anonymous.lovedrop`
- **URL Scheme**: `love-drop://`
- **New Architecture**: Enabled (React Native's new architecture)
- **Orientation**: Portrait only
