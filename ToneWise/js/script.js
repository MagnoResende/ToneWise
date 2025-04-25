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
  const translationOutput = document.getElementById('translationOutput'); // Get the translation output element

  // English to Portuguese common word translations
  const englishToPortuguese = {
    // Common words
    'hello': 'olá',
    'goodbye': 'adeus',
    'thank you': 'obrigado',
    'please': 'por favor',
    'yes': 'sim',
    'no': 'não',
    'sorry': 'desculpe',
    'excuse me': 'com licença',
    'good morning': 'bom dia',
    'good afternoon': 'boa tarde',
    'good evening': 'boa noite',
    'good night': 'boa noite',
    'how are you': 'como está',
    'fine': 'bem',
    'happy': 'feliz',
    'sad': 'triste',
    'angry': 'zangado',
    'tired': 'cansado',
    'hungry': 'com fome',
    'thirsty': 'com sede',
    'hot': 'quente',
    'cold': 'frio',
    'big': 'grande',
    'small': 'pequeno',
    'fast': 'rápido',
    'slow': 'lento',
    'easy': 'fácil',
    'difficult': 'difícil',
    'good': 'bom',
    'bad': 'mau',
    'new': 'novo',
    'old': 'velho',
    'beautiful': 'bonito',
    'ugly': 'feio',
    'expensive': 'caro',
    'cheap': 'barato',
    'open': 'aberto',
    'closed': 'fechado',
    'full': 'cheio',
    'empty': 'vazio',
    'clean': 'limpo',
    'dirty': 'sujo',
    'right': 'direito',
    'left': 'esquerdo',
    'up': 'para cima',
    'down': 'para baixo',
    'in': 'dentro',
    'out': 'fora',
    'here': 'aqui',
    'there': 'ali',
    'today': 'hoje',
    'tomorrow': 'amanhã',
    'yesterday': 'ontem',
    'now': 'agora',
    'later': 'mais tarde',
    'always': 'sempre',
    'never': 'nunca',
    'sometimes': 'às vezes',
    'often': 'frequentemente',
    'rarely': 'raramente',
    'water': 'água',
    'food': 'comida',
    'house': 'casa',
    'car': 'carro',
    'book': 'livro',
    'pen': 'caneta',
    'paper': 'papel',
    'money': 'dinheiro',
    'time': 'tempo',
    'day': 'dia',
    'night': 'noite',
    'week': 'semana',
    'month': 'mês',
    'year': 'ano',
    'family': 'família',
    'friend': 'amigo',
    'work': 'trabalho',
    'school': 'escola',
    'home': 'casa',
    'office': 'escritório',
    'store': 'loja',
    'restaurant': 'restaurante',
    'hospital': 'hospital',
    'doctor': 'médico',
    'teacher': 'professor',
    'student': 'estudante',
    'child': 'criança',
    'man': 'homem',
    'woman': 'mulher',
    'boy': 'menino',
    'girl': 'menina',
    'love': 'amor',
    'hate': 'ódio',
    'life': 'vida',
    'death': 'morte',
    'health': 'saúde',
    'sickness': 'doença',
    'pain': 'dor',
    'pleasure': 'prazer',
    'happiness': 'felicidade',
    'sadness': 'tristeza',
    'anger': 'raiva',
    'fear': 'medo',
    'hope': 'esperança',
    'dream': 'sonho',
    'reality': 'realidade',
    'truth': 'verdade',
    'lie': 'mentira',
    'problem': 'problema',
    'solution': 'solução',
    'question': 'pergunta',
    'answer': 'resposta',
    'beginning': 'começo',
    'end': 'fim',
    'success': 'sucesso',
    'failure': 'fracasso',
    'help': 'ajuda',
    'information': 'informação',
    'illusory': 'ilusório',
    'illusive': 'ilusivo'
  };

  // Function to translate English to Portuguese
  function translateToPortuguese(word) {
    const lowerWord = word.toLowerCase();
    
    // Check if we have a direct translation
    if (englishToPortuguese[lowerWord]) {
      return englishToPortuguese[lowerWord];
    }
    
    // If no direct translation, try to use a translation API
    // For this implementation, we'll use a fallback message
    return `Tradução não disponível para "${word}"`;
  }

  const processWord = () => {
    const word = wordInput.value.trim();
    console.log('Input word:', word);

    if (!word) {
      alert('Please enter a word.');
      return;
    }

    const upperWord = word.toUpperCase();

    // Get Portuguese translation
    const translation = translateToPortuguese(word);
    translationOutput.textContent = translation;

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

  // Handle Speech Recognition Button Click
  const speechRecognitionBtn = document.getElementById('speechRecognitionBtn');
  if (speechRecognitionBtn) {
    speechRecognitionBtn.onclick = () => {
      startSpeechRecognition();
    };
  } else {
    console.error('Speech recognition button not found in the DOM.');
  }

  // Function to start speech recognition
  function startSpeechRecognition() {
    // Check if the browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please try Chrome or Edge.');
      return;
    }

    // Create a speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure the recognition
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Add visual feedback when listening
    speechRecognitionBtn.querySelector('.mic-icon').classList.add('listening');

    // Start listening
    recognition.start();

    // Handle the results
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      wordInput.value = transcript.trim();
      processWord(); // Process the recognized word
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('Speech recognition error: ' + event.error);
      speechRecognitionBtn.querySelector('.mic-icon').classList.remove('listening');
    };

    // Clean up when done
    recognition.onend = () => {
      speechRecognitionBtn.querySelector('.mic-icon').classList.remove('listening');
    };
  }

  // Updated function to highlight stress prioritizing primary stress over double letters
  function highlightStressWithDoubleLetters(word, phonemes) {
    const lowerCaseWord = word.toLowerCase();
    const phonemeArray = phonemes.split(' ');

    // Find the index of the primary stress phoneme
    let stressIndex = phonemeArray.findIndex(phon => phon.includes('1'));
    
    // If no primary stress found, check for secondary stress
    if (stressIndex === -1) {
      stressIndex = phonemeArray.findIndex(phon => phon.includes('2'));
    }
    
    // Special override for the word "information"
    if (lowerCaseWord === 'information') {
      stressIndex = 6; // Adjust index for the word "information"
    }
    
    // List of words that should use double letter rule instead of primary stress
    // Add more words to this list as needed
    const doubleLetterPriorityWords = ['illusory'];
    
    // Only apply double letter rule if the word is in the priority list or no stress was found
    if (doubleLetterPriorityWords.includes(lowerCaseWord) || stressIndex === -1) {
      // Detect consecutive identical letters in the word
      const doubleLetterIndex = lowerCaseWord.split('').findIndex((char, idx) => {
        return idx > 0 && lowerCaseWord[idx] === lowerCaseWord[idx - 1]; // Check for two identical letters
      });
      
      // Apply double letter rule if found
      if (doubleLetterIndex !== -1) {
        stressIndex = Math.min(doubleLetterIndex + 1, lowerCaseWord.length - 1); // Move highlight to the next syllable
      }
    }
    
    // If still no stress index found, return word as-is
    if (stressIndex === -1) return lowerCaseWord;
    
    // Map phoneme index to character index in the word
    // This is a simplified mapping and might need adjustment for complex words
    const charIndex = Math.min(stressIndex, lowerCaseWord.length - 1);
    
    // Check if charIndex is valid for the word length
    if (charIndex >= lowerCaseWord.length) return lowerCaseWord;

    // Highlight the stressed letter
    return (
      lowerCaseWord.substring(0, charIndex) +
      '[' + lowerCaseWord.charAt(charIndex).toUpperCase() + ']' +
      lowerCaseWord.substring(charIndex + 1)
    );
  }

  // Function to pronounce the word using Web Speech API
  function playPronunciation(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // Set language for pronunciation
    window.speechSynthesis.speak(utterance);
  }
});
