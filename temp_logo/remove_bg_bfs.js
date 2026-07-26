const jimp = require('jimp');

async function processImage() {
    try {
        const img = await jimp.read('D:\\Rotations\\image_1448-02-12_00-27-12.jpg');
        const width = img.bitmap.width;
        const height = img.bitmap.height;

        console.log(`Image size: ${width}x${height}`);
        
        // Relaxed threshold for JPG artifacts in the white background
        const targetR = 180, targetG = 180, targetB = 180; 
        
        const isWhite = (idx) => {
            return img.bitmap.data[idx] > targetR &&
                   img.bitmap.data[idx+1] > targetG &&
                   img.bitmap.data[idx+2] > targetB;
        };

        const visited = new Set();
        const queue = [];

        // Start BFS from ALL pixels along the 4 outer edges of the image
        for (let x = 0; x < width; x++) {
            queue.push({x: x, y: 0});
            queue.push({x: x, y: height - 1});
        }
        for (let y = 0; y < height; y++) {
            queue.push({x: 0, y: y});
            queue.push({x: width - 1, y: y});
        }

        let replaced = 0;

        while(queue.length > 0) {
            const {x, y} = queue.shift();
            
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const idx = (y * width + x) * 4;
            
            if (isWhite(idx)) {
                img.bitmap.data[idx + 3] = 0; // Make transparent
                replaced++;
                
                // Add neighbors
                queue.push({x: x+1, y: y});
                queue.push({x: x-1, y: y});
                queue.push({x: x, y: y+1});
                queue.push({x: x, y: y-1});
            }
        }
        
        console.log(`Flood-fill complete. Replaced ${replaced} pixels from the outside.`);
        
        img.autocrop();
        
        await img.writeAsync('D:\\Rotations\\logo_v4.png');
        console.log("Auto-cropped and saved to logo_v4.png");
    } catch (e) {
        console.error(e);
    }
}
processImage();
