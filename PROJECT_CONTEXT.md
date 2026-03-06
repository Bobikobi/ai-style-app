# ai-style-app — Project Context

## Repo
- GitHub: `Bobikobi/ai-style-app` | Branch: `master`
- Deployed: Vercel (auto-deploy on push)
- Last commit: `06c753c`

## Stack
- Next.js 14.1.0 App Router, TypeScript, `src/app`
- Tailwind CSS — neutral/stone/beige palette
- **Zero WebGL** — three/fiber/drei were removed due to crash. Pure SVG avatar.
- Pollinations.ai — free image generation (outfit cards, season moodboards)
- Supabase client exists (`src/lib/supabase.ts`) but is NOT used in analyze flow
- `.npmrc`: `legacy-peer-deps=true`

## File Map
```
src/app/
  page.tsx                  — Homepage
  layout.tsx                — Root layout + nav
  error.tsx                 — Global error boundary (Hebrew UI)
  analyze/page.tsx          — Upload photo → client-side Canvas pixel analysis → /quiz/results
  body-shape/page.tsx       — Interactive measurement sliders + live SVG avatar + color picker
  quiz/page.tsx             — Multi-step style quiz
  quiz/results/page.tsx     — Season + body shape results
  color-seasons/page.tsx    — 12-season color theory guide
  outfits/page.tsx          — Outfit gallery (Pollinations images)
  skin-guide/page.tsx       — Skin tone guide
  results/[id]/page.tsx     — Dynamic result page

src/components/
  body-avatar-3d.tsx        — SVG female figure: A-pose arms, 3D shading, skin color prop, RAF lerp morph
  body-shape-selector.tsx   — Shape picker using SHAPE_PRESETS + BodyAvatarFigure
  color-palette.tsx         — Season palette swatches
  nav.tsx                   — Top navigation
  upload-photo.tsx          — File/camera input component

src/lib/
  analyzeImage.ts           — Client-side pixel sampling (Canvas API), returns seasonId + skinToneId
  bodyShapeAlgorithm.ts     — detectBodyShape({bust,waist,hips}) → {shape, scores{}}
  imageService.ts           — Pollinations.ai URL builder
  supabase.ts               — Supabase client (unused in main flows)

src/data/styleData.ts       — BODY_SHAPES[], COLOR_SEASONS[], SKIN_TONES[] etc.
src/types/analysis.ts       — Shared TypeScript types
```

## Avatar (`body-avatar-3d.tsx`)
- Default export: `BodyAvatarFigure`
- Props: `bust, waist, hips` (cm), `skinColor` (hex), `showAnnotations`, `className`, `style`
- Named export: `SHAPE_PRESETS` — preset measurements per BodyShapeId
- ViewBox: `0 0 270 520`, CX=135
- Animation: `useEffect` RAF loop lerps `cur.ref` → `tgt.ref` at SPEED=0.10, mutates SVG DOM directly
- Shading: `linearGradient gBody` + `radialGradient gHl` (highlight) + `gEdge` (depth) + rim stroke
- `skinShades(hex)` derives base/light/lighter/dark/darker/shadow/rimLight/hlSpot from any hex

## Body Shape Algorithm
- `detectBodyShape({bust, waist, hips})` in `src/lib/bodyShapeAlgorithm.ts`
- Returns `{ shape: BodyShapeId, scores: Record<BodyShapeId, number> }`
- BodyShapeId: `'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle'`

## Body Shape Page (`/body-shape`)
- Left panel (44%): sticky dark avatar panel with measurement annotations + color swatch
- Right panel (56%): bust/waist/hips sliders (cm), skin-tone color bar (skin ↔ rainbow toggle), shape presets, match % bars, clothing recommendations, CTA to /quiz/results
- `skinGradientColor(t)` — interpolates across 7 skin-tone stops
- `hslToHex(h,s,l)` — converts HSL to hex for rainbow mode

## Analyze Flow
- User uploads photo → `analyzeImage(file)` samples center 120×120 pixels via Canvas
- Returns `{ seasonId, skinToneId, bodyShape: 'hourglass', avgR, avgG, avgB }`
- Routes to `/quiz/results?seasonId=...&skinTone=...&bodyShape=...`

## Known Issues / Pending
- OBJ model at `public/femaletorso_v2_L1.123c.../11542_femaletorso_v2.obj` (7.6 MB)
  — needs Blender export → GLB → Three.js implementation (not yet done)
- `BODY_SHAPES` in styleData.ts still has unused `emoji` field
- Google Custom Search catalog pipeline (designed, not implemented)
  — Vercel Cron → `/api/sync-catalog` → classify → Supabase
- Brand data enrichment pending (user will provide)

## Commands
```bash
npm run dev      # local dev
npm run build    # production build (must pass before push)
git push         # triggers Vercel deploy
```
