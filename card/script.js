function runCardScripts() {
  // Convert English digits to Persian
  function toPersianNumber(num) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return String(num).split('').map(d => persianDigits[d] || d).join('');
  }

  const keywordEl = document.getElementById("keyword");
  if (!keywordEl) return;

  const keyword = keywordEl.innerText.trim().toLowerCase();

  // Escape special characters for RegExp
  const base = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Remove trailing "e" to catch common derivatives like -ing, -ed
  const baseWithoutE = base.endsWith('e') ? base.slice(0, -1) : base;

  // Create regex for keyword and common derivatives
  const regex = new RegExp(`\\b(${base}|${baseWithoutE}((s|es|ed|ing|ies)?))\\b`, 'gi');

  // Highlight keyword and its derivatives in all example elements
  document.querySelectorAll('.example').forEach(example => {
    example.innerHTML = example.innerHTML.replace(regex, `<span class="english-word">$1</span>`);
  });

  // Format Persian definitions into numbered list (if multiline)
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

// Run the script either via Anki event or fallback after short delay
if (typeof Anki !== "undefined" && Anki) {
  document.addEventListener("anki:shown", runCardScripts);
} else {
  setTimeout(runCardScripts, 100);
}
