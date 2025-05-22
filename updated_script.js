document.addEventListener("DOMContentLoaded", () => {
  let cmuDict = null;

  // Load the CMUDict JSON file from an external source
  // Using a CDN-hosted version of the dictionary to avoid GitHub Pages file size limitations
  fetch("https://cdn.jsdelivr.net/gh/MagnoResende/ToneWise@main/cmudict.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      cmuDict = data; // Store the JSON data in a variable
      console.log("CMUDict loaded successfully. Example entry:", cmuDict["DEMOCRACY"]);
    })
    .catch(error => {
      console.error("Error loading CMUDict:", error);
      document.getElementById("output").textContent = "Error: Unable to load pronunciation dictionary.";
    });

  // Handle Translate Button Click
  const submitButton = document.getElementById("submitBtn");
  const wordInput = document.getElementById("wordInput"); // Get the input field
  const translationOutput = document.getElementById("translationOutput"); // Get the translation output element

  // English to Portuguese common word translations
  const englishToPortuguese = {
    // Common words (dictionary from previous version)
    "hello": "olá", "goodbye": "adeus", "thank you": "obrigado", "please": "por favor", "yes": "sim", "no": "não", "sorry": "desculpe", "excuse me": "com licença", "good morning": "bom dia", "good afternoon": "boa tarde", "good evening": "boa noite", "good night": "boa noite", "how are you": "como está", "fine": "bem", "happy": "feliz", "sad": "triste", "angry": "zangado", "tired": "cansado", "hungry": "com fome", "thirsty": "com sede", "hot": "quente", "cold": "frio", "big": "grande", "small": "pequeno", "fast": "rápido", "slow": "lento", "easy": "fácil", "difficult": "difícil", "good": "bom", "bad": "mau", "new": "novo", "old": "velho", "beautiful": "bonito", "ugly": "feio", "expensive": "caro", "cheap": "barato", "open": "aberto", "closed": "fechado", "full": "cheio", "empty": "vazio", "clean": "limpo", "dirty": "sujo", "right": "direito", "left": "esquerdo", "up": "para cima", "down": "para baixo", "in": "dentro", "out": "fora", "here": "aqui", "there": "ali", "today": "hoje", "tomorrow": "amanhã", "yesterday": "ontem", "now": "agora", "later": "mais tarde", "always": "sempre", "never": "nunca", "sometimes": "às vezes", "often": "frequentemente", "rarely": "raramente", "water": "água", "food": "comida", "house": "casa", "car": "carro", "book": "livro", "pen": "caneta", "paper": "papel", "money": "dinheiro", "time": "tempo", "day": "dia", "night": "noite", "week": "semana", "month": "mês", "year": "ano", "family": "família", "friend": "amigo", "work": "trabalho", "school": "escola", "home": "casa", "office": "escritório", "store": "loja", "restaurant": "restaurante", "hospital": "hospital", "doctor": "médico", "teacher": "professor", "student": "estudante", "child": "criança", "man": "homem", "woman": "mulher", "boy": "menino", "girl": "menina", "love": "amor", "hate": "ódio", "life": "vida", "death": "morte", "health": "saúde", "sickness": "doença", "pain": "dor", "pleasure": "prazer", "happiness": "felicidade", "sadness": "tristeza", "anger": "raiva", "fear": "medo", "hope": "esperança", "dream": "sonho", "reality": "realidade", "truth": "verdade", "lie": "mentira", "problem": "problema", "solution": "solução", "question": "pergunta", "answer": "resposta", "beginning": "começo", "end": "fim", "success": "sucesso", "failure": "fracasso", "help": "ajuda", "information": "informação", "illusory": "ilusório", "illusive": "ilusivo", "democracy": "democracia"
  };

  // Function to translate English to Portuguese
  function translateToPortuguese(word) {
    const lowerWord = word.toLowerCase();
    if (englishToPortuguese[lowerWord]) {
      return englishToPortuguese[lowerWord];
    }
    return `Tradução não disponível para "${word}"`;
  }

  const processWord = () => {
    let word = wordInput.value.trim();
    console.log("Input word (raw):", word);

    // Remove trailing period if present (fix for speech recognition bug)
    if (word.endsWith(".")) {
      word = word.slice(0, -1);
      console.log("Input word (period removed):", word);
      wordInput.value = word; // Update input field to show the corrected word
    }

    if (!word) {
      alert("Please enter a word.");
      return;
    }

    const upperWord = word.toUpperCase();

    const translation = translateToPortuguese(word);
    translationOutput.textContent = translation;

    if (cmuDict && cmuDict[upperWord]) {
      const phonemes = cmuDict[upperWord];
      console.log("Phonemes for", upperWord, ":", phonemes);
      const result = highlightStressWithDoubleLetters(word, phonemes);
      document.getElementById("output").textContent = result;
    } else {
      console.log(`Word "${upperWord}" not found in CMUDict.`);
      document.getElementById("output").textContent = `Sorry, Word "${upperWord}" not found in ToneWise. Try another word.`;
    }
  };

  if (submitButton) {
    submitButton.onclick = processWord;
  } else {
    console.error("Submit button not found in the DOM.");
  }

  if (wordInput) {
    wordInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        processWord();
      }
    });
  } else {
    console.error("Word input field not found in the DOM.");
  }

  const pronounceIcon = document.getElementById("pronounceIcon");
  if (pronounceIcon) {
    pronounceIcon.onclick = () => {
      const word = wordInput.value.trim();
      if (!word) {
        alert("Please enter a word.");
        return;
      }
      playPronunciation(word);
    };
  } else {
    console.error("Pronounce icon not found in the DOM.");
  }

  const speechRecognitionBtn = document.getElementById("speechRecognitionBtn");
  if (speechRecognitionBtn) {
    speechRecognitionBtn.onclick = () => {
      startSpeechRecognition();
    };
  } else {
    console.error("Speech recognition button not found in the DOM.");
  }

  function startSpeechRecognition() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    const micIcon = speechRecognitionBtn.querySelector(".mic-icon");
    if(micIcon) micIcon.classList.add("listening");
    recognition.start();
    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      // No need to remove period here, processWord will handle it.
      wordInput.value = transcript.trim();
      processWord();
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error: " + event.error);
      if(micIcon) micIcon.classList.remove("listening");
    };
    recognition.onend = () => {
      if(micIcon) micIcon.classList.remove("listening");
    };
  }

  function highlightStressWithDoubleLetters(word, phonemes) {
    const lowerCaseWord = word.toLowerCase();
    const phonemeArray = phonemes.split(" ");
    let stressIndex = phonemeArray.findIndex(phon => phon.includes("1"));
    if (stressIndex === -1) {
      stressIndex = phonemeArray.findIndex(phon => phon.includes("2"));
    }
    if (lowerCaseWord === "information") {
      stressIndex = 6;
    }
    const doubleLetterPriorityWords = ["illusory"];
    if (doubleLetterPriorityWords.includes(lowerCaseWord) || stressIndex === -1) {
      const doubleLetterIndex = lowerCaseWord.split("").findIndex((char, idx) => {
        return idx > 0 && lowerCaseWord[idx] === lowerCaseWord[idx - 1];
      });
      if (doubleLetterIndex !== -1) {
        stressIndex = Math.min(doubleLetterIndex + 1, lowerCaseWord.length - 1);
      }
    }
    if (stressIndex === -1) return lowerCaseWord;
    const charIndex = Math.min(stressIndex, lowerCaseWord.length - 1);
    if (charIndex >= lowerCaseWord.length) return lowerCaseWord;
    return (
      lowerCaseWord.substring(0, charIndex) +
      "[" + lowerCaseWord.charAt(charIndex).toUpperCase() + "]" +
      lowerCaseWord.substring(charIndex + 1)
    );
  }

  function playPronunciation(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }
});
