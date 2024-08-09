# Utiliser une image de base Node.js officielle
FROM node:18

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances spécifiées dans package.json
RUN npm install

# Copier le reste de l'application dans le conteneur
COPY . .

# Définir la commande à exécuter pour démarrer l'application
CMD ["node", "index.js"]

# Exposer le port que votre application utilise (optionnel)
EXPOSE 3000