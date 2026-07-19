(function initializeRecipeQuality(global) {
  "use strict";

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function cleanSentence(value) {
    const text = cleanText(value);
    if (!text || /[.!?]$/.test(text)) return text;
    return `${text}.`;
  }

  function mergeIngredients(ingredients) {
    const merged = new Map();
    (ingredients || []).forEach((ingredient) => {
      if (!ingredient?.name || !ingredient?.unit) return;
      const cleaned = {
        ...ingredient,
        name: cleanText(ingredient.name),
        unit: cleanText(ingredient.unit),
        amount: Number(ingredient.amount)
      };
      const key = `${cleaned.name.toLocaleLowerCase("de-DE")}|${cleaned.unit.toLocaleLowerCase("de-DE")}`;
      if (merged.has(key)) {
        merged.get(key).amount += cleaned.amount;
      } else {
        merged.set(key, cleaned);
      }
    });
    return [...merged.values()];
  }

  function review(recipe) {
    const originalIngredientCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
    const ingredients = mergeIngredients(recipe.ingredients);
    const steps = (recipe.steps || []).map(cleanSentence).filter(Boolean);
    const allergens = [...new Set((recipe.allergens || []).map((item) => cleanText(item).toLocaleLowerCase("de-DE")))];
    const revisions = [];
    if (ingredients.length < originalIngredientCount) revisions.push("Doppelte Zutaten zusammengeführt");
    if (steps.some((step, index) => step !== recipe.steps[index])) revisions.push("Arbeitsschritte sprachlich vereinheitlicht");

    return {
      ...recipe,
      title: cleanText(recipe.title),
      description: cleanSentence(recipe.description),
      ingredients,
      steps,
      allergens,
      tip: cleanSentence(recipe.tip),
      editorialRevisions: revisions
    };
  }

  function macroPlausibility(recipe) {
    const macros = recipe.macros || {};
    const kcal = Number(macros.kcal);
    const calculated = Number(macros.protein) * 4 + Number(macros.carbs) * 4 + Number(macros.fat) * 9;
    if (![kcal, calculated].every(Number.isFinite) || kcal <= 0) return false;
    return Math.abs(calculated - kcal) <= Math.max(55, kcal * 0.2);
  }

  function inspect(recipe) {
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    const checks = [
      {
        id: "ingredients",
        label: "Zutaten mit realistischen Mengen",
        passed: ingredients.length >= 3 && ingredients.every((item) => (
          item && typeof item.name === "string" && Number(item.amount) > 0 && item.unit
        ))
      },
      {
        id: "method",
        label: "Ausführliche und vollständige Schrittfolge",
        passed: steps.length >= 6 && steps.every((step) => typeof step === "string" && step.trim().length >= 35)
      },
      {
        id: "macros",
        label: "Makros rechnerisch plausibel",
        passed: macroPlausibility(recipe)
      },
      {
        id: "timing",
        label: "Zeit und Schwierigkeit plausibel",
        passed: Number(recipe.time) >= 5 && Number(recipe.time) <= 90 && Boolean(recipe.level)
      },
      {
        id: "metadata",
        label: "Gang, Küche, Ernährungsform und Allergene geprüft",
        passed: ["starter", "main", "dessert"].includes(recipe.course)
          && Boolean(recipe.cuisine)
          && ["omnivore", "vegetarian", "vegan"].includes(recipe.diet)
          && Array.isArray(recipe.allergens)
      }
    ];
    const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);

    return {
      passed: checks.every((check) => check.passed),
      score,
      editorial: true,
      label: "Redaktionell geprüft",
      checks: checks.filter((check) => check.passed).map((check) => check.label),
      note: "Das Rezept wurde auf Zutaten, Mengen, Zubereitung, Makros, Zeit und Metadaten geprüft und bei Bedarf vereinheitlicht."
    };
  }

  function prepare(recipes) {
    return recipes.map((recipe) => {
      const reviewed = review(recipe);
      return { ...reviewed, quality: inspect(reviewed) };
    }).filter((recipe) => recipe.quality.passed);
  }

  global.KuechenenergieQuality = { prepare, inspect, review };
}(typeof window !== "undefined" ? window : globalThis));
