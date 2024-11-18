# Utiliser une image Node officielle
FROM node:16

# Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json, puis installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port de l'application (par exemple 4000)
EXPOSE 4000

# Commande pour lancer le serveur
CMD ["npm", "start"]
