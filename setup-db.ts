import { execSync } from 'child_process';
import { existsSync, copyFileSync, writeFileSync, readFileSync, readdirSync } from 'fs';

interface CommandOptions {
    stdio?: 'inherit' | 'ignore' | 'pipe';
    [key: string]: any;
}

function runCommand(command: string, options:  CommandOptions = {}): boolean {
    try {
        execSync(command, { stdio: 'inherit', ...options });
        return true;
    } catch (error) {
        return false;
    }
}

function checkCommand(command: string): boolean {
    try {
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

console.log('🚀 Configuration de la base de données...\n');

// 1. Vérifier si .env existe, sinon le créer depuis .env.example
if (!existsSync('.env')) {
    if (existsSync('.env.example')) {
        console.log('📝 Création du fichier .env depuis .env.example...');
        copyFileSync('.env.example', '.env');
        console.log('✅ Fichier .env créé\n');
    } else {
        console.log('📝 Création du fichier .env...');
        const defaultEnv = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nasflix"\n';
        writeFileSync('.env', defaultEnv);
        console.log('✅ Fichier .env créé avec les valeurs par défaut\n');
    }
} else {
    console.log('✅ Fichier .env existe déjà\n');
}

// 2. Vérifier si PostgreSQL est installé
console.log('🔍 Vérification de PostgreSQL...');
const hasPostgres:  boolean = checkCommand('psql --version');

if (!hasPostgres) {
    console.error('❌ PostgreSQL n\'est pas installé !\n');
    console.log('📦 Instructions d\'installation : ');
    console.log('  • macOS    : brew install postgresql@18');
    console.log('  • Windows  : https://www.postgresql.org/download/windows/');
    console.log('  • Ubuntu   : sudo apt install postgresql postgresql-contrib');
    console.log('  • Arch     : sudo pacman -S postgresql\n');
    console.log('💡 Ou utilisez Docker :  docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:18\n');
    process.exit(1);
}

console.log('✅ PostgreSQL est installé\n');

// 3. Vérifier si le serveur PostgreSQL est en cours d'exécution
console.log('🔍 Vérification du serveur PostgreSQL...');
const isRunning: boolean = checkCommand('pg_isready');

if (!isRunning) {
    console.log('⚠️  Le serveur PostgreSQL ne semble pas démarré');
    console.log('🚀 Tentative de démarrage...\n');
    
    // Essayer de démarrer selon l'OS
    const platform:  NodeJS.Platform = process.platform;
    
    if (platform === 'darwin') {
        // macOS
        runCommand('brew services start postgresql@18', { stdio: 'ignore' }) ||
        runCommand('brew services start postgresql', { stdio: 'ignore' });
    } else if (platform === 'linux') {
        // Linux
        runCommand('sudo systemctl start postgresql', { stdio: 'ignore' }) ||
        runCommand('sudo service postgresql start', { stdio: 'ignore' });
    } else if (platform === 'win32') {
        // Windows
        runCommand('net start postgresql-x64-18', { stdio: 'ignore' });
    }
    
    // Attendre un peu
    console.log('⏳ Attente du démarrage (3 secondes)...');
    try {
        execSync('sleep 3 || timeout 3', { stdio: 'ignore' });
    } catch {
        // Ignorer l'erreur si la commande n'existe pas
    }
    
    // Vérifier à nouveau
    if (! checkCommand('pg_isready')) {
        console.error('❌ Impossible de démarrer PostgreSQL automatiquement');
        console.log('🔧 Démarrez-le manuellement :');
        console.log('  • macOS    : brew services start postgresql');
        console.log('  • Linux    : sudo systemctl start postgresql');
        console.log('  • Windows  :  Démarrez le service depuis Services\n');
        process.exit(1);
    }
}

console.log('✅ Le serveur PostgreSQL est en cours d\'exécution\n');

// 4. Créer la base de données si elle n'existe pas
console.log('🗄️  Vérification/Création de la base de données...');

// Lire la DATABASE_URL pour extraire le nom de la DB
const envContent:  string = readFileSync('.env', 'utf-8');
const dbUrlMatch:  RegExpMatchArray | null = envContent.match(
    /DATABASE_URL="?postgresql:\/\/([^: ]+):([^@]+)@([^:]+):(\d+)\/([^"\s? ]+)/
);

let dbName = 'nasflix';
let dbUser = 'postgres';

if (dbUrlMatch) {
    dbUser = dbUrlMatch[1];
    dbName = dbUrlMatch[5];
}

console.log(`📊 Base de données :  ${dbName}`);
console.log(`👤 Utilisateur : ${dbUser}\n`);

// Essayer de créer la base de données
const createDbCommand:  string = process.platform === 'win32' 
    ? `psql -U ${dbUser} -c "CREATE DATABASE ${dbName};" 2>nul || echo Base existante`
    : `createdb -U ${dbUser} ${dbName} 2>/dev/null || psql -U ${dbUser} -c "CREATE DATABASE ${dbName};" 2>/dev/null || echo "Base de données existante"`;

runCommand(createDbCommand, { stdio: 'ignore' });
console.log('✅ Base de données prête\n');

// 5. Vérifier si Prisma est installé
console.log('🔍 Vérification de Prisma...');
if (!existsSync('node_modules/prisma') && !existsSync('node_modules/.bin/prisma')) {
    console.log('⚠️  Prisma n\'est pas installé');
    console.log('📦 Installation de Prisma...\n');
    runCommand('npm install prisma @prisma/client');
}
console.log('✅ Prisma est installé\n');

// 6. Vérifier si le schema existe
if (!existsSync('prisma/schema.prisma')) {
    console.log('📝 Initialisation de Prisma...');
    runCommand('npx prisma init');
    console.log('✅ Schema Prisma créé\n');
    console.log('⚠️  N\'oublie pas de configurer ton schema.prisma avant de continuer !\n');
} else {
    console.log('✅ Schema Prisma existe\n');
}

// 7. Appliquer les migrations
console.log('🔄 Application des migrations Prisma...');
const hasMigrations: boolean = existsSync('prisma/migrations') && 
                                            readdirSync('prisma/migrations').length > 0;

if (hasMigrations) {
    console.log('📦 Migrations détectées, application...\n');
    if (runCommand('npx prisma migrate deploy')) {
        console.log('✅ Migrations appliquées avec succès\n');
    }
} else {
    console.log('📝 Aucune migration trouvée, création de la première migration...\n');
    if (runCommand('npx prisma migrate dev --name init')) {
        console.log('✅ Première migration créée et appliquée\n');
    }
}

// 8. Générer le client Prisma
console.log('⚙️  Génération du client Prisma...');
if (runCommand('npx prisma generate')) {
    console.log('✅ Client Prisma généré\n');
}

console.log('🎉 Configuration terminée ! Ta base de données est prête à l\'emploi !\n');
console.log('💡 Commandes utiles :');
console.log('   npm run db:studio  - Ouvrir Prisma Studio');
console.log('   npm run db:migrate - Créer une nouvelle migration');
console.log('   npm run db:reset   - Réinitialiser la base de données\n');