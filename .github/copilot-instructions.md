# AI Coding Agent Instructions

## Project Overview
**NextStore** is a full-stack e-commerce application built with **Next.js 16**, **Prisma ORM**, and **Tailwind CSS** with **shadcn/ui** components. The architecture emphasizes server-side rendering, type safety, and a clean component hierarchy.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4 + Tailwind Merge
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **Icons**: react-icons + Radix UI icons
- **Theme**: next-themes with system preference detection
- **State**: Server Components (async) + React context for theme
- **Forms**: Standardized form components in `/components/form`

### Directory Structure
- **`app/`** - Next.js pages (route segments) and layouts
- **`components/`** - Reusable UI organized by feature:
  - `ui/` - shadcn/ui base components
  - `navbar/` - Navigation components (Logo, CartButton, DarkMode, LinksDropDown, UserIcon, SignOutLink, NavSearch)
  - `global/` - App-wide layout components (Container, SectionTitle, EmptyList, LoadingContainer)
  - `home/` - Homepage features (Hero, HeroCarousel, FeaturedProducts)
  - `products/` - Product listing (ProductsGrid, ProductsList, FavoriteToggleButton)
  - `single-product/` - Product detail (BreadCrumbs, AddToCart, ProductRating)
  - `form/` - Form inputs and handlers
- **`utils/`** - Shared utilities:
  - `db.ts` - Prisma singleton instance (critical for connection pooling in dev)
  - `links.ts` - Navigation link definitions
  - `format.ts` - Formatting functions (formatCurrency)
  - `actions.ts` - Server actions for data fetching
- **`lib/`** - Library code:
  - `utils.ts` - `cn()` function (merges Tailwind classes safely)
  - `generated/prisma/` - Auto-generated Prisma Client (do not edit)
- **`prisma/`** - Database schema and migrations
- **`public/`** - Static assets

## Critical Developer Workflows

### Database Setup
```bash
npx prisma db push          # Sync schema to dev database
npx prisma studio          # GUI for viewing/editing data
npx prisma generate        # Regenerate Prisma Client after schema changes
```

### Development
```bash
npm run dev        # Start dev server (resets Prisma Client on hot reload - uses singleton pattern)
npm run build      # Build for production (includes `prisma generate`)
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Common Patterns

#### Prisma Singleton Pattern
The codebase uses a singleton pattern in `utils/db.ts` to prevent connection pool exhaustion during hot reloading:
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClientSingleton | undefined };
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;
```
**Always import from `@/utils/db` for all database operations**, never directly instantiate `PrismaClient`.

#### Server Actions & Data Fetching
All data queries use server actions in `utils/actions.ts`:
```typescript
export const fetchAllProducts = ({ search = "" }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};
```
Components call these directly (no API routes needed for internal data).

#### Async Components with Suspense
Product lists use async Server Components wrapped in `Suspense`:
```tsx
<Suspense fallback={<LoadingContainer />}>
  <FeaturedProducts /> {/* internally calls fetchFeaturedProducts() */}
</Suspense>
```
This provides streaming and loading states without client-side data fetching.

#### Class Name Merging
Always use the `cn()` utility from `@/lib/utils` to merge Tailwind classes:
```typescript
cn("base-class", condition && "conditional-class", customClass)
```
This prevents conflicts when conditional classes override base Tailwind directives.

#### Component Structure
- **UI Components**: Simple, stateless presentational components from shadcn/ui
- **Feature Components**: May have local state (e.g., `NavSearch` uses `useState` with debouncing)
- **Container/Layout**: Use `<Container>` wrapper for consistent max-width and padding
- **Image Optimization**: All Next.js `<Image>` components include `sizes` prop and `priority` attribute

#### Forms & Inputs
Custom form inputs in `components/form/` accept standard props:
```tsx
<FormInput name="productName" type="text" label="Product Name" />
```
These wrap shadcn `<Input>` and `<Label>` for consistency.

## Project-Specific Conventions

### Naming Conventions
- Components: PascalCase (`Navbar.tsx`, `ProductsGrid.tsx`)
- Utilities/Actions: camelCase (`fetchAllProducts`, `formatCurrency`)
- Type definitions: Imported from Prisma (`Product` from `@prisma/client`)

### Tailwind + shadcn Pattern
- Use Tailwind utility classes directly in JSX
- Import shadcn components for complex interactions (dropdowns, modals, carousels)
- `Radix UI` props (e.g., `variant`, `size`) available on most shadcn components

### Search & Filtering
`NavSearch` uses URL params (`searchParams`) not local state:
- Search term → URL query string via `useRouter().replace()`
- Products filtered server-side in `fetchAllProducts({ search })`
- Debouncing prevents excessive queries

### Dark Mode
Handled by `next-themes` context provider:
- Automatically reads system preference
- Toggle in `DarkMode` component calls `setTheme("dark"|"light"|"system")`
- CSS variables in `app/globals.css` define colors per theme

## Integration Points

### Authentication (Clerk)
- Middleware restricts `/admin` routes to `process.env.ADMIN_USER_ID`
- `currentUser()` server function retrieves auth context
- Components use `<SignedIn>` / `<SignedOut>` for conditional rendering

### External Dependencies
- **Embla Carousel**: Hero carousel (`<Carousel>`, `<CarouselItem>`)
- **Sonner**: Toast notifications (imported in providers)
- **use-debounce**: Debounces search input in `NavSearch`
- **@faker-js/faker**: Generates mock product data (dev only)

### Images
- Remote images from `images.pexels.com` (configured in `next.config.ts`)
- All images use Next.js `<Image>` component with responsive `sizes` and `fill` props

## Key Files to Reference
- `prisma/schema.prisma` - Data model definition
- `utils/db.ts` - Prisma singleton pattern (critical)
- `utils/actions.ts` - All server-side queries
- `app/layout.tsx` - Root layout with providers
- `components/global/Container.tsx` - Layout wrapper template
- `components/products/ProductsGrid.tsx` - Template for rendering lists
- `.env.local` - Database URLs and API keys (not in git)

## Build & Deployment
- Production build runs `prisma generate` before `next build` (see `package.json`)
- Environment variables split: `NEXT_PUBLIC_*` for client, others for server only
- Deploy to Vercel with GitHub integration (sets env vars in dashboard)
