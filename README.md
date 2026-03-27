This is a Next.js 16 project for the Reichman quoting and account signup flow.

## Getting Started

Install dependencies, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment

Create a local env file from `.env.example` and provide your Supabase values.

Drizzle looks for one of these variables when running migration commands:

- `DATABASE_URL`
- `SUPABASE_DB_URL`
- `SUPABASE_DATABASE_URL`

## Database Structure

The database foundation now lives under `db/`:

```text
db/
  migrations/
  schema/
    account-signups.ts
    index.ts
drizzle.config.ts
```

The first schema models the current signup flow so we can wire the React Hook Form page into Supabase next.

## Drizzle Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Next Steps

- Connect the signup submit handler to a server action or route handler.
- Hash the password before writing to `account_signups.password_hash`.
- Add the actual Supabase connection layer for app-side reads and writes.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
