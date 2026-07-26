const jimp = require('jimp');

async function processImage() {
    try {
        const img = await jimp.read('D:\\Rotations\\image_1448-02-12_00-27-12.jpg');
        const width = img.bitmap.width;
        const height = img.bitmap.height;

        console.log(`Image size: ${width}x${height}`);
        
        let whitePixelsReplaced = 0;
        
        // Let's just make ALL pixels that are very light (background) transparent.
        // The logo itself is dark blue/green/silver.
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = img.bitmap.data[idx];
                const g = img.bitmap.data[idx+1];
                const b = img.bitmap.data[idx+2];
                
                // If the pixel is close to white (accounting for JPG artifacts)
                if (r > 230 && g > 230 && b > 230) {
                    img.bitmap.data[idx + 3] = 0; // Transparent
                    whitePixelsReplaced++;
                }
            }
        }
        
        // Let's auto-crop it to remove the transparent borders!
        img.autocrop();

        await img.writeAsync('D:\\Rotations\\logo_final2.png');
        console.log(`Processed image, replaced ${whitePixelsReplaced} white pixels, and autocropped.`);
    } catch (e) {
        console.error(e);
    }
}
processImage();
