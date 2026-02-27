# Student Management System

Une application complète de gestion des étudiants construite avec **Next.js**, **NextAuth.js** et une base de données **JSON**.

## Fonctionnalités

✅ **Authentification sécurisée** avec NextAuth.js
- Inscription et connexion des utilisateurs
- Sessions JWT sécurisées
- Pages protégées par authentification

✅ **Gestion complète des étudiants (CRUD)**
- Créer de nouveaux étudiants
- Lire/afficher les informations des étudiants
- Modifier les données des étudiants
- Supprimer les étudiants

✅ **Design moderne**
- Interface utilisateur responsive avec Tailwind CSS
- Navigation intuitive
- Tableau de bord principal

✅ **Base de données**
- Stockage JSON persistant (JSON-based database)
- Données séparatistes par utilisateur
- Aucune configuration externe requise

## Technologies utilisées

- **Frontend**: React 19 + TypeScript
- **Backend**: Next.js 15 (API Routes)
- **Authentification**: NextAuth.js v4
- **Base de données**: JSON (fichier data.json)
- **Styles**: Tailwind CSS
- **Runtime**: Node.js

## Installation

### Prérequis
- Node.js (v25.4.0 ou supérieur)
- Git (v2.53.0 ou supérieur)
- npm

### Étapes

1. **Cloner le dépôt**
```bash
git clone https://github.com/ibekkali-wq/SM.git
cd sm
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

5. **Accéder à l'application**
```
http://localhost:3000
```

## Credentials par défaut

**Email**: admin@example.com
**Password**: admin123

## Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Compiler l'application pour la production
npm start        # Démarrer le serveur de production
npm run lint     # Vérifier le code avec ESLint
```

## Structure du projet

```
sm/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes (endpoints)
│   │   │   ├── auth/               # Authentification
│   │   │   └── students/           # Gestion des étudiants
│   │   ├── auth/                   # Pages d'authentification
│   │   ├── dashboard/              # Page principale
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Page d'accueil
│   │   └── globals.css             # Styles globaux
│   ├── components/                 # Composants React
│   └── lib/                        # Utilitaires (ex: gestion de BD)
├── db/                             # Dossier de la base de données
├── public/                         # Fichiers statiques
├── .env.local                      # Variables d'environnement
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vercel.json                     # Configuration Vercel
```

## Fonctionnement

### Architecture

L'application utilise une architecture **Next.js API Routes** avec:

1. **Frontend**: Pages React compilées côté serveur (SSR/SSG)
2. **API**: Endpoints REST pour la gestion des données
3. **Base de données**: Fichier JSON stocké localement (dans le dossier `db/`)
4. **Authentification**: Utilise NextAuth.js avec JWT

### Flux d'authentification

1. L'utilisateur crée un compte via `/auth/register`
2. Les données sont envoyées à l'API `/api/auth/register`
3. L'utilisateur se connecte via `/auth/login`
4. NextAuth génère un JWT et crée une session
5. Les routes protégées comme `/dashboard` nécessitent une authentification

### Gestion des étudiants

1. **GET /api/students**: Récupérer les étudiants de l'utilisateur
2. **POST /api/students**: Créer un nouvel étudiant
3. **PUT /api/students/[id]**: Modifier un étudiant
4. **DELETE /api/students/[id]**: Supprimer un étudiant

Toutes les opérations sont isolées par utilisateur grâce à la vérification de session.

## Déploiement

### Sur Vercel

1. **Connecter le dépôt GitHub**
   - Aller sur https://vercel.com
   - Importer le projet depuis GitHub

2. **Configurer les variables d'environnement**
   - `NEXTAUTH_URL`: URL de production
   - `NEXTAUTH_SECRET`: Clé secrète pour JWT

3. **Déployer automatiquement**
   - Chaque push sur `main` déclenche un déploiement

4. **Accéder à l'application**
   - L'application sera disponible sur `https://votre-app.vercel.app`

## Note importante pour Vercel

La base de données JSON est stockée dans le système de fichiers. Sur Vercel (environnement serverless), les changements de fichiers ne sont pas persistants entre les déploiements. 

**Solution recommandée pour la production**:
- Migrer vers une base de données cloud (PostgreSQL, MongoDB, etc.)
- Utiliser une solution de stockage persistant (Firebase, etc.)

Pour l'environnement de développement local, l'application fonctionne parfaitement avec les fichiers JSON.

## Dépannage

### Erreur: "NEXTAUTH_SECRET n'est pas défini"
Assurez-vous que `.env.local` existe et contient `NEXTAUTH_SECRET`.

### Erreur: "Student not found"
Vérifiez que vous êtes connecté et que l'ID de l'étudiant est correct.

### Port 3000 déjà utilisé
Utilisez un port différent:
```bash
npm run dev -- -p 3001
```

## API Documentation

### Endpoints disponibles

#### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/[...nextauth]` - Gestion d'authentification

#### Étudiants
- `GET /api/students` - Lister les étudiants
- `POST /api/students` - Créer un étudiant
- `GET /api/students/:id` - Récupérer un étudiant
- `PUT /api/students/:id` - Modifier un étudiant
- `DELETE /api/students/:id` - Supprimer un étudiant

### Exemple de requête

```javascript
// Créer un étudiant
const response = await fetch('/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33612345678',
    student_number: 'STU001',
    date_of_birth: '2000-01-01',
    address: '123 Rue de Paris'
  })
});
```

## Contributions

Les contributions sont bienvenues! Veuillez:
1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter les changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Auteur

**Imane Bekkali**
- Email: i.bekkali@esisa.ac.ma
- GitHub: [@ibekkali-wq](https://github.com/ibekkali-wq)

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

---

**Statut du projet**: ✅ Entièrement fonctionnel et testé
**Date de création**: 27 février 2026
**Dernière mise à jour**: 27 février 2026
