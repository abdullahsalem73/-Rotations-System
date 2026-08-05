const Jimp = require('jimp');

async function processIcon() {
    try {
        console.log('Reading logo_v4.png...');
        const image = await Jimp.read('logo_v4.png');
        
        console.log('Cropping uneven whitespace...');
        image.autocrop(0.05, false); // auto-crop with 5% tolerance

        console.log('Creating a perfect 512x512 white background...');
        const background = new Jimp(512, 512, '#FFFFFF');

        console.log('Resizing logo to fit safely inside the circle...');
        image.scaleToFit(380, 380); // Leave enough padding for "maskable"

        const x = Math.floor((512 - image.bitmap.width) / 2);
        const y = Math.floor((512 - image.bitmap.height) / 2);

        console.log('Centering logo on background...');
        background.composite(image, x, y);

        console.log('Saving as logo_maskable.png...');
        await background.writeAsync('logo_maskable.png');
        
        console.log('SUCCESS: Professional centered icon created!');
    } catch (err) {
        console.error('ERROR:', err);
    }
}

processIcon();
