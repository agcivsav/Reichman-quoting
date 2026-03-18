# Reichman Sales — Quoting Dashboard

A full-stack quotes management system for Reichman Sales, built with **Next.js 14**, **Tailwind CSS**, and **Supabase**.

## Features

- **All Quotes Dashboard** — status-coded list with filters (status, sales rep, search)
- **Quote Detail** — inline product editor, substitution tracking, in-portal messaging, accept/status controls
- **My Quotes** — personal sales rep view
- **Customers** — customer directory with quote history
- **Public Quote Form** — branded submission form at `/quotes/submit`
- **External API** — REST endpoint for the main Reichman Sales site (cart → quote)
- **Real-time messaging** — Supabase Realtime powers the in-portal message thread
- **Role-based access** — admin / sales_rep / customer

## Stack

| Layer    | Tech                     |
|----------|--------------------------|
| Frontend | Next.js 14 (App Router)  |
| Styling  | Tailwind CSS             |
| Backend  | Supabase (PostgreSQL)    |
| Auth     | Supabase Auth            |
| Deploy   | Netlify                  |

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy your Project URL + anon key + service role key

### 2. Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
QUOTES_API_KEY=your-secret-key        # share this with the external site
ADMIN_EMAIL=admin@reichmansales.com
NEXT_PUBLIC_SITE_URL=https://reichman-quoting.netlify.app
```

### 3. Local Dev

```bash
npm install
npm run dev
```

### 4. Netlify Deploy

1. Connect this repo in Netlify
2. Add environment variables in Netlify dashboard
3. Deploy — it auto-detects Next.js

---

## External Site Integration API

The main Reichman Sales site sends cart data here when a customer checks out or creates an account.

### `POST /api/quotes/external`

**Request:**
```json
{
  "api_key": "your-secret-key",
  "customer": {
    "email": "farmer@example.com",
    "full_name": "John Doe",
    "phone": "555-123-4567",
    "company": "Doe Farms",
    "license_number": "IL-12345",
    "state": "IL",
    "city": "Springfield"
  },
  "cart_items": [
    {
      "product_name": "Roundup PowerMax",
      "pack_size": "2.5 gallon",
      "quantity": 4,
      "notes": "for corn acres"
    }
  ],
  "source": "external_site"
}
```

**Response:**
```json
{
  "success": true,
  "quote_id": "uuid",
  "quote_number": 1042
}
```

### `GET /api/quotes/{id}?api_key=your-key`

Returns quote status + items + customer-visible messages.

---

## User Roles

| Role       | Access                                      |
|------------|---------------------------------------------|
| `admin`    | All quotes, assign reps, manage everything  |
| `sales_rep`| Their assigned quotes only (My Quotes)      |
| `customer` | Their own quotes + messaging (read-only)    |

Set roles directly in Supabase: `profiles` table → `role` column.

## Quote Statuses

| Status    | Color  | Meaning                              |
|-----------|--------|--------------------------------------|
| `new`     | 🟠 Orange | Just came in, not yet addressed   |
| `open`    | 🔵 Blue  | Being worked on                     |
| `quoting` | 🟡 Yellow | Quote sent, awaiting response      |
| `agreed`  | 🟢 Green | Customer accepted                   |
| `closed`  | ⚫ Gray  | Completed or cancelled              |
