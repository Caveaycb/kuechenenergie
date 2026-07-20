(function initializeShoppingList(global) {
  "use strict";

  const categories = [
    { id: "produce", label: "Obst & Gemüse", pattern: /apfel|aprikos|aubergine|banane|beere|bete|birne|brokkoli|blumenkohl|champignon|erbs|fenchel|gurke|himbeer|ingwer|kirsche|knoblauch|kohl|kraut|kuerbis|kürbis|limette|mais|mango|moehre|möhre|orange|paprika(?!pulver)|pflaum|pilz|salat|spinat|suesskartoffel|süßkartoffel|tomat|zitrone|zucchini|zwiebel|kartoffel|obst/ },
    { id: "protein", label: "Protein & Kühlregal", pattern: /bohne|ei\b|eier|feta|fisch|fleisch|frischkaese|frischkäse|garnele|hack|haehnchen|hähnchen|halloumi|joghurt|kaese|käse|lachs|linse|milch|mozzarella|parmesan|proteinpulver|pute|quark|rind|schmand|seelachs|skyr|tofu|thunfisch|butter/ },
    { id: "carbs", label: "Beilagen & Backen", pattern: /brot|brötchen|couscous|flocken|gnocchi|grieß|hafer|mehl|nudel|pasta|reis|semmel|spaetzle|spätzle|toast|tortilla|wrap/ },
    { id: "pantry", label: "Vorrat prüfen", pattern: /bruehe|brühe|curry|essig|gewuerz|gewürz|honig|kraeuter|kräuter|mandel|nuss|nuesse|oel|öl|paprikapulver|petersilie|salz|senf|sesam|sojasauce|vanille|zimt|zucker|kakao|saft/ }
  ];

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("de-DE")
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/\s+/g, " ").trim();
  }

  function formatAmount(value, unit) {
    let rounded;
    if (["Stk.", "TL", "EL"].includes(unit)) rounded = Math.round(value * 2) / 2;
    else if (unit === "Prise") rounded = Math.max(1, Math.round(value));
    else if (value >= 50) rounded = Math.round(value / 5) * 5;
    else if (value >= 10) rounded = Math.round(value);
    else rounded = Math.round(value * 2) / 2;
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(rounded);
  }

  function categoryFor(name) {
    const normalized = normalize(name);
    return categories.find((category) => category.pattern.test(normalized))?.id || "other";
  }

  function aggregate(meals, multiplier = 1) {
    const items = new Map();
    (meals || []).forEach((meal) => {
      (meal?.ingredients || []).forEach((ingredient) => {
        const amount = Number(ingredient.amount);
        if (!ingredient?.name || !ingredient?.unit || !Number.isFinite(amount)) return;
        const key = `${normalize(ingredient.name)}|${normalize(ingredient.unit)}`;
        const existing = items.get(key);
        if (existing) existing.amount += amount * multiplier;
        else items.set(key, {
          name: ingredient.name,
          unit: ingredient.unit,
          amount: amount * multiplier,
          category: categoryFor(ingredient.name)
        });
      });
    });
    const definitions = [...categories, { id: "other", label: "Sonstiges" }];
    return definitions.map((definition) => ({
      ...definition,
      items: [...items.values()]
        .filter((item) => item.category === definition.id)
        .sort((first, second) => first.name.localeCompare(second.name, "de"))
    })).filter((group) => group.items.length);
  }

  function text(groups, title = "Einkaufsliste") {
    return [title, ...groups.flatMap((group) => [
      "",
      group.label.toUpperCase(),
      ...group.items.map((item) => `☐ ${formatAmount(item.amount, item.unit)} ${item.unit} ${item.name}`)
    ])].join("\n");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    })[character]);
  }

  function markup(groups, prefix = "shopping-item") {
    let itemIndex = 0;
    return groups.map((group) => `
      <section class="shopping-group">
        <h3>${escapeHtml(group.label)}</h3>
        <ul>
          ${group.items.map((item) => {
            const inputId = `${prefix}-${itemIndex++}`;
            return `<li>
              <input id="${escapeHtml(inputId)}" type="checkbox" />
              <label for="${escapeHtml(inputId)}"><strong>${escapeHtml(formatAmount(item.amount, item.unit))} ${escapeHtml(item.unit)}</strong><span>${escapeHtml(item.name)}</span></label>
            </li>`;
          }).join("")}
        </ul>
      </section>`).join("");
  }

  global.KuechenenergieShopping = { aggregate, formatAmount, text, markup };
}(typeof window !== "undefined" ? window : globalThis));
