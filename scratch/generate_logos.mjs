import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImg = 'c:/Users/M S I/Downloads/final hotel/next-client/public/images/albaith_logo.png';

const targetDirs = [
    'c:/Users/M S I/Downloads/final hotel/client/public',
    'c:/Users/M S I/Downloads/final hotel/next-client/public'
];

async function generate() {
    console.log('Starting logo and favicon generation from:', sourceImg);

    // 1. Generate main asset for SPA: client/src/assets/albaith_logo.png
    const spaAssetPath = 'c:/Users/M S I/Downloads/final hotel/client/src/assets/albaith_logo.png';
    fs.mkdirSync(path.dirname(spaAssetPath), { recursive: true });
    
    // We can optimize the main website logo (e.g. max width 500px, keeping transparency)
    await sharp(sourceImg)
        .resize({ width: 500, height: 500, fit: 'inside' })
        .png({ quality: 90 })
        .toFile(spaAssetPath);
    console.log('✅ Generated spa navbar asset:', spaAssetPath);

    // 2. Generate standard sizes for each target public directory
    for (const dir of targetDirs) {
        fs.mkdirSync(dir, { recursive: true });

        // apple-touch-icon.png (180x180)
        await sharp(sourceImg)
            .resize(180, 180)
            .png()
            .toFile(path.join(dir, 'apple-touch-icon.png'));
        console.log('✅ Generated apple-touch-icon.png in:', dir);

        // favicon-32x32.png (32x32)
        await sharp(sourceImg)
            .resize(32, 32)
            .png()
            .toFile(path.join(dir, 'favicon-32x32.png'));
        console.log('✅ Generated favicon-32x32.png in:', dir);

        // favicon-16x16.png (16x16)
        await sharp(sourceImg)
            .resize(16, 16)
            .png()
            .toFile(path.join(dir, 'favicon-16x16.png'));
        console.log('✅ Generated favicon-16x16.png in:', dir);

        // favicon.ico (32x32 png, standard fallback name)
        await sharp(sourceImg)
            .resize(32, 32)
            .png()
            .toFile(path.join(dir, 'favicon.ico'));
        console.log('✅ Generated favicon.ico in:', dir);

        // android-chrome-192x192.png (192x192)
        await sharp(sourceImg)
            .resize(192, 192)
            .png()
            .toFile(path.join(dir, 'android-chrome-192x192.png'));
        console.log('✅ Generated android-chrome-192x192.png in:', dir);

        // android-chrome-512x512.png (512x512)
        await sharp(sourceImg)
            .resize(512, 512)
            .png()
            .toFile(path.join(dir, 'android-chrome-512x512.png'));
        console.log('✅ Generated android-chrome-512x512.png in:', dir);

        // favicon.png (512x512)
        await sharp(sourceImg)
            .resize(512, 512)
            .png()
            .toFile(path.join(dir, 'favicon.png'));
        console.log('✅ Generated favicon.png in:', dir);

        // logo.png (high resolution optimized)
        await sharp(sourceImg)
            .resize({ width: 800 })
            .png({ quality: 90 })
            .toFile(path.join(dir, 'logo.png'));
        console.log('✅ Generated logo.png in:', dir);

        // albaith-logo.png
        await sharp(sourceImg)
            .resize({ width: 500 })
            .png({ quality: 90 })
            .toFile(path.join(dir, 'albaith-logo.png'));
        console.log('✅ Generated albaith-logo.png in:', dir);
    }

    console.log('🎉 Generation completed successfully!');
}

generate().catch(err => {
    console.error('❌ Error generating logos:', err);
});
