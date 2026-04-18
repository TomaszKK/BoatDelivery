const fs = require('fs');
const path = require('path');

// Konfiguracja ścieżek
const TARGET_DIR = path.join(__dirname, 'BoatDelivery');
const OUTPUT_FILE = path.join(__dirname, 'boatdelivery_all_code.txt');

// Filtry - czego NIE dołączać do zrzutu
const IGNORE_DIRS = new Set(['node_modules', 'vendor', 'dist', 'build', '.git', '.idea', '.vscode', 'public']);
const IGNORE_FILES = new Set(['package-lock.json', 'composer.lock', 'yarn.lock', 'pnpm-lock.yaml']);
const IGNORE_EXTENSIONS = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.webp',
    '.mp4', '.webm', '.pdf', '.zip', '.tar', '.gz',
    '.woff', '.woff2', '.ttf', '.eot'
]);

function isBinary(content) {
    // Prosta heurystyka sprawdzająca obecność znaków null (typowych dla binarek) w pierwszych bajtach
    for (let i = 0; i < Math.min(content.length, 512); i++) {
        if (content[i] === 0) return true;
    }
    return false;
}

function processDirectory(directory, writeStream) {
    let entries;
    try {
        entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch (err) {
        console.error(`Błąd odczytu katalogu ${directory}:`, err.message);
        return;
    }

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORE_DIRS.has(entry.name)) {
                processDirectory(fullPath, writeStream);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();

            if (IGNORE_FILES.has(entry.name) || IGNORE_EXTENSIONS.has(ext)) {
                continue;
            }

            try {
                const buffer = fs.readFileSync(fullPath);

                // Ochrona przed zrzutem niezidentyfikowanych plików binarnych
                if (isBinary(buffer)) {
                    continue;
                }

                const content = buffer.toString('utf-8');

                // Separator z wyraźną ścieżką relatywną
                const relativePath = path.relative(__dirname, fullPath);
                writeStream.write(`\n\n${'='.repeat(80)}\n`);
                writeStream.write(`FILE: ${relativePath}\n`);
                writeStream.write(`${'='.repeat(80)}\n\n`);
                writeStream.write(content);

            } catch (err) {
                console.error(`Błąd odczytu pliku ${fullPath}:`, err.message);
            }
        }
    }
}

function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        console.error(`Katalog źródłowy nie istnieje: ${TARGET_DIR}`);
        process.exit(1);
    }

    // Czyszczenie poprzedniego pliku wynikowego
    if (fs.existsSync(OUTPUT_FILE)) {
        fs.unlinkSync(OUTPUT_FILE);
    }

    const writeStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'a' });

    console.log('Rozpoczęto ekstrakcję kodu...');
    processDirectory(TARGET_DIR, writeStream);

    writeStream.end();

    writeStream.on('finish', () => {
        const stats = fs.statSync(OUTPUT_FILE);
        const fileSizeInMegabytes = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`Zakończono. Plik wyjściowy: ${OUTPUT_FILE} (${fileSizeInMegabytes} MB)`);
    });
}

main();