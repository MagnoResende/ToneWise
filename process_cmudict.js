const fs = require('fs'); // Node.js file system module

console.log('Starting to process CMUDict file...');

// Read the cmudict file
fs.readFile('cmudict-0.7b', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    console.log('CMUDict file loaded successfully.');

    const cmuDict = {};
    const lines = data.split('\n');
    
    lines.forEach(line => {
        if (!line.startsWith(';;;') && line.trim() !== '') { // Skip comments and blank lines
            const [word, phonemes] = line.split('  '); // Split word and phonemes
            if (word && phonemes) {
                cmuDict[word] = phonemes;
            }
        }
    });

    console.log('Processing complete. Saving to cmudict.json...');

    // Save as JSON
    fs.writeFile('cmudict.json', JSON.stringify(cmuDict, null, 2), err => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('CMUDict processed and saved as cmudict.json');
        }
    });
});
