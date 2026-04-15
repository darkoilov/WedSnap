WORK MODE: STEP-BY-STEP EXECUTION

You must NOT generate the full UI at once.

Instead:
- Follow the document section by section
- Treat each major section as a separate step
- After completing ONE section, STOP
- Wait for my approval before continuing

Rules:
- Do NOT continue automatically
- Do NOT implement future sections
- Do NOT skip sections
- Do NOT merge multiple sections into one step

After each step:
1. Briefly explain what was built
2. Show the code
3. STOP and wait for approval

I will tell you when to continue with the next section.

V0 MASTER UI SPEC – WEDDING PHOTO QR PLATFORM
________________________________________
🧠 GLOBAL INSTRUCTIONS (PASTE FIRST)
Build a modern, production-ready React UI using Tailwind CSS.

CRITICAL RULES:
- Do NOT use mock data
- All data must come from props or API placeholders
- Do NOT hardcode images or content
- Focus on mobile-first UX
- No authentication UI
- No payment UI
- No backend logic
- Keep components reusable and modular

UX PRIORITY:
- Maximum 2 clicks to upload
- Large, clear buttons
- Instant feedback (loading, success, error)
- Designed for non-technical users (wedding guests)

STYLE:
- Minimal, elegant wedding style
- Clean, modern SaaS feel
- Neutral palette: white, beige, soft gray
- Subtle shadows, rounded corners (rounded-xl)
- No heavy decorations or clutter
________________________________________
🗺️ PAGE MAP (ALL PAGES)
1. Event Landing Page (MAIN)
2. Upload State Views (same page)
3. Gallery Page
4. Admin Panel (minimal)
5. Error / Invalid Event Page
6. Event Closed / Upload Disabled State
________________________________________
📱 1. EVENT LANDING PAGE
🎯 Goal
User can upload photos immediately after scanning QR
________________________________________
📐 Layout Rules [x] COMPLETED
- Max width: max-w-md (mobile), max-w-2xl (desktop)
- Centered container
- Vertical spacing: space-y-6
- Padding: p-4 mobile, p-6 desktop
- All content centered
________________________________________
🧩 COMPONENT STRUCTURE

Header [x] COMPLETED
Props:
- eventName: string

UI:
- Large title (text-2xl or text-3xl)
- Centered
- Elegant font weight (font-semibold)
________________________________________
Event Info [x] COMPLETED
Props:
- eventDate: string
- eventLocation?: string

UI:
- Small muted text (text-sm text-gray-500)
- Centered under title
________________________________________
Upload Section (MAIN) [x] COMPLETED
Props:
- uploadEnabled: boolean
- remainingStorageMb: number
- maxStorageMb: number
- eventStatus: "active" | "full" | "closed"
________________________________________
🎯 STATES (VERY IMPORTANT)
1. IDLE STATE [x]
- Large primary button (full width)
- Text: "📸 Додади слики"
- Subtext below: "Можеш да додадеш повеќе слики одеднаш"
- Storage indicator:
  "Останато: X MB од Y MB"
________________________________________
2. FILES SELECTED [x]
- Show preview grid
- Show file names
- Show remove (X) button per file
- Show upload button: "Прикачи"
________________________________________
3. UPLOADING STATE [x]
- Disable buttons
- Show progress bar
- Show percentage
- Optional spinner
________________________________________
4. SUCCESS STATE [x]
- Large check icon
- Text: "Сликите се успешно прикачени!"
- Button: "Додади уште"
________________________________________
5. ERROR STATE [x]
- Red message
- Text: "Настана грешка. Обиди се повторно."
- Button: Retry
________________________________________
6. UPLOAD DISABLED [x]
Condition:
eventStatus = "full" OR "closed"

UI:
- Disabled button
- Message:
  "Upload лимитот е достигнат" OR
  "Овој настан е затворен"
________________________________________
🖼️ 2. GALLERY PAGE [x] COMPLETED
🎯 Goal
Users can view uploaded images
________________________________________
📐 Layout [x]
- Grid layout
- 2 columns mobile
- 3 columns tablet
- 4 columns desktop
- Gap: gap-2 or gap-4
________________________________________
🔹 Image Grid [x]
Props:
images: {
  id: string
  url: string
  thumbnailUrl: string
  type: "image" | "video"
  uploadedAt: string
}[]
________________________________________
🔹 Empty State [x]
- Text: "Сѐ уште нема слики"
- Centered
________________________________________
🔹 Image Modal [x]
Props:
- imageUrl: string

UI:
- Fullscreen overlay
- Close (X) top-right
- Background dark overlay
________________________________________
🛠️ 3. ADMIN PANEL (MINIMAL) [x] COMPLETED
🎯 Goal
Event owner manages uploads
________________________________________
Layout [x]
- Max width: max-w-4xl
- Grid or list layout
________________________________________
Upload List [x]
Props:
uploads: {
  id: string
  url: string
  type: string
  size: number
}[]
________________________________________
UI [x]
- Thumbnail preview
- File size
- Delete button (danger)
- Optional: download button
________________________________________
❌ 4. ERROR PAGE (INVALID EVENT) [ ] <-- NEXT STEP
UI:
- Message: "Настанот не постои"
- Centered
- Button: "Назад"
________________________________________
🔒 5. EVENT CLOSED PAGE [ ]
UI:
- Message: "Овој настан е затворен"
- No upload button
________________________________________
🧩 6. GLOBAL COMPONENTS [ ]
________________________________________
Button [ ]
Variants:
- primary (dark background, white text)
- secondary (light border)
- danger (red)

States:
- hover
- disabled
________________________________________
Card [ ]
- White background
- Shadow
- Rounded-xl
- Padding p-4 or p-6
________________________________________
Modal [ ]
- Overlay (bg-black/50)
- Centered content
- Close button
________________________________________
Progress Bar [ ]
- Rounded
- Smooth animation
________________________________________
📱 7. RESPONSIVE RULES [ ]
Mobile-first:
- All buttons full width
- Stack vertically

Tablet:
- Increase spacing
- Improve grid

Desktop:
- Center content
- Use wider container
________________________________________
🎨 8. DESIGN SYSTEM [x] COMPLETED
________________________________________
Colors [x]
Primary: gray-900
Background: white
Accent: beige / gray-100
Error: red-500
Success: green-500
________________________________________
Typography [x]
- Title: text-2xl / text-3xl
- Body: text-base
- Small: text-sm
________________________________________
Spacing [x]
space-y-4 / space-y-6
________________________________________
Radius [x]
rounded-xl everywhere
________________________________________
⚠️ 9. EDGE CASES
________________________________________
No internet
Show:
"Нема интернет конекција"
________________________________________
Slow upload
Show spinner + progress
________________________________________
Large files
Show error:
"Фајлот е преголем"
________________________________________
🔌 10. API PLACEHOLDERS
GET /api/event/:slug
POST /api/upload/init
POST /api/upload/complete
GET /api/gallery/:slug
________________________________________
🚫 11. DO NOT INCLUDE
- Authentication
- Payments
- Backend logic
________________________________________
🏁 FINAL INSTRUCTION (PASTE LAST)
Generate clean, production-ready React components using Tailwind.

Requirements:
- Fully responsive
- Modular components
- Clean code structure
- No mock data
- Ready for API integration

