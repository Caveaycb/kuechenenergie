(function initializeRecipeVisuals(global) {
  "use strict";

  const ingredientIcons = [
    [/hähnchen|pute|chicken/, "🍗"],
    [/lachs|fisch|thunfisch|karpfen/, "🐟"],
    [/ei\b|eier|omelette/, "🥚"],
    [/feta|käse|mozzarella/, "🧀"],
    [/tofu|bohnen|linsen|kichererbsen/, "🫘"],
    [/kartoffel/, "🥔"],
    [/brokkoli|blumenkohl/, "🥦"],
    [/karotte|möhre|kürbis/, "🥕"],
    [/paprika/, "🫑"],
    [/tomate/, "🍅"],
    [/mais/, "🌽"],
    [/gurke/, "🥒"],
    [/spinat|salat|kräuter|petersilie/, "🌿"],
    [/avocado/, "🥑"],
    [/pilz|champignon/, "🍄"],
    [/zitrone|limette/, "🍋"],
    [/mango/, "🥭"],
    [/apfel/, "🍎"],
    [/kirsche/, "🍒"],
    [/beere|heidelbeere|himbeere/, "🫐"],
    [/hafer|müsli/, "🌾"],
    [/reis|couscous|bulgur/, "🍚"],
    [/nudel|pasta/, "🍝"]
  ];

  const cuisineFallbacks = {
    deutsch: ["🥔", "🥕", "🌿"],
    mediterran: ["🍅", "🍋", "🌿"],
    asiatisch: ["🥦", "🥕", "🍚"],
    mexikanisch: ["🌽", "🫑", "🍅"],
    orientalisch: ["🍋", "🫘", "🌿"],
    indisch: ["🥕", "🫑", "🍚"],
    klassisch: ["🥦", "🍅", "🌿"],
    saechsisch: ["🥔", "🍎", "🌿"]
  };

  function stableHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mainIcon(recipe) {
    const title = String(recipe.title || "").toLowerCase();
    if (recipe.course === "starter") {
      if (/suppe/.test(title)) return "🥣";
      if (/salat|schiffchen/.test(title)) return "🥗";
      if (/taler|happen/.test(title)) return "🧆";
      return "🍽️";
    }
    if (recipe.course === "dessert") {
      if (/quarkkäul|quarkkeul|plinsen/.test(title)) return "🥞";
      if (/streusel|crumble/.test(title)) return "🥧";
      if (/keks|cheese/.test(title)) return "🍰";
      if (/pudding|creme|mousse/.test(title)) return "🍮";
      return "🍨";
    }
    if (recipe.course === "snack") {
      if (/shake/.test(title)) return "🥤";
      if (/spieß/.test(title)) return "🍢";
      if (/porridge|tasse/.test(title)) return "🥣";
      if (/happen|banane|apfel|beere/.test(title)) return "🍎";
      return recipe.emoji || "🥙";
    }
    if (/bowl|salat/.test(title)) return "🥗";
    if (/curry/.test(title)) return "🍛";
    if (/pasta/.test(title)) return "🍝";
    if (/eintopf/.test(title)) return "🍲";
    if (/wrap/.test(title)) return "🌯";
    if (/risotto|reis/.test(title)) return "🍚";
    if (/nudel/.test(title)) return "🍜";
    if (/omelette|rührei/.test(title)) return "🍳";
    if (/ofen|auflauf/.test(title)) return "🥘";
    return recipe.emoji || "🍽️";
  }

  function accentIcons(recipe, main) {
    const text = [
      recipe.title,
      ...(recipe.ingredients || []).map((ingredient) => ingredient.name)
    ].join(" ").toLowerCase();
    const matches = ingredientIcons
      .filter(([pattern]) => pattern.test(text))
      .map(([, icon]) => icon)
      .filter((icon, index, icons) => icon !== main && icons.indexOf(icon) === index);
    const fallbacks = cuisineFallbacks[recipe.cuisine] || ["🥦", "🍋", "🌿"];
    fallbacks.forEach((icon) => {
      if (icon !== main && !matches.includes(icon)) matches.push(icon);
    });
    return matches.slice(0, 2);
  }

  function forRecipe(recipe) {
    const hash = stableHash(recipe.id || recipe.title || "rezept");
    const main = mainIcon(recipe);
    const accents = accentIcons(recipe, main);
    return {
      main,
      accentOne: accents[0] || "🥦",
      accentTwo: accents[1] || "🍋",
      layout: String(hash % 6),
      pattern: ["dots", "waves", "sprinkles", "orbit"][Math.floor(hash / 7) % 4]
    };
  }

  global.KuechenenergieVisuals = { forRecipe };
}(typeof window !== "undefined" ? window : globalThis));
