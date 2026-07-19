(function initializePdfExport(global) {
  "use strict";

  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const PAGE_MARGIN = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
  const PAGE_BOTTOM = 48;

  const winAnsiCharacters = new Map([
    ["€", 0x80], ["‚", 0x82], ["ƒ", 0x83], ["„", 0x84], ["…", 0x85],
    ["†", 0x86], ["‡", 0x87], ["ˆ", 0x88], ["‰", 0x89], ["Š", 0x8a],
    ["‹", 0x8b], ["Œ", 0x8c], ["Ž", 0x8e], ["‘", 0x91], ["’", 0x92],
    ["“", 0x93], ["”", 0x94], ["•", 0x95], ["–", 0x96], ["—", 0x97],
    ["˜", 0x98], ["™", 0x99], ["š", 0x9a], ["›", 0x9b], ["œ", 0x9c],
    ["ž", 0x9e], ["Ÿ", 0x9f]
  ]);

  function toWinAnsi(value) {
    let result = "";
    for (const character of String(value ?? "").normalize("NFC")) {
      const code = character.charCodeAt(0);
      if (character === "\n") result += " ";
      else if (character === "\t" || character === "\r") result += " ";
      else if (code >= 32 && code <= 255) result += character;
      else if (winAnsiCharacters.has(character)) result += String.fromCharCode(winAnsiCharacters.get(character));
      else result += "";
    }
    return result.replace(/\s+/g, " ").trim();
  }

  function escapePdfString(value) {
    return toWinAnsi(value).replace(/([\\()])/g, "\\$1");
  }

  function wrapText(value, maxWidth, fontSize) {
    const text = toWinAnsi(value);
    if (!text) return [];
    const maxCharacters = Math.max(12, Math.floor(maxWidth / (fontSize * 0.52)));
    const words = text.split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const chunks = [];
      for (let index = 0; index < word.length; index += maxCharacters) {
        chunks.push(word.slice(index, index + maxCharacters));
      }
      chunks.forEach((chunk) => {
        const candidate = line ? `${line} ${chunk}` : chunk;
        if (candidate.length <= maxCharacters) {
          line = candidate;
        } else {
          if (line) lines.push(line);
          line = chunk;
        }
      });
    });
    if (line) lines.push(line);
    return lines;
  }

  function formatAmount(value, unit) {
    let rounded;
    if (unit === "Stk.") rounded = Math.round(value * 2) / 2;
    else if (unit === "TL" || unit === "EL") rounded = Math.round(value * 2) / 2;
    else if (unit === "Prise") rounded = Math.max(1, Math.round(value));
    else if (value >= 50) rounded = Math.round(value / 5) * 5;
    else if (value >= 10) rounded = Math.round(value);
    else rounded = Math.round(value * 2) / 2;
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(rounded);
  }

  function formatDecimal(value, digits = 2) {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(Number(value) || 0);
  }

  function courseLabel(course) {
    if (course === "starter") return "Vorspeise";
    if (course === "dessert") return "Dessert";
    return "Hauptspeise";
  }

  function dietLabel(diet) {
    if (diet === "vegan") return "Vegan";
    if (diet === "vegetarian") return "Vegetarisch";
    return "Mit Fleisch oder Fisch";
  }

  function buildPages(meal, servingCount) {
    const pages = [[]];
    let pageIndex = 0;
    let cursorY = PAGE_HEIGHT - 55;

    function newPage() {
      pages.push([]);
      pageIndex += 1;
      cursorY = PAGE_HEIGHT - 55;
    }

    function ensureSpace(height) {
      if (cursorY - height < PAGE_BOTTOM) newPage();
    }

    function addText(value, options = {}) {
      const {
        font = "regular",
        size = 10,
        leading = size * 1.38,
        before = 0,
        after = 0,
        x = PAGE_MARGIN,
        width = CONTENT_WIDTH,
        color = "0.15 0.20 0.18"
      } = options;
      cursorY -= before;
      const lines = wrapText(value, width, size);
      lines.forEach((line) => {
        ensureSpace(leading);
        pages[pageIndex].push({ text: line, font, size, x, y: cursorY, color });
        cursorY -= leading;
      });
      cursorY -= after;
    }

    function addRule() {
      ensureSpace(18);
      pages[pageIndex].push({ rule: true, x: PAGE_MARGIN, y: cursorY - 4, width: CONTENT_WIDTH });
      cursorY -= 18;
    }

    const { recipe, macros } = meal;
    const portions = Math.max(1, Number(servingCount) || 1);
    const cuisine = recipe.cuisine || "Alltagsküche";
    const meta = `${courseLabel(recipe.course)} · ${cuisine} · ${dietLabel(recipe.diet)} · ${recipe.time} Min. · ${recipe.level}`;
    const macroLine = `${Math.round(macros.kcal)} kcal · ${Math.round(macros.protein)} g Protein · ${Math.round(macros.carbs)} g Kohlenhydrate · ${Math.round(macros.fat)} g Fett pro Portion`;

    addText("KÜCHENENERGIE", { font: "bold", size: 9, leading: 12, color: "0.91 0.37 0.06", after: 8 });
    addText(recipe.title, { font: "bold", size: 22, leading: 27, color: "0.06 0.06 0.06", after: 8 });
    addText(meta, { font: "bold", size: 9, leading: 12, color: "0.30 0.37 0.33", after: 5 });
    addText(macroLine, { size: 9, leading: 12, color: "0.30 0.37 0.33", after: 12 });
    addText(recipe.description, { size: 10.5, leading: 15, after: 5 });
    if (meal.energy) {
      const { primary, alternative, priceCents } = meal.energy;
      addText("KOCHENERGIE · MODELLSCHÄTZUNG", {
        font: "bold", size: 8.5, leading: 12, color: "0.00 0.48 0.70", before: 8, after: 3
      });
      addText(
        `${primary.label}: ca. ${formatDecimal(primary.kwh)} kWh ${primary.energyKind} · ca. ${formatDecimal(primary.cost)} EUR für ${meal.energy.servings} ${meal.energy.servings === 1 ? "Portion" : "Portionen"} · Energiepreis ${formatDecimal(priceCents, 1)} ct/kWh`,
        { size: 9, leading: 13, after: 3 }
      );
      addText(
        `Sparoption ${alternative.label}: ca. ${formatDecimal(alternative.kwh)} kWh · ca. ${formatDecimal(alternative.cost)} EUR · rund ${alternative.savingsPercent} % weniger.`,
        { size: 9, leading: 13, after: 3 }
      );
      addText(`Energiespartipp: ${meal.energy.tip}`, { size: 8.5, leading: 12, color: "0.35 0.39 0.40", after: 5 });
    }
    addRule();

    addText(`Zutaten für ${portions} ${portions === 1 ? "Portion" : "Portionen"}`, {
      font: "bold", size: 14, leading: 19, color: "0.06 0.06 0.06", after: 6
    });
    meal.ingredients.forEach((ingredient) => {
      const amount = formatAmount(ingredient.amount * portions, ingredient.unit);
      const extra = ingredient.adjustmentLabel ? ` (${ingredient.adjustmentLabel})` : "";
      addText(`• ${amount} ${ingredient.unit} ${ingredient.name}${extra}`, { size: 10, leading: 14, x: PAGE_MARGIN + 3, width: CONTENT_WIDTH - 3 });
    });

    addText("Zubereitung", {
      font: "bold", size: 14, leading: 19, color: "0.06 0.06 0.06", before: 16, after: 7
    });
    (meal.steps || recipe.steps).forEach((step, index) => {
      addText(`${index + 1}. ${step}`, { size: 10, leading: 14.5, after: 6 });
    });

    const adjustmentNotes = [];
    if (meal.boosterAmount) adjustmentNotes.push(`${meal.booster.name} gleicht das Proteinziel aus`);
    if (meal.energyBoosterAmount) adjustmentNotes.push(`${meal.energyBooster.name} bringt die Portion in die Kalorienspanne`);
    const coachTip = adjustmentNotes.length ? `${recipe.tip} ${adjustmentNotes.join("; ")}.` : recipe.tip;
    addText("Energie-Tipp", {
      font: "bold", size: 12, leading: 16, color: "0.06 0.06 0.06", before: 11, after: 4
    });
    addText(coachTip, { size: 10, leading: 14.5, after: 14 });
    addText("Nährwerte und Energieverbrauch sind Näherungswerte und können je nach Produkt, Gerät und Zubereitung abweichen.", {
      size: 8, leading: 11, color: "0.42 0.45 0.43"
    });

    return pages;
  }

  function pageContent(lines, pageNumber, pageCount) {
    const commands = [];
    lines.forEach((line) => {
      if (line.rule) {
        commands.push(`0.83 0.82 0.77 RG 0.7 w ${line.x} ${line.y} m ${line.x + line.width} ${line.y} l S`);
        return;
      }
      const fontName = line.font === "bold" ? "F2" : "F1";
      commands.push(
        `BT /${fontName} ${line.size} Tf ${line.color} rg 1 0 0 1 ${line.x} ${line.y} Tm (${escapePdfString(line.text)}) Tj ET`
      );
    });
    commands.push(`BT /F1 8 Tf 0.45 0.47 0.46 rg 1 0 0 1 48 25 Tm (Küchenenergie) Tj ET`);
    commands.push(`BT /F1 8 Tf 0.45 0.47 0.46 rg 1 0 0 1 515 25 Tm (${pageNumber}/${pageCount}) Tj ET`);
    return commands.join("\n");
  }

  function binaryStringToBytes(binary) {
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index) & 0xff;
    return bytes;
  }

  function buildRecipePdf(meal, servingCount = 1) {
    if (!meal?.recipe || !meal?.ingredients || !meal?.macros) {
      throw new Error("Für den PDF-Export fehlt ein vollständiges Rezept.");
    }

    const pages = buildPages(meal, servingCount);
    const objects = [];
    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

    const pageReferences = [];
    pages.forEach((lines, index) => {
      const pageObject = 5 + index * 2;
      const contentObject = pageObject + 1;
      const content = pageContent(lines, index + 1, pages.length);
      pageReferences.push(`${pageObject} 0 R`);
      objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`;
      objects[contentObject] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    });
    objects[2] = `<< /Type /Pages /Kids [${pageReferences.join(" ")}] /Count ${pages.length} >>`;

    let binary = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets = [0];
    for (let objectNumber = 1; objectNumber < objects.length; objectNumber += 1) {
      offsets[objectNumber] = binary.length;
      binary += `${objectNumber} 0 obj\n${objects[objectNumber]}\nendobj\n`;
    }
    const xrefOffset = binary.length;
    binary += `xref\n0 ${objects.length}\n`;
    binary += "0000000000 65535 f \n";
    for (let objectNumber = 1; objectNumber < objects.length; objectNumber += 1) {
      binary += `${String(offsets[objectNumber]).padStart(10, "0")} 00000 n \n`;
    }
    binary += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return binaryStringToBytes(binary);
  }

  function makeFileName(title) {
    const slug = String(title || "Rezept")
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "rezept";
    return `kuechenenergie-${slug}.pdf`;
  }

  global.KuechenenergiePdf = { buildRecipePdf, makeFileName };
}(window));
