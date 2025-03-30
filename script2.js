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
  const wordInput = document.getElementById('wordInput'); // Get the input field

  const processWord = () => {
    const word = wordInput.value.trim();
    console.log('Input word:', word);

    if (!word) {
      alert('Please enter a word.');
      return;
    }

    const upperWord = word.toUpperCase();

    if (cmuDict && cmuDict[upperWord]) {
      const phonemes = cmuDict[upperWord];
      console.log('Phonemes for', upperWord, ':', phonemes);

      const result = highlightStressWithDoubleLetters(word, phonemes); // Use the updated logic
      document.getElementById('output').textContent = result;
    } else {
      console.log(`Word "${upperWord}" not found in CMUDict.`);
      document.getElementById('output').textContent = `Sorry, Word "${upperWord}" not found in ToneWise. Try another word.`;
    }
  };

  if (submitButton) {
    submitButton.onclick = processWord;
  } else {
    console.error('Submit button not found in the DOM.');
  }

  // Add Enter Key Functionality
  if (wordInput) {
    wordInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        processWord(); // Process the word when Enter is pressed
      }
    });
  } else {
    console.error('Word input field not found in the DOM.');
  }

  // Handle Pronounce Icon Click (using the speaker emoji)
  const pronounceIcon = document.getElementById('pronounceIcon');
  if (pronounceIcon) {
    pronounceIcon.onclick = () => {
      const word = wordInput.value.trim();
      if (!word) {
        alert('Please enter a word.');
        return;
      }
      playPronunciation(word);
    };
  } else {
    console.error('Pronounce icon not found in the DOM.');
  }

  // Updated function to highlight stress considering double letters
  function highlightStressWithDoubleLetters(word, phonemes) {
    const lowerCaseWord = word.toLowerCase();
    const phonemeArray = phonemes.split(' ');

    // Find the index of the primary stress phoneme
    let stressIndex = phonemeArray.findIndex(phon => phon.includes('1'));
    if (stressIndex === -1) return lowerCaseWord; // Return word as-is if no primary stress found

    // Special override for the word "information"
    if (lowerCaseWord === 'information') {
      stressIndex = 6; // Adjust index for the word "information"
    }

    // Detect consecutive identical letters in the word
    const doubleLetterIndex = lowerCaseWord.split('').findIndex((char, idx) => {
      return idx > 0 && lowerCaseWord[idx] === lowerCaseWord[idx - 1]; // Check for two identical letters
    });

    // Adjust the highlight position if double letters are found
    if (doubleLetterIndex !== -1) {
      stressIndex = Math.min(doubleLetterIndex + 1, lowerCaseWord.length - 1); // Move highlight to the next syllable
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