# Gokiishere - Project Design Document

## 1. Project Overview
**Gokiishere** is a high-performance landing page designed to showcase professional "joki" services in the technology and engineering sectors. The project emphasizes technical excellence, speed, and a bold, industrial aesthetic.

- **Vision**: To be the most trusted platform for high-level technical outsourcing.
- **Core Values**: Precision, Transparency, and Modern Engineering.

---

## 2. Technical Stack
The project is built using a modern, lightweight, and type-safe stack.

| Category | Technology | Reason |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Latest features, improved performance, and ecosystem support. |
| **Build Tool** | [Vite](https://vitejs.dev/) | Extremely fast Hot Module Replacement (HMR) and optimized builds. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static typing to prevent runtime errors and improve developer experience. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling with the new CSS-native configuration engine. |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth, declarative animations for UI interactions. |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent, and lightweight icon set. |

---

## 3. Design Philosophy: Neo-Brutalism
The UI follows a **Neo-Brutalist** aesthetic, which deviates from standard minimalist trends to create a memorable, high-impact brand identity.

### Key Visual Elements:
- **High Contrast**: Pure black borders and shadows against light backgrounds.
- **Hard Shadows**: Box shadows use 0 blur and specific offsets (e.g., `4px 4px 0px 0px black`).
- **Thick Borders**: Consistent `2px` or `4px` black borders on cards and buttons.
- **Bold Typography**: Heavy font weights and uppercase tracking for headers.

### Color Palette:
- **Base BG**: `#F2F2F2` (Soft Gray)
- **Text Base**: `#121212` (Near Black)
- **Brand Blue**: `#2563EB` (Primary Action)
- **Brand Yellow**: `#FACC15` (Highlight/Accent)

### Typography:
- **Sans-Serif**: `Inter` (UI and body text)
- **Monospace**: `JetBrains Mono` (Technical details, status tags, and ticker)

---

## 4. Architecture & Structure

### Component Strategy:
- **Atomic Design**: Currently centralized in `App.tsx` for the prototype phase, but planned to be split into:
  - `components/ui/`: Reusable brutalist primitives (Buttons, Cards, Badges).
  - `components/sections/`: Large page blocks (Hero, Services, Process).
  - `components/layout/`: Navbar, Footer, Ticker.

### Layout System:
- **Grid-First**: Uses CSS Grid for the main Hero/Services split.
- **Responsive**: Mobile-first approach transitioning to a side-by-side grid layout on `lg` screens.

---

## 5. Key Features
1. **Tech Ticker**: An infinite scrolling footer displaying real-time statistics and capabilities.
2. **Brutalist Interactions**: Buttons that "press down" on click by adjusting shadow offsets and transforms.
3. **Dynamic Service List**: Data-driven service grid allowing for easy updates to the catalog.
4. **AI-Ready**: Pre-configured with `@google/genai` for future integration of automated project consultation or cost estimation.

---

## 6. Future Roadmap
- [ ] Transition to Next.js for better SEO and SSR.
- [ ] Implement a dynamic Portfolio gallery.
- [ ] Integrate a WhatsApp API for direct ordering.
- [ ] Add a dark mode toggle (keeping the brutalist contrast).
- [ ] Implement a real-time "Cost Calculator" using Gemini AI.
