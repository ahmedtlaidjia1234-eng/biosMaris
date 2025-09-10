# Bios Maris Website MVP Todo

## Core Features to Implement:
1. **Main Landing Page** (`src/pages/Index.tsx`)
   - Hero section with animated entrance (image unzooming)
   - Products showcase section with hover animations
   - Contact information display
   - Responsive design

2. **Product Components** (`src/components/ProductCard.tsx`, `src/components/ProductGrid.tsx`)
   - Product cards with hover effects
   - Image gallery on hover
   - Product details overlay

3. **Navigation** (`src/components/Navbar.tsx`)
   - Animated navbar that changes position on scroll
   - Day/night mode toggle
   - Responsive menu

4. **Search System** (`src/components/SearchSystem.tsx`)
   - QR code scanner integration
   - Product search functionality

5. **Admin Panel** (`src/pages/Admin.tsx`)
   - Product management (add/edit/remove)
   - Admin authentication
   - Settings management

6. **Theme System** (`src/hooks/useTheme.ts`)
   - Day/night mode implementation
   - Theme persistence

7. **Custom Cursor** (`src/components/CustomCursor.tsx`)
   - Animated cursor following mouse
   - Interactive animations

8. **Data Management** (`src/lib/products.ts`)
   - Product data structure
   - Local storage for admin changes

## File Structure:
- `src/pages/Index.tsx` - Main homepage
- `src/pages/Admin.tsx` - Admin panel
- `src/components/Navbar.tsx` - Navigation component
- `src/components/ProductCard.tsx` - Individual product card
- `src/components/ProductGrid.tsx` - Products grid layout
- `src/components/SearchSystem.tsx` - QR scanner and search
- `src/components/CustomCursor.tsx` - Animated cursor
- `src/hooks/useTheme.ts` - Theme management hook
- `src/lib/products.ts` - Product data and management