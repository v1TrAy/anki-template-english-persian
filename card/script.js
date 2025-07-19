  function runCardScripts() {
    // Convert English digits to Persian digits
    function toPersianNumber(num) {
      const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
      return String(num).split('').map(d => persianDigits[d] || d).join('');
    }

    // Generate different verb forms (conjugations)
    function getVerbForms(verb) {
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      const lastChar = verb.slice(-1);
      const secondLastChar = verb.slice(-2, -1);
      const isCVC = !vowels.includes(lastChar) && vowels.includes(secondLastChar) && verb.length <= 4;

      // Check for doubled consonant verbs like "rub" -> "rubbed"
      const doubled = isCVC ? verb + lastChar : verb;
      const baseWithoutE = verb.endsWith('e') ? verb.slice(0, -1) : verb;

      return [
        verb,
        `${verb}s`,
        `${doubled}ed`,
        `${baseWithoutE}ing`,
        `${doubled}ing`
      ];
    }

    const keywordEl = document.getElementById("keyword");
    if (!keywordEl) return;

    const rawKeyword = keywordEl.innerText.trim().toLowerCase();
    const parts = rawKeyword.split(/\s+/);

    if (parts.length === 1) {
      // Single word verbs (e.g., run, play)
      const verbForms = getVerbForms(parts[0]);
      const regex = new RegExp(`\\b(${verbForms.join('|')})\\b`, 'gi');

      document.querySelectorAll('.example').forEach(example => {
        example.innerHTML = example.innerHTML.replace(regex, match =>
          `<span class="english-word">${match}</span>`
        );
      });

    } else if (parts.length === 2) {
      // Two-word phrasal verbs (e.g., rub out)
      const verb = parts[0];
      const particle = parts[1];
      const verbForms = getVerbForms(verb).map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const escapedParticle = particle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      document.querySelectorAll('.example').forEach(example => {
        // Highlight verb forms separately
        example.innerHTML = example.innerHTML.replace(
          new RegExp(`\\b(${verbForms.join('|')})\\b`, 'gi'),
          match => `<span class="english-word">${match}</span>`
        );

        // Highlight particle separately
        example.innerHTML = example.innerHTML.replace(
          new RegExp(`\\b${escapedParticle}\\b`, 'gi'),
          match => `<span class="english-word">${match}</span>`
        );
      });

    } else if (parts.length === 3) {
      // Simple three-word phrases
      const regex = new RegExp(`\\b${parts[0]}(?:\\s+\\w+){0,2}\\s+${parts[1]}(?:\\s+\\w+){0,2}\\s+${parts[2]}\\b`, 'gi');

      document.querySelectorAll('.example').forEach(example => {
        example.innerHTML = example.innerHTML.replace(regex, match =>
          `<span class="english-word">${match}</span>`
        );
      });

    } else {
      // Fallback for longer or unknown phrases
      const escaped = rawKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

      document.querySelectorAll('.example').forEach(example => {
        example.innerHTML = example.innerHTML.replace(regex, match =>
          `<span class="english-word">${match}</span>`
        );
      });
    }

    // Persian numbering for translation list
    const persianContainer = document.getElementById("persian-list");
    if (persianContainer) {
      const rawText = persianContainer.innerText || persianContainer.textContent;
      const lines = rawText
        .replace(/\r/g, '')
        .split(/\n+/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (lines.length > 1) {
        persianContainer.innerHTML = lines.map((line, index) =>
          `<div class="persian-item">${toPersianNumber(index + 1)}) ${line}</div>`
        ).join('');
      }
    }
  }

  // Run script when Anki card is shown or after short delay for other environments
  if (typeof Anki !== "undefined" && Anki) {
    document.addEventListener("anki:shown", runCardScripts);
  } else {
    setTimeout(runCardScripts, 100);
  }
