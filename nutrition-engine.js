(function initializeNutritionEngine(global) {
  "use strict";

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.8;
  const EPSILON = 0.0001;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeMacros(macros = {}) {
    const protein = Math.max(0, Number(macros.protein) || 0);
    const carbs = Math.max(0, Number(macros.carbs) || 0);
    const fat = Math.max(0, Number(macros.fat) || 0);
    return {
      kcal: protein * 4 + carbs * 4 + fat * 9,
      protein,
      carbs,
      fat
    };
  }

  function addMacros(...parts) {
    return parts.reduce((total, part) => ({
      kcal: total.kcal + part.kcal,
      protein: total.protein + part.protein,
      carbs: total.carbs + part.carbs,
      fat: total.fat + part.fat
    }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  }

  function multiplyMacros(macros, multiplier) {
    return {
      kcal: macros.kcal * multiplier,
      protein: macros.protein * multiplier,
      carbs: macros.carbs * multiplier,
      fat: macros.fat * multiplier
    };
  }

  function targetsFrom(config) {
    const calories = Number(config.calories) || 650;
    const protein = Number(config.protein) || 45;
    return {
      caloriesMin: Number(config.caloriesMin ?? calories),
      caloriesMax: Number(config.caloriesMax ?? calories),
      proteinMin: Number(config.proteinMin ?? protein),
      proteinMax: Number(config.proteinMax ?? protein)
    };
  }

  function isWithinTargets(macros, targets) {
    return macros.kcal >= targets.caloriesMin - EPSILON
      && macros.kcal <= targets.caloriesMax + EPSILON
      && macros.protein >= targets.proteinMin - EPSILON
      && macros.protein <= targets.proteinMax + EPSILON;
  }

  function centerDistance(macros, targets) {
    const calorieCenter = (targets.caloriesMin + targets.caloriesMax) / 2;
    const proteinCenter = (targets.proteinMin + targets.proteinMax) / 2;
    const calorieWidth = Math.max(25, targets.caloriesMax - targets.caloriesMin);
    const proteinWidth = Math.max(5, targets.proteinMax - targets.proteinMin);
    return Math.abs(macros.kcal - calorieCenter) / calorieWidth
      + Math.abs(macros.protein - proteinCenter) / proteinWidth;
  }

  function candidateFrom(scale, proteinAmount, energyAmount, base, proteinExtra, energyExtra, targets) {
    const roundedProteinAmount = proteinAmount >= 7.5 ? Math.round(proteinAmount / 5) * 5 : 0;
    const roundedEnergyAmount = energyAmount >= 7.5 ? Math.round(energyAmount / 5) * 5 : 0;
    const macros = addMacros(
      multiplyMacros(base, scale),
      multiplyMacros(proteinExtra, roundedProteinAmount / 100),
      multiplyMacros(energyExtra, roundedEnergyAmount / 100)
    );
    const adjustmentScore = Math.abs(Math.log(scale)) * 22
      + (roundedProteinAmount / 100) * 8
      + (roundedEnergyAmount / 100) * 7
      + Math.max(0, roundedProteinAmount - 180) / 12
      + Math.max(0, roundedEnergyAmount - 120) / 10
      + centerDistance(macros, targets) * 1.5;
    return {
      scale,
      proteinAmount: roundedProteinAmount,
      energyAmount: roundedEnergyAmount,
      macros,
      adjustmentScore,
      withinTargets: isWithinTargets(macros, targets)
    };
  }

  function naturalCandidate(base, proteinExtra, energyExtra, targets) {
    if (!base.kcal || !base.protein) return null;
    const lower = Math.max(
      MIN_SCALE,
      targets.caloriesMin / base.kcal,
      targets.proteinMin / base.protein
    );
    const upper = Math.min(
      MAX_SCALE,
      targets.caloriesMax / base.kcal,
      targets.proteinMax / base.protein
    );
    if (lower > upper + EPSILON) return null;
    const scale = clamp(1, lower, upper);
    return candidateFrom(scale, 0, 0, base, proteinExtra, energyExtra, targets);
  }

  function adjustedCandidate(base, proteinExtra, energyExtra, proteinBooster, energyBooster, targets) {
    const determinant = proteinExtra.protein * energyExtra.kcal
      - proteinExtra.kcal * energyExtra.protein;
    if (Math.abs(determinant) < EPSILON) return null;

    const calorieMiddle = (targets.caloriesMin + targets.caloriesMax) / 2;
    const proteinMiddle = (targets.proteinMin + targets.proteinMax) / 2;
    const targetPairs = [
      [calorieMiddle, proteinMiddle],
      [targets.caloriesMin + 1, proteinMiddle],
      [targets.caloriesMax - 1, proteinMiddle],
      [calorieMiddle, targets.proteinMin + 0.2],
      [calorieMiddle, targets.proteinMax - 0.2]
    ];
    const maxProteinAmount = Number(proteinBooster.maxAmount) || 300;
    const maxEnergyAmount = Number(energyBooster.maxAmount) || 180;
    let best = null;

    targetPairs.forEach(([calorieTarget, proteinTarget]) => {
      for (let scaleStep = 50; scaleStep <= 180; scaleStep += 2) {
        const scale = scaleStep / 100;
        const remainingProtein = proteinTarget - base.protein * scale;
        const remainingCalories = calorieTarget - base.kcal * scale;
        const proteinMultiplier = (
          remainingProtein * energyExtra.kcal - remainingCalories * energyExtra.protein
        ) / determinant;
        const energyMultiplier = (
          proteinExtra.protein * remainingCalories - proteinExtra.kcal * remainingProtein
        ) / determinant;
        const proteinAmount = proteinMultiplier * 100;
        const energyAmount = energyMultiplier * 100;
        if (proteinAmount < -EPSILON || energyAmount < -EPSILON) continue;
        if (proteinAmount > maxProteinAmount || energyAmount > maxEnergyAmount) continue;
        const candidate = candidateFrom(
          scale,
          Math.max(0, proteinAmount),
          Math.max(0, energyAmount),
          base,
          proteinExtra,
          energyExtra,
          targets
        );
        if (!candidate.withinTargets) continue;
        if (!best || candidate.adjustmentScore < best.adjustmentScore) best = candidate;
      }
    });
    return best;
  }

  function oneExtraCandidate(base, proteinExtra, energyExtra, proteinBooster, energyBooster, targets) {
    const proteinTarget = (targets.proteinMin + targets.proteinMax) / 2;
    const calorieTarget = (targets.caloriesMin + targets.caloriesMax) / 2;
    const maxProteinAmount = Number(proteinBooster.maxAmount) || 300;
    const maxEnergyAmount = Number(energyBooster.maxAmount) || 180;
    let best = null;

    for (let scaleStep = 50; scaleStep <= 180; scaleStep += 1) {
      const scale = scaleStep / 100;
      const proteinAmount = Math.max(0, (proteinTarget - base.protein * scale) / proteinExtra.protein * 100);
      if (proteinAmount <= maxProteinAmount) {
        const candidate = candidateFrom(scale, proteinAmount, 0, base, proteinExtra, energyExtra, targets);
        if (candidate.withinTargets && (!best || candidate.adjustmentScore < best.adjustmentScore)) best = candidate;
      }

      const remainingCalories = calorieTarget - base.kcal * scale;
      const energyAmount = Math.max(0, remainingCalories / energyExtra.kcal * 100);
      if (energyAmount <= maxEnergyAmount) {
        const candidate = candidateFrom(scale, 0, energyAmount, base, proteinExtra, energyExtra, targets);
        if (candidate.withinTargets && (!best || candidate.adjustmentScore < best.adjustmentScore)) best = candidate;
      }
    }
    return best;
  }

  function fallbackCandidate(base, proteinExtra, energyExtra, targets) {
    const calorieTarget = (targets.caloriesMin + targets.caloriesMax) / 2;
    const scale = clamp(calorieTarget / Math.max(base.kcal, 1), MIN_SCALE, MAX_SCALE);
    return candidateFrom(scale, 0, 0, base, proteinExtra, energyExtra, targets);
  }

  function adaptRecipe(recipe, config, proteinBooster, energyBooster) {
    const targets = targetsFrom(config);
    const base = normalizeMacros(recipe.macros);
    const proteinExtra = normalizeMacros(proteinBooster.macros);
    const energyExtra = normalizeMacros(energyBooster.macros);
    const natural = naturalCandidate(base, proteinExtra, energyExtra, targets);
    const adjusted = natural || adjustedCandidate(
      base,
      proteinExtra,
      energyExtra,
      proteinBooster,
      energyBooster,
      targets
    ) || oneExtraCandidate(
      base,
      proteinExtra,
      energyExtra,
      proteinBooster,
      energyBooster,
      targets
    ) || fallbackCandidate(base, proteinExtra, energyExtra, targets);

    const ingredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: ingredient.amount * adjusted.scale
    }));
    if (adjusted.proteinAmount) {
      ingredients.push({
        name: proteinBooster.name,
        amount: adjusted.proteinAmount,
        unit: proteinBooster.unit,
        adjustmentLabel: "Protein-Extra"
      });
    }
    if (adjusted.energyAmount) {
      ingredients.push({
        name: energyBooster.name,
        amount: adjusted.energyAmount,
        unit: energyBooster.unit,
        adjustmentLabel: "Energie-Beilage"
      });
    }
    const adaptationSteps = [];
    if (adjusted.proteinAmount && proteinBooster.instruction) adaptationSteps.push(proteinBooster.instruction);
    if (adjusted.energyAmount && energyBooster.instruction) adaptationSteps.push(energyBooster.instruction);
    const recipeSteps = [...recipe.steps];
    const servingStep = recipeSteps.length ? recipeSteps.pop() : null;

    const outOfRange = (value, min, max) => {
      if (value < min) return (min - value) / Math.max(min, 1);
      if (value > max) return (value - max) / Math.max(max, 1);
      return 0;
    };
    const error = outOfRange(adjusted.macros.kcal, targets.caloriesMin, targets.caloriesMax)
      + outOfRange(adjusted.macros.protein, targets.proteinMin, targets.proteinMax);
    const match = adjusted.withinTargets
      ? clamp(Math.round(100 - Math.min(7, adjusted.adjustmentScore * 0.12)), 93, 100)
      : clamp(Math.round(88 - error * 80), 40, 88);

    return {
      recipe,
      config,
      scale: adjusted.scale,
      boosterAmount: adjusted.proteinAmount,
      booster: proteinBooster,
      energyBoosterAmount: adjusted.energyAmount,
      energyBooster,
      macros: adjusted.macros,
      match,
      withinTargets: adjusted.withinTargets,
      adjustmentScore: adjusted.adjustmentScore,
      ingredients,
      steps: [...recipeSteps, ...adaptationSteps, ...(servingStep ? [servingStep] : [])]
    };
  }

  global.KuechenenergieNutrition = {
    adaptRecipe,
    isWithinTargets,
    normalizeMacros,
    targetsFrom
  };
}(window));
