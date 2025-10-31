Super-U Monorepo (server, client, staff)

Structure
- /server: API Express + TypeScript + MongoDB (Mongoose), architecture MVC
- /client: Application client (Vite + React TS), base importée de DarkPerfect2/Super-U
- /staff: Dashboard staff (Vite + React TS), base issue de Alvine-Mays/super-u-dashboard

Ports
- server: 5000
- client: 3000
- staff: 3001

Démarrage
1) Créez un fichier .env dans /server à partir de /server/.env.example puis:
   - MONGO_URI=...
   - JWT_SECRET=...
   - CORS_ORIGINS=http://localhost:3000,http://localhost:3001

2) Démarrer chaque app indépendamment:
   - cd server && npm install && npm run dev
   - cd client && npm install && npm run dev
   - cd staff && npm install && npm run dev

Back-end (API)
- Authentification: POST /api/auth/login; JWT (Authorization: Bearer <token>)
- Produits: CRUD /api/products
- Catégories: CRUD /api/categories
- Stock: /api/stock/in, /api/stock/out, /api/stock/adjust, /api/stock/movements
- Réponses JSON: { success, data, error }

Seed
- cd server && npm run seed
  - admin: admin@example.com / admin123
  - 2 catégories et 2 produits sont créés

Environnements
- /server/.env.example
- /client/.env.example (VITE_API_URL=http://localhost:5000)
- /staff/.env.example (VITE_API_URL=http://localhost:5000)

Notes
- Toute dépendance Drizzle/Neon/Postgres a été retirée.
- Chaque app possède son package.json et fonctionne de façon indépendante.
