# Utiliser une image Node officielle
FROM node:16

# Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json, puis installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application React pour la production
RUN npm run build

# Exposer le port (par exemple 3000)
EXPOSE 3000

# Commande pour servir l'application (par exemple avec serve)
CMD ["npx", "serve", "-s", "build"]
