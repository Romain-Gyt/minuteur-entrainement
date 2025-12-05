# Guide de Déploiement - MyTimer

Votre application est composée de deux parties :
1.  **Frontend** : Vue.js (Vite)
2.  **Backend** : Node.js (Express) + SQLite

Comme vous avez un backend et une base de données, vous ne pouvez pas utiliser un hébergement statique simple (comme GitHub Pages) pour tout le projet.

Voici la méthode la plus simple pour mettre en production : **Render** ou **Railway**.

## Option Recommandée : Render (Gratuit/Pas cher)

Render permet d'héberger le frontend et le backend ensemble ou séparément très facilement.

### Préparation
Assurez-vous que votre projet est sur GitHub.

### Étapes
1.  Créez un compte sur [render.com](https://render.com).
2.  Cliquez sur **"New +"** et choisissez **"Web Service"**.
3.  Connectez votre dépôt GitHub.
4.  Configurez le service :
    *   **Name** : `mytimer`
    *   **Environment** : `Node`
    *   **Build Command** : `npm install && npm run build`
    *   **Start Command** : `npm run server`
5.  Ajoutez les variables d'environnement (Environment Variables) :
    *   `NODE_ENV` = `production`
    *   `JWT_SECRET` = (générez une clé secrète longue et aléatoire)
6.  Cliquez sur **"Create Web Service"**.

Render va détecter que c'est une app Node, installer les dépendances, construire le frontend (via le script `build` dans `package.json` qui fait `vite build`), et lancer le serveur.

**Note importante pour la base de données SQLite** :
Sur Render (offre gratuite), le disque est éphémère. Si le serveur redémarre, vous perdrez les données (comptes utilisateurs, entraînements).
*   **Solution Pro** : Utiliser une vraie base de données (PostgreSQL) gérée par Render (ils ont une offre gratuite). Il faudrait adapter légèrement le code (remplacer `better-sqlite3` par `pg`).
*   **Solution Simple (Persistance)** : Utiliser un "Disk" payant sur Render pour garder le fichier SQLite, ou passer sur **Railway** qui gère mieux les volumes persistants.

## Option Alternative : Railway (Plus simple pour SQLite)

Railway gère très bien les volumes pour SQLite.

1.  Créez un compte sur [railway.app](https://railway.app).
2.  "New Project" > "Deploy from GitHub repo".
3.  Ajoutez une variable : `NIXPACKS_PLAN_TEAPOT` (optionnel, Railway détecte souvent tout seul).
4.  **Pour garder la base de données (Persistance)** :
    *   Allez dans l'onglet **"Volumes"** de votre service Railway.
    *   Cliquez sur **"Add Volume"**.
    *   Montez le volume sur le chemin : `/app/data` (par exemple).
    *   Allez dans l'onglet **"Variables"**.
    *   Ajoutez la variable `DB_PATH` avec la valeur `/app/data/database.sqlite`.
    *   Railway va redémarrer votre app. La base de données sera maintenant stockée dans le volume persistant et ne sera pas perdue lors des redémarrages.

## Vérification Locale avant déploiement

Pour tester que tout marche en mode "production" sur votre machine :

1.  Construire l'app :
    ```bash
    npm run build
    ```
2.  Lancer le serveur (qui doit servir les fichiers statiques du dossier `dist`) :
    *   Assurez-vous que `server/index.js` sert bien le dossier `dist` quand il ne trouve pas de route API.
    *   Lancez : `npm run server`
    *   Ouvrez `http://localhost:3000` (ou le port défini).

## Commandes Utiles

*   **Build** : `npm run build` (Crée le dossier `dist` optimisé)
*   **Preview** : `npm run preview` (Teste le build localement)
