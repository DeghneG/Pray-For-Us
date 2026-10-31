# Pray For Us: proposal prototype

Vite 5 + React 18 + TypeScript + Tailwind 3.4, run with Bun. Front end only: sample data, mock checkout and mock admin. No orders are sent anywhere.

## Run
```
bun install
bun run images     # builds public/img (WebP) and public/logo.png from "pfu picture" and "Logo"
bun run dev        # http://localhost:5173
bun run build      # type-check + production build into dist/
```

## Where things are
- `src/data/products.ts`: the catalog (prices, status, sizes, size charts, photo names, bundle rule).
- `src/data/fits.ts`: The Congregation (people wearing the merch).
- `scripts/image-map.json`: which original photo is which product. `file_mapping.json` links the renamed `01.jpg`...`58.jpg` back to the Facebook file names.
- `src/lib/bag.tsx`, `src/lib/order.ts`: order bag, DAY N NITE bundle, order message, demo order storage (browser localStorage).
- `src/admin/Admin.tsx`: demo admin at `/admin` (any password).
- `vercel.json`: SPA rewrite for hosting.

## Plans
Planning docs (PLAN, IMPLEMENTATION_PLAN, FEATURES_PLAN, ARCHITECTURE) are kept out of this repo on purpose. The original photos (`pfu picture/`) and source logo (`Logo/`) are also local only, so `bun run images` needs them present; the optimized output in `public/` is committed.

## Known gaps
- DAY (white) tee photos missing; shows a placeholder.
- Hat names (GOOD WILL, ISAIAH, Paris, FMJ) were assigned from photo order in the posts: confirm with the client.
- Logo is a transparent cut-out made from the white-background file; a client-supplied transparent logo would be sharper.
- Payment methods and processing time are not known yet ("How to order" shows a placeholder).
- About page copy is a draft.
