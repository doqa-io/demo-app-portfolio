# Application de Démonstration pour Portfolio de Freelance en Qualité Logicielle

## Description

Ce projet est une application de démonstration développée pour illustrer des compétences en qualité logicielle et en automatisation de tests. L'application permet aux utilisateurs de s'enregistrer, de télécharger des images (scans de dessins d'enfants), de gérer ces images, et de les partager entre utilisateurs inscrits.

Ce projet inclut :
- Une interface front-end développée en React.
- Un serveur back-end basé sur Node.js et Express.
- Une base de données pour stocker les informations utilisateur et les images partagées.
- Des tests automatisés couvrant les tests unitaires, d'API, et end-to-end.
- Une infrastructure CI/CD avec IONOS Deploy Now pour le déploiement continu.

## Fonctionnalités

- Inscription et authentification utilisateur.
- Téléchargement, suppression, et gestion d'images.
- Partage d'images entre utilisateurs.
- Interface utilisateur responsive.
- Sécurité avec JWT pour l'authentification.

## Prérequis

- **Node.js** v14 ou supérieur
- **Docker** pour la conteneurisation et le déploiement local
- **GitHub Account** pour le CI/CD avec GitHub Actions
- **IONOS Deploy Now** pour le déploiement automatisé

## Installation

1. **Cloner le repository** :

   ```bash
   git clone https://github.com/your-username/demo-app-portfolio.git
   cd demo-app-portfolio
   ```
2. **Installer les dépendances** :

   - Pour le back-end :
     ```bash
     cd server
     npm install
     ```

   - Pour le front-end :
     ```bash
     cd ../client
     npm install
     ```

3. **Configurer les variables d'environnement** :

   Créer un fichier `.env` dans le dossier `server` avec les variables suivantes :
   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_url
   ```
4. **Démarrer l'application en local** :

   - Pour le back-end :
     ```bash
     cd server
     npm start
     ```

   - Pour le front-end :
     ```bash
     cd ../client
     npm start
     ```
## Déploiement
    Ce projet utilise GitHub Actions pour le déploiement CI/CD. À chaque push sur la branche main, les tests sont exécutés et l'application est déployée via IONOS Deploy Now.

## Tests

    Ce projet inclut une couverture de tests automatisés pour garantir la stabilité et la qualité du code :
    - Tests unitaires avec Jest pour les fonctions critiques.
    - Tests d'intégration avec Supertest pour les API back-end.
    - Tests end-to-end avec Cypress pour simuler les interactions utilisateur.
    
    Pour lancer les tests :
    ```# Tests unitaires et d'intégration dans le back-end
        cd server
        npm test

       # Tests end-to-end dans le front-end
        cd ../client
        npm run cypress:open
    ```

## CI/CD

Ce projet utilise GitHub Actions pour le CI/CD. Les workflows sont définis dans le dossier `.github/workflows`. Vous pouvez les personnaliser pour votre propre déploiement.

## Déploiement

Ce projet est configuré pour le déploiement continu avec IONOS Deploy Now. Vous pouvez suivre les instructions de [IONOS Deploy Now](https://deploy-now.ionos.com/) pour déployer votre propre application.

## Contributeurs

- [John Doe]