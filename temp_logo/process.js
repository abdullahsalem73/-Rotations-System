const jimp = require('jimp');

async function processImage() {
    try {
        const img = await jimp.read('D:\\Rotations\\petromasila-logo-transparent.png');
        
        // Remove white background and make it transparent
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            // If pixel is very close to white, make it transparent
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            } else {
                // optional: anti-aliasing simple attempt: if it's kinda gray near the edge, maybe increase transparency
                // but let's just do a hard threshold first, or a soft one:
                // if it's light gray, make it semi-transparent
                if (r > 200 && g > 200 && b > 200) {
                   const avg = (r + g + b) / 3;
                   // 200 -> alpha 255 (fully opaque)
                   // 255 -> alpha 0
                   const alpha = Math.max(0, 255 - ((avg - 200) * (255/55)));
                   this.bitmap.data[idx + 3] = Math.min(this.bitmap.data[idx+3], alpha);
                }
            }
        });

        // Resize the image using Bicubic interpolation for higher quality
        const newWidth = img.bitmap.width * 3;
        const newHeight = img.bitmap.height * 3;
        img.resize(newWidth, newHeight, jimp.RESIZE_BICUBIC);

        await img.writeAsync('D:\\Rotations\\logo.png');
        console.log("Processed image and saved as D:\\Rotations\\logo.png");
    } catch (err) {
        console.error(err);
    }
}

processImage();
