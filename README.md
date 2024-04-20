# AvG: Sprint 2 - Team 2

## Getting Started

First, install the packages.
```bash
npm i
```

Then, initialize SQLite.
```bash
npx prisma generate && npx prisma db push
```

Then, start the docker image in .extras\compose\activemq\compose.yml with
```bash
docker compose up
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
