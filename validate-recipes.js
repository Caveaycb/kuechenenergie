"use strict";

const assert = require("assert");

global.window = global;
require("./recipe-catalog.js");
require("./recipe-catalog-extension.js");
require("./recipe-quality.js");
require("./nutrition-engine.js");

const raw = global.KuechenenergieRecipeCatalog.buildRecipes();
const recipes = global.KuechenenergieQuality.prepare(raw);

function groupedCount(field) {
  return Object.fromEntries(
    Object.entries(Object.groupBy(recipes, (recipe) => recipe[field]))
      .map(([key, values]) => [key, values.length])
  );
}

function titleTokens(value) {
  const stopWords = new Set(["mit", "und", "der", "die", "das", "ein", "eine", "vom"]);
  return new Set(String(value).toLocaleLowerCase("de-DE")
    .replace(/[^a-zäöüß0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2 && !stopWords.has(word)));
}

function jaccard(first, second) {
  const union = new Set([...first, ...second]);
  if (!union.size) return 0;
  return [...first].filter((value) => second.has(value)).length / union.size;
}

function mostSimilar(getValues) {
  let result = { score: 0, first: "", second: "" };
  for (let firstIndex = 0; firstIndex < recipes.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < recipes.length; secondIndex += 1) {
      const score = jaccard(getValues(recipes[firstIndex]), getValues(recipes[secondIndex]));
      if (score > result.score) {
        result = {
          score,
          first: recipes[firstIndex].title,
          second: recipes[secondIndex].title
        };
      }
    }
  }
  return result;
}

assert.strictEqual(raw.length, 600, "Der erweiterte Katalog muss exakt 600 Grundrezepte enthalten.");
assert.strictEqual(recipes.length, 600, "Alle 600 Grundrezepte müssen die automatische Qualitätsprüfung bestehen.");
assert.deepStrictEqual(groupedCount("course"), { starter: 105, main: 395, dessert: 100 });
assert.strictEqual(new Set(recipes.map((recipe) => recipe.id)).size, 600, "Rezept-IDs müssen eindeutig sein.");
assert.strictEqual(new Set(recipes.map((recipe) => recipe.title.toLocaleLowerCase("de-DE"))).size, 600, "Titel müssen eindeutig sein.");
assert.ok(new Set(recipes.map((recipe) => recipe.family)).size >= 70, "Der Katalog benötigt mindestens 70 Zubereitungsfamilien.");
assert.strictEqual(recipes.filter((recipe) => recipe.cuisine === "saechsisch").length, 30, "Die sächsische Kategorie muss 30 eigene Grundrezepte enthalten.");

recipes.forEach((recipe) => {
  assert.strictEqual(recipe.quality.passed, true, `${recipe.title}: Qualitätsprüfung fehlgeschlagen.`);
  assert.strictEqual(recipe.quality.editorial, false, `${recipe.title}: darf ohne menschliche Freigabe nicht redaktionell geprüft heißen.`);
  assert.strictEqual(recipe.provenance.type, "original", `${recipe.title}: Herkunft fehlt.`);
  assert.strictEqual(recipe.provenance.externalContentUsed, false, `${recipe.title}: Fremdinhalt wurde markiert.`);
  assert.strictEqual(recipe.humanReview.status, "pending", `${recipe.title}: menschlicher Status muss nachvollziehbar sein.`);
  assert.ok(recipe.steps.length >= 6, `${recipe.title}: zu wenige Arbeitsschritte.`);
  assert.ok(recipe.steps.every((step) => step.length >= 35), `${recipe.title}: Arbeitsschritt zu knapp.`);
  assert.ok(recipe.ingredients.length >= 6, `${recipe.title}: Zutatenliste zu kurz.`);
  assert.ok(recipe.ingredients.every((ingredient) => ingredient.amount > 0), `${recipe.title}: Zutatenmenge muss positiv sein.`);
  const calculatedKcal = recipe.macros.protein * 4 + recipe.macros.carbs * 4 + recipe.macros.fat * 9;
  assert.ok(Math.abs(calculatedKcal - recipe.macros.kcal) <= 1, `${recipe.title}: Makros und Kalorien widersprechen sich.`);
  assert.ok(recipe.variantPolicy.proteinBooster, `${recipe.title}: Proteinvariante fehlt.`);
  assert.ok(recipe.variantPolicy.energyBooster, `${recipe.title}: Energievariante fehlt.`);
});

const titleSimilarity = mostSimilar((recipe) => titleTokens(recipe.title));
const ingredientSimilarity = mostSimilar((recipe) => new Set(
  recipe.ingredients.map((ingredient) => ingredient.name.toLocaleLowerCase("de-DE"))
));
assert.ok(titleSimilarity.score <= 0.84, `Titel zu ähnlich: ${titleSimilarity.first} / ${titleSimilarity.second}`);
assert.ok(ingredientSimilarity.score <= 0.8, `Zutatenlisten zu ähnlich: ${ingredientSimilarity.first} / ${ingredientSimilarity.second}`);

const bannedSpecialtyTerms = /seidentofu|wakame|wasabi|salsiccia|prosciutto|orzo/i;
recipes.forEach((recipe) => {
  const ingredientText = recipe.ingredients.map((ingredient) => ingredient.name).join(" ");
  assert.ok(!bannedSpecialtyTerms.test(ingredientText), `${recipe.title}: unnötig spezielle Supermarktzutat gefunden.`);
});

const saxonRecipes = recipes.filter((recipe) => recipe.cuisine === "saechsisch");
saxonRecipes.forEach((recipe) => {
  assert.ok(recipe.provenance.researchBasis, `${recipe.title}: regionale Recherchegrundlage fehlt.`);
});
assert.ok(!recipes.some((recipe) => recipe.title === "Leipziger Lerche"), "Geschützte Produktbezeichnung darf nicht als eigenes Originalrezept ausgegeben werden.");

const defaultTargets = {
  caloriesMin: 550,
  caloriesMax: 750,
  proteinMin: 35,
  proteinMax: 55
};
const adaptiveResults = recipes.map((recipe) => global.KuechenenergieNutrition.adaptRecipe(
  recipe,
  defaultTargets,
  recipe.variantPolicy.proteinBooster,
  recipe.variantPolicy.energyBooster
));
assert.ok(adaptiveResults.every((result) => result.withinTargets), "Nicht alle Grundrezepte erreichen die Standard-Makrospanne realistisch.");

const report = {
  baseRecipes: recipes.length,
  adaptiveVariants: global.KuechenenergieRecipeCatalog.stats.adaptiveVariants,
  distribution: {
    course: groupedCount("course"),
    diet: groupedCount("diet"),
    cuisine: groupedCount("cuisine")
  },
  methodFamilies: new Set(recipes.map((recipe) => recipe.family)).size,
  qualityPassed: recipes.filter((recipe) => recipe.quality.passed).length,
  defaultMacroRangeReached: adaptiveResults.filter((result) => result.withinTargets).length,
  mostSimilarTitles: titleSimilarity,
  mostSimilarIngredients: ingredientSimilarity,
  saxonResearchRecipes: saxonRecipes.length,
  provenance: "100 % Küchenenergie-Eigenentwicklung · keine übernommenen Fremdtexte oder Fremdbilder"
};

console.log(JSON.stringify(report, null, 2));
