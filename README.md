# Strmr

### This is a T3 Stack project bootstrapped with create-t3-app

## Features

- Utilizes Next.js with Supabase for authentication
- Styled with TailwindCSS
- Prisma as ORM
- Uses Supabase for backend and storage services
- Shadcn UI components for UI elements
- Vidstack for the Video Player
-

# Installation

To install and set up the project, follow these steps:

Clone the repository:

```bash
git clone https://github.com/Abdulkareemoj/Strmr.git
cd Strmr
```

Install dependencies

```bash
npm install
```

## Set up with Supabase

- Create a new project on [Supabase](https://supabase.io/)
- The project already has a `.env.example` file. Rename it to `.env.local` and fill in the required details from your Supabase project.
- To make it easier if youre deploying on vercel, you can use the supabase vercel integration to automatically set up the environment variables for you.
- However to get the supabase url and key, you can find them in the settings of your supabase project.
- The other values are also on the dashboard but will take a little bit of searching to find them.
- When you find the rest of the environment variables run the following commands to set up the database schema and seed the database with some data:

```bash
npx prisma generate ##To generate the prisma client
npx prisma db push ##To push the schema to the database

```

# License

This project is licensed under the MIT License.
