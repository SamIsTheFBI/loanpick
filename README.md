# LoanPick - Loan Comparison Platform

A modern loan comparison platform built with Next.js 16, featuring AI-powered product assistance, intelligent scoring, and personalized recommendations.
A demo video for this project is linked [here](https://www.loom.com/share/656226e623da49c99609babce1ff865a).

## Architecture Diagram
<img width="839" height="970" alt="image" src="https://github.com/user-attachments/assets/985452b4-3386-4613-b14f-7fcfeb561d8a" />


## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS 4, shadcn/ui, Aceternity UI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth (Email/Password + Google OAuth)
- **AI**: Google Gemini 2.5 Flash
- **Data Validation**: Zod

## Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Google Cloud Console account (for OAuth)
- Google AI Studio account (for Gemini API)

### 1. Clone and Install

```bash
git clone <repository-url>
cd clickpe-assignment
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Gemini AI
GEMINI_API_KEY=<your-gemini-api-key>
```

#### Getting API Keys:

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**Gemini API:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key

**Better Auth Secret:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Push schema to database
pnpm drizzle-kit push

# Seed with sample data
pnpm seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## Badge Logic

Badges are dynamically generated based on product attributes to highlight key features. Implementation in `lib/utils/badges.ts`:

### Badge Types & Criteria

| Badge | Criteria | Purpose |
|-------|----------|---------|
| **Low APR** | APR < 10% | Highlights competitive interest rates |
| **Prepayment Allowed** | `prepayment_allowed = true` | Shows flexibility in early repayment |
| **No Prepayment** | `prepayment_allowed = false` | Warns about prepayment restrictions |
| **Fast Disbursal** | `disbursal_speed = "instant"` or `"fast"` | Indicates quick loan processing |
| **Flexible Tenure** | Tenure spread ≥ 48 months | Shows repayment flexibility |
| **Low Docs** | `docs_level = "low"` or `"minimal"` | Minimal documentation required |
| **Salary ≥ ₹Xk** | Based on `min_income` | Income eligibility threshold |
| **Credit Score ≥ X** | Based on `min_credit_score` | Credit score requirement |

The code for the algorithm is present at `lib/utils/scoring.ts`.

## AI Grounding Strategy

The AI chat feature uses **context-aware grounding** to provide accurate, product-specific responses.

### Grounding Implementation

**1. Context Injection** (`app/api/ai/ask/route.ts`):

```typescript
const prompt = `You are a helpful financial assistant for a loan comparison platform. 
Answer questions about this loan product:

Product: ${product.name}
Bank: ${product.bank}
Type: ${product.type}
Interest Rate: ${product.rate_apr}% APR
Minimum Income: ₹${Number(product.min_income).toLocaleString("en-IN")}
Minimum Credit Score: ${product.min_credit_score}
Tenure: ${product.tenure_min_months} - ${product.tenure_max_months} months
Processing Fee: ${product.processing_fee_pct}%
Prepayment: ${product.prepayment_allowed ? "Allowed" : "Not allowed"}
Disbursal Speed: ${product.disbursal_speed}
Documentation: ${product.docs_level}

${product.summary ? `Summary: ${product.summary}` : ""}

FAQ:
${faqList}

Guidelines:
- Be concise and helpful
- Use the product information provided
- If asked about other products, politely redirect to this product
- Format numbers with Indian numbering (lakhs, crores)
- Don't make up information not in the product details`;
```

**2. Conversation History**:

The chat maintains context through conversation history:

```typescript
const chat = model.startChat({ 
  history: [
    { role: "user", parts: [{ text: prompt }] },
    { role: "model", parts: [{ text: "I understand. I'll help answer questions about this loan product." }] },
    ...previousMessages
  ] 
});
```

**3. Response Persistence**:

All conversations are stored for:
- User history retrieval
- Context continuity across sessions
- Analytics and improvement

```typescript
await db.insert(ai_chat_messages).values([
  { user_id: session.user.id, product_id: productId, role: "user", content: message },
  { user_id: session.user.id, product_id: productId, role: "assistant", content: response },
]);
```

### Grounding Benefits

1. **Accuracy**: AI responses are constrained to actual product data
2. **Consistency**: Same questions get consistent answers
3. **Compliance**: Prevents hallucination of financial terms
4. **Personalization**: Product-specific context for each chat
5. **Traceability**: All conversations are logged and retrievable

### Example Grounding Flow

```
User: "What's the interest rate?"
     ↓
Context: Product APR = 12.5%
     ↓
AI Response: "The interest rate for this loan is 12.5% APR."
     ↓
Saved to database with user_id and product_id
```

## Database Schema

### Products Table
```sql
products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  type TEXT NOT NULL,
  rate_apr NUMERIC NOT NULL,
  min_income NUMERIC NOT NULL,
  min_credit_score INTEGER NOT NULL,
  tenure_min_months INTEGER DEFAULT 6,
  tenure_max_months INTEGER DEFAULT 60,
  processing_fee_pct NUMERIC DEFAULT 0,
  prepayment_allowed BOOLEAN DEFAULT true,
  disbursal_speed TEXT DEFAULT 'standard',
  docs_level TEXT DEFAULT 'standard',
  summary TEXT,
  faq JSONB DEFAULT '[]',
  terms JSONB DEFAULT '{}'
)
```

### AI Chat Messages
```sql
ai_chat_messages (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id),
  product_id UUID NOT NULL REFERENCES products(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Authentication Tables
- `user`: User accounts
- `session`: Active sessions
- `account`: OAuth accounts
- `verification`: Email verification

## Features

### 🎯 Core Features
- **Smart Product Comparison**: Filter by APR, income, credit score
- **AI-Powered Chat**: Product-specific Q&A with Gemini AI
- **Personalized Dashboard**: Top 5 loan recommendations
- **Dynamic Badges**: Visual indicators for key features
- **Real-time Search**: Debounced search with instant results

### 🔐 Authentication
- Email/Password authentication
- Google OAuth integration
- Session management with Better Auth
- Protected routes

### 🎨 UI/UX
- Responsive design (mobile-first)
- Collapsible sidebar navigation
- Smooth animations with Motion
- Loading skeletons
- Toast notifications

### 📊 Data Management
- Type-safe database queries with Drizzle ORM
- Optimistic updates with React Query
- Server-side rendering for SEO
- API route handlers

## Project Structure

```
clickpe-assignment/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Home dashboard
│   │   ├── products/         # Product listing
│   │   └── layout.tsx        # Sidebar layout
│   ├── api/                  # API routes
│   │   ├── ai/               # AI chat endpoints
│   │   ├── products/         # Product endpoints
│   │   └── [...all]/         # Better Auth handler
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── app-sidebar.tsx       # Navigation sidebar
│   ├── loan-card.tsx         # Product card
│   ├── product-chat-*.tsx    # Chat components
│   └── products-*.tsx        # Product listing components
├── db/
│   ├── schema.ts             # Database schema
│   └── seed.ts               # Seed data
├── lib/
│   ├── utils/
│   │   ├── badges.ts         # Badge generation logic
│   │   └── scoring.ts        # Product scoring algorithm
│   ├── queries/              # Database queries
│   ├── auth.ts               # Auth configuration
│   └── db.ts                 # Database connection
└── drizzle/                  # Database migrations
```

## API Endpoints

### Products
- `GET /api/products` - List products with filters
  - Query params: `bank`, `aprMin`, `aprMax`, `minIncome`, `minCreditScore`

### AI Chat
- `POST /api/ai/ask` - Send chat message
  - Body: `{ productId, message, history }`
- `GET /api/ai/history` - Get chat history
  - Query params: `productId`

### Authentication
- `POST /api/auth/sign-in/email` - Email/password login
- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/sign-out` - Logout

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm seed         # Seed database with sample data
```

### Database Commands

```bash
# Generate migrations
pnpm drizzle-kit generate

# Push schema to database
pnpm drizzle-kit push

# Open Drizzle Studio
pnpm drizzle-kit studio
```
