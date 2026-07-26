const jimp = require('jimp');

async function processImage() {
    try {
        const img = await jimp.read('D:\\Rotations\\image_1448-02-12_00-27-12.jpg');
        const width = img.bitmap.width;
        const height = img.bitmap.height;

        const targetR = 240, targetG = 240, targetB = 240; 
        
        const isWhite = (idx) => {
            return img.bitmap.data[idx] > targetR &&
                   img.bitmap.data[idx+1] > targetG &&
                   img.bitmap.data[idx+2] > targetB;
        };

        const visited = new Set();
        const queue = [];

        const corners = [
            {x: 0, y: 0},
            {x: width - 1, y: 0},
            {x: 0, y: height - 1},
            {x: width - 1, y: height - 1}
        ];

        for (const c of corners) {
            queue.push(c);
        }

        while(queue.length > 0) {
            const {x, y} = queue.shift();
            
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const idx = (y * width + x) * 4;
            
            if (isWhite(idx)) {
                img.bitmap.data[idx + 3] = 0; // Transparent
                
                queue.push({x: x+1, y: y});
                queue.push({x: x-1, y: y});
                queue.push({x: x, y: y+1});
                queue.push({x: x, y: y-1});
            }
        }

        await img.writeAsync('D:\\Rotations\\logo_final.png');
        console.log("Processed image and saved to logo_final.png");
    } catch (e) {
        console.error(e);
    }
}
processImage();
