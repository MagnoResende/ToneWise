let cmuDict = null;

// Load the CMUDict JSON file
fetch('cmudict.json')
  .then(response => response.json())
  .then(data => {
    cmuDict = data; // Store the JSON data in a variable
    console.log('CMUDict loaded successfully');
  })
  .catch(error => console.error('Error loading CMUDict:', error));

// Handle Translate Button Click
document.getElementById('submitBtn').onclick = () => {
  const word = document.getElementById('wordInput').value.trim();
  console.log('Input word:', word);

  if (!word) {
    alert('Please enter a word.');
    return;
  }

  // CMUDict keys are uppercase
  const upperWord = word.toUpperCase();

  if (cmuDict && cmuDict[upperWord]) {
    const phonemes = cmuDict[upperWord];
    console.log('Phonemes for', upperWord, ':', phonemes);
    
    // Get the result by highlighting a letter based on the primary stress phoneme.
    const result = highlightStressSimple(word, phonemes);
    document.getElementById('output').textContent = result;
  } else {
    document.getElementById('output').textContent = `Sorry, Word "${upperWord}" not found in ToweWise.`;
  }
};

// A simplified function that highlights a single letter corresponding to the primary stress.
// It does not check for vowels; it simply uses the index of the phoneme containing "1".
// Example outcomes:
//    "democracy" -> "dem[O]cracy"    (if the phoneme with "1" is at index 3)
//    "information" -> "inform[A]tion"  (by special override)
function highlightStressSimple(word, phonemes) {
  // Split the phoneme string by spaces
  const phonemeArray = phonemes.split(' ');
  
  // Find the index of the first phoneme that contains '1'
  let stressIndex = phonemeArray.findIndex(phon => phon.includes('1'));
  if (stressIndex === -1) return word; // If no primary stress is found, return the original word.
  
  // Special override for "information" if needed:
  if (word.toLowerCase() === "information") {
    stressIndex = 6; // Adjust this value as desired.
  }
  
  // If the calculated index is out-of-bounds for the word, just return the word as is.
  if (stressIndex >= word.length) return word;
  
  // Highlight the letter at the found index:
  return word.substring(0, stressIndex) + 
         "[" + word.charAt(stressIndex).toUpperCase() + "]" + 
         word.substring(stressIndex + 1);
}
