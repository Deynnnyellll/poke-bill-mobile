# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm start` / `npx expo start` — start the Metro dev server (prompts for platform: press `w` for web, `a`/`i` for emulators, or scan QR with Expo Go).
- `npm run web` — start directly in web mode.
- `npm run android` / `npm run ios` — start directly targeting an emulator.
- `npm run lint` — runs `expo lint` (ESLint). There is no configured test runner or `test` script in this repo.
- `npm run reset-project` — runs `scripts/reset-project.js`, which moves the current starter code in `src/app` to `app-example` and creates a blank `src/app`. Only run this if the user explicitly asks to wipe the starter.

## Architecture

This is an Expo Router (file-based routing) app. **Expo has changed significantly in recent versions** — always check the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing code against Expo/Router/RN APIs; do not rely on older/remembered Expo patterns.

- Routing root is `src/app` (configured via `expo-router` + the `main: "expo-router/entry"` field in `package.json`). Files here define routes: `_layout.tsx` is the root layout, `index.tsx`/`index.jsx` is Home, `explore.tsx` is the second tab.
- **New route files (`index` and anything added after it) should be authored as `.jsx`, not `.tsx`** — this was an explicit user decision partway through this project's life; existing `.tsx` route/component files don't need to be converted unless asked. `tsconfig.json` has `allowJs`/`.jsx`/`.js` included in `include` for editor support even though the project is otherwise TypeScript.
- Platform-specific files use Expo/Metro's automatic extension resolution: a `.web.tsx` (or `.web.ts`) file overrides the default `.tsx`/`.ts` file on web only. Existing pairs: `app-tabs.tsx`/`app-tabs.web.tsx`, `animated-icon.tsx`/`animated-icon.web.tsx`, `use-color-scheme.ts`/`use-color-scheme.web.ts`. When changing behavior for one platform, check whether a platform-specific override file already exists before editing the shared one.
- Tab navigation is split by platform: `AppTabs` (native) uses `expo-router/unstable-native-tabs` (`NativeTabs`), while `AppTabs` (web) builds a custom tab bar from `expo-router/ui` primitives (`Tabs`, `TabList`, `TabTrigger`, `TabSlot`). Both are wired from `src/app/_layout.tsx` via the shared `AppTabs` import (extension resolution picks the right one).
- Theming lives in `src/constants/theme.ts` (`Colors.light`/`Colors.dark`, `Fonts`, `Spacing` scale, `BottomTabInset`, `MaxContentWidth`) and is consumed through `useTheme()` (`src/hooks/use-theme.ts`), which reads `useColorScheme()` and falls back to `'light'` when `'unspecified'`. `ThemedText` and `ThemedView` (`src/components/themed-*.tsx`) are the standard building blocks — they take a `type`/`themeColor` prop keyed into `Colors`/typography styles rather than raw inline colors. `use-color-scheme.web.ts` special-cases web to avoid SSR/static-render hydration mismatches (returns `'light'` until hydrated).
- Path alias `@/*` maps to `src/*`, and `@/assets/*` maps to the top-level `assets/` directory (see `tsconfig.json`).
- `app.json` has `experiments.typedRoutes` and `experiments.reactCompiler` enabled — don't disable these without a reason, and don't hand-write memoization the compiler already handles.
- Splash/animated intro is handled by `AnimatedSplashOverlay` + `AnimatedIcon` (`src/components/animated-icon.tsx` / `.web.tsx`), driven by `react-native-reanimated` keyframes and shown from `_layout.tsx`; `SplashScreen.preventAutoHideAsync()` is called at module scope there.
