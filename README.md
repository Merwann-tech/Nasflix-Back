# Nasflix-Back

# Mon Projet

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 ou supérieur)

### Installation rapide

1. **Cloner le projet**
   ```bash
   git clone <ton-repo>
   cd <ton-projet>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```
   
   Le script d'installation va automatiquement : 
   - Créer le fichier `.env` si nécessaire
   - Vérifier que PostgreSQL est installé et démarré
   - Créer la base de données
   - Appliquer les migrations Prisma

3. **Démarrer l'application**
   ```bash
   npm run dev
   ```

### Configuration manuelle (si besoin)

Si l'installation automatique échoue : 

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Démarrer PostgreSQL (selon ton OS)
# macOS: 
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# 3. Créer la base de données manuellement
createdb mydatabase

# 4. Lancer le script de setup
npm run setup
```

## 📝 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer l'application en mode développement |
| `npm run setup` | Configuration initiale de la base de données |
| `npm run db:studio` | Ouvrir Prisma Studio (interface graphique) |
| `npm run db:migrate` | Créer une nouvelle migration |
| `npm run db:reset` | Réinitialiser la base de données |
| `npm run db:push` | Pousser le schéma sans créer de migration |

## 🗄️ Base de données

La base de données PostgreSQL est configurée localement.  

**Paramètres par défaut :**
- Hôte : `localhost`
- Port : `5432`
- Utilisateur : `postgres`
- Mot de passe : `postgres`
- Base de données : `mydatabase`

Tu peux modifier ces paramètres dans le fichier `.env`.

## 🔧 Résolution de problèmes

### PostgreSQL n'est pas démarré

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Démarrer le service depuis le gestionnaire de services
```

### La base de données n'existe pas

```bash
createdb mydatabase
# ou
npm run setup
```

### Erreur de connexion

Vérifie que ton fichier `.env` contient la bonne `DATABASE_URL`.

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
```