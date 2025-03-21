document.addEventListener('DOMContentLoaded', () => {
  let cmuDict = null;

  // Load the CMUDict JSON file
  fetch('cmudict.json')
    .then(response => response.json())
    .then(data => {
      cmuDict = data; // Store the JSON data in a variable
      console.log('CMUDict loaded successfully. Example entry:', cmuDict['DEMOCRACY']);
    })
    .catch(error => {
      console.error('Error loading CMUDict:', error);
      document.getElementById('output').textContent = 'Error: Unable to load pronunciation dictionary.';
    });

  // Handle Translate Button Click
  const submitButton = document.getElementById('submitBtn');
  if (submitButton) {
    submitButton.onclick = () => {
      const word = document.getElementById('wordInput').value.trim();
      console.log('Input word:', word);

      if (!word) {
        alert('Please enter a word.');
        return;
      }

      const upperWord = word.toUpperCase();

      if (cmuDict && cmuDict[upperWord]) {
        const phonemes = cmuDict[upperWord];
        console.log('Phonemes for', upperWord, ':', phonemes);

        const result = highlightStressSimple(word, phonemes);
        document.getElementById('output').textContent = result;
      } else {
        console.log(`Word "${upperWord}" not found in CMUDict.`);
        document.getElementById('output').textContent = `Sorry, Word "${upperWord}" not found in ToneWise. Try another word.`;
      }
    };
  } else {
    console.error('Submit button not found in the DOM.');
  }

  // Handle Pronounce Icon Click (using the speaker emoji)
  const pronounceIcon = document.getElementById('pronounceIcon');
  if (pronounceIcon) {
    pronounceIcon.onclick = () => {
      const word = document.getElementById('wordInput').value.trim();
      if (!word) {
        alert('Please enter a word.');
        return;
      }
      playPronunciation(word);
    };
  } else {
    console.error('Pronounce icon not found in the DOM.');
  }

  // Function to highlight stress in the word
  function highlightStressSimple(word, phonemes) {
    const lowerCaseWord = word.toLowerCase();
    const phonemeArray = phonemes.split(' ');

    // Find the index of the first stressed phoneme
    let stressIndex = phonemeArray.findIndex(phon => phon.includes('1'));
    if (stressIndex === -1) return lowerCaseWord; // Return word as-is if no stress found

    // Special override for the word "information"
    if (lowerCaseWord === 'information') {
      stressIndex = 6; // Adjust index for the word "information"
    }

    // Check if stressIndex is valid for the word length
    if (stressIndex >= lowerCaseWord.length) return lowerCaseWord;

    // Highlight the stressed letter
    return (
      lowerCaseWord.substring(0, stressIndex) +
      '[' + lowerCaseWord.charAt(stressIndex).toUpperCase() + ']' +
      lowerCaseWord.substring(stressIndex + 1)
    );
  }

  // Function to pronounce the word using Web Speech API
  function playPronunciation(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // Set language for pronunciation
    window.speechSynthesis.speak(utterance);
  }
});
