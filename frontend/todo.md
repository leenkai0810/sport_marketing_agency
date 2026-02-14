# Sports Marketing Agency Landing Page - Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **Nike.com**: Bold athlete imagery, dynamic layouts, inspiring copy
- **Adidas.com**: Clean sections, strong CTAs, professional sports aesthetic
- **Style**: Modern Sports Marketing + Bold Typography + Dynamic Imagery

### Color Palette
- Primary: #FF0000 (Vibrant Red - energy, passion, sports)
- Secondary: #1A1A1A (Deep Black - professionalism, strength)
- Accent: #FFFFFF (White - clarity, clean)
- Background: #0A0A0A (Dark Black - dramatic backdrop)
- Text: #FFFFFF (White), #CCCCCC (Light Gray - secondary text)

### Typography
- Heading1: Inter font-weight 900 (56px) - Bold, impactful headlines
- Heading2: Inter font-weight 800 (40px) - Section headers
- Heading3: Inter font-weight 700 (28px) - Subsection titles
- Body/Normal: Inter font-weight 400 (16px) - Readable body text
- Body/Emphasize: Inter font-weight 600 (16px) - Important info
- CTA Buttons: Inter font-weight 700 (18px) - Action-driving text

### Key Component Styles
- **Buttons**: Red background (#FF0000), white text, 8px rounded, hover: scale 1.05 + shadow
- **Cards**: Dark background (#1A1A1A), subtle border, 12px rounded, hover: lift effect
- **Forms**: Dark inputs with red focus border, white text, clear labels
- **Sections**: Full-width, alternating dark backgrounds, 100px vertical padding

### Layout & Spacing
- Hero section: Full viewport height with dynamic athlete imagery
- Content sections: Max-width 1200px, centered, 80px vertical spacing
- Grid layouts: 3 columns desktop, 2 tablet, 1 mobile, 32px gaps
- Form layouts: Single column, 24px field spacing

### Images to Generate
1. **hero-athlete-action.jpg** - Dynamic shot of athlete in intense action moment, multiple sports collage style (Style: photorealistic, high energy, dramatic lighting)
2. **soccer-player-celebration.jpg** - Soccer player celebrating goal, professional stadium setting (Style: photorealistic, vibrant, emotional)
3. **basketball-dunk-action.jpg** - Basketball player mid-dunk, powerful athletic moment (Style: photorealistic, dynamic motion)
4. **social-media-growth.jpg** - Abstract visualization of social media growth, Instagram/TikTok icons, upward trending graphs (Style: modern digital art, tech-focused)
5. **professional-team-work.jpg** - Team of professionals working on video editing and social media content (Style: photorealistic, professional office setting)
6. **multi-sport-collage.jpg** - Collage featuring various sports: tennis, swimming, track, boxing (Style: photorealistic, energetic composition)

---

## Development Tasks

### Phase 1: Setup & Structure
- Initialize shadcn-ui template ✓
- Install dependencies ✓
- Generate all 6 hero/feature images using ImageCreator

### Phase 2: Database Setup
- Create `athlete_registrations` table (name, email, phone, sport, instagram_handle, tiktok_handle, status, created_at)
- Create `info_requests` table (athlete_id, message, status, created_at)
- Install backend dependencies and configure Stripe

### Phase 3: Frontend Components
- Hero section with captivating headline and CTA
- About section (agency description, mission, team)
- Services section (3-column grid: Social Media Management, Video Editing, Brand Exposure)
- Registration form component with validation
- Info request form component
- Social proof section with athlete imagery
- Contact/CTA section

### Phase 4: Backend Integration
- Auth callback route setup
- Registration API integration
- Info request API integration
- Payment gateway (Stripe) integration for monthly subscriptions

### Phase 5: Styling & Polish
- Apply design system consistently
- Add hover effects and animations
- Ensure responsive design (mobile, tablet, desktop)
- Optimize images and performance

### Phase 6: Testing & Deployment
- Run lint check
- Test all forms and user flows
- Test payment integration
- Check UI rendering quality