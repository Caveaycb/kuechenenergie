(function initializeEnergyEngine(global) {
  "use strict";

  const DEFAULT_PRICE_CENTS = 35;

  const appliances = {
    induction: {
      label: "Induktionskochfeld",
      shortLabel: "Induktion",
      energyKind: "Strom",
      activeKw: 1,
      fixedKwh: 0.02,
      heatShare: 0.64,
      minMinutes: 7,
      maxMinutes: 42,
      ecoFactor: 0.84,
      ecoLabel: "Deckel + Restwärme",
      tip: "Nutze einen passenden Topf mit Deckel und reduziere die Leistung, sobald die Speise kocht. Induktion reagiert schnell – hohe Stufen sind meist nur zum Anheizen nötig."
    },
    ceramic: {
      label: "Glaskeramikkochfeld",
      shortLabel: "Ceranfeld",
      energyKind: "Strom",
      activeKw: 1.2,
      fixedKwh: 0.04,
      heatShare: 0.67,
      minMinutes: 8,
      maxMinutes: 44,
      ecoFactor: 0.82,
      ecoLabel: "Deckel + Restwärme",
      tip: "Topf und Kochzone sollten gleich groß sein. Schalte die Platte einige Minuten vor Garende aus und nutze die gespeicherte Restwärme."
    },
    hotplate: {
      label: "Elektrokochplatte",
      shortLabel: "Kochplatte",
      energyKind: "Strom",
      activeKw: 1.38,
      fixedKwh: 0.05,
      heatShare: 0.68,
      minMinutes: 8,
      maxMinutes: 45,
      ecoFactor: 0.8,
      ecoLabel: "Deckel + Restwärme",
      tip: "Verwende ebene Töpfe, einen Deckel und die passende Plattengröße. Drehe früh herunter und nutze die lange Restwärme der Kochplatte."
    },
    oven: {
      label: "Elektrobackofen",
      shortLabel: "Backofen",
      energyKind: "Strom",
      activeKw: 0.78,
      fixedKwh: 0.28,
      heatShare: 1,
      minMinutes: 15,
      maxMinutes: 65,
      subtractMinutes: 8,
      ecoFactor: 0.82,
      ecoLabel: "Umluft ohne langes Vorheizen",
      tip: "Nutze Umluft und heize nur vor, wenn das Rezept es wirklich benötigt. Öffne die Tür möglichst selten und gare bei Gelegenheit mehrere Portionen gemeinsam."
    },
    airfryer: {
      label: "Heißluftfritteuse",
      shortLabel: "Airfryer",
      energyKind: "Strom",
      activeKw: 1.05,
      fixedKwh: 0.03,
      heatShare: 0.56,
      minMinutes: 8,
      maxMinutes: 35,
      ecoFactor: 0.9,
      ecoLabel: "Ohne Vorheizen",
      tip: "Verzichte bei kurzen Garzeiten auf das Vorheizen und fülle den Korb nur so weit, dass die heiße Luft noch gut zirkulieren kann."
    },
    microwave: {
      label: "Mikrowelle",
      shortLabel: "Mikrowelle",
      energyKind: "Strom",
      activeKw: 0.95,
      fixedKwh: 0.01,
      heatShare: 0.34,
      minMinutes: 4,
      maxMinutes: 18,
      ecoFactor: 0.9,
      ecoLabel: "Abgedeckt erwärmen",
      tip: "Decke die Speise ab, nutze ein flaches Gefäß und erwärme nur so lange wie nötig. Umrühren verkürzt bei größeren Portionen die Laufzeit."
    },
    gas: {
      label: "Gaskochfeld",
      shortLabel: "Gasherd",
      energyKind: "Gas",
      activeKw: 2.1,
      fixedKwh: 0.02,
      heatShare: 0.65,
      minMinutes: 7,
      maxMinutes: 42,
      ecoFactor: 0.84,
      ecoLabel: "Deckel + passende Flamme",
      tip: "Die Flamme sollte nicht über den Topfboden hinausragen. Nutze einen Deckel und stelle nach dem Aufkochen auf eine kleinere Flamme."
    }
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function recipeText(recipe) {
    const ingredients = (recipe.ingredients || []).map((ingredient) => (
      typeof ingredient === "string" ? ingredient : ingredient.name
    ));
    return [recipe.title, recipe.description, ...ingredients, ...(recipe.steps || [])].join(" ").toLowerCase();
  }

  function recipeModes(recipe) {
    const text = recipeText(recipe);
    return {
      oven: /backofen|\bofen\b|backen|gebacken|auflauf|gratin|crumble/.test(text),
      microwave: /mikrowelle|microwave/.test(text)
    };
  }

  function recipeSignals(recipe) {
    const text = recipeText(recipe);
    return {
      ...recipeModes(recipe),
      waterHeavy: /reis|nudel|pasta|kartoffel|suppe|brühe|wasser|linsen|bohnen|couscous|bulgur/.test(text),
      longCook: /suppe|eintopf|curry|schmor|linsen|bohnen|kartoffel|ragout/.test(text),
      onePot: /curry|suppe|eintopf|pfanne|pasta|risotto|bowl/.test(text),
      chunkable: /kartoffel|karotte|möhre|gemüse|kürbis|brokkoli|blumenkohl|rübe/.test(text),
      frozen: /tiefkühl|gefroren|\btk[ -]/.test(text)
    };
  }

  function stableHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function resolveAppliance(recipe, requested) {
    if (requested && requested !== "auto" && appliances[requested]) return requested;
    const modes = recipeModes(recipe);
    if (modes.microwave) return "microwave";
    if (modes.oven) return "oven";
    return "induction";
  }

  function compatibilityFor(recipe, requestedAppliance, resolvedAppliance) {
    if (requestedAppliance === "auto") return "automatisch erkannt";
    const modes = recipeModes(recipe);
    const cooktop = ["induction", "ceramic", "hotplate", "gas"].includes(resolvedAppliance);
    if (resolvedAppliance === "microwave" && !modes.microwave) return "Rezept nicht speziell dafür optimiert";
    if (["oven", "airfryer"].includes(resolvedAppliance) && !modes.oven) return "Rezept nicht speziell dafür optimiert";
    if (cooktop && modes.oven) return "Zubereitung gegebenenfalls anpassen";
    return "manuell gewählt";
  }

  function activeMinutes(recipe, appliance) {
    const profile = appliances[appliance];
    const totalMinutes = Math.max(5, Number(recipe.time) || 25);
    const adjustedTotal = Math.max(1, totalMinutes - (profile.subtractMinutes || 0));
    return clamp(adjustedTotal * profile.heatShare, profile.minMinutes, profile.maxMinutes);
  }

  function portionFactor(servings) {
    const portions = clamp(Math.round(Number(servings) || 1), 1, 8);
    return 1 + (portions - 1) * 0.12;
  }

  function consumptionFor(recipe, appliance, servings) {
    const profile = appliances[appliance];
    const minutes = activeMinutes(recipe, appliance);
    const consumption = (profile.fixedKwh + profile.activeKw * minutes / 60) * portionFactor(servings);
    return {
      appliance,
      label: profile.label,
      shortLabel: profile.shortLabel,
      energyKind: profile.energyKind,
      activeMinutes: Math.round(minutes),
      kwh: round(consumption, 2)
    };
  }

  function costFor(kwh, priceCents) {
    return round(kwh * priceCents / 100, 2);
  }

  function scaledAlternative(primary, label, factor, tip, strategy) {
    return {
      ...primary,
      appliance: `${primary.appliance}-${strategy}`,
      label,
      shortLabel: label,
      kwh: round(primary.kwh * factor, 2),
      strategy,
      tip
    };
  }

  function deviceAlternative(recipe, appliance, servings, label, tip, strategy, factor = 1) {
    const alternative = consumptionFor(recipe, appliance, servings);
    return {
      ...alternative,
      label,
      shortLabel: label,
      kwh: round(alternative.kwh * factor, 2),
      strategy,
      tip
    };
  }

  function alternativeCandidates(recipe, primary, servings) {
    const signals = recipeSignals(recipe);
    const profile = appliances[primary.appliance];
    const cooktop = ["induction", "ceramic", "hotplate", "gas"].includes(primary.appliance);
    const candidates = [];

    if (signals.oven && cooktop && primary.energyKind === "Strom") {
      if (servings <= 2 || recipe.course !== "main") {
        candidates.push(deviceAlternative(
          recipe,
          "airfryer",
          servings,
          "Airfryer für kleine Portionen",
          "Für ein bis zwei Portionen kann der kleinere Garraum des Airfryers schneller heiß sein. Nicht überfüllen und nach der Hälfte der Zeit prüfen.",
          "small-airfryer"
        ));
      }
      candidates.push(deviceAlternative(
        recipe,
        "oven",
        servings,
        "Umluft ohne Vorheizen",
        "Umluft verteilt die Hitze gleichmäßig. Heize nur vor, wenn Teig oder Garergebnis es wirklich verlangen, und öffne die Tür möglichst selten.",
        "fan-no-preheat",
        0.82
      ));
      return candidates;
    }

    if (!signals.oven && ["oven", "airfryer"].includes(primary.appliance)) {
      candidates.push(deviceAlternative(
        recipe,
        "induction",
        servings,
        "Passendes Kochfeld nutzen",
        "Pfannen- und Topfgerichte benötigen keinen großen Garraum. Nutze einen passenden Topf mit Deckel und reduziere die Stufe nach dem Aufheizen.",
        "right-appliance"
      ));
    }

    if (cooktop) {
      if (signals.longCook) {
        candidates.push(scaledAlternative(
          primary,
          "Schnellkochtopf",
          0.58,
          "Für Kartoffeln, Hülsenfrüchte und Schmorgerichte verkürzt ein Schnellkochtopf die Garzeit deutlich. Erst Druck aufbauen, dann die Leistung sofort reduzieren.",
          "pressure-cooker"
        ));
      }
      if (signals.waterHeavy && primary.energyKind === "Strom") {
        candidates.push(scaledAlternative(
          primary,
          "Wasserkocher fürs Kochwasser",
          0.82,
          "Erhitze nur die benötigte Wassermenge im Wasserkocher und gib sie direkt in den Topf. Das spart lange Aufheizzeit auf der Platte.",
          "kettle-water"
        ));
      }
      if (signals.onePot) {
        candidates.push(scaledAlternative(
          primary,
          "Alles in einem Topf garen",
          0.84,
          "Plane die Reihenfolge so, dass Beilage, Gemüse und Sauce nacheinander in demselben Topf garen. So bleibt nur eine Kochzone aktiv.",
          "one-pot"
        ));
      }
      if (signals.chunkable) {
        candidates.push(scaledAlternative(
          primary,
          "Zutaten kleiner schneiden",
          0.9,
          "Schneide feste Zutaten in gleichmäßig kleine Stücke. Sie garen schneller; reduziere die Temperatur, sobald alles köchelt.",
          "smaller-pieces"
        ));
      }
      candidates.push(
        scaledAlternative(
          primary,
          profile.ecoLabel,
          profile.ecoFactor,
          primary.appliance === "gas"
            ? "Setze einen Deckel auf und wähle die Flamme so, dass sie nicht über den Topfboden hinausragt. Nach dem Aufkochen reicht meist eine kleine Flamme."
            : "Verwende einen gut schließenden Deckel und schalte früh herunter. Bei Ceran und Kochplatten kannst du die gespeicherte Restwärme für die letzten Minuten nutzen.",
          "lid-residual-heat"
        ),
        scaledAlternative(
          primary,
          primary.appliance === "gas" ? "Topf und Flamme passend wählen" : "Topf und Kochzone passend wählen",
          0.9,
          primary.appliance === "gas"
            ? "Der Topfboden sollte die Flamme vollständig abdecken. Eine zu große Flamme heizt vor allem die Raumluft statt das Essen."
            : "Nutze einen ebenen Topf, dessen Boden genau zur Kochzone passt. Zu kleine Töpfe und unebene Böden verlieren unnötig Wärme.",
          "matching-pot"
        ),
        scaledAlternative(
          primary,
          primary.appliance === "gas" ? "Früh auf kleine Flamme stellen" : "Früh herunterschalten",
          0.88,
          "Nutze die höchste Stufe nur zum Anheizen. Sobald es kocht oder brät, reicht meist eine deutlich niedrigere Leistung zum Weitergaren.",
          "lower-early"
        )
      );
      if (["ceramic", "hotplate"].includes(primary.appliance)) {
        candidates.push(deviceAlternative(
          recipe,
          "induction",
          servings,
          "Induktionskochfeld",
          "Falls ohnehin ein Gerätetausch ansteht, erhitzt Induktion den Topf direkt. Für den Alltag bringen aber auch Deckel, passende Topfgröße und frühes Herunterschalten viel.",
          "induction-switch"
        ));
      }
    } else if (primary.appliance === "oven") {
      if (servings <= 2 || recipe.course !== "main") {
        candidates.push(deviceAlternative(
          recipe,
          "airfryer",
          servings,
          "Airfryer für kleine Portionen",
          "Für ein bis zwei Portionen kann der kleinere Garraum schneller heiß sein. Prüfe das Gericht etwas früher als im Backofen.",
          "small-airfryer"
        ));
      }
      candidates.push(
        scaledAlternative(
          primary,
          "Umluft ohne Vorheizen",
          0.82,
          "Nutze Umluft und verzichte auf Vorheizen, wenn das Rezept keine sofortige starke Anfangshitze braucht. Öffne die Tür während des Garens selten.",
          "fan-no-preheat"
        ),
        scaledAlternative(
          primary,
          "Backofen früher ausschalten",
          0.9,
          "Schalte den Backofen einige Minuten vor Garende aus und nutze die Restwärme. Die Tür bleibt dabei geschlossen.",
          "oven-residual-heat"
        )
      );
      if (signals.frozen) {
        candidates.push(scaledAlternative(
          primary,
          "Zutaten vorher auftauen",
          0.9,
          "Taue gefrorene Zutaten rechtzeitig im Kühlschrank auf. Dadurch muss der Backofen weniger Energie zum Durchwärmen aufbringen.",
          "defrost-first"
        ));
      }
    } else if (primary.appliance === "airfryer") {
      candidates.push(
        scaledAlternative(
          primary,
          "Airfryer ohne Vorheizen",
          0.9,
          "Bei kurzen Garzeiten kannst du meist direkt starten. Prüfe das Gericht frühzeitig und vermeide unnötige Leerlaufminuten.",
          "airfryer-no-preheat"
        ),
        scaledAlternative(
          primary,
          "Korb locker befüllen",
          0.92,
          "Lass zwischen den Stücken Platz, damit die heiße Luft zirkuliert. Ein überfüllter Korb verlängert die Garzeit.",
          "airfryer-airflow"
        )
      );
    } else if (primary.appliance === "microwave") {
      candidates.push(
        scaledAlternative(
          primary,
          "Abgedeckt im flachen Gefäß",
          0.9,
          "Ein flaches, abgedecktes Gefäß verteilt die Wärme besser und hält Feuchtigkeit im Essen. Zwischendurch einmal umrühren.",
          "microwave-covered"
        ),
        scaledAlternative(
          primary,
          "Portion flach verteilen",
          0.92,
          "Verteile die Speise ringförmig und nicht als hohen Haufen. So wird sie gleichmäßiger heiß und benötigt weniger Nachheizzeit.",
          "microwave-flat"
        )
      );
    }

    if (!candidates.length) {
      candidates.push(scaledAlternative(
        primary,
        profile.ecoLabel,
        profile.ecoFactor,
        profile.tip,
        "profile-eco"
      ));
    }
    return candidates;
  }

  function alternativeFor(recipe, primary, servings, priceCents) {
    const candidates = alternativeCandidates(recipe, primary, servings)
      .filter((candidate) => candidate.kwh < primary.kwh);
    const profile = appliances[primary.appliance];
    const fallback = scaledAlternative(
      primary,
      profile.ecoLabel,
      profile.ecoFactor,
      profile.tip,
      "profile-eco"
    );
    const usableCandidates = candidates.length ? candidates : [fallback];
    const key = `${recipe.id || recipe.title}|${primary.appliance}|${servings}`;
    const alternative = usableCandidates[stableHash(key) % usableCandidates.length];
    alternative.cost = costFor(alternative.kwh, priceCents);
    const savingsPercent = primary.kwh > 0
      ? Math.max(0, Math.round((1 - alternative.kwh / primary.kwh) * 100))
      : 0;
    return { ...alternative, savingsPercent };
  }

  function estimate(recipe, config = {}, servings = 1) {
    if (!recipe) throw new Error("Für die Energieschätzung fehlt ein Rezept.");
    const requestedAppliance = config.appliance || "auto";
    const appliance = resolveAppliance(recipe, requestedAppliance);
    const priceCents = clamp(Number(config.energyPrice) || DEFAULT_PRICE_CENTS, 1, 100);
    const primary = consumptionFor(recipe, appliance, servings);
    primary.cost = costFor(primary.kwh, priceCents);
    const alternative = alternativeFor(recipe, primary, servings, priceCents);

    return {
      requestedAppliance,
      automaticallySelected: requestedAppliance === "auto",
      compatibility: compatibilityFor(recipe, requestedAppliance, appliance),
      priceCents,
      servings: clamp(Math.round(Number(servings) || 1), 1, 8),
      primary,
      alternative,
      tip: alternative.tip,
      disclaimer: "Modellschätzung aus Geräteprofil, aktiver Garzeit und Portionszahl. Der tatsächliche Verbrauch hängt von Gerät, Topf, Temperatur und Zubereitung ab."
    };
  }

  function listAppliances() {
    return Object.entries(appliances).map(([value, profile]) => ({
      value,
      label: profile.label,
      energyKind: profile.energyKind
    }));
  }

  global.KuechenenergieEnergy = {
    DEFAULT_PRICE_CENTS,
    estimate,
    listAppliances,
    resolveAppliance
  };
}(window));
