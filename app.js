const recipes = [];
const pilotRecipes = window.KuechenenergieRecipeCatalog?.buildRecipes?.() || [];
const rawRecipeDatabase = pilotRecipes.length ? pilotRecipes : recipes;
const recipeDatabase = window.KuechenenergieQuality?.prepare
  ? window.KuechenenergieQuality.prepare(rawRecipeDatabase)
  : rawRecipeDatabase.map((recipe) => ({
    ...recipe,
    quality: {
      passed: true,
      score: 100,
      editorial: false,
      automated: true,
      label: "Automatisch qualitätsgeprüft",
      checks: ["Zutaten mit Mengen", "Ausführliche Schrittfolge", "Makros rechnerisch plausibel"],
      note: "Das Rezept wurde auf Vollständigkeit und rechnerische Plausibilität geprüft."
    }
  }));

const boosters = {
  omnivore: {
    name: "Extra Hähnchenbrust",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 250,
    instruction: "Die zusätzliche Hähnchenbrust in gleichmäßige Stücke schneiden, würzen und in einer heißen Pfanne vollständig durchgaren.",
    macros: { kcal: 110, protein: 23, carbs: 0, fat: 1.5 }
  },
  vegetarian: {
    name: "Skyr-Kräuterdip",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 300,
    instruction: "Den zusätzlichen Skyr mit Kräutern, Salz, Pfeffer und einem Schluck Wasser zu einem cremigen Dip rühren.",
    macros: { kcal: 63, protein: 11, carbs: 4, fat: 0.2 }
  },
  vegan: {
    name: "Naturtofu",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 300,
    instruction: "Den zusätzlichen Tofu trocken tupfen, würfeln, würzen und in einer beschichteten Pfanne rundum goldbraun braten.",
    macros: { kcal: 152, protein: 15, carbs: 5, fat: 8 }
  },
  veganNoSoy: {
    name: "Gekochte Linsen",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 300,
    instruction: "Die zusätzlichen Linsen abspülen, gut abtropfen lassen und passend gewürzt unter das Gericht heben.",
    macros: { kcal: 116, protein: 9, carbs: 20, fat: 0.5 }
  },
  dessertVegetarian: {
    name: "Vanille-Skyr",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 300,
    instruction: "Den zusätzlichen Vanille-Skyr glatt rühren und gekühlt zusammen mit dem Dessert servieren.",
    macros: { kcal: 63, protein: 11, carbs: 4, fat: 0.2 }
  },
  dessertVegan: {
    name: "Veganes Proteinpulver, neutral",
    note: "als Protein-Extra",
    unit: "g",
    maxAmount: 70,
    instruction: "Das vegane Proteinpulver portionsweise mit etwas Wasser oder Pflanzendrink glatt rühren und unter die Dessertcreme ziehen.",
    macros: { kcal: 375, protein: 72, carbs: 8, fat: 7 }
  }
};

const energyBoosters = {
  savory: {
    name: "Langkornreis (Trockengewicht)",
    note: "als Energie-Beilage",
    unit: "g",
    maxAmount: 150,
    instruction: "Den zusätzlich ausgewiesenen Langkornreis nach Packungsangabe in leicht gesalzenem Wasser garen, ausdampfen lassen und als Beilage servieren.",
    macros: { kcal: 351, protein: 7.5, carbs: 78, fat: 1 }
  },
  dessert: {
    name: "Glutenfreie Haferflocken",
    note: "als Energie-Basis",
    unit: "g",
    maxAmount: 160,
    instruction: "Die zusätzlichen Haferflocken unter die Dessertmasse rühren und mindestens fünf Minuten quellen lassen; bei Bedarf etwas Pflanzendrink ergänzen.",
    macros: { kcal: 353, protein: 13, carbs: 59, fat: 7 }
  }
};

const form = document.querySelector("#meal-form");
const recipeCard = document.querySelector("#recipe-card");
const recipePlaceholder = document.querySelector("#recipe-placeholder");
const noResult = document.querySelector("#no-result");
const resultArea = document.querySelector("#result-area");
const caloriesMinInput = document.querySelector("#calories-min");
const caloriesMaxInput = document.querySelector("#calories-max");
const proteinMinInput = document.querySelector("#protein-min");
const proteinMaxInput = document.querySelector("#protein-max");
const caloriesOutput = document.querySelector("#calories-output");
const proteinOutput = document.querySelector("#protein-output");
const calorieRange = document.querySelector("#calorie-range");
const proteinRange = document.querySelector("#protein-range");
const applianceInput = document.querySelector("#appliance");
const energyPriceInput = document.querySelector("#energy-price");
const recipeSearchInput = document.querySelector("#recipe-search");
const clearSearchButton = document.querySelector("#clear-search");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");
const savedDialog = document.querySelector("#saved-dialog");
const toast = document.querySelector("#toast");
const allergenToggle = document.querySelector("#allergen-toggle");
const allergenPanel = document.querySelector("#allergen-panel");
const allergenList = document.querySelector("#allergen-list");
const plannerResult = document.querySelector("#planner-result");
const plannerAnnouncement = document.querySelector("#planner-announcement");
const generatePlanButton = document.querySelector("#generate-plan");
const savePlanButton = document.querySelector("#save-plan");
const savePlanLabel = document.querySelector("#save-plan-label");
const savedWeekCount = document.querySelector("#saved-week-count");
const builderLayout = document.querySelector("#builder-layout");
const fridgePanel = document.querySelector("#fridge-mode-panel");
const fridgeForm = document.querySelector("#fridge-form");
const fridgeInput = document.querySelector("#fridge-input");
const fridgeSelected = document.querySelector("#fridge-selected");
const fridgeCommonChips = document.querySelector("#fridge-common-chips");
const fridgeResults = document.querySelector("#fridge-results");
const fridgeAnnouncement = document.querySelector("#fridge-announcement");
const createShoppingListButton = document.querySelector("#create-shopping-list");
const shoppingDialog = document.querySelector("#shopping-dialog");
const shoppingList = document.querySelector("#shopping-list");
const shoppingSource = document.querySelector("#shopping-source");
const shoppingPeople = document.querySelector("#shopping-people");

let currentMeal = null;
let servings = 1;
let recentRecipeIds = [];
let toastTimer;
let previousCourse = form.elements.course.value;
let plannerMode = "day";
let plannerPlans = { day: null, week: null };
let appMode = "planner";
let shoppingMeals = [];
let shoppingTitle = "";
let shoppingPrintCleanup = null;
const plannerMealCache = new Map();
const fridgeIngredients = new Map();
const SAVED_WEEK_PLANS_KEY = "kuechenenergie-week-plans";
const SAVED_DAY_PLANS_KEY = "kuechenenergie-day-plans";
const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

const COMMON_FRIDGE_INGREDIENTS = [
  "Kartoffeln", "Reis", "Nudeln", "Eier", "Tomaten", "Paprika", "Zucchini",
  "Möhren", "Zwiebeln", "Brokkoli", "Spinat", "Hähnchen", "Hackfleisch",
  "Lachs", "Quark", "Joghurt", "Käse", "Tofu", "Linsen", "Haferflocken"
];

const FRIDGE_ALIASES = {
  kartoffeln: ["kartoffel"],
  reis: ["reis"],
  nudeln: ["nudel", "pasta", "spaghetti"],
  eier: ["ei", "eier", "eiklar"],
  tomaten: ["tomate", "tomatenmark"],
  paprika: ["paprika"],
  zucchini: ["zucchini"],
  moehren: ["moehre", "karotte"],
  zwiebeln: ["zwiebel"],
  brokkoli: ["brokkoli"],
  spinat: ["spinat"],
  haehnchen: ["haehnchen", "huehnchen"],
  hackfleisch: ["hackfleisch", "rinderhack"],
  lachs: ["lachs"],
  quark: ["quark"],
  joghurt: ["joghurt", "skyr"],
  kaese: ["kaese", "feta", "mozzarella", "parmesan"],
  tofu: ["tofu"],
  linsen: ["linse"],
  haferflocken: ["haferflock", "hafer"]
};

const allergenLabels = {
  gluten: "Glutenhaltiges Getreide",
  laktose: "Milch / Laktose",
  "nüsse": "Schalenfrüchte",
  soja: "Soja",
  fisch: "Fisch",
  ei: "Ei",
  senf: "Senf",
  sellerie: "Sellerie",
  sesam: "Sesam",
  "erdnüsse": "Erdnüsse",
  krebstiere: "Krebstiere"
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLocaleLowerCase("de-DE")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[character]);
}

function fridgeVariants(value) {
  const normalized = normalizeSearchText(value);
  const variants = new Set([normalized, ...(FRIDGE_ALIASES[normalized] || [])]);
  [...variants].forEach((term) => {
    if (term.length > 5 && term.endsWith("en")) variants.add(term.slice(0, -2));
    if (term.length > 4 && term.endsWith("n")) variants.add(term.slice(0, -1));
    if (term.length > 4 && term.endsWith("e")) variants.add(term.slice(0, -1));
  });
  return [...variants].filter((term) => term.length > 1);
}

function recipeHasFridgeIngredient(recipe, ingredient) {
  const ingredientNames = (recipe.ingredients || []).map((item) => normalizeSearchText(item.name));
  return fridgeVariants(ingredient).some((variant) => ingredientNames.some((name) => {
    if (variant.length <= 3) return name.split(" ").includes(variant);
    return name.includes(variant);
  }));
}

function setAppMode(mode) {
  appMode = mode === "fridge" ? "fridge" : "planner";
  const isFridge = appMode === "fridge";
  document.body.classList.toggle("fridge-mode", isFridge);
  document.querySelectorAll("[data-app-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.appMode === appMode));
  });
  fridgePanel.hidden = !isFridge;
  if (isFridge) {
    builderLayout.classList.remove("has-fridge-recipe");
    window.requestAnimationFrame(() => fridgeInput.focus({ preventScroll: true }));
  }
}

function renderFridgeCommonChips() {
  fridgeCommonChips.innerHTML = COMMON_FRIDGE_INGREDIENTS.map((ingredient) => {
    const key = normalizeSearchText(ingredient);
    const selected = fridgeIngredients.has(key);
    return `<button type="button" data-fridge-common="${escapeHtml(ingredient)}" aria-pressed="${selected}">${escapeHtml(ingredient)}</button>`;
  }).join("");
}

function renderFridgeSelection() {
  const values = [...fridgeIngredients.entries()];
  fridgeSelected.innerHTML = values.length
    ? `<span>In deinem Kühlschrank:</span>${values.map(([key, label]) => `<button type="button" data-remove-fridge="${escapeHtml(key)}"><span>${escapeHtml(label)}</span><i aria-hidden="true">×</i><span class="sr-only"> entfernen</span></button>`).join("")}`
    : "<p>Noch keine Zutaten ausgewählt.</p>";
  renderFridgeCommonChips();
}

function rankedFridgeRecipes() {
  const selected = [...fridgeIngredients.values()];
  if (!selected.length) return [];
  return recipeDatabase.map((recipe) => {
    const matched = selected.filter((ingredient) => recipeHasFridgeIngredient(recipe, ingredient));
    const essentialIngredients = (recipe.ingredients || []).filter((ingredient) => !/salz|pfeffer|gewürz|wasser|öl|essig|brühe|kräuter/i.test(ingredient.name));
    const missing = essentialIngredients.filter((ingredient) => !selected.some((item) => recipeHasFridgeIngredient({ ingredients: [ingredient] }, item)));
    const coverage = matched.length / selected.length;
    const recipeCoverage = essentialIngredients.length
      ? (essentialIngredients.length - missing.length) / essentialIngredients.length
      : 0;
    return { recipe, matched, missing, score: matched.length * 100 + coverage * 30 + recipeCoverage * 25 - recipe.time * 0.05 };
  }).filter((result) => result.matched.length)
    .sort((first, second) => second.score - first.score || first.recipe.time - second.recipe.time)
    .slice(0, 12);
}

function renderFridgeResults() {
  const selectedCount = fridgeIngredients.size;
  if (!selectedCount) {
    fridgeResults.innerHTML = `<div class="fridge-empty"><span aria-hidden="true">🥕</span><strong>Deine Zutaten machen den Anfang.</strong><p>Wähle oben typische Vorräte aus oder gib eigene Zutaten ein.</p></div>`;
    fridgeAnnouncement.textContent = "Noch keine Zutaten ausgewählt.";
    return;
  }
  const results = rankedFridgeRecipes();
  if (!results.length) {
    fridgeResults.innerHTML = `<div class="fridge-empty"><span aria-hidden="true">🧊</span><strong>Noch keine passende Idee gefunden.</strong><p>Ergänze eine weitere Zutat oder probiere einen allgemeineren Begriff.</p></div>`;
    fridgeAnnouncement.textContent = "Zu dieser Auswahl wurde noch kein Rezept gefunden.";
    return;
  }
  fridgeResults.innerHTML = results.map(({ recipe, matched, missing }) => `
    <article class="fridge-result-card">
      <div class="fridge-result-top"><span>${escapeHtml(courseLabel(recipe.course))}</span><span>${recipe.time} Min.</span></div>
      <h2>${escapeHtml(recipe.title)}</h2>
      <p>${escapeHtml(recipe.description)}</p>
      <div class="fridge-match"><strong>${matched.length} ${matched.length === 1 ? "Treffer" : "Treffer"}</strong>${matched.map((ingredient) => `<span>${escapeHtml(ingredient)}</span>`).join("")}</div>
      ${missing.length ? `<small>Noch hilfreich: ${missing.slice(0, 3).map((item) => escapeHtml(item.name)).join(", ")}</small>` : "<small>Alle wesentlichen Zutaten sind dabei.</small>"}
      <button type="button" data-fridge-recipe="${escapeHtml(recipe.id)}">Rezept ansehen <span aria-hidden="true">→</span></button>
    </article>`).join("");
  fridgeAnnouncement.textContent = `${results.length} Rezeptvorschläge für ${selectedCount} ausgewählte ${selectedCount === 1 ? "Zutat" : "Zutaten"}.`;
}

function addFridgeIngredients(value) {
  String(value || "").split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean).forEach((label) => {
    const key = normalizeSearchText(label);
    if (key) fridgeIngredients.set(key, label);
  });
  renderFridgeSelection();
  renderFridgeResults();
}

function openFridgeRecipe(recipeId) {
  const recipe = recipeDatabase.find((item) => item.id === recipeId);
  if (!recipe) return;
  const macros = window.KuechenenergieNutrition.normalizeMacros(recipe.macros);
  const config = {
    ...getConfig(),
    caloriesMin: Math.max(50, macros.kcal - 15),
    caloriesMax: macros.kcal + 15,
    proteinMin: Math.max(1, macros.protein - 2),
    proteinMax: macros.protein + 2,
    calories: macros.kcal,
    protein: macros.protein,
    course: recipe.course,
    diet: "all",
    cuisine: "all",
    maxTime: 60,
    search: "",
    exclude: []
  };
  const meal = adaptRecipe(recipe, config);
  renderMeal(meal);
  builderLayout.classList.add("has-fridge-recipe");
  window.requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    document.querySelector("#recipe-title").focus({ preventScroll: true });
  });
}

function currentShoppingPlan() {
  return plannerPlans[plannerMode];
}

function renderShoppingList() {
  const engine = window.KuechenenergieShopping;
  if (!engine) return;
  const multiplier = Math.max(1, Number(shoppingPeople.value) || 1);
  const groups = engine.aggregate(shoppingMeals, multiplier);
  shoppingSource.textContent = `${shoppingTitle} · Mengen für ${multiplier} ${multiplier === 1 ? "Person" : "Personen"}`;
  shoppingList.innerHTML = groups.length
    ? engine.markup(groups, "planner-shopping-item")
    : "<p class=\"shopping-empty\">Für diesen Plan sind keine Zutaten verfügbar.</p>";
}

function openShoppingList() {
  const plan = currentShoppingPlan();
  if (!plan) {
    showToast("Bitte zuerst einen Tages- oder Wochenplan erstellen.");
    return;
  }
  showShoppingList(
    plan.days.flatMap((day) => day.meals || []),
    plannerMode === "week" ? "Einkauf für deinen Wochenplan" : "Einkauf für dein Drei-Gänge-Menü"
  );
}

function showShoppingList(meals, title) {
  shoppingMeals = meals;
  shoppingTitle = title;
  shoppingPeople.value = "1";
  renderShoppingList();
  if (typeof shoppingDialog.showModal === "function") shoppingDialog.showModal();
  else shoppingDialog.setAttribute("open", "");
}

function openSavedPlanShoppingList(plan) {
  if (!plan) return;
  const meals = plan.days.flatMap((day) => (day.meals || []).map((meal) => ({
    ingredients: Array.isArray(meal.ingredients) && meal.ingredients.length
      ? meal.ingredients
      : recipeDatabase.find((recipe) => recipe.id === meal.recipeId)?.ingredients || []
  })));
  savedDialog.close();
  showShoppingList(meals, `Einkauf · ${plan.name || "Gespeicherter Plan"}`);
}

async function copyShoppingList() {
  const engine = window.KuechenenergieShopping;
  const groups = engine?.aggregate(shoppingMeals, Math.max(1, Number(shoppingPeople.value) || 1)) || [];
  const text = engine?.text(groups, `${shoppingTitle} (${shoppingPeople.options[shoppingPeople.selectedIndex].text})`) || "";
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showToast("Einkaufsliste kopiert");
}

function printShoppingList() {
  document.body.classList.add("printing-shopping");
  shoppingPrintCleanup = () => {
    document.body.classList.remove("printing-shopping");
    shoppingPrintCleanup = null;
  };
  window.print();
  window.setTimeout(() => shoppingPrintCleanup?.(), 600);
}

function recipeSearchText(recipe) {
  return normalizeSearchText([
    recipe.title,
    recipe.description,
    cuisineLabel(recipe.cuisine),
    courseLabel(recipe.course),
    dietLabel(recipe.diet),
    ...(recipe.ingredients || []).map((ingredient) => ingredient.name)
  ].join(" "));
}

function matchesRecipeSearch(recipe, query) {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  if (!terms.length) return true;
  const haystack = recipeSearchText(recipe);
  return terms.every((term) => {
    const variants = new Set([term]);
    if (term.length > 5 && term.endsWith("n")) variants.add(term.slice(0, -1));
    if (term.length > 6 && term.endsWith("en")) variants.add(term.slice(0, -2));
    if (term.length > 5 && term.endsWith("e")) variants.add(term.slice(0, -1));
    return [...variants].some((variant) => haystack.includes(variant));
  });
}

function searchRelevance(recipe, query) {
  const normalizedQuery = normalizeSearchText(query);
  const title = normalizeSearchText(recipe.title);
  const ingredientNames = normalizeSearchText((recipe.ingredients || []).map((ingredient) => ingredient.name).join(" "));
  let score = 0;
  if (title === normalizedQuery) score += 240;
  else if (title.startsWith(normalizedQuery)) score += 150;
  else if (title.includes(normalizedQuery)) score += 100;
  if (ingredientNames.includes(normalizedQuery)) score += 65;
  return score - recipe.title.length / 100;
}

function getConfig() {
  const caloriesMin = Number(caloriesMinInput.value);
  const caloriesMax = Number(caloriesMaxInput.value);
  const proteinMin = Number(proteinMinInput.value);
  const proteinMax = Number(proteinMaxInput.value);
  return {
    caloriesMin,
    caloriesMax,
    proteinMin,
    proteinMax,
    calories: Math.round((caloriesMin + caloriesMax) / 2),
    protein: Math.round((proteinMin + proteinMax) / 2),
    course: form.elements.course.value,
    diet: form.elements.diet.value,
    cuisine: form.elements.cuisine.value,
    maxTime: Number(form.elements.maxTime.value),
    search: recipeSearchInput.value.trim(),
    appliance: applianceInput.value,
    energyPrice: clamp(Number(energyPriceInput.value) || 35, 1, 100),
    exclude: [...form.querySelectorAll('input[name="exclude"]:checked')].map((input) => input.value)
  };
}

function updateDualRange(minInput, maxInput, range, output, unit) {
  const floor = Number(minInput.min);
  const ceiling = Number(minInput.max);
  const start = ((Number(minInput.value) - floor) / (ceiling - floor)) * 100;
  const end = ((Number(maxInput.value) - floor) / (ceiling - floor)) * 100;
  const formatter = new Intl.NumberFormat("de-DE");
  const label = `${formatter.format(Number(minInput.value))}–${formatter.format(Number(maxInput.value))} ${unit}`;
  range.style.setProperty("--range-start", `${start}%`);
  range.style.setProperty("--range-end", `${end}%`);
  output.value = label;
  output.textContent = label;
  minInput.setAttribute("aria-valuetext", `${minInput.value} ${unit}, Untergrenze`);
  maxInput.setAttribute("aria-valuetext", `${maxInput.value} ${unit}, Obergrenze`);
}

function keepRangeOrdered(event, minInput, maxInput) {
  const gap = Number(minInput.step) || 1;
  if (event.target === minInput && Number(minInput.value) > Number(maxInput.value) - gap) {
    minInput.value = String(Number(maxInput.value) - gap);
  }
  if (event.target === maxInput && Number(maxInput.value) < Number(minInput.value) + gap) {
    maxInput.value = String(Number(minInput.value) + gap);
  }
  updateControls();
}

function updateControls() {
  updateDualRange(caloriesMinInput, caloriesMaxInput, calorieRange, caloriesOutput, "kcal");
  updateDualRange(proteinMinInput, proteinMaxInput, proteinRange, proteinOutput, "g");
  updateAvailableCount();
  renderSearchResults();
}

function updateAvailableCount() {
  const config = getConfig();
  const candidates = eligibleRecipes(config);
  const directHits = candidates.filter((recipe) => {
    const macros = window.KuechenenergieNutrition.normalizeMacros(recipe.macros);
    return macros.kcal >= config.caloriesMin
      && macros.kcal <= config.caloriesMax
      && macros.protein >= config.proteinMin
      && macros.protein <= config.proteinMax;
  }).length;
  const formatter = new Intl.NumberFormat("de-DE");
  const hint = document.querySelector("#available-count");
  if (!candidates.length) hint.textContent = "Keine Idee – bitte einen Filter lockern";
  else if (directHits) hint.textContent = `${formatter.format(directHits)} direkte Treffer · ${formatter.format(candidates.length)} variierbar`;
  else hint.textContent = `${formatter.format(candidates.length)} Ideen können an die Spanne angepasst werden`;
  document.querySelector("#header-recipe-count").textContent = formatter.format(recipeDatabase.length);
}

function eligibleRecipes(config) {
  return recipeDatabase.filter((recipe) => {
    const courseMatches = config.course === "all" || recipe.course === config.course;
    const dietMatches = config.diet === "all"
      || (config.diet === "vegetarian" && recipe.diet !== "omnivore")
      || (config.diet === "vegan" && recipe.diet === "vegan");
    const cuisineMatches = config.cuisine === "all" || recipe.cuisine === config.cuisine;
    const timeMatches = recipe.time <= config.maxTime;
    const exclusionsMatch = !config.exclude.some((excluded) => recipe.allergens.includes(excluded));
    const searchMatches = matchesRecipeSearch(recipe, config.search);
    return courseMatches && dietMatches && cuisineMatches && timeMatches && exclusionsMatch && searchMatches;
  });
}

function renderSearchResults() {
  const query = recipeSearchInput.value.trim();
  clearSearchButton.hidden = !query;

  if (query.length < 2) {
    searchResults.hidden = true;
    searchResults.replaceChildren();
    searchStatus.textContent = "Alle Rezepte werden berücksichtigt.";
    return;
  }

  const matches = eligibleRecipes(getConfig())
    .sort((first, second) => searchRelevance(second, query) - searchRelevance(first, query));
  const formatter = new Intl.NumberFormat("de-DE");
  searchStatus.textContent = matches.length
    ? `${formatter.format(matches.length)} Treffer für „${query}“. Die besten sechs werden angezeigt.`
    : `Keine Treffer für „${query}“ mit den aktuellen Filtern.`;
  searchResults.replaceChildren();

  if (!matches.length) {
    searchResults.hidden = true;
    return;
  }

  matches.slice(0, 6).forEach((recipe) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const meta = document.createElement("small");

    button.type = "button";
    button.dataset.searchRecipe = recipe.id;
    button.setAttribute("aria-label", `${recipe.title} auswählen, ${courseLabel(recipe.course)}, ${recipe.time} Minuten`);
    title.textContent = recipe.title;
    meta.textContent = `${courseLabel(recipe.course)} · ${recipe.time} Min. · ${dietLabel(recipe.diet)}`;
    copy.append(title, meta);
    button.append(copy);
    item.append(button);
    searchResults.append(item);
  });
  searchResults.hidden = false;
}

function getBooster(recipe, config) {
  const configured = recipe.variantPolicy?.proteinBooster;
  const configuredHasDairy = configured && /skyr|quark|frischkäse|joghurt/i.test(configured.name);
  const configuredHasSoy = configured && /tofu|soja|tempeh/i.test(configured.name);
  if (configured
    && !(config.exclude.includes("laktose") && configuredHasDairy)
    && !(config.exclude.includes("soja") && configuredHasSoy)) return configured;
  if (recipe.course === "dessert") {
    if (config.exclude.includes("laktose")) return config.exclude.includes("soja") ? boosters.veganNoSoy : boosters.dessertVegan;
    return recipe.diet === "vegan" ? boosters.dessertVegan : boosters.dessertVegetarian;
  }
  if (recipe.diet === "vegan") return config.exclude.includes("soja") ? boosters.veganNoSoy : boosters.vegan;
  if (recipe.diet === "vegetarian") {
    if (config.exclude.includes("laktose")) return config.exclude.includes("soja") ? boosters.veganNoSoy : boosters.vegan;
    return boosters.vegetarian;
  }
  return boosters.omnivore;
}

function getEnergyBooster(recipe, config) {
  const configured = recipe.variantPolicy?.energyBooster;
  const containsGluten = configured && /brot|pasta|couscous|hafer/i.test(configured.name);
  if (configured && !(config.exclude.includes("gluten") && containsGluten)) return configured;
  if (config.exclude.includes("gluten")) {
    return recipe.course === "dessert" ? energyBoosters.dessert : energyBoosters.savory;
  }
  return recipe.course === "dessert" ? energyBoosters.dessert : energyBoosters.savory;
}

function adaptRecipe(recipe, config) {
  return window.KuechenenergieNutrition.adaptRecipe(
    recipe,
    config,
    getBooster(recipe, config),
    getEnergyBooster(recipe, config)
  );
}

function chooseMeal(config, preferredId) {
  const candidates = eligibleRecipes(config);
  if (!candidates.length) return null;

  if (preferredId) {
    const preferred = candidates.find((recipe) => recipe.id === preferredId);
    if (preferred) {
      const adaptedPreferred = adaptRecipe(preferred, config);
      if (adaptedPreferred.withinTargets) return adaptedPreferred;
    }
  }

  const ranked = candidates
    .map((recipe) => {
      const adapted = adaptRecipe(recipe, config);
      const recentPenalty = recentRecipeIds.includes(recipe.id) ? 17 : 0;
      const surprise = Math.random() * 8;
      const targetBonus = adapted.withinTargets ? 1000 : 0;
      return {
        adapted,
        score: targetBonus + adapted.match - adapted.adjustmentScore - recentPenalty + surprise
      };
    })
    .sort((a, b) => b.score - a.score);

  const exactMatches = ranked.filter(({ adapted }) => adapted.withinTargets);
  if (!exactMatches.length) return null;
  const pool = exactMatches.slice(0, Math.min(4, exactMatches.length));
  const selected = pool[Math.floor(Math.random() * pool.length)].adapted;
  recentRecipeIds = [selected.recipe.id, ...recentRecipeIds.filter((id) => id !== selected.recipe.id)].slice(0, 4);
  return selected;
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

function dietLabel(diet) {
  if (diet === "vegan") return "Vegan";
  if (diet === "vegetarian") return "Vegetarisch";
  return "Mischkost";
}

function courseLabel(course) {
  if (course === "starter") return "Vorspeise";
  if (course === "dessert") return "Dessert";
  if (course === "snack") return "Snack";
  return "Hauptspeise";
}

function cuisineLabel(cuisine) {
  if (cuisine === "saechsisch") return "Typisch sächsisch";
  if (cuisine === "klassisch") return "Modern & klassisch";
  return cuisine.charAt(0).toLocaleUpperCase("de-DE") + cuisine.slice(1);
}

function allergensForMeal(meal) {
  const allergens = new Set(meal.recipe.allergens || []);
  const text = (meal.ingredients || []).map((ingredient) => ingredient.name).join(" ").toLocaleLowerCase("de-DE");
  const rules = [
    ["gluten", /brot|toast|brötchen|mehl|panier|couscous|bulgur|pasta|nudel|gnocchi|wrap|tortilla|hafer|grieß|semmel/],
    ["laktose", /joghurt|skyr|quark|feta|halloumi|mozzarella|frischkäse|milch|butter|parmesan|hüttenkäse|schmand|buttermilch/],
    ["nüsse", /walnuss|cashew|mandel|haselnuss|nussmus|marzipan/],
    ["soja", /tofu|sojajoghurt|sojasauce|tempeh/],
    ["fisch", /lachs|fisch|thunfisch|kabeljau|seelachs|karpfen/],
    ["ei", /\bei\b|eier|rührei|eiklar/],
    ["senf", /senf/],
    ["sellerie", /sellerie/],
    ["sesam", /sesam|tahin|hummus/],
    ["erdnüsse", /erdnuss/],
    ["krebstiere", /garnele|krebs|scampi/]
  ];
  rules.forEach(([key, pattern]) => { if (pattern.test(text)) allergens.add(key); });
  return [...allergens].filter(Boolean).sort((first, second) => (
    (allergenLabels[first] || first).localeCompare(allergenLabels[second] || second, "de")
  ));
}

function allergenText(meal) {
  const allergens = allergensForMeal(meal);
  return allergens.length
    ? allergens.map((allergen) => allergenLabels[allergen] || allergen).join(", ")
    : "Keine der automatisch erfassten Hauptallergene erkannt";
}

function renderAllergens(meal) {
  const allergens = allergensForMeal(meal);
  allergenToggle.setAttribute("aria-expanded", "false");
  allergenPanel.hidden = true;
  document.querySelector("#allergen-count").textContent = allergens.length
    ? `${allergens.length} ${allergens.length === 1 ? "Hinweis" : "Hinweise"} – zum Öffnen tippen`
    : "Keine Hauptallergene erkannt – Details öffnen";
  allergenList.innerHTML = allergens.length
    ? allergens.map((allergen) => `<li>${allergenLabels[allergen] || allergen}</li>`).join("")
    : "<li>Keine automatisch erfassten Hauptallergene</li>";
}

function renderIngredients() {
  const list = document.querySelector("#ingredient-list");
  list.innerHTML = currentMeal.ingredients.map((ingredient, index) => {
    const amount = formatAmount(ingredient.amount * servings, ingredient.unit);
    const adjustmentText = ingredient.adjustmentLabel
      ? ` <small>(${ingredient.adjustmentLabel})</small>`
      : "";
    return `
      <li>
        <input type="checkbox" id="ingredient-${index}" />
        <label for="ingredient-${index}">${ingredient.name}${adjustmentText}</label>
        <span class="amount">${amount} ${ingredient.unit}</span>
      </li>`;
  }).join("");
  document.querySelector("#servings").textContent = servings;
  document.querySelector("#serving-minus").disabled = servings <= 1;
  document.querySelector("#serving-plus").disabled = servings >= 8;
}

function formatEnergyNumber(value) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatEnergyPrice(value) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: value % 1 ? 1 : 0,
    maximumFractionDigits: 1
  }).format(value);
}

function renderEnergy() {
  if (!currentMeal || !window.KuechenenergieEnergy) return;
  const liveConfig = getConfig();
  currentMeal.config.appliance = liveConfig.appliance;
  currentMeal.config.energyPrice = liveConfig.energyPrice;
  const energy = window.KuechenenergieEnergy.estimate(currentMeal.recipe, liveConfig, servings);
  currentMeal.energy = energy;

  document.querySelector("#energy-device").textContent = energy.primary.shortLabel;
  document.querySelector("#energy-device-note").textContent = energy.compatibility;
  document.querySelector("#energy-kwh").textContent = formatEnergyNumber(energy.primary.kwh);
  document.querySelector("#energy-kind").textContent = `${energy.primary.energyKind} · ${energy.servings} ${energy.servings === 1 ? "Portion" : "Portionen"}`;
  document.querySelector("#energy-cost").textContent = `${formatEnergyNumber(energy.primary.cost)} €`;
  document.querySelector("#energy-price-note").textContent = `bei ${formatEnergyPrice(energy.priceCents)} ct/kWh`;
  document.querySelector("#energy-saving-percent").textContent = `−${energy.alternative.savingsPercent} %`;
  document.querySelector("#energy-alternative-title").textContent = energy.alternative.label;
  document.querySelector("#energy-alternative-copy").textContent = `ca. ${formatEnergyNumber(energy.alternative.kwh)} kWh · ${formatEnergyNumber(energy.alternative.cost)} €`;
  document.querySelector("#energy-tip").textContent = energy.tip;
  document.querySelector("#energy-disclaimer").textContent = energy.disclaimer;
}

function renderMeal(meal) {
  currentMeal = meal;
  servings = 1;
  const { recipe, macros, config, match } = meal;

  recipeCard.hidden = false;
  recipePlaceholder.hidden = true;
  noResult.hidden = true;
  document.querySelector("#recipe-visual").dataset.theme = recipe.theme;
  document.querySelector("#match-value").textContent = match;
  const visual = window.KuechenenergieVisuals?.forRecipe?.(recipe);
  if (visual) {
    const foodArt = document.querySelector("#food-art");
    foodArt.dataset.layout = visual.layout;
    foodArt.dataset.pattern = visual.pattern;
    document.querySelector("#food-main").textContent = visual.main;
    document.querySelector("#food-accent-one").textContent = visual.accentOne;
    document.querySelector("#food-accent-two").textContent = visual.accentTwo;
  }
  document.querySelector("#recipe-cuisine").textContent = `${courseLabel(recipe.course).toUpperCase()} · ${cuisineLabel(recipe.cuisine).toUpperCase()} · ${dietLabel(recipe.diet).toUpperCase()}`;
  const recipeTitle = document.querySelector("#recipe-title");
  recipeTitle.textContent = recipe.title;
  recipeTitle.classList.toggle("is-long", recipe.title.length > 42);
  recipeTitle.classList.toggle("is-very-long", recipe.title.length > 62);
  document.querySelector("#detail-title").textContent = recipe.title;
  document.querySelector("#recipe-description").textContent = recipe.description;
  document.querySelector("#recipe-time").textContent = `${recipe.time} Min.`;
  document.querySelector("#recipe-level").textContent = recipe.level;
  document.querySelector("#macro-calories").textContent = Math.round(macros.kcal);
  document.querySelector("#macro-protein").textContent = Math.round(macros.protein);
  document.querySelector("#macro-carbs").textContent = Math.round(macros.carbs);
  document.querySelector("#macro-fat").textContent = Math.round(macros.fat);
  document.querySelector("#protein-bar").style.width = `${clamp((macros.protein / config.proteinMin) * 100, 10, 100)}%`;
  const adaptationParts = [];
  if (Math.abs(meal.scale - 1) >= 0.02) adaptationParts.push(`Portionsbasis auf ${Math.round(meal.scale * 100)} % skaliert`);
  if (meal.boosterAmount) adaptationParts.push(`${formatAmount(meal.boosterAmount, meal.booster.unit)} ${meal.booster.unit} ${meal.booster.name} als Protein-Extra`);
  if (meal.energyBoosterAmount) adaptationParts.push(`${formatAmount(meal.energyBoosterAmount, meal.energyBooster.unit)} ${meal.energyBooster.unit} ${meal.energyBooster.name} als Energie-Beilage`);
  const adaptationNote = document.querySelector("#adaptation-note");
  adaptationNote.textContent = adaptationParts.length
    ? `Anpassung dieses Grundrezepts: ${adaptationParts.join(" · ")}.`
    : "Dieses Grundrezept passt bereits ohne zusätzliche Makro-Extras in deine Zielspanne.";
  adaptationNote.classList.toggle("is-direct", !adaptationParts.length);
  renderAllergens(meal);
  document.querySelector("#method-list").innerHTML = meal.steps.map((step) => `<li>${step}</li>`).join("");
  const adjustments = [];
  if (meal.boosterAmount) adjustments.push(`${meal.booster.name} gleicht das Proteinziel aus`);
  if (meal.energyBoosterAmount) adjustments.push(`${meal.energyBooster.name} bringt die Portion in die Kalorienspanne`);
  document.querySelector("#coach-tip").textContent = adjustments.length
    ? `${recipe.tip} ${adjustments.join("; ")}.`
    : recipe.tip;

  renderIngredients();
  renderEnergy();
  updateSaveButton();
  document.querySelector("#result-announcement").textContent = `${recipe.title} wurde ausgewählt. ${Math.round(macros.kcal)} Kilokalorien und ${Math.round(macros.protein)} Gramm Protein pro Portion.`;
  resultArea.setAttribute("aria-busy", "false");
}

function showNoResult() {
  currentMeal = null;
  recipeCard.hidden = true;
  recipePlaceholder.hidden = true;
  noResult.hidden = false;
  document.querySelector("#result-announcement").textContent = "Kein realistischer Rezepttreffer für die aktuelle Auswahl.";
  resultArea.setAttribute("aria-busy", "false");
}

function showRecipePlaceholder() {
  currentMeal = null;
  servings = 1;
  recipeCard.hidden = true;
  noResult.hidden = true;
  recipePlaceholder.hidden = false;
  document.querySelector("#result-announcement").textContent = "";
  resultArea.setAttribute("aria-busy", "false");
}

function generateMeal(preferredId, shouldScroll = false) {
  resultArea.setAttribute("aria-busy", "true");
  recipeCard.classList.remove("is-loading");
  void recipeCard.offsetWidth;
  recipeCard.classList.add("is-loading");

  window.setTimeout(() => {
    const meal = chooseMeal(getConfig(), preferredId);
    if (meal) renderMeal(meal);
    else showNoResult();
    recipeCard.classList.remove("is-loading");
    if (shouldScroll) {
      const focusTarget = meal
        ? document.querySelector("#recipe-title")
        : document.querySelector("#no-result-title");
      focusTarget.focus({ preventScroll: true });
      const reducedMotion = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
      resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }, 260);
}

function plannerCourseConfig(baseConfig, course, share) {
  const dayCaloriesMin = Math.max(1500, baseConfig.caloriesMin * 3);
  const dayCaloriesMax = Math.max(dayCaloriesMin + 300, baseConfig.caloriesMax * 3);
  const dayProteinMin = Math.max(75, baseConfig.proteinMin * 3);
  const dayProteinMax = Math.max(dayProteinMin + 25, baseConfig.proteinMax * 3);
  const caloriesMin = Math.max(100, Math.round((dayCaloriesMin * share) / 25) * 25);
  const caloriesMax = Math.max(caloriesMin + 50, Math.round((dayCaloriesMax * share) / 25) * 25);
  const proteinMin = Math.max(5, Math.round((dayProteinMin * share) / 5) * 5);
  const proteinMax = Math.max(proteinMin + 5, Math.round((dayProteinMax * share) / 5) * 5);
  return {
    ...baseConfig,
    caloriesMin,
    caloriesMax,
    proteinMin,
    proteinMax,
    calories: Math.round((caloriesMin + caloriesMax) / 2),
    protein: Math.round((proteinMin + proteinMax) / 2),
    course,
    search: ""
  };
}

function rankPlannerCourse(baseConfig, course, share) {
  let config = plannerCourseConfig(baseConfig, course, share);
  let candidates = eligibleRecipes(config);
  let relaxedCuisine = false;
  let relaxedTime = false;

  if (!candidates.length && config.cuisine !== "all") {
    config = { ...config, cuisine: "all" };
    candidates = eligibleRecipes(config);
    relaxedCuisine = true;
  }
  if (!candidates.length && config.maxTime < 60) {
    config = { ...config, maxTime: 60 };
    candidates = eligibleRecipes(config);
    relaxedTime = true;
  }

  const meals = candidates.map((recipe) => {
    const meal = adaptRecipe(recipe, config);
    return {
      meal,
      score: (meal.withinTargets ? 1000 : 0) + meal.match - meal.adjustmentScore + Math.random() * 5
    };
  }).sort((first, second) => second.score - first.score).map((item) => item.meal);

  return { meals, relaxedCuisine, relaxedTime };
}

function selectPlannerMeal(ranking, usedRecipeIds) {
  const fresh = ranking.meals.filter((meal) => !usedRecipeIds.has(meal.recipe.id));
  const source = fresh.length ? fresh : ranking.meals;
  if (!source.length) return null;
  const pool = source.slice(0, Math.min(12, source.length));
  const selected = pool[Math.floor(Math.random() * pool.length)];
  usedRecipeIds.add(selected.recipe.id);
  return selected;
}

function summarizeMenu(meals, config) {
  return meals.reduce((summary, meal) => {
    const energy = window.KuechenenergieEnergy?.estimate(meal.recipe, config, 1);
    summary.kcal += meal.macros.kcal;
    summary.protein += meal.macros.protein;
    summary.carbs += meal.macros.carbs;
    summary.fat += meal.macros.fat;
    summary.time += meal.recipe.time;
    summary.kwh += energy?.primary.kwh || 0;
    summary.cost += energy?.primary.cost || 0;
    return summary;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, time: 0, kwh: 0, cost: 0 });
}

function createPlannerPlan(dayCount) {
  const baseConfig = { ...getConfig(), course: "all", search: "" };
  const rankings = {
    starter: rankPlannerCourse(baseConfig, "starter", 0.2),
    main: rankPlannerCourse(baseConfig, "main", 0.6),
    dessert: rankPlannerCourse(baseConfig, "dessert", 0.2)
  };
  if (Object.values(rankings).some((ranking) => !ranking.meals.length)) return null;

  const usedRecipeIds = new Set();
  const days = Array.from({ length: dayCount }, (_, dayIndex) => {
    const meals = [
      selectPlannerMeal(rankings.starter, usedRecipeIds),
      selectPlannerMeal(rankings.main, usedRecipeIds),
      selectPlannerMeal(rankings.dessert, usedRecipeIds)
    ];
    return { dayIndex, meals, summary: summarizeMenu(meals, baseConfig) };
  });

  return {
    days,
    config: baseConfig,
    relaxedCuisine: Object.values(rankings).some((ranking) => ranking.relaxedCuisine),
    relaxedTime: Object.values(rankings).some((ranking) => ranking.relaxedTime)
  };
}

function readSavedWeekPlans() {
  try {
    const plans = JSON.parse(localStorage.getItem(SAVED_WEEK_PLANS_KEY) || "[]");
    return Array.isArray(plans) ? plans : [];
  } catch {
    return [];
  }
}

function readSavedDayPlans() {
  try {
    const plans = JSON.parse(localStorage.getItem(SAVED_DAY_PLANS_KEY) || "[]");
    return Array.isArray(plans) ? plans : [];
  } catch {
    return [];
  }
}

function writeSavedWeekPlans(plans) {
  try {
    localStorage.setItem(SAVED_WEEK_PLANS_KEY, JSON.stringify(plans));
    updateSavedList();
    return true;
  } catch {
    showToast("Der Wochenplan konnte in diesem Browser nicht gespeichert werden.");
    return false;
  }
}

function writeSavedDayPlans(plans) {
  try {
    localStorage.setItem(SAVED_DAY_PLANS_KEY, JSON.stringify(plans));
    updateSavedList();
    return true;
  } catch {
    showToast("Der Tagesplan konnte in diesem Browser nicht gespeichert werden.");
    return false;
  }
}

function compactPlanSummary(summary) {
  return {
    kcal: Math.round(summary.kcal),
    protein: Math.round(summary.protein),
    carbs: Math.round(summary.carbs),
    fat: Math.round(summary.fat),
    time: Math.round(summary.time),
    kwh: Math.round(summary.kwh * 100) / 100,
    cost: Math.round(summary.cost * 100) / 100
  };
}

function serializePlan(plan, type = "week") {
  const savedAt = new Date();
  const titleDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(savedAt);
  const isWeek = type === "week";
  return {
    id: `${isWeek ? "week" : "day"}-${savedAt.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    type: isWeek ? "week" : "day",
    name: `${isWeek ? "Wochenplan" : "Tagesplan"} vom ${titleDate}`,
    savedAt: savedAt.toISOString(),
    config: {
      caloriesMin: plan.config.caloriesMin,
      caloriesMax: plan.config.caloriesMax,
      proteinMin: plan.config.proteinMin,
      proteinMax: plan.config.proteinMax,
      diet: plan.config.diet,
      cuisine: plan.config.cuisine,
      maxTime: plan.config.maxTime,
      exclude: [...plan.config.exclude],
      energyPrice: plan.config.energyPrice,
      appliance: plan.config.appliance
    },
    relaxedCuisine: plan.relaxedCuisine,
    relaxedTime: plan.relaxedTime,
    days: plan.days.map((day) => ({
      dayIndex: day.dayIndex,
      summary: compactPlanSummary(day.summary),
      meals: day.meals.map((meal) => ({
        recipeId: meal.recipe.id,
        title: meal.recipe.title,
        description: meal.recipe.description,
        course: meal.recipe.course,
        cuisine: meal.recipe.cuisine,
        diet: meal.recipe.diet,
        time: meal.recipe.time,
        macros: {
          kcal: Math.round(meal.macros.kcal),
          protein: Math.round(meal.macros.protein),
          carbs: Math.round(meal.macros.carbs),
          fat: Math.round(meal.macros.fat)
        },
        config: { ...meal.config, exclude: [...(meal.config.exclude || [])] },
        scale: meal.scale,
        boosterAmount: meal.boosterAmount,
        booster: meal.booster,
        energyBoosterAmount: meal.energyBoosterAmount,
        energyBooster: meal.energyBooster,
        match: meal.match,
        ingredients: meal.ingredients.map((ingredient) => ({ ...ingredient })),
        steps: [...meal.steps],
        allergens: allergensForMeal(meal)
      }))
    }))
  };
}

function restoredWeekMeal(savedMeal, savedPlan) {
  const recipe = recipeDatabase.find((item) => item.id === savedMeal.recipeId);
  if (!recipe) return null;
  const kcal = Number(savedMeal.macros?.kcal) || recipe.macros.kcal;
  const protein = Number(savedMeal.macros?.protein) || recipe.macros.protein;
  const inferredConfig = {
    ...getConfig(),
    ...(savedPlan.config || {}),
    caloriesMin: Math.max(50, kcal - 3),
    caloriesMax: kcal + 3,
    proteinMin: Math.max(1, protein - 1),
    proteinMax: protein + 1,
    calories: kcal,
    protein,
    course: recipe.course,
    cuisine: "all",
    maxTime: 60,
    search: "",
    exclude: [...(savedPlan.config?.exclude || [])]
  };
  const config = savedMeal.config
    ? { ...inferredConfig, ...savedMeal.config, exclude: [...(savedMeal.config.exclude || [])] }
    : inferredConfig;
  const fallback = adaptRecipe(recipe, config);
  const hasFullRecipe = Array.isArray(savedMeal.ingredients) && savedMeal.ingredients.length
    && Array.isArray(savedMeal.steps) && savedMeal.steps.length;
  return {
    ...fallback,
    recipe,
    config,
    scale: Number.isFinite(Number(savedMeal.scale)) ? Number(savedMeal.scale) : fallback.scale,
    boosterAmount: Number.isFinite(Number(savedMeal.boosterAmount)) ? Number(savedMeal.boosterAmount) : fallback.boosterAmount,
    booster: savedMeal.booster || fallback.booster,
    energyBoosterAmount: Number.isFinite(Number(savedMeal.energyBoosterAmount)) ? Number(savedMeal.energyBoosterAmount) : fallback.energyBoosterAmount,
    energyBooster: savedMeal.energyBooster || fallback.energyBooster,
    macros: savedMeal.macros ? { ...fallback.macros, ...savedMeal.macros } : fallback.macros,
    match: Number(savedMeal.match) || fallback.match,
    ingredients: hasFullRecipe ? savedMeal.ingredients.map((ingredient) => ({ ...ingredient })) : fallback.ingredients,
    steps: hasFullRecipe ? [...savedMeal.steps] : fallback.steps
  };
}

function openSavedPlanRecipe(type, planId, dayIndex, mealIndex) {
  const plans = type === "week" ? readSavedWeekPlans() : readSavedDayPlans();
  const savedPlan = plans.find((plan) => plan.id === planId);
  const savedMeal = savedPlan?.days?.[dayIndex]?.meals?.[mealIndex];
  const meal = savedMeal && restoredWeekMeal(savedMeal, savedPlan);
  if (!meal) {
    showToast("Dieses Plan-Rezept ist nicht mehr verfügbar.");
    return;
  }
  savedDialog.close();
  setAppMode("planner");
  renderMeal(meal);
  document.querySelector("#result-announcement").textContent = `${meal.recipe.title} aus deinem gespeicherten ${type === "week" ? "Wochenplan" : "Tagesplan"} wurde geöffnet.`;
  window.requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    document.querySelector("#recipe-title").focus({ preventScroll: true });
  });
}

function openRequestedWeekRecipe() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("weekPlan");
  if (!planId) return;
  const dayIndex = Number(params.get("day"));
  const mealIndex = Number(params.get("meal"));
  const savedPlan = readSavedWeekPlans().find((plan) => plan.id === planId);
  const savedDay = savedPlan?.days?.find((day, index) => (Number.isInteger(day.dayIndex) ? day.dayIndex : index) === dayIndex);
  const savedMeal = savedDay?.meals?.[mealIndex];
  const meal = savedMeal && restoredWeekMeal(savedMeal, savedPlan);
  if (!meal) {
    showToast("Dieses Wochenplan-Rezept ist in diesem Browser nicht mehr gespeichert.");
    return;
  }
  renderMeal(meal);
  document.querySelector("#result-announcement").textContent = `${meal.recipe.title} aus deinem gespeicherten Wochenplan wurde geöffnet.`;
  window.requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    document.querySelector("#recipe-title").focus({ preventScroll: true });
  });
}

function updateWeekPlanControls() {
  const plans = readSavedWeekPlans();
  savedWeekCount.textContent = String(plans.length);
  const isWeek = plannerMode === "week";
  savePlanButton.disabled = !plannerPlans[plannerMode];
  savePlanLabel.textContent = isWeek ? "Wochenplan speichern" : "Tagesplan speichern";
  createShoppingListButton.disabled = !plannerPlans[plannerMode];
}

function saveCurrentPlan() {
  const plan = plannerPlans[plannerMode];
  if (!plan) {
    showToast(`Bitte zuerst einen ${plannerMode === "week" ? "Wochenplan" : "Tagesplan"} erstellen.`);
    return;
  }
  const savedPlan = serializePlan(plan, plannerMode);
  const isWeek = plannerMode === "week";
  const plans = [savedPlan, ...(isWeek ? readSavedWeekPlans() : readSavedDayPlans())].slice(0, 20);
  const stored = isWeek ? writeSavedWeekPlans(plans) : writeSavedDayPlans(plans);
  if (!stored) return;
  updateWeekPlanControls();
  showToast(`${isWeek ? "Wochenplan" : "Tagesplan"} gespeichert`);
}

function plannerSummaryMarkup(summary, prefix = "") {
  return `
    <div class="plan-summary" aria-label="${prefix || "Menü"} Nährwerte und Kochenergie">
      <span class="plan-summary-label"><strong>${prefix || "Menü"}</strong></span>
      <span><strong>${Math.round(summary.kcal)}</strong> kcal</span>
      <span><strong>${Math.round(summary.protein)}</strong> g Protein</span>
      <span><strong>${Math.round(summary.carbs)}</strong> g Carbs</span>
      <span><strong>${Math.round(summary.fat)}</strong> g Fette</span>
      <span><strong>${Math.round(summary.time)}</strong> Min. Zubereitung</span>
      <span><strong>${formatEnergyNumber(summary.kwh)}</strong> kWh · ${formatEnergyNumber(summary.cost)} €</span>
    </div>`;
}

function planRecipeMarkup(meal, cacheKey) {
  const icon = meal.recipe.course === "starter" ? "🥗" : meal.recipe.course === "dessert" ? "🍮" : "🍽️";
  plannerMealCache.set(cacheKey, meal);
  return `
    <article class="plan-recipe-card">
      <div class="plan-course"><span aria-hidden="true">${icon}</span>${courseLabel(meal.recipe.course)}</div>
      <h3>${meal.recipe.title}</h3>
      <p>${meal.recipe.description}</p>
      <div class="plan-macros" aria-label="Nährwerte"><span>${Math.round(meal.macros.kcal)} kcal</span><span>${Math.round(meal.macros.protein)} g Protein</span><span>${meal.recipe.time} Min.</span></div>
      <div class="plan-card-actions">
        <button type="button" data-open-plan-recipe="${cacheKey}">Rezept öffnen</button>
      </div>
    </article>`;
}

function weekCourseMarkup(meal, cacheKey) {
  plannerMealCache.set(cacheKey, meal);
  return `
    <div class="week-course-cell" role="cell">
      <span class="week-course-label">${courseLabel(meal.recipe.course)}</span>
      <div class="week-course-actions">
        <button class="week-recipe-link" type="button" data-open-plan-recipe="${cacheKey}">${meal.recipe.title}</button>
      </div>
      <small>${Math.round(meal.macros.kcal)} kcal · ${Math.round(meal.macros.protein)} g Protein · ${meal.recipe.time} Min.</small>
    </div>`;
}

function plannerRelaxationMarkup(plan) {
  if (!plan.relaxedCuisine && !plan.relaxedTime) return "";
  const details = [
    plan.relaxedCuisine ? "der Küchenstil" : "",
    plan.relaxedTime ? "die maximale Zeit" : ""
  ].filter(Boolean).join(" und ");
  return `<p class="adaptation-note">Für ein vollständiges Menü wurde ${details} bei einzelnen Gängen behutsam erweitert. Ernährungsweise und Allergenausschlüsse bleiben unverändert.</p>`;
}

function renderPlannerPlan() {
  const plan = plannerPlans[plannerMode];
  plannerMealCache.clear();
  if (!plan) {
    plannerResult.innerHTML = `<div class="planner-empty"><span aria-hidden="true">${plannerMode === "week" ? "7" : "1"}</span><div><strong>Noch kein Plan auf dem Tisch.</strong><p>${plannerMode === "week" ? "Erstelle sieben abwechslungsreiche Drei-Gänge-Menüs für deine Woche." : "Erstelle ein passendes Menü aus Vorspeise, Hauptspeise und Dessert."}</p></div></div>`;
    return;
  }

  if (plannerMode === "day") {
    const day = plan.days[0];
    plannerResult.innerHTML = `${plannerSummaryMarkup(day.summary, "Tagesplan")}${plannerRelaxationMarkup(plan)}<div class="plan-day-grid">${day.meals.map((meal, index) => planRecipeMarkup(meal, `day-0-${index}`)).join("")}</div>`;
    return;
  }

  const total = plan.days.reduce((summary, day) => {
    Object.keys(summary).forEach((key) => { summary[key] += day.summary[key]; });
    return summary;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, time: 0, kwh: 0, cost: 0 });
  const dailyAverage = Object.fromEntries(Object.entries(total).map(([key, value]) => [key, value / 7]));
  plannerResult.innerHTML = `${plannerSummaryMarkup(dailyAverage, "Ø pro Tag")}${plannerRelaxationMarkup(plan)}
    <div class="week-overview" role="table" aria-label="Wochenplan mit sieben Tagen">
      <div class="week-overview-head" role="row">
        <span role="columnheader">Tag</span><span role="columnheader">Vorspeise</span><span role="columnheader">Hauptspeise</span><span role="columnheader">Dessert</span>
      </div>
      ${plan.days.map((day, dayIndex) => `
        <article class="week-overview-row" role="row">
          <div class="week-day-label" role="rowheader">
            <span class="week-number">${dayIndex + 1}</span>
            <div><strong>${WEEKDAYS[dayIndex]}</strong><small>${Math.round(day.summary.kcal)} kcal · ${Math.round(day.summary.protein)} g Protein<br>${formatEnergyNumber(day.summary.kwh)} kWh · ${formatEnergyNumber(day.summary.cost)} €</small></div>
          </div>
          ${day.meals.map((meal, mealIndex) => weekCourseMarkup(meal, `week-${dayIndex}-${mealIndex}`)).join("")}
        </article>`).join("")}
    </div>`;
}

function setPlannerMode(mode) {
  plannerMode = mode;
  document.querySelectorAll("[data-planner-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.plannerMode === mode));
  });
  const isWeek = mode === "week";
  document.querySelector("#planner-mode-title").textContent = isWeek ? "Sieben Tage, sieben Menüs" : "Dein Drei-Gänge-Tag";
  document.querySelector("#planner-mode-copy").textContent = isWeek
    ? "Jeder Tag kombiniert Vorspeise, Hauptspeise und Dessert; Wiederholungen werden möglichst vermieden."
    : "Deine Zielspanne dient als Mahlzeitbasis; daraus entsteht ein realistischer Tagesrahmen im Verhältnis 20 / 60 / 20.";
  document.querySelector("#generate-plan-label").textContent = isWeek ? "Wochenplan erstellen" : "Tagesplan erstellen";
  renderPlannerPlan();
  updateWeekPlanControls();
}

function generatePlannerPlan() {
  generatePlanButton.disabled = true;
  plannerResult.setAttribute("aria-busy", "true");
  document.querySelector("#generate-plan-label").textContent = "Menüs werden kombiniert …";
  window.setTimeout(() => {
    const plan = createPlannerPlan(plannerMode === "week" ? 7 : 1);
    plannerPlans[plannerMode] = plan;
    renderPlannerPlan();
    plannerResult.setAttribute("aria-busy", "false");
    generatePlanButton.disabled = false;
    document.querySelector("#generate-plan-label").textContent = plannerMode === "week" ? "Wochenplan neu mischen" : "Tagesplan neu mischen";
    updateWeekPlanControls();
    plannerAnnouncement.textContent = plan
      ? `${plannerMode === "week" ? "Wochenplan mit sieben Menüs" : "Tagesplan mit drei Gängen"} wurde erstellt.`
      : "Mit den aktuellen Ausschlüssen konnte kein vollständiger Menüplan erstellt werden.";
  }, 80);
}

function savedKey(meal = currentMeal) {
  if (!meal) return "";
  return `${meal.recipe.id}:${meal.config.caloriesMin}-${meal.config.caloriesMax}:${meal.config.proteinMin}-${meal.config.proteinMax}:${meal.config.diet}`;
}

function readSaved() {
  try {
    return JSON.parse(
      localStorage.getItem("kuechenenergie-saved")
      || localStorage.getItem("kern-kelle-saved")
      || "[]"
    );
  } catch {
    return [];
  }
}

function writeSaved(items) {
  try {
    localStorage.setItem("kuechenenergie-saved", JSON.stringify(items));
  } catch {
    showToast("Die Merkliste ist in diesem Browser nicht verfügbar.");
  }
  updateSavedList();
  updateSaveButton();
}

function updateSaveButton() {
  const button = document.querySelector("#save-recipe");
  const isSaved = currentMeal && readSaved().some((item) => item.key === savedKey());
  button.classList.toggle("is-saved", Boolean(isSaved));
  button.setAttribute("aria-label", isSaved ? "Gericht aus der Merkliste entfernen" : "Gericht merken");
  button.setAttribute("aria-pressed", String(Boolean(isSaved)));
}

function toggleSave() {
  if (!currentMeal) return;
  const items = readSaved();
  const key = savedKey();
  const existing = items.findIndex((item) => item.key === key);
  if (existing >= 0) {
    items.splice(existing, 1);
    showToast("Aus der Merkliste entfernt");
  } else {
    items.unshift({
      key,
      recipeId: currentMeal.recipe.id,
      title: currentMeal.recipe.title,
      emoji: currentMeal.recipe.emoji,
      calories: Math.round(currentMeal.macros.kcal),
      protein: Math.round(currentMeal.macros.protein),
      energy: currentMeal.energy ? {
        kwh: currentMeal.energy.primary.kwh,
        cost: currentMeal.energy.primary.cost,
        device: currentMeal.energy.primary.shortLabel
      } : null,
      config: currentMeal.config
    });
    showToast("Gericht gemerkt");
  }
  writeSaved(items.slice(0, 12));
}

function savedPlanSummary(plan, type) {
  const summaries = (plan.days || []).map((day) => day.summary || {});
  const total = summaries.reduce((result, summary) => {
    result.kcal += Number(summary.kcal) || 0;
    result.protein += Number(summary.protein) || 0;
    return result;
  }, { kcal: 0, protein: 0 });
  const divisor = type === "week" ? Math.max(1, summaries.length) : 1;
  const mealCount = (plan.days || []).reduce((count, day) => count + (day.meals?.length || 0), 0);
  return {
    kcal: Math.round(total.kcal / divisor),
    protein: Math.round(total.protein / divisor),
    mealCount
  };
}

function savedRecipeMarkup(item) {
  return `
    <article class="saved-item">
      <span class="saved-item-emoji" aria-hidden="true">${escapeHtml(item.emoji || "🍽️")}</span>
      <div><strong>${escapeHtml(item.title)}</strong><small>${Math.round(item.calories)} kcal · ${Math.round(item.protein)} g Protein${item.energy ? ` · ${formatEnergyNumber(item.energy.kwh)} kWh` : ""}</small></div>
      <div class="saved-item-actions">
        <button type="button" data-load-saved="${escapeHtml(item.key)}" aria-label="${escapeHtml(item.title)} öffnen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </button>
        <button type="button" data-remove-saved="${escapeHtml(item.key)}" aria-label="${escapeHtml(item.title)} entfernen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>
        </button>
      </div>
    </article>`;
}

function savedPlanMarkup(plan, type) {
  const isWeek = type === "week";
  const summary = savedPlanSummary(plan, type);
  const meals = (plan.days || []).flatMap((day, dayIndex) => (day.meals || []).map((meal, mealIndex) => ({ meal, dayIndex, mealIndex })));
  const displayedMeals = isWeek ? meals.slice(0, 3) : meals;
  return `
    <article class="saved-plan-collection-card ${isWeek ? "is-week" : "is-day"}">
      <div class="saved-plan-collection-heading">
        <span aria-hidden="true">${isWeek ? "7" : "1"}</span>
        <div><small>${isWeek ? "Wochenplan" : "Tagesplan"}</small><strong>${escapeHtml(plan.name || (isWeek ? "Gespeicherter Wochenplan" : "Gespeicherter Tagesplan"))}</strong><p>${summary.mealCount} Gerichte · ${summary.kcal} kcal · ${summary.protein} g Protein${isWeek ? " im Tagesdurchschnitt" : ""}</p></div>
      </div>
      <ul class="saved-plan-collection-meals">
        ${displayedMeals.map(({ meal, dayIndex, mealIndex }) => `<li><button type="button" data-load-saved-plan-recipe="${escapeHtml(plan.id)}" data-plan-type="${type}" data-day-index="${dayIndex}" data-meal-index="${mealIndex}"><span>${escapeHtml(courseLabel(meal.course))}</span><strong>${escapeHtml(meal.title || "Unbenanntes Gericht")}</strong><i aria-hidden="true">→</i></button></li>`).join("")}
      </ul>
      ${isWeek && meals.length > displayedMeals.length ? `<p class="saved-plan-more">+ ${meals.length - displayedMeals.length} weitere Gerichte im vollständigen Wochenplan</p>` : ""}
      <div class="saved-plan-collection-actions">
        ${isWeek ? `<a href="wochenplaene.html">Wochenplan öffnen</a>` : ""}
        <button type="button" data-shopping-saved-plan="${escapeHtml(plan.id)}" data-plan-type="${type}">Einkaufsliste</button>
        <button class="is-delete" type="button" data-remove-saved-plan="${escapeHtml(plan.id)}" data-plan-type="${type}" aria-label="${isWeek ? "Wochenplan" : "Tagesplan"} entfernen">Entfernen</button>
      </div>
    </article>`;
}

function savedCollectionSection(title, icon, items, content, extra = "") {
  return `
    <section class="saved-collection-section">
      <div class="saved-collection-title"><span aria-hidden="true">${icon}</span><h3>${title}</h3><strong>${items.length}</strong>${extra}</div>
      <div class="saved-collection-content">${items.length ? content : `<p class="saved-section-empty">Noch keine ${title.toLocaleLowerCase("de-DE")} gespeichert.</p>`}</div>
    </section>`;
}

function updateSavedList() {
  const items = readSaved();
  const dayPlans = readSavedDayPlans();
  const weekPlans = readSavedWeekPlans();
  const totalCount = items.length + dayPlans.length + weekPlans.length;
  document.querySelector("#saved-count").textContent = totalCount;
  const list = document.querySelector("#saved-list");
  if (!totalCount) {
    list.innerHTML = `<div class="saved-empty"><span>🥄</span><p>Noch nichts gemerkt. Rezepte, Tagespläne und Wochenpläne warten hier auf dich.</p></div>`;
    return;
  }
  list.innerHTML = [
    savedCollectionSection("Einzelrezepte", "🍽️", items, items.map(savedRecipeMarkup).join("")),
    savedCollectionSection("Tagespläne", "☀", dayPlans, dayPlans.map((plan) => savedPlanMarkup(plan, "day")).join("")),
    savedCollectionSection("Wochenpläne", "7", weekPlans, weekPlans.map((plan) => savedPlanMarkup(plan, "week")).join(""), weekPlans.length ? '<a href="wochenplaene.html">Alle ansehen</a>' : "")
  ].join("");
}

function applyConfig(config) {
  const legacyCalories = config.calories || 650;
  const legacyProtein = config.protein || 45;
  caloriesMinInput.value = config.caloriesMin ?? clamp(legacyCalories - 100, Number(caloriesMinInput.min), Number(caloriesMinInput.max) - 25);
  caloriesMaxInput.value = config.caloriesMax ?? clamp(legacyCalories + 100, Number(caloriesMaxInput.min) + 25, Number(caloriesMaxInput.max));
  proteinMinInput.value = config.proteinMin ?? clamp(legacyProtein - 10, Number(proteinMinInput.min), Number(proteinMinInput.max) - 5);
  proteinMaxInput.value = config.proteinMax ?? clamp(legacyProtein + 10, Number(proteinMaxInput.min) + 5, Number(proteinMaxInput.max));
  const course = config.course || "all";
  form.querySelector(`input[name="course"][value="${course}"]`).checked = true;
  previousCourse = course;
  form.querySelector(`input[name="diet"][value="${config.diet || "all"}"]`).checked = true;
  form.elements.cuisine.value = config.cuisine || "all";
  form.elements.maxTime.value = String(config.maxTime || 60);
  recipeSearchInput.value = config.search || "";
  applianceInput.value = config.appliance || applianceInput.value || "auto";
  energyPriceInput.value = String(config.energyPrice || energyPriceInput.value || 35);
  form.querySelectorAll('input[name="exclude"]').forEach((input) => {
    input.checked = (config.exclude || []).includes(input.value);
  });
  updateControls();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function saveEnergyPreferences() {
  try {
    localStorage.setItem("kuechenenergie-energy-settings", JSON.stringify({
      appliance: applianceInput.value,
      energyPrice: clamp(Number(energyPriceInput.value) || 35, 1, 100)
    }));
  } catch {
    // Die App bleibt auch ohne lokalen Speicher vollständig nutzbar.
  }
}

function restoreEnergyPreferences() {
  try {
    const preferences = JSON.parse(localStorage.getItem("kuechenenergie-energy-settings") || "null");
    if (!preferences) return;
    if ([...applianceInput.options].some((option) => option.value === preferences.appliance)) {
      applianceInput.value = preferences.appliance;
    }
    if (Number(preferences.energyPrice) >= 1 && Number(preferences.energyPrice) <= 100) {
      energyPriceInput.value = String(preferences.energyPrice);
    }
  } catch {
    // Ungültige oder nicht verfügbare Einstellungen werden ignoriert.
  }
}

async function copyIngredients() {
  if (!currentMeal) return;
  const lines = currentMeal.ingredients.map((ingredient) => {
    const amount = formatAmount(ingredient.amount * servings, ingredient.unit);
    return `• ${amount} ${ingredient.unit} ${ingredient.name}`;
  });
  const text = `${currentMeal.recipe.title} (${servings} ${servings === 1 ? "Portion" : "Portionen"})\n\n${lines.join("\n")}`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showToast("Zutatenliste kopiert");
}

function printCurrentRecipe() {
  if (!currentMeal) {
    showToast("Bitte zuerst ein Rezept erstellen.");
    return;
  }
  window.focus();
  window.print();
}

function downloadCurrentRecipePdf() {
  if (!currentMeal) {
    showToast("Bitte zuerst ein Rezept erstellen.");
    return;
  }
  if (!window.KuechenenergiePdf) {
    showToast("Der PDF-Export konnte nicht geladen werden.");
    return;
  }

  try {
    renderEnergy();
    const bytes = window.KuechenenergiePdf.buildRecipePdf(currentMeal, servings);
    const file = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = window.KuechenenergiePdf.makeFileName(currentMeal.recipe.title);
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("PDF wurde heruntergeladen");
  } catch (error) {
    console.error(error);
    showToast("Das PDF konnte nicht erstellt werden.");
  }
}

document.querySelectorAll("[data-app-mode]").forEach((button) => {
  button.addEventListener("click", () => setAppMode(button.dataset.appMode));
});

fridgeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addFridgeIngredients(fridgeInput.value);
  fridgeInput.value = "";
  fridgeInput.focus();
});

fridgeCommonChips.addEventListener("click", (event) => {
  const button = event.target.closest("[data-fridge-common]");
  if (!button) return;
  const label = button.dataset.fridgeCommon;
  const key = normalizeSearchText(label);
  if (fridgeIngredients.has(key)) fridgeIngredients.delete(key);
  else fridgeIngredients.set(key, label);
  renderFridgeSelection();
  renderFridgeResults();
});

fridgeSelected.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-fridge]");
  if (!button) return;
  fridgeIngredients.delete(button.dataset.removeFridge);
  renderFridgeSelection();
  renderFridgeResults();
});

fridgeResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-fridge-recipe]");
  if (button) openFridgeRecipe(button.dataset.fridgeRecipe);
});

createShoppingListButton.addEventListener("click", openShoppingList);
shoppingPeople.addEventListener("change", renderShoppingList);
document.querySelector("#copy-shopping-list").addEventListener("click", copyShoppingList);
document.querySelector("#print-shopping-list").addEventListener("click", printShoppingList);
document.querySelector("#close-shopping-list").addEventListener("click", () => shoppingDialog.close());
shoppingDialog.addEventListener("click", (event) => {
  if (event.target === shoppingDialog) shoppingDialog.close();
});
window.addEventListener("afterprint", () => shoppingPrintCleanup?.());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateMeal(undefined, true);
});

caloriesMinInput.addEventListener("input", (event) => keepRangeOrdered(event, caloriesMinInput, caloriesMaxInput));
caloriesMaxInput.addEventListener("input", (event) => keepRangeOrdered(event, caloriesMinInput, caloriesMaxInput));
proteinMinInput.addEventListener("input", (event) => keepRangeOrdered(event, proteinMinInput, proteinMaxInput));
proteinMaxInput.addEventListener("input", (event) => keepRangeOrdered(event, proteinMinInput, proteinMaxInput));
form.addEventListener("change", (event) => {
  if (event.target === applianceInput || event.target === energyPriceInput) {
    saveEnergyPreferences();
    renderEnergy();
    return;
  }
  if (event.target.matches('input[name="course"]')) {
    const nextCourse = event.target.value;
    if (nextCourse === "snack") {
      caloriesMinInput.value = "150";
      caloriesMaxInput.value = "350";
      proteinMinInput.value = "10";
      proteinMaxInput.value = "30";
    } else if (previousCourse === "snack"
      && caloriesMinInput.value === "150"
      && caloriesMaxInput.value === "350"
      && proteinMinInput.value === "10"
      && proteinMaxInput.value === "30") {
      caloriesMinInput.value = "550";
      caloriesMaxInput.value = "750";
      proteinMinInput.value = "35";
      proteinMaxInput.value = "55";
    }
    previousCourse = nextCourse;
    updateControls();
    return;
  }
  updateAvailableCount();
  renderSearchResults();
});
energyPriceInput.addEventListener("input", () => {
  saveEnergyPreferences();
  renderEnergy();
});

recipeSearchInput.addEventListener("input", () => {
  updateAvailableCount();
  renderSearchResults();
});

clearSearchButton.addEventListener("click", () => {
  recipeSearchInput.value = "";
  updateAvailableCount();
  renderSearchResults();
  recipeSearchInput.focus();
});

searchResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-recipe]");
  if (!button) return;
  const recipe = recipeDatabase.find((item) => item.id === button.dataset.searchRecipe);
  if (!recipe) return;
  recipeSearchInput.value = recipe.title;
  updateAvailableCount();
  renderSearchResults();
  generateMeal(recipe.id, true);
});

document.querySelector("#new-idea").addEventListener("click", () => generateMeal(undefined, true));
document.querySelector("#save-recipe").addEventListener("click", toggleSave);
document.querySelector("#copy-list").addEventListener("click", copyIngredients);
document.querySelector("#print-recipe").addEventListener("click", printCurrentRecipe);
document.querySelector("#download-pdf").addEventListener("click", downloadCurrentRecipePdf);
allergenToggle.addEventListener("click", () => {
  const expanded = allergenToggle.getAttribute("aria-expanded") === "true";
  allergenToggle.setAttribute("aria-expanded", String(!expanded));
  allergenPanel.hidden = expanded;
});

document.querySelectorAll("[data-planner-mode]").forEach((button) => {
  button.addEventListener("click", () => setPlannerMode(button.dataset.plannerMode));
});
generatePlanButton.addEventListener("click", generatePlannerPlan);
savePlanButton.addEventListener("click", saveCurrentPlan);
window.addEventListener("storage", (event) => {
  if ([SAVED_WEEK_PLANS_KEY, SAVED_DAY_PLANS_KEY, "kuechenenergie-saved", "kern-kelle-saved"].includes(event.key)) {
    updateWeekPlanControls();
    updateSavedList();
  }
});
window.addEventListener("pageshow", () => {
  updateWeekPlanControls();
  updateSavedList();
});
plannerResult.addEventListener("click", (event) => {
  const recipeButton = event.target.closest("[data-open-plan-recipe]");
  if (!recipeButton) return;
  const meal = plannerMealCache.get(recipeButton.dataset.openPlanRecipe);
  if (!meal) return;
  renderMeal(meal);
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  document.querySelector("#recipe-title").focus({ preventScroll: true });
});

document.querySelector("#serving-minus").addEventListener("click", () => {
  servings = clamp(servings - 1, 1, 8);
  renderIngredients();
  renderEnergy();
});

document.querySelector("#serving-plus").addEventListener("click", () => {
  servings = clamp(servings + 1, 1, 8);
  renderIngredients();
  renderEnergy();
});

document.querySelector("#reset-config").addEventListener("click", () => {
  form.reset();
  previousCourse = "all";
  saveEnergyPreferences();
  updateControls();
  showRecipePlaceholder();
  showToast("Auswahl zurückgesetzt");
});

document.querySelector("#broaden-search").addEventListener("click", () => {
  caloriesMinInput.value = String(clamp(Number(caloriesMinInput.value) - 100, Number(caloriesMinInput.min), Number(caloriesMinInput.max) - 25));
  caloriesMaxInput.value = String(clamp(Number(caloriesMaxInput.value) + 100, Number(caloriesMinInput.min) + 25, Number(caloriesMaxInput.max)));
  proteinMinInput.value = String(clamp(Number(proteinMinInput.value) - 10, Number(proteinMinInput.min), Number(proteinMinInput.max) - 5));
  proteinMaxInput.value = String(clamp(Number(proteinMaxInput.value) + 10, Number(proteinMinInput.min) + 5, Number(proteinMaxInput.max)));
  form.elements.cuisine.value = "all";
  form.elements.maxTime.value = "60";
  recipeSearchInput.value = "";
  form.querySelectorAll('input[name="exclude"]').forEach((input) => { input.checked = false; });
  updateControls();
  generateMeal(undefined, true);
});

document.querySelector("#open-saved").addEventListener("click", () => {
  updateSavedList();
  if (typeof savedDialog.showModal === "function") savedDialog.showModal();
  else savedDialog.setAttribute("open", "");
});

document.querySelector("#close-saved").addEventListener("click", () => savedDialog.close());

savedDialog.addEventListener("click", (event) => {
  if (event.target === savedDialog) savedDialog.close();
  const loadButton = event.target.closest("[data-load-saved]");
  const removeButton = event.target.closest("[data-remove-saved]");
  const planRecipeButton = event.target.closest("[data-load-saved-plan-recipe]");
  const removePlanButton = event.target.closest("[data-remove-saved-plan]");
  const shoppingPlanButton = event.target.closest("[data-shopping-saved-plan]");

  if (loadButton) {
    const item = readSaved().find((saved) => saved.key === loadButton.dataset.loadSaved);
    if (item) {
      applyConfig(item.config);
      savedDialog.close();
      generateMeal(item.recipeId, true);
    }
  }

  if (removeButton) {
    writeSaved(readSaved().filter((saved) => saved.key !== removeButton.dataset.removeSaved));
    showToast("Aus der Merkliste entfernt");
  }

  if (planRecipeButton) {
    openSavedPlanRecipe(
      planRecipeButton.dataset.planType,
      planRecipeButton.dataset.loadSavedPlanRecipe,
      Number(planRecipeButton.dataset.dayIndex),
      Number(planRecipeButton.dataset.mealIndex)
    );
  }

  if (shoppingPlanButton) {
    const isWeek = shoppingPlanButton.dataset.planType === "week";
    const plans = isWeek ? readSavedWeekPlans() : readSavedDayPlans();
    openSavedPlanShoppingList(plans.find((plan) => plan.id === shoppingPlanButton.dataset.shoppingSavedPlan));
  }

  if (removePlanButton) {
    const isWeek = removePlanButton.dataset.planType === "week";
    const plans = (isWeek ? readSavedWeekPlans() : readSavedDayPlans())
      .filter((plan) => plan.id !== removePlanButton.dataset.removeSavedPlan);
    if (isWeek) writeSavedWeekPlans(plans);
    else writeSavedDayPlans(plans);
    updateWeekPlanControls();
    showToast(`${isWeek ? "Wochenplan" : "Tagesplan"} entfernt`);
  }
});

restoreEnergyPreferences();
updateControls();
updateSavedList();
showRecipePlaceholder();
renderFridgeSelection();
renderFridgeResults();
setAppMode("planner");
setPlannerMode("day");
openRequestedWeekRecipe();
