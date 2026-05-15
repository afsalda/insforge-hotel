import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== 'node_modules' && f !== '.git') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir(process.cwd(), (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.txt' || ext === '.log') {
        try {
            const buffer = fs.readFileSync(filePath);
            if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
                console.log(`Converting ${filePath} from UTF-16LE to UTF-8...`);
                const content = buffer.toString('utf16le');
                fs.writeFileSync(filePath, content, 'utf8');
            }
        } catch (err) {
            console.error(`Error processing ${filePath}:`, err.message);
        }
    }
});
