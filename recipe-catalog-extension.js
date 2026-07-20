(function extendRecipeCatalog(global) {
  "use strict";

  const baseCatalog = global.KuechenenergieRecipeCatalog;
  if (!baseCatalog?.buildRecipes) throw new Error("Der Grundkatalog muss vor der Erweiterung geladen werden.");

  const themes = ["sunset", "indigo", "olive", "clay", "plum"];

  function macro(protein, carbs, fat) {
    return {
      kcal: Math.round(protein * 4 + carbs * 4 + fat * 9),
      protein,
      carbs,
      fat
    };
  }

  function parseIngredients(value) {
    return value.split(";").map((entry) => {
      const [name, amount, unit] = entry.split("|");
      return { name: name.trim(), amount: Number(amount), unit: unit.trim() };
    });
  }

  function inferAllergens(ingredients) {
    const text = ingredients.map((item) => item.name).join(" ").toLocaleLowerCase("de-DE");
    const allergens = [];
    if (/brot|toast|brötchen|mehl|panier|couscous|bulgur|pasta|spaghetti|nudel|gnocchi|wrap|tortilla|hafer|grieß|semmel/.test(text)) allergens.push("gluten");
    if (/joghurt|skyr|quark|feta|halloumi|mozzarella|frischkäse|milch|butter|parmesan|hüttenkäse|schmand|buttermilch/.test(text)) allergens.push("laktose");
    if (/walnuss|cashew|mandel|haselnuss|nussmus|marzipan/.test(text)) allergens.push("nüsse");
    if (/tofu|sojajoghurt|sojasauce|tempeh/.test(text)) allergens.push("soja");
    if (/lachs|fisch|thunfisch|kabeljau|seelachs|garnele|karpfen/.test(text)) allergens.push("fisch");
    if (/\bei\b|eier|rührei|eiklar/.test(text)) allergens.push("ei");
    if (/senf/.test(text)) allergens.push("senf");
    if (/sellerie/.test(text)) allergens.push("sellerie");
    if (/sesam|tahin|hummus/.test(text)) allergens.push("sesam");
    if (/erdnuss/.test(text)) allergens.push("erdnüsse");
    if (/garnele|krebs|scampi/.test(text)) allergens.push("krebstiere");
    return allergens;
  }

  const boosterDefinitions = {
    chicken: ["Hähnchenbrust", "g", 250, "Die zusätzliche Hähnchenbrust passend schneiden, würzen und vollständig durchgaren.", [23, 0, 1.5]],
    turkey: ["Putenbrust", "g", 250, "Die zusätzliche Putenbrust gleichmäßig schneiden, kräftig anbraten und vollständig durchgaren.", [24, 0, 1]],
    beef: ["Mageres Rindfleisch", "g", 220, "Das zusätzliche Rindfleisch portionsweise anbraten und erst zum Schluss wieder zum Gericht geben.", [21, 0, 5]],
    fish: ["Seelachsfilet", "g", 220, "Das zusätzliche Seelachsfilet würzen, schonend garen und in saftigen Stücken ergänzen.", [20, 0, 1]],
    egg: ["Ei", "g", 180, "Das zusätzliche Ei verquirlen und passend zum Gericht vollständig stocken lassen.", [13, 1, 10]],
    skyr: ["Skyr", "g", 300, "Den zusätzlichen Skyr mit den Kräutern oder Gewürzen des Rezepts glatt rühren und als Dip servieren.", [11, 4, 0.2]],
    cottage: ["Körniger Frischkäse", "g", 260, "Den zusätzlichen körnigen Frischkäse abtropfen lassen und erst beim Anrichten ergänzen.", [12, 3, 4]],
    tofu: ["Naturtofu", "g", 280, "Den zusätzlichen Tofu trocken tupfen, würfeln und rundum goldbraun braten.", [15, 5, 8]],
    lentils: ["Gekochte Linsen", "g", 300, "Die zusätzlichen Linsen abspülen, abtropfen lassen und während der letzten Garphase erhitzen.", [9, 20, 0.5]],
    dessert: ["Magerquark", "g", 300, "Den zusätzlichen Magerquark mit etwas Flüssigkeit und den Aromazutaten cremig rühren.", [12, 4, 0.3]],
    dessertVegan: ["Veganes Proteinpulver, neutral", "g", 70, "Das Proteinpulver mit Pflanzendrink glatt rühren und klümpchenfrei einarbeiten.", [72, 8, 7]]
  };

  const energyDefinitions = {
    rice: ["Langkornreis (Trockengewicht)", "g", 150, "Den zusätzlichen Reis mit Deckel garen, ausdampfen lassen und als Beilage servieren.", [7.5, 78, 1]],
    potato: ["Kartoffeln", "g", 350, "Die zusätzlichen Kartoffeln gleichmäßig schneiden und passend kochen, backen oder anbraten.", [2, 17, 0.1]],
    pasta: ["Pasta (Trockengewicht)", "g", 140, "Die zusätzliche Pasta bissfest garen und mit etwas Kochwasser in der Sauce fertigziehen.", [12, 70, 2]],
    couscous: ["Couscous (Trockengewicht)", "g", 140, "Den zusätzlichen Couscous mit heißer Flüssigkeit übergießen, quellen lassen und auflockern.", [12, 72, 2]],
    bread: ["Vollkornbrot", "g", 180, "Das zusätzliche Vollkornbrot in Scheiben schneiden, kurz rösten und zum Gericht reichen.", [8, 43, 2]],
    oats: ["Haferflocken", "g", 150, "Die zusätzlichen Haferflocken einarbeiten und ausreichend Flüssigkeit sowie Quellzeit einplanen.", [13, 59, 7]],
    fruit: ["Zusätzliches Obst", "g", 300, "Das zusätzliche Obst vorbereiten und frisch, gedünstet oder gebacken ergänzen.", [0.5, 13, 0.2]]
  };

  function booster(definition) {
    const [name, unit, maxAmount, instruction, values] = definition;
    return { name, unit, maxAmount, instruction, macros: macro(...values) };
  }

  function slug(value) {
    return value.toLocaleLowerCase("de-DE")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function emojiFor(recipe) {
    if (recipe.course === "starter") return recipe.family.includes("soup") ? "🥣" : "🥗";
    if (recipe.course === "dessert") return recipe.family.includes("pancake") ? "🥞" : recipe.family.includes("baked") || recipe.family.includes("cake") ? "🥧" : "🍮";
    if (recipe.course === "snack") {
      if (/shake/.test(recipe.family)) return "🥤";
      if (/sweet|mug/.test(recipe.family)) return "🍎";
      if (/skewer/.test(recipe.family)) return "🍢";
      return "🥙";
    }
    if (/curry|stew|soup/.test(recipe.family)) return "🍲";
    if (/pasta|noodle/.test(recipe.family)) return "🍝";
    if (/rice|bowl/.test(recipe.family)) return "🍚";
    if (/fish/.test(recipe.family)) return "🐟";
    return "🍽️";
  }

  function starterSteps(recipe) {
    const [first, second, third] = recipe.ingredients.map((item) => item.name);
    if (recipe.family.includes("soup")) return [
      `${first}, ${second} und die weiteren Gemüsezutaten gründlich waschen, putzen und in ähnlich große Stücke schneiden.`,
      `Zwiebel und feste Gemüsebestandteile in einem ausreichend großen Topf bei mittlerer Hitze mit wenig Öl glasig anschwitzen.`,
      `${first} und ${second} ergänzen, kurz mitrösten und anschließend die abgemessene Brühe vollständig angießen.`,
      `Alles einmal aufkochen und danach mit aufgelegtem Deckel sanft garen, bis die festeste Zutat weich geworden ist.`,
      `Je nach gewünschter Konsistenz einen Teil der Suppe pürieren oder mit einem Kartoffelstampfer leicht sämig drücken.`,
      `Die Suppe mit Kräutern, Pfeffer und einer kleinen Menge Säure abschmecken und die Konsistenz bei Bedarf korrigieren.`,
      `${recipe.title} in vorgewärmte Schalen füllen, die frische Garnitur darübergeben und direkt servieren.`
    ];
    if (recipe.family.includes("salad")) return [
      `${first}, ${second} und ${third} getrennt vorbereiten, gründlich abtropfen lassen und in gut essbare Stücke schneiden.`,
      `Feste oder gegarte Bestandteile zunächst in einer weiten Schüssel verteilen, damit sie vollständig auskühlen können.`,
      `Aus Essig oder Zitrone, Öl, Kräutern und den vorgesehenen Gewürzen ein gleichmäßiges Dressing verrühren.`,
      `${first} und ${second} mit dem Dressing vermengen und fünf Minuten ziehen lassen, damit sich die Aromen verbinden.`,
      `${third} sowie empfindliche Blätter erst kurz vor dem Essen locker unterheben, damit der Salat knackig bleibt.`,
      `Den Salat probieren und mit Salz, Pfeffer oder einem weiteren Spritzer Säure ausgewogen nachwürzen.`,
      `${recipe.title} auf kleinen Tellern anrichten, die knusprige Komponente zuletzt ergänzen und frisch servieren.`
    ];
    if (recipe.family.includes("toast")) return [
      `${first}, ${second} und die weiteren Zutaten vollständig vorbereiten und das Vollkornbrot gleichmäßig portionieren.`,
      `${first} je nach Zutat fein schneiden oder zerdrücken und mit Kräutern sowie der vorgesehenen cremigen Komponente verrühren.`,
      `${second} getrennt vorbereiten und nur leicht würzen, damit sein eigener Geschmack klar erkennbar bleibt.`,
      `Die Brotscheiben in einer Pfanne oder im Toaster rösten, bis die Oberfläche knusprig und die Mitte noch weich ist.`,
      `Die Creme abschmecken und erst unmittelbar vor dem Servieren gleichmäßig auf den warmen Brotscheiben verteilen.`,
      `${second} und die übrigen frischen Zutaten locker auflegen, ohne die geröstete Oberfläche vollständig zu bedecken.`,
      `${recipe.title} mit Kräutern vollenden und sofort servieren, solange das Brot noch knusprig ist.`
    ];
    return [
      `${first}, ${second} und ${third} waschen, trocken tupfen und für eine gleichmäßige Garung passend portionieren.`,
      `Den Backofen oder die Pfanne rechtzeitig erhitzen und ein Blech beziehungsweise eine beschichtete Pfanne vorbereiten.`,
      `${first} mit wenig Öl und Gewürzen mischen und so verteilen, dass die Stücke nicht übereinanderliegen.`,
      `${second} nach der ersten Garphase ergänzen und alles wenden, sobald die Unterseite sichtbar gebräunt ist.`,
      `Die Hauptzutaten vollständig garen und an mehreren Stücken prüfen, ob sie innen weich und außen gebräunt sind.`,
      `${third} zu einem frischen Dip oder einer Garnitur verarbeiten und die Würzung abschließend ausbalancieren.`,
      `${recipe.title} lauwarm anrichten, den Dip getrennt dazugeben und die knusprigen Stellen nach oben legen.`
    ];
  }

  function mainSteps(recipe) {
    const [protein, side, firstVegetable, secondVegetable] = recipe.ingredients.map((item) => item.name);
    const family = recipe.family;
    if (family.includes("curry") || family.includes("stew")) return [
      `${protein}, ${side}, ${firstVegetable} und ${secondVegetable} vollständig vorbereiten und in ähnlich große Stücke schneiden.`,
      `Aromatische Grundzutaten in einem schweren Topf mit wenig Öl anschwitzen und die vorgesehenen Gewürze kurz mitrösten.`,
      `${protein} zugeben und je nach Zutat anbraten oder kurz mit den Gewürzen vermengen, ohne den Topfboden zu überfüllen.`,
      `${firstVegetable}, ${secondVegetable} und die Sauce ergänzen, einmal aufkochen und anschließend die Hitze deutlich reduzieren.`,
      `${side} nach Packungsangabe oder direkt im Topf garen und regelmäßig prüfen, damit die Beilage nicht zu weich wird.`,
      `Die Garstufe der Hauptzutat kontrollieren, die Sauce bei Bedarf offen einkochen und mit Salz sowie Säure abschmecken.`,
      `${recipe.title} einige Minuten ruhen lassen, mit frischen Kräutern vollenden und in tiefen Tellern servieren.`
    ];
    if (family.includes("oven") || family.includes("gratin") || family.includes("baked")) return [
      `Den Backofen vorheizen und ${protein}, ${side}, ${firstVegetable} sowie ${secondVegetable} gleichmäßig vorbereiten.`,
      `${side} und länger garende Zutaten zuerst mit wenig Öl und Gewürzen in einer ausreichend großen Form verteilen.`,
      `${protein} würzen und zusammen mit ${firstVegetable} so ergänzen, dass möglichst wenig übereinanderliegt.`,
      `Das Gericht backen und nach der Hälfte der Garzeit wenden oder die Form drehen, damit alles gleichmäßig bräunt.`,
      `${secondVegetable} oder empfindliche Zutaten später ergänzen und die vollständige Garung an mehreren Stellen prüfen.`,
      `Sauce und Würzung ausbalancieren und das fertige Gericht drei Minuten außerhalb des Ofens ruhen lassen.`,
      `${recipe.title} auf vorgewärmte Teller verteilen, frische Kräuter darübergeben und heiß servieren.`
    ];
    if (family.includes("fish")) return [
      `${protein} trocken tupfen und auf mögliche Gräten prüfen; ${side}, ${firstVegetable} und ${secondVegetable} vorbereiten.`,
      `${side} zuerst mit Deckel oder im Ofen garen, weil die Beilage in der Regel länger als das Fischfilet benötigt.`,
      `${firstVegetable} und ${secondVegetable} bei mittlerer Hitze bissfest garen und anschließend warm halten.`,
      `${protein} würzen und schonend braten oder dünsten, bis sich das Filet leicht teilen lässt und innen saftig bleibt.`,
      `Die vorgesehene Sauce im Bratensatz ansetzen und nur sanft erhitzen, damit sie glatt bleibt und nicht gerinnt.`,
      `Fisch, Beilage und Gemüse abschmecken und besonders die Garstufe an der dicksten Stelle noch einmal kontrollieren.`,
      `${recipe.title} behutsam anrichten, Sauce seitlich angießen und ohne weitere Wartezeit servieren.`
    ];
    if (family.includes("pasta") || family.includes("noodle")) return [
      `${protein}, ${firstVegetable} und ${secondVegetable} vorbereiten und für ${side} einen ausreichend großen Topf Wasser aufsetzen.`,
      `${side} knapp bissfest garen und vor dem Abgießen eine Tasse Kochwasser für die spätere Sauce zurückbehalten.`,
      `${protein} in einer breiten Pfanne anbraten oder rösten, anschließend herausnehmen und kurz warm halten.`,
      `${firstVegetable} und ${secondVegetable} im Bratensatz garen und mit der vorgesehenen Sauce ablöschen.`,
      `${side} und ${protein} in die Pfanne geben und alles mit etwas Kochwasser cremig miteinander verbinden.`,
      `Die Garstufe prüfen und die Sauce mit Salz, Pfeffer, Kräutern und einer kleinen Menge Säure ausbalancieren.`,
      `${recipe.title} sofort auf tiefe Teller verteilen und die frische Garnitur erst beim Servieren ergänzen.`
    ];
    return [
      `${protein} trocken tupfen beziehungsweise abtropfen lassen und ${side}, ${firstVegetable} sowie ${secondVegetable} vorbereiten.`,
      `${side} mit der passenden Wassermenge und einem Deckel garen, anschließend kurz ausdampfen lassen und auflockern.`,
      `${protein} portionsweise in einer heißen Pfanne kräftig anbraten und danach kurz aus der Pfanne nehmen.`,
      `${firstVegetable} und ${secondVegetable} im Bratensatz bissfest garen und die vorgesehene Sauce oder Würze ergänzen.`,
      `${protein} zurückgeben und alles vollständig erhitzen, ohne die Hauptzutat oder das Gemüse trocken zu garen.`,
      `Die Garstufe kontrollieren und das Gericht mit Salz, Pfeffer, Kräutern sowie einer kleinen Menge Säure abschmecken.`,
      `${recipe.title} mit der Beilage auf vorgewärmten Tellern anrichten und direkt servieren.`
    ];
  }

  function dessertSteps(recipe) {
    const [base, fruit, third] = recipe.ingredients.map((item) => item.name);
    if (recipe.family.includes("cream")) return [
      `${base}, ${fruit} und die weiteren Zutaten abwiegen und gekühlte Bestandteile bis zur Verarbeitung kalt stellen.`,
      `${fruit} waschen oder abtropfen lassen, einen Teil fein pürieren und den Rest in gut essbare Stücke schneiden.`,
      `${base} mit Vanille, Zimt oder Zitrusschale glatt rühren und die Süße erst nach und nach dosieren.`,
      `Das Fruchtpüree nur kurz unterziehen, damit eine sichtbare Marmorierung und eine lockere Konsistenz erhalten bleiben.`,
      `${third} beziehungsweise die knusprige Komponente getrennt rösten oder zerbröseln und vollständig abkühlen lassen.`,
      `Die Creme probieren, mit Frucht und Säure ausbalancieren und bis zum Servieren zugedeckt kalt stellen.`,
      `${recipe.title} in Gläser füllen, Fruchtstücke und Crunch zuletzt ergänzen und direkt servieren.`
    ];
    if (recipe.family.includes("pudding")) return [
      `${base}, ${fruit}, ${third} und die übrigen Zutaten vollständig abwiegen und einen Schneebesen bereitlegen.`,
      `Stärke oder Grieß zunächst mit einem Teil der kalten Flüssigkeit glatt rühren, damit keine Klümpchen entstehen.`,
      `Die restliche Flüssigkeit erhitzen und die angerührte Mischung unter ständigem Rühren langsam einlaufen lassen.`,
      `Den Pudding bei kleiner Hitze so lange rühren, bis er sichtbar bindet und keine mehlige Note mehr vorhanden ist.`,
      `${fruit} getrennt kurz erwärmen oder frisch vorbereiten und mit Zimt, Vanille oder Zitrone abschmecken.`,
      `Den Pudding kurz abkühlen lassen und dabei gelegentlich umrühren, damit sich keine feste Haut bildet.`,
      `${recipe.title} in Schalen verteilen, die Fruchtkomponente daraufgeben und warm oder gekühlt servieren.`
    ];
    if (recipe.family.includes("pancake")) return [
      `${base}, ${fruit}, ${third} und die weiteren Teigzutaten vollständig abwiegen und getrennt bereitstellen.`,
      `Die feuchten Zutaten glatt rühren, trockene Bestandteile kurz unterheben und den Teig fünf Minuten quellen lassen.`,
      `${fruit} waschen oder schälen und je nach Rezept würfeln, in Scheiben schneiden oder kurz zu Kompott dünsten.`,
      `Eine beschichtete Pfanne auf mittlere Hitze bringen und pro Küchlein eine kleine Portion Teig hineingeben.`,
      `Die Küchlein erst wenden, wenn die Oberfläche Blasen zeigt und der Rand sichtbar stabil geworden ist.`,
      `Die zweite Seite goldbraun fertig backen, ein Probestück öffnen und die Hitze bei Bedarf etwas reduzieren.`,
      `${recipe.title} mit der Fruchtbeilage anrichten, leicht bestäuben und möglichst frisch servieren.`
    ];
    return [
      `Den Backofen rechtzeitig vorheizen und ${base}, ${fruit}, ${third} sowie die übrigen Zutaten vollständig abwiegen.`,
      `${fruit} waschen oder schälen, gleichmäßig schneiden und in einer passenden Form flach verteilen.`,
      `${base} mit den feuchten Zutaten verrühren und trockene Bestandteile nur so lange einarbeiten, bis alles verbunden ist.`,
      `Die Masse beziehungsweise Streusel gleichmäßig über der Frucht verteilen und die Oberfläche nicht festdrücken.`,
      `Das Dessert backen, bis die Oberfläche goldbraun ist und die Mitte bei einer Garprobe nicht mehr flüssig wirkt.`,
      `Die Form aus dem Ofen nehmen und das Dessert mindestens fünf Minuten ruhen lassen, damit es sich stabilisiert.`,
      `${recipe.title} warm oder lauwarm portionieren, die kühle Creme getrennt dazugeben und servieren.`
    ];
  }

  function snackSteps(recipe) {
    const [first, second, third] = recipe.ingredients.map((item) => item.name);
    if (recipe.family.includes("shake")) return [
      `${first}, ${second}, ${third} und die übrigen Zutaten vollständig abwiegen und einen hohen Mixbecher bereitstellen.`,
      `Frisches Obst waschen oder schälen, in kleine Stücke schneiden und für eine cremige Konsistenz gut vorkühlen.`,
      `Zuerst die flüssigen Zutaten, anschließend die festen Bestandteile in den Mixbecher geben, damit nichts am Boden haftet.`,
      `Alles in kurzen Intervallen fein pürieren und den Mixer zwischendurch ausschalten, um die Konsistenz zu kontrollieren.`,
      `Den Snack probieren und nur bei Bedarf mit etwas Wasser verdünnen oder mit Zimt beziehungsweise Kakao abrunden.`,
      `Den fertigen Shake in ein Glas füllen, die zurückbehaltene Garnitur auflegen und unmittelbar frisch servieren.`
    ];
    if (recipe.family.includes("oven") || recipe.family.includes("mug")) return [
      `Backofen oder Mikrowelle passend vorheizen und ${first}, ${second}, ${third} sowie alle weiteren Zutaten genau abwiegen.`,
      `Feste Zutaten gleichmäßig klein schneiden und feuchte Bestandteile in einer Schüssel oder Tasse sorgfältig verrühren.`,
      `Die übrigen Zutaten kurz unterheben, bis eine gleichmäßige Masse entsteht, ohne sie unnötig lange zu bearbeiten.`,
      `Die Mischung flach verteilen und so garen, dass die Oberfläche Farbe bekommt, der Snack innen aber saftig bleibt.`,
      `An einer dicken Stelle prüfen, ob alles vollständig gegart ist, und die Garzeit bei Bedarf minutenweise verlängern.`,
      `Den Snack kurz ruhen lassen, abschließend würzen oder garnieren und warm beziehungsweise lauwarm servieren.`
    ];
    if (recipe.family.includes("pan")) return [
      `${first}, ${second}, ${third} und die weiteren Zutaten vorbereiten und in Griffweite neben der Pfanne bereitstellen.`,
      `Eine kleine beschichtete Pfanne auf mittlere Hitze bringen und nur die im Rezept vorgesehene Fettmenge verwenden.`,
      `Zuerst die länger garenden Zutaten hineingeben und gleichmäßig verteilen, damit sie zuverlässig Farbe annehmen.`,
      `Die restlichen Zutaten ergänzen und unter regelmäßigem Wenden garen, ohne den Pfannenboden unnötig zu überfüllen.`,
      `Die Garstufe kontrollieren und den Snack mit Salz, Pfeffer, Kräutern oder einer kleinen Menge Säure abschmecken.`,
      `Den Pfannensnack auf einem kleinen Teller anrichten, kurz abkühlen lassen und möglichst frisch genießen.`
    ];
    if (recipe.family.includes("skewer") || recipe.family.includes("roll")) return [
      `${first}, ${second}, ${third} und die übrigen Zutaten gründlich vorbereiten und auf einer sauberen Fläche bereitlegen.`,
      `Gemüse oder Obst in ähnlich große, gut essbare Stücke schneiden und feuchte Zutaten sorgfältig trocken tupfen.`,
      `Den cremigen Bestandteil glatt rühren, zurückhaltend würzen und dünn aufstreichen beziehungsweise separat bereitstellen.`,
      `Die Zutaten abwechselnd auf kurze Spieße stecken oder kompakt aufrollen, damit jede Portion sicher zusammenhält.`,
      `Alle Stücke auf gleichmäßige Größe und einen festen Sitz prüfen und empfindliche Zutaten erst zuletzt ergänzen.`,
      `Den Snack auf einer kleinen Platte anrichten, mit Kräutern vollenden und sofort oder gut gekühlt servieren.`
    ];
    return [
      `${first}, ${second}, ${third} und die weiteren Zutaten vollständig abwiegen und gekühlte Bestandteile kalt stellen.`,
      `Obst oder Gemüse waschen, trocken tupfen und in gleichmäßige, gut essbare Stücke beziehungsweise Scheiben schneiden.`,
      `Die cremige Basis mit Gewürzen, Kräutern oder Zitrone glatt rühren und die Würzung zunächst zurückhaltend dosieren.`,
      `Die vorbereiteten Zutaten locker miteinander verbinden oder übersichtlich in einem kleinen Glas beziehungsweise Becher schichten.`,
      `Den Snack probieren, Süße, Säure und Salz ausbalancieren und knusprige Zutaten erst ganz zum Schluss ergänzen.`,
      `${recipe.title} kompakt anrichten, bis zum Verzehr kühl stellen und innerhalb kurzer Zeit frisch genießen.`
    ];
  }

  function saxonSteps(recipe) {
    const title = recipe.title;
    if (recipe.course === "starter") return starterSteps(recipe);

    if (title.includes("Leipziger Allerlei")) return [
      "Kartoffeln schälen und in gleich große Stücke schneiden; Möhren, Kohlrabi, Blumenkohl, Spargel und Champignons getrennt vorbereiten.",
      "Die Kartoffeln in wenig Salzwasser mit Deckel garen, anschließend abgießen, ausdampfen lassen und mit Petersilie mischen.",
      "Möhren und Kohlrabi zuerst in einer breiten Pfanne mit wenig Brühe bissfest dünsten, weil sie am längsten benötigen.",
      "Blumenkohl und Spargel zeitlich versetzt ergänzen und nur so lange garen, dass Form, Farbe und leichter Biss erhalten bleiben.",
      "Die Champignons separat kräftig anbraten und erst zum Schluss zusammen mit dem körnigen Frischkäse unter das Gemüse heben.",
      "Das Allerlei mit Muskat, Salz, Pfeffer und Petersilie abschmecken und bei Bedarf mit wenigen Löffeln Gemüsebrühe binden.",
      "Leipziger Allerlei mit Petersilienkartoffeln auf vorgewärmten Tellern anrichten und die Gemüse klar erkennbar verteilen."
    ];
    if (title.includes("grüne Klöße")) return [
      "Die rohen Kartoffeln fein reiben, in einem sauberen Tuch sehr kräftig ausdrücken und die aufgefangene Kartoffelstärke absetzen lassen.",
      "Die gekochten Kartoffeln fein pressen und mit der ausgedrückten Rohmasse sowie der abgesetzten Stärke gründlich vermengen.",
      "Aus der Kartoffelmasse mit feuchten Händen gleich große Klöße formen und einen Probekloß in siedendem Salzwasser gar ziehen lassen.",
      "Bleibt der Probekloß stabil, die übrigen Klöße einlegen und ohne sprudelndes Kochen ziehen lassen, bis sie an die Oberfläche steigen.",
      "Für das Ragout die Champignons portionsweise kräftig bräunen, Zwiebel ergänzen und anschließend mit Hafercuisine ablöschen.",
      "Das Pilzragout offen einkochen, mit Petersilie, Salz und Pfeffer abschmecken und die Klöße vorsichtig aus dem Wasser heben.",
      "Vogtländische grüne Klöße mit reichlich Pilzragout anrichten und unmittelbar nach dem Garen heiß servieren."
    ];
    if (title.includes("Wickelklöße")) return [
      "Kartoffeln weich garen, vollständig ausdampfen lassen und noch warm durch eine Kartoffelpresse in eine große Schüssel drücken.",
      "Kartoffeln mit Mehl und Ei zügig zu einem formbaren Teig verkneten, ohne die Masse länger als nötig zu bearbeiten.",
      "Den Teig auf einer leicht bemehlten Fläche rechteckig ausrollen, dünn mit Butter bestreichen und mit Semmelbröseln bestreuen.",
      "Die Teigplatte straff aufrollen, in gleich große Stücke schneiden und einen Probekloß in nur siedendem Salzwasser gar ziehen lassen.",
      "Die übrigen Wickelklöße bei sanfter Hitze garen; währenddessen Champignons und Zwiebel kräftig anbraten und die Sauce ansetzen.",
      "Die Champignonsauce mit Hafercuisine einkochen, mit Petersilie abschmecken und die gegarten Klöße vorsichtig abtropfen lassen.",
      "Sächsische Wickelklöße mit Champignonsauce auf tiefen Tellern anrichten und frisch aus dem Kochwasser servieren."
    ];
    if (title.includes("Bambes") || title.includes("Klitscher")) return [
      "Kartoffeln schälen, grob reiben und in einem sauberen Tuch sehr gründlich ausdrücken, damit die Masse nicht wässrig bleibt.",
      "Die Kartoffelraspel mit Ei, dem vorgesehenen Bindemittel, Salz und Pfeffer mischen und fünf Minuten quellen lassen.",
      "Magerquark mit Schnittlauch, wenig Wasser, Salz und Pfeffer glatt rühren und den Dip bis zum Servieren kühl stellen.",
      "Gurke und Radieschen vorbereiten, leicht würzen und erst kurz vor dem Essen mit dem frischen Dressing vermengen.",
      "Aus der Kartoffelmasse kleine flache Puffer formen und in einer beschichteten Pfanne bei mittlerer Hitze goldbraun braten.",
      "Die Puffer erst wenden, wenn die Unterseite vollständig stabil ist, und anschließend auf Küchenpapier kurz abtropfen lassen.",
      `${title} mit dem kalten Kräuterquark und dem knackigen Salat anrichten und sofort servieren.`
    ];
    if (title.includes("Teichelmauke")) return [
      "Rindfleisch, Möhre, Sellerie und Zwiebel in gleich große Stücke schneiden und in einem schweren Topf kräftig anrösten.",
      "Rinderbrühe angießen, einmal aufkochen und das Fleisch anschließend bei kleiner Hitze zugedeckt weich schmoren.",
      "Kartoffeln separat in Salzwasser garen, vollständig abgießen und mit einem Kartoffelstampfer locker zerdrücken.",
      "Das weich gegarte Fleisch aus der Brühe heben, in mundgerechte Stücke schneiden und zugedeckt warm halten.",
      "Die Brühe durch ein Sieb gießen, Gemüse nach Wunsch zurückgeben und mit Salz, Pfeffer sowie Petersilie abschmecken.",
      "Den Kartoffelstampf auf tiefe Teller geben und in der Mitte eine deutliche Mulde für Brühe und Fleisch formen.",
      "Oberlausitzer Teichelmauke mit heißer Brühe und Rindfleisch füllen, mit Petersilie bestreuen und direkt servieren."
    ];
    if (title.includes("Senfeier")) return [
      "Kartoffeln schälen, in gleich große Stücke schneiden und in wenig Salzwasser mit aufgelegtem Deckel weich garen.",
      "Die Eier in einem zweiten Topf wachsweich bis hart kochen, kalt abschrecken, vorsichtig pellen und halbieren.",
      "Für die Sauce Mehl in wenig Milch glatt rühren, die restliche Milch erhitzen und die Mischung unter Rühren einlaufen lassen.",
      "Die Sauce bei kleiner Hitze binden lassen und den Senf erst anschließend einrühren, damit sein Aroma deutlich bleibt.",
      "Gurke fein schneiden und mit wenig Salz, Säure und Petersilie zu einer frischen, knackigen Beilage vermengen.",
      "Die Eier nur kurz in der Senfsauce erwärmen und Sauce sowie Kartoffeln abschließend mit Salz und Pfeffer abschmecken.",
      "Senfeier mit Petersilienkartoffeln und Gurke auf vorgewärmten Tellern anrichten und die Sauce großzügig verteilen."
    ];
    if (title.includes("Quarkkäulchen")) return [
      "Die gekochten Kartoffeln vollständig auskühlen lassen, fein reiben und mit Magerquark, Ei und Mehl in eine Schüssel geben.",
      "Die Masse mit Zimt und wenig Salz zügig zu einem weichen Teig vermengen und anschließend zehn Minuten ruhen lassen.",
      "Äpfel schälen, würfeln und mit wenig Wasser sowie Zimt zugedeckt zu einem noch leicht stückigen Apfelmus dünsten.",
      "Aus dem Quark-Kartoffel-Teig mit leicht bemehlten Händen kleine, flache Käulchen von gleicher Größe formen.",
      "Eine beschichtete Pfanne mit wenig Öl erhitzen und die Käulchen bei mittlerer Hitze von beiden Seiten goldbraun braten.",
      "Ein Probestück öffnen und prüfen, ob der Teig vollständig gegart, aber im Inneren weiterhin locker und saftig ist.",
      "Sächsische Quarkkäulchen mit warmem Apfelmus anrichten, leicht mit Zimt bestäuben und frisch servieren."
    ];
    if (title.includes("Quarkplinsen")) return [
      "Magerquark, Ei und Mehl glatt verrühren, Vanille ergänzen und den Teig fünf Minuten quellen lassen.",
      "Pflaumen waschen, entsteinen und mit Zimt sowie wenig Wasser zu einem stückigen Kompott dünsten.",
      "Skyr mit einem kleinen Schluck Wasser cremig rühren und bis zum Anrichten abgedeckt kalt stellen.",
      "Eine beschichtete Pfanne auf mittlere Hitze bringen und jeweils eine kleine Portion Teig hineingeben.",
      "Die Plinsen erst wenden, wenn die Oberfläche Blasen zeigt und der äußere Rand sichtbar stabil geworden ist.",
      "Die zweite Seite goldbraun fertig backen und ein Probestück auf eine vollständig gegarte Mitte kontrollieren.",
      "Sächsische Quarkplinsen mit Pflaumenkompott und einem Klecks Skyr anrichten und warm servieren."
    ];
    if (title.includes("Mohnklöße")) return [
      "Die Vollkornbrötchen in gleich große Würfel schneiden und in einer weiten Schüssel locker verteilen.",
      "Milch mit Mohn, Vanille und Honig langsam erhitzen, dabei regelmäßig rühren und nicht sprudelnd kochen lassen.",
      "Die heiße Mohnmilch portionsweise über die Brotwürfel geben und alles vorsichtig wenden, ohne die Stücke zu zerdrücken.",
      "Die getränkten Würfel fünf Minuten ziehen lassen und bei Bedarf nur wenig zusätzliche Milch ergänzen.",
      "Aus Milch und Vanillepuddingpulver eine leichte Sauce kochen und anschließend kurz abkühlen lassen.",
      "Skyr in die nur noch warme Vanillesauce rühren und die Süße sowie Konsistenz abschließend ausbalancieren.",
      "Erzgebirgische Mohnklöße mit Vanillesauce in Schalen anrichten und warm oder lauwarm servieren."
    ];
    if (recipe.course === "dessert" && recipe.family.includes("baked")) return [
      "Den Backofen vorheizen, eine passende kleine Form vorbereiten und alle Teig-, Quark- sowie Füllungszutaten genau abwiegen.",
      "Bei Hefeteig die Hefe zunächst in lauwarmer Milch lösen; bei Mürbeteig die Zutaten dagegen zügig und möglichst kühl verarbeiten.",
      "Den Grundteig gleichmäßig in der Form verteilen und einen niedrigen Rand formen, damit die spätere Füllung sicher gehalten wird.",
      "Quark, Ei und die im Rezept vorgesehenen Zutaten glatt verrühren und Mohn, Marzipan, Rosinen oder Frucht passend ergänzen.",
      "Die Füllung gleichmäßig auf dem Boden verteilen und bei Eierschecke oder Törtchen die vorgesehene obere Schicht behutsam auflegen.",
      "Das Gebäck backen, bis die Oberfläche goldbraun und die Mitte bei einer vorsichtigen Garprobe nicht mehr flüssig ist.",
      `${title} vollständig oder mindestens lauwarm auskühlen lassen, sauber portionieren und anschließend servieren.`
    ];
    if (title.includes("Sauerbraten") || title.includes("Rinderroulade") || title.includes("Krautwickel")) return [
      "Fleisch beziehungsweise Wirsingblätter und Füllung vollständig vorbereiten und alle Beilagen getrennt bereitstellen.",
      "Das Fleisch kräftig anbraten oder die gefüllten Rouladen rundum bräunen, anschließend Zwiebel und Wurzelgemüse ergänzen.",
      "Brühe angießen und das Gericht bei kleiner Hitze mit Deckel schmoren, bis das Fleisch weich und vollständig gegart ist.",
      "Kartoffelklöße oder Kartoffelstampf parallel zubereiten und den Rotkohl beziehungsweise die Gemüsebeilage sanft erhitzen.",
      "Das Fleisch kurz herausnehmen, die Sauce offen einkochen und je nach Gericht mit Senf oder einer milden Säure abschmecken.",
      "Eine Garprobe durchführen, das Fleisch wieder in die Sauce geben und alles noch einige Minuten gemeinsam ziehen lassen.",
      `${title} auf vorgewärmten Tellern anrichten, die Sauce großzügig verteilen und das Gericht heiß servieren.`
    ];
    if (title.includes("Buttermilchgetzen") || title.includes("Kartoffelkuchen") || title.includes("Neunerlei")) return [
      "Den Backofen vorheizen und Kartoffeln sowie die weiteren Gemüse- und Teigzutaten vollständig vorbereiten.",
      "Kartoffeln je nach Rezept fein reiben oder pressen und überschüssige Flüssigkeit sorgfältig entfernen.",
      "Die Kartoffelmasse mit Buttermilch, Ei oder dem vorgesehenen Bindemittel vermengen und ausgewogen würzen.",
      "Gemüse, Apfel oder die weiteren Bestandteile zeitlich passend ergänzen und alles gleichmäßig in der Form verteilen.",
      "Das Gericht backen, bis die Oberfläche sichtbar gebräunt und die Kartoffelmasse auch in der Mitte vollständig gegart ist.",
      "Die Form einige Minuten außerhalb des Ofens ruhen lassen und währenddessen die frische Beilage vorbereiten.",
      `${title} sauber portionieren, mit Kräutern vollenden und warm auf vorgewärmten Tellern servieren.`
    ];
    return mainSteps(recipe);
  }

  function makeRecipe(spec, index, origin = "extension") {
    const ingredients = Array.isArray(spec.ingredients) ? spec.ingredients : parseIngredients(spec.ingredients);
    const recipe = {
      id: `${origin}-${String(index + 1).padStart(3, "0")}-${slug(spec.title)}`,
      baseRecipeId: `${origin}-${String(index + 1).padStart(3, "0")}`,
      title: spec.title,
      description: spec.description,
      course: spec.course,
      cuisine: spec.cuisine,
      diet: spec.diet,
      time: spec.time,
      level: spec.time <= 20 ? "Sehr einfach" : spec.time <= 40 ? "Einfach" : "Mittel",
      emoji: "🍽️",
      theme: themes[index % themes.length],
      family: spec.family,
      allergens: inferAllergens(ingredients),
      macros: macro(...spec.macros),
      ingredients,
      steps: [],
      tip: spec.tip,
      variantPolicy: {
        proteinBooster: booster(boosterDefinitions[spec.proteinBoost]),
        energyBooster: booster(energyDefinitions[spec.energyBoost])
      },
      provenance: {
        type: "original",
        label: spec.cuisine === "saechsisch"
          ? "Küchenenergie-Eigenentwicklung · regional recherchierte Adaption"
          : "Küchenenergie-Eigenentwicklung",
        externalContentUsed: false,
        researchBasis: spec.researchBasis || null
      },
      humanReview: {
        status: "pending",
        label: "Menschliche Freigabe ausstehend"
      }
    };
    recipe.emoji = emojiFor(recipe);
    recipe.steps = spec.steps || (recipe.cuisine === "saechsisch"
      ? saxonSteps(recipe)
      : recipe.course === "starter"
      ? starterSteps(recipe)
      : recipe.course === "dessert"
        ? dessertSteps(recipe)
        : recipe.course === "snack"
          ? snackSteps(recipe)
        : mainSteps(recipe));
    return recipe;
  }

  const starterCultures = [
    { cuisine: "deutsch", herbs: ["Schnittlauch", "Dill", "Petersilie"], pairs: [["Kartoffel", "Sellerie"], ["Rote Bete", "Apfel"], ["Linse", "Möhre"], ["Gurke", "Radieschen"], ["Kohlrabi", "Erbse"], ["Champignon", "Thymian"], ["Weißkohl", "Apfel"], ["Kürbis", "Möhre"], ["Weiße Bohne", "Petersilie"], ["Brokkoli", "Kartoffel"], ["Möhre", "Orange"], ["Sauerkraut", "Birne"]] },
    { cuisine: "mediterran", herbs: ["Basilikum", "Petersilie", "Rosmarin"], pairs: [["Tomate", "Weiße Bohne"], ["Zucchini", "Zitrone"], ["Paprika", "Feta"], ["Aubergine", "Tomate"], ["Kichererbse", "Gurke"], ["Brokkoli", "Zitrone"], ["Champignon", "Tomate"], ["Fenchel", "Orange"], ["Linse", "Paprika"], ["Möhre", "Rosmarin"], ["Blumenkohl", "Olive"], ["Erbse", "Minze"]] },
    { cuisine: "asiatisch", herbs: ["Ingwer", "Koriander", "Frühlingszwiebel"], pairs: [["Gurke", "Möhre"], ["Brokkoli", "Sesam"], ["Edamame", "Paprika"], ["Spitzkohl", "Möhre"], ["Tofu", "Gurke"], ["Champignon", "Ingwer"], ["Blumenkohl", "Sesam"], ["Zucchini", "Frühlingszwiebel"], ["Erbse", "Minze"], ["Paprika", "Mango"], ["Weiße Bohne", "Ingwer"], ["Rote Bete", "Sesam"]] },
    { cuisine: "mexikanisch", herbs: ["Petersilie", "Limette", "Paprikapulver"], pairs: [["Kidneybohne", "Mais"], ["Paprika", "Tomate"], ["Süßkartoffel", "Bohne"], ["Mais", "Gurke"], ["Linse", "Tomate"], ["Kichererbse", "Paprika"], ["Zucchini", "Mais"], ["Blumenkohl", "Tomate"], ["Möhre", "Bohne"], ["Kürbis", "Mais"], ["Avocado", "Tomate"], ["Kartoffel", "Paprika"]] },
    { cuisine: "orientalisch", herbs: ["Petersilie", "Minze", "Zitrone"], pairs: [["Kichererbse", "Möhre"], ["Linse", "Zitrone"], ["Rote Bete", "Joghurt"], ["Aubergine", "Paprika"], ["Blumenkohl", "Paprika"], ["Gurke", "Petersilie"], ["Kürbis", "Kichererbse"], ["Weiße Bohne", "Minze"], ["Möhre", "Orange"], ["Zucchini", "Mango"], ["Erbse", "Joghurt"], ["Kartoffel", "Sesam"]] },
    { cuisine: "indisch", herbs: ["Currypulver", "Ingwer", "Zitrone"], pairs: [["Rote Linse", "Möhre"], ["Kichererbse", "Spinat"], ["Blumenkohl", "Erbse"], ["Gurke", "Joghurt"], ["Kartoffel", "Paprika"], ["Kürbis", "Linse"], ["Brokkoli", "Kichererbse"], ["Tomate", "Möhre"], ["Zucchini", "Ingwer"], ["Aubergine", "Joghurt"], ["Weiße Bohne", "Spinat"], ["Süßkartoffel", "Zitrone"]] },
    { cuisine: "klassisch", herbs: ["Petersilie", "Schnittlauch", "Zitrone"], pairs: [["Erbse", "Minze"], ["Möhre", "Apfel"], ["Brokkoli", "Mandel"], ["Tomate", "Hüttenkäse"], ["Gurke", "Dill"], ["Kürbis", "Kern"], ["Linse", "Birne"], ["Champignon", "Frischkäse"], ["Blumenkohl", "Joghurt"], ["Paprika", "Weiße Bohne"], ["Kohlrabi", "Schnittlauch"], ["Rote Bete", "Orange"]] }
  ];

  const starterMethods = ["soup", "salad", "oven-bites", "toast"];

  function starterIngredientName(name) {
    const cooked = new Set(["Linse", "Rote Linse", "Kichererbse", "Kidneybohne", "Weiße Bohne", "Bohne", "Edamame"]);
    return cooked.has(name) ? `Gekochte ${name}n` : name;
  }

  function buildGeneralStarters() {
    return starterCultures.flatMap((culture) => culture.pairs.map(([first, second], index) => {
      const method = starterMethods[index % starterMethods.length];
      const herb = culture.herbs[index % culture.herbs.length];
      const title = method === "soup"
        ? `${first}-${second}-Suppe mit ${herb}`
        : method === "salad"
          ? `${first}-${second}-Salat mit ${herb}`
          : method === "toast"
            ? `${first}-Creme auf Vollkorntoast mit ${second}`
            : `Gebackene ${first}-Happen mit ${second}`;
      const secondName = second === "Joghurt" ? "Sojajoghurt" : second === "Feta" ? "Feta" : second;
      const diet = second === "Feta" ? "vegetarian" : "vegan";
      const ingredients = method === "soup"
        ? `${starterIngredientName(first)}|200|g;${starterIngredientName(secondName)}|120|g;Gemüsebrühe|350|ml;Zwiebel|50|g;${herb}|10|g;Rapsöl|1|TL;Zitrone|0.25|Stk.`
        : method === "salad"
          ? `${starterIngredientName(first)}|180|g;${starterIngredientName(secondName)}|120|g;Feldsalat|60|g;${herb}|10|g;Apfelessig|1|EL;Rapsöl|1|TL;Mittelscharfer Senf|1|TL`
          : method === "toast"
            ? `${starterIngredientName(first)}|180|g;${starterIngredientName(secondName)}|100|g;Vollkornbrot|90|g;Sojajoghurt|70|g;${herb}|10|g;Zitrone|0.25|Stk.;Rapsöl|1|TL`
            : `${starterIngredientName(first)}|200|g;${starterIngredientName(secondName)}|120|g;Haferflocken|30|g;Sojajoghurt|90|g;${herb}|10|g;Zitrone|0.25|Stk.;Rapsöl|1|TL`;
      return {
        title,
        description: `Eine unkomplizierte ${method === "soup" ? "Suppe" : method === "salad" ? "Vorspeise" : "kleine Mahlzeit"} aus ${first} und ${second}, alltagstauglich gewürzt mit ${herb}.`,
        course: "starter",
        cuisine: culture.cuisine,
        diet,
        time: 15 + (index % 4) * 5,
        family: `starter-${method}`,
        macros: [14 + index % 7, 34 + index % 10, 9 + index % 5],
        ingredients,
        proteinBoost: diet === "vegan" ? (index % 2 ? "tofu" : "lentils") : "skyr",
        energyBoost: "bread",
        tip: `Bereite ${first} und ${second} getrennt vor und verbinde beide erst in der letzten Gar- oder Mischphase, damit die unterschiedlichen Konsistenzen erhalten bleiben.`
      };
    }));
  }

  const mainCultures = [
    {
      cuisine: "deutsch", label: "Bodenständiges", spice: "Majoran", sauce: "Gemüsebrühe", methods: ["pan", "oven", "stew"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenbrust", "omnivore", "turkey", 43, 4], ["Seelachs", "Seelachsfilet", "omnivore", "fish", 38, 4], ["Tofu", "Räuchertofu", "vegan", "tofu", 28, 13], ["Linsen", "Gekochte Linsen", "vegan", "lentils", 25, 3]],
      sides: [["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1], ["Reis", "Langkornreis", "rice", 7, 62, 1], ["Spätzle", "Vollkornspätzle", "pasta", 11, 65, 3]],
      vegetables: [["Möhre", "Lauch"], ["Kohlrabi", "Erbse"], ["Champignon", "Paprika"]]
    },
    {
      cuisine: "mediterran", label: "Mediterranes", spice: "Italienische Kräuter", sauce: "Passierte Tomaten", methods: ["pan", "oven", "pasta"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Lachs", "Lachsfilet", "omnivore", "fish", 36, 18], ["Garnelen", "Garnelen", "omnivore", "fish", 35, 4], ["Feta", "Feta", "vegetarian", "cottage", 24, 18], ["Weiße Bohnen", "Weiße Bohnen", "vegan", "lentils", 23, 4]],
      sides: [["Kräuterreis", "Langkornreis", "rice", 7, 62, 1], ["Pasta", "Vollkornnudeln", "pasta", 11, 65, 3], ["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1]],
      vegetables: [["Zucchini", "Tomate"], ["Paprika", "Aubergine"], ["Brokkoli", "Kirschtomate"]]
    },
    {
      cuisine: "asiatisch", label: "Mildes asiatisches", spice: "Frischer Ingwer", sauce: "Sojasauce", methods: ["rice-pan", "noodle", "oven"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenbrust", "omnivore", "turkey", 43, 4], ["Seelachs", "Seelachsfilet", "omnivore", "fish", 38, 4], ["Tofu", "Naturtofu", "vegan", "tofu", 28, 13], ["Ei", "Eier", "vegetarian", "egg", 26, 14]],
      sides: [["Reis", "Langkornreis", "rice", 7, 62, 1], ["Reisnudeln", "Reisnudeln", "pasta", 6, 68, 1], ["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1]],
      vegetables: [["Brokkoli", "Möhre"], ["Paprika", "Zuckerschote"], ["Spitzkohl", "Champignon"]]
    },
    {
      cuisine: "mexikanisch", label: "Mildes Tex-Mex", spice: "Paprikapulver", sauce: "Gehackte Tomaten", methods: ["rice-pan", "oven", "stew"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenhack", "omnivore", "turkey", 40, 7], ["Rind", "Mageres Rinderhack", "omnivore", "beef", 38, 12], ["Tofu", "Naturtofu", "vegan", "tofu", 28, 13], ["Kidneybohnen", "Kidneybohnen", "vegan", "lentils", 23, 4]],
      sides: [["Reis", "Langkornreis", "rice", 7, 62, 1], ["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1], ["Tortilla", "Vollkorn-Tortilla", "bread", 10, 55, 5]],
      vegetables: [["Paprika", "Mais"], ["Zucchini", "Tomate"], ["Süßkartoffel", "Bohne"]]
    },
    {
      cuisine: "orientalisch", label: "Würziges orientalisches", spice: "Kreuzkümmel", sauce: "Gehackte Tomaten", methods: ["couscous-pan", "oven", "stew"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenhack", "omnivore", "turkey", 40, 7], ["Seelachs", "Seelachsfilet", "omnivore", "fish", 38, 4], ["Kichererbsen", "Kichererbsen", "vegan", "lentils", 22, 5], ["Tofu", "Naturtofu", "vegan", "tofu", 28, 13]],
      sides: [["Couscous", "Couscous", "couscous", 10, 64, 2], ["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1], ["Reis", "Langkornreis", "rice", 7, 62, 1]],
      vegetables: [["Zucchini", "Paprika"], ["Möhre", "Kürbis"], ["Blumenkohl", "Spinat"]]
    },
    {
      cuisine: "indisch", label: "Mildes indisches", spice: "Currypulver", sauce: "Passierte Tomaten", methods: ["curry", "curry", "curry"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenbrust", "omnivore", "turkey", 43, 4], ["Seelachs", "Seelachsfilet", "omnivore", "fish", 38, 4], ["Tofu", "Naturtofu", "vegan", "tofu", 28, 13], ["Linsen", "Rote Linsen", "vegan", "lentils", 25, 3]],
      sides: [["Reis", "Langkornreis", "rice", 7, 62, 1], ["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1], ["Vollkornfladen", "Vollkornbrot", "bread", 10, 55, 5]],
      vegetables: [["Blumenkohl", "Erbse"], ["Spinat", "Tomate"], ["Brokkoli", "Möhre"]]
    },
    {
      cuisine: "klassisch", label: "Klassisches", spice: "Petersilie", sauce: "Hafercuisine", methods: ["pan", "gratin", "pasta"],
      proteins: [["Hähnchen", "Hähnchenbrust", "omnivore", "chicken", 42, 5], ["Pute", "Putenbrust", "omnivore", "turkey", 43, 4], ["Seelachs", "Seelachsfilet", "omnivore", "fish", 38, 4], ["Ei", "Eier", "vegetarian", "egg", 26, 14], ["Linsen", "Gekochte Linsen", "vegan", "lentils", 25, 3]],
      sides: [["Kartoffeln", "Kartoffeln", "potato", 7, 58, 1], ["Nudeln", "Vollkornnudeln", "pasta", 11, 65, 3], ["Reis", "Langkornreis", "rice", 7, 62, 1]],
      vegetables: [["Brokkoli", "Möhre"], ["Champignon", "Erbse"], ["Spinat", "Tomate"]]
    }
  ];

  function buildGeneralMains() {
    const recipes = [];
    mainCultures.forEach((culture) => {
      culture.proteins.forEach(([shortProtein, proteinName, diet, proteinBoost, proteinValue, proteinFat], proteinIndex) => {
        culture.sides.forEach(([sideTitle, sideName, energyBoost, sideProtein, sideCarbs, sideFat], sideIndex) => {
          culture.vegetables.forEach(([firstVegetable, secondVegetable], vegetableIndex) => {
            const method = culture.methods[(proteinIndex + sideIndex + vegetableIndex) % culture.methods.length];
            const family = `main-${culture.cuisine}-${method}`;
            const titlePrefix = {
              deutsch: "Aus der Landküche",
              mediterran: "Mediterran",
              asiatisch: "Nach Asia-Art",
              mexikanisch: "Nach Tex-Mex-Art",
              orientalisch: "Orientalisch gewürzt",
              klassisch: "Klassisch"
            }[culture.cuisine];
            let title;
            if (culture.cuisine === "indisch") {
              const indianTitles = [
                `${shortProtein}-${firstVegetable}-Curry mit ${sideTitle}`,
                `${sideTitle} mit ${shortProtein} in ${firstVegetable}-Currysauce`,
                `${firstVegetable}-${secondVegetable}-Curry mit ${shortProtein} und ${sideTitle}`,
                `${shortProtein}-${secondVegetable}-Curry mit ${sideTitle}`,
                `${firstVegetable}-${secondVegetable}-Linsencurry mit ${sideTitle}`
              ];
              title = indianTitles[proteinIndex];
            } else {
              const cultureTitles = [
                `${titlePrefix}: ${shortProtein}-${firstVegetable}-Pfanne mit ${sideTitle}`,
                `${titlePrefix}: ${shortProtein} mit ${firstVegetable}, ${secondVegetable} und ${sideTitle}`,
                `${titlePrefix}: ${firstVegetable}-${sideTitle}-Teller mit ${shortProtein} und ${secondVegetable}`,
                `${titlePrefix}: ${shortProtein}-${secondVegetable}-Pfanne mit ${sideTitle}`,
                `${titlePrefix}: ${firstVegetable}-${secondVegetable}-Topf mit ${shortProtein} und ${sideTitle}`
              ];
              title = cultureTitles[proteinIndex];
            }
            const aromatic = culture.cuisine === "asiatisch"
              ? "Frühlingszwiebel"
              : culture.cuisine === "mediterran"
                ? "Knoblauch"
                : culture.cuisine === "mexikanisch"
                  ? "Rote Zwiebel"
                  : "Zwiebel";
            const finish = culture.cuisine === "asiatisch"
              ? "Sesam"
              : culture.cuisine === "mediterran"
                ? "Zitrone"
                : culture.cuisine === "mexikanisch"
                  ? "Limette"
                  : culture.cuisine === "orientalisch"
                    ? "Petersilie"
                    : culture.cuisine === "indisch"
                      ? "Zitrone"
                      : "Petersilie";
            recipes.push({
              title,
              description: `${culture.label} Hauptgericht mit ${proteinName}, ${firstVegetable}, ${secondVegetable} und ${sideTitle} aus gut erhältlichen Zutaten.`,
              course: "main",
              cuisine: culture.cuisine,
              diet,
              time: 25 + ((proteinIndex + sideIndex + vegetableIndex) % 4) * 5,
              family,
              macros: [proteinValue + sideProtein, sideCarbs + 18 + vegetableIndex * 3, proteinFat + sideFat + 8],
              ingredients: `${proteinName}|${proteinName === "Eier" ? 2 : proteinName.includes("Linsen") || proteinName.includes("Bohnen") || proteinName.includes("Kichererbsen") ? 220 : 180}|${proteinName === "Eier" ? "Stk." : "g"};${sideName}|${energyBoost === "rice" || energyBoost === "pasta" || energyBoost === "couscous" ? 80 : 260}|g;${firstVegetable}|160|g;${secondVegetable}|120|g;${culture.sauce}|180|${culture.sauce.includes("cuisine") || culture.sauce.includes("brühe") ? "ml" : "g"};${aromatic}|${aromatic === "Knoblauch" ? 1 : 60}|${aromatic === "Knoblauch" ? "Stk." : "g"};${culture.spice}|1|TL;${finish}|${finish === "Sesam" ? 10 : finish === "Petersilie" ? 10 : 0.5}|${finish === "Sesam" || finish === "Petersilie" ? "g" : "Stk."};Rapsöl|1|TL`,
              proteinBoost,
              energyBoost,
              tip: `${proteinName} und ${firstVegetable} getrennt garen und erst am Ende verbinden; dadurch bleiben Röstaromen und ein klarer Gemüsegeschmack erhalten.`
            });
          });
        });
      });
    });
    return recipes.slice(0, 314);
  }

  const dessertArchetypes = [
    ["Quarkcreme", "Magerquark", "vegetarian", "dessert-cream", "dessert", "oats", [31, 45, 9]],
    ["Skyrbecher", "Skyr", "vegetarian", "dessert-cream", "dessert", "fruit", [30, 42, 10]],
    ["Joghurt-Parfait", "Griechischer Joghurt", "vegetarian", "dessert-cream", "dessert", "oats", [24, 48, 13]],
    ["Grießpudding", "Milch", "vegetarian", "dessert-pudding", "dessert", "fruit", [22, 58, 8]],
    ["Haferpudding", "Haferdrink", "vegan", "dessert-pudding", "dessertVegan", "fruit", [14, 60, 12]],
    ["Haferauflauf", "Haferflocken", "vegetarian", "dessert-baked", "dessert", "oats", [27, 62, 13]],
    ["Quarkpfannküchlein", "Magerquark", "vegetarian", "dessert-pancake", "dessert", "oats", [30, 54, 13]],
    ["Hafercrumble", "Haferflocken", "vegan", "dessert-baked", "dessertVegan", "oats", [13, 64, 17]],
    ["Quarkkuchen im Glas", "Magerquark", "vegetarian", "dessert-cream", "dessert", "oats", [32, 47, 10]]
  ];
  const dessertFruits = ["Apfel", "Birne", "Kirsche", "Heidelbeere", "Himbeere", "Pflaume", "Aprikose", "Orange"];

  function buildGeneralDesserts() {
    return dessertArchetypes.flatMap(([format, base, diet, family, proteinBoost, energyBoost, macros], archetypeIndex) => dessertFruits.map((fruit, fruitIndex) => {
      const title = `${fruit}-${format} mit ${fruitIndex % 2 ? "Vanille" : "Zimt"}`;
      const ingredientSets = [
        `Magerquark|230|g;${fruit}|180|g;Walnüsse|15|g;Milch|40|ml;Zitrone|0.25|Stk.;Vanille|1|Prise;Honig|1|TL`,
        `Skyr|240|g;${fruit}|180|g;Sonnenblumenkerne|15|g;Griechischer Joghurt|60|g;Zitrone|0.25|Stk.;Vanille|1|Prise;Ahornsirup|1|TL`,
        `Griechischer Joghurt|220|g;${fruit}|180|g;Haferflocken|35|g;Skyr|80|g;Vanille|1|Prise;Mandeln|10|g;Honig|1|TL`,
        `Milch|280|ml;${fruit}|180|g;Weichweizengrieß|45|g;Skyr|120|g;Vanille|1|Prise;Zimt|1|Prise;Honig|1|TL`,
        `Haferdrink|280|ml;${fruit}|180|g;Haferflocken|55|g;Sojajoghurt|120|g;Vanille|1|Prise;Zitrone|0.25|Stk.;Ahornsirup|1|TL`,
        `Haferflocken|65|g;${fruit}|180|g;Ei|1|Stk.;Magerquark|100|g;Apfelsaft|90|ml;Vanille|1|Prise;Backpulver|0.5|TL`,
        `Magerquark|220|g;${fruit}|180|g;Ei|1|Stk.;Hafermehl|45|g;Skyr|80|g;Vanille|1|Prise;Rapsöl|1|TL`,
        `Haferflocken|60|g;${fruit}|200|g;Margarine|15|g;Sojajoghurt|140|g;Zimt|1|Prise;Mandeln|10|g;Ahornsirup|1|TL`,
        `Magerquark|230|g;${fruit}|180|g;Vollkornkekse|35|g;Griechischer Joghurt|70|g;Zitrone|0.25|Stk.;Vanille|1|Prise;Honig|1|TL`
      ];
      const ingredients = ingredientSets[archetypeIndex];
      return {
        title,
        description: `${format} mit ${fruit}, milder Süße und einer gut nachvollziehbaren Zubereitung für den Alltag.`,
        course: "dessert",
        cuisine: archetypeIndex % 3 === 0 ? "deutsch" : archetypeIndex % 3 === 1 ? "klassisch" : "mediterran",
        diet,
        time: 15 + (archetypeIndex % 5) * 5,
        family,
        macros: [macros[0], macros[1] + fruitIndex % 4, macros[2]],
        ingredients,
        proteinBoost,
        energyBoost,
        tip: `Verarbeite ${fruit} nur so lange wie nötig und gib die knusprige Komponente erst unmittelbar vor dem Servieren dazu.`
      };
    }));
  }

  const saxonSource = "Offizielle Informationen von Tourismus Marketing Gesellschaft Sachsen und Tourismusverband Erzgebirge (Erzgebirgs-ABC, Heimatgenuss und Neunerlei-Angebote; Abruf Juli 2026); eigenständige alltagstaugliche Adaptionen ohne übernommene Rezepttexte";
  const saxonSpecs = [
    ["Sächsische Kartoffelsuppe mit Majoran", "Cremige Kartoffelsuppe mit Lauch, Möhre und Majoran nach sächsischer Alltagstradition.", "starter", "vegetarian", 35, "saxon-soup", [18, 48, 12], "Kartoffeln|240|g;Lauch|120|g;Möhre|100|g;Gemüsebrühe|400|ml;Skyr|80|g;Majoran|1|TL;Rapsöl|1|TL", "skyr", "bread", "Einen Teil der Kartoffeln zerdrücken statt alles zu pürieren, damit die Suppe ihren bodenständigen Charakter behält."],
    ["Erzgebirgische Schwammesuppe mit Kartoffeln", "Herzhafte Pilzsuppe mit Kartoffeln, Möhre und Petersilie, inspiriert von der erzgebirgischen Pilzküche.", "starter", "vegetarian", 35, "saxon-soup", [17, 43, 13], "Champignons|220|g;Kartoffeln|180|g;Möhre|90|g;Gemüsebrühe|400|ml;Hafercuisine|80|ml;Petersilie|10|g;Rapsöl|1|TL", "cottage", "bread", "Die Pilze portionsweise kräftig anbraten und erst danach in die Suppe geben, damit ihr Röstaroma erhalten bleibt."],
    ["Wermsdorfer Fischsuppe für den Alltag", "Leichte Fischsuppe mit Wurzelgemüse und Kartoffeln als gut erhältliche Adaption der Wermsdorfer Fischtradition.", "starter", "omnivore", 40, "saxon-soup", [31, 39, 10], "Karpfenfilet oder Seelachsfilet|160|g;Kartoffeln|160|g;Möhre|100|g;Lauch|100|g;Gemüsebrühe|450|ml;Dill|8|g;Zitrone|0.5|Stk.", "fish", "bread", "Den Fisch erst in den letzten Minuten in der nur sanft köchelnden Suppe gar ziehen lassen."],
    ["Lausitzer Kartoffelsalat mit Leinöl", "Lauwarmer Kartoffelsalat mit Gurke, Apfel und einem milden Leinöl-Senf-Dressing.", "starter", "vegan", 25, "saxon-salad", [10, 48, 14], "Kartoffeln|260|g;Gurke|120|g;Apfel|90|g;Rote Zwiebel|40|g;Leinöl|1|EL;Apfelessig|1|EL;Mittelscharfer Senf|1|TL", "lentils", "bread", "Das Leinöl nicht erhitzen, sondern erst unter die nur noch lauwarmen Kartoffeln mischen."],
    ["Sächsischer Sauerkraut-Apfel-Salat", "Frischer Krautsalat mit mildem Sauerkraut, Apfel, Möhre und Schnittlauch.", "starter", "vegan", 15, "saxon-salad", [8, 32, 9], "Sauerkraut|180|g;Apfel|120|g;Möhre|100|g;Feldsalat|50|g;Schnittlauch|10|g;Apfelessig|1|EL;Rapsöl|1|TL", "tofu", "bread", "Das Sauerkraut nur leicht ausdrücken und den Feldsalat erst direkt vor dem Servieren unterheben."],
    ["Leinöl-Kräuterquark mit Radieschenbrot", "Sächsisch inspirierter Kräuterquark mit Leinöl, Radieschen und kräftigem Vollkornbrot.", "starter", "vegetarian", 15, "saxon-toast", [28, 38, 14], "Magerquark|220|g;Vollkornbrot|100|g;Radieschen|100|g;Gurke|100|g;Leinöl|1|EL;Schnittlauch|10|g;Milch|30|ml", "skyr", "bread", "Das Leinöl erst kurz vor dem Servieren auf den glatt gerührten Quark träufeln."],
    ["Leipziger Allerlei mit Petersilienkartoffeln", "Alltagstaugliche Variante des Leipziger Gemüseklassikers mit Möhren, Kohlrabi, Spargel, Blumenkohl und Champignons.", "main", "vegetarian", 45, "saxon-stew", [29, 68, 18], "Körniger Frischkäse|150|g;Kartoffeln|280|g;Möhre|100|g;Kohlrabi|120|g;Blumenkohl|120|g;Champignons|120|g;Grüner Spargel|120|g;Petersilie|10|g", "cottage", "potato", "Die Gemüse einzeln oder zeitlich gestaffelt garen, damit jede Sorte ihren eigenen Biss behält."],
    ["Sächsischer Sauerbraten mit Rotkohl und Kartoffelklößen", "Festliches Rinderschmorgericht mit mild-säuerlicher Sauce, Rotkohl und Kartoffelklößen.", "main", "omnivore", 60, "saxon-stew", [46, 73, 20], "Rinderschmorbraten|190|g;Kartoffelklöße|220|g;Rotkohl|180|g;Möhre|100|g;Zwiebel|70|g;Rinderbrühe|250|ml;Apfelessig|1|EL;Rapsöl|1|TL", "beef", "potato", "Für die schnelle Alltagsfassung die Säure in der Sauce ausbalancieren und das Fleisch besonders sanft schmoren."],
    ["Vogtländische grüne Klöße mit Pilzragout", "Kartoffelklöße aus rohen und gekochten Kartoffeln mit kräftig gebratenem Pilzragout.", "main", "vegetarian", 60, "saxon-stew", [24, 82, 20], "Rohe Kartoffeln|300|g;Gekochte Kartoffeln|100|g;Champignons|250|g;Hafercuisine|100|ml;Zwiebel|60|g;Petersilie|10|g;Speisestärke|20|g", "cottage", "potato", "Die rohen Kartoffeln sehr gründlich ausdrücken; dadurch halten die Klöße besser und werden nicht wässrig."],
    ["Vogtländischer Bambes mit Kräuterquark", "Knusprige Kartoffelpuffer nach vogtländischer Art mit frischem Kräuterquark und Gurkensalat.", "main", "vegetarian", 40, "saxon-pan", [31, 68, 18], "Kartoffeln|340|g;Magerquark|220|g;Gurke|160|g;Ei|1|Stk.;Haferflocken|30|g;Schnittlauch|10|g;Rapsöl|2|TL", "skyr", "potato", "Die Kartoffelraspel kräftig ausdrücken und die Puffer flach formen, damit sie mit wenig Öl knusprig werden."],
    ["Erzgebirgische Buttermilchgetzen mit Apfel", "Saftiger Kartoffelauflauf mit Buttermilch, Ei und Apfel als herzhafte Alltagsfassung.", "main", "vegetarian", 50, "saxon-baked", [27, 75, 17], "Kartoffeln|380|g;Buttermilch|180|ml;Apfel|120|g;Ei|2|Stk.;Zwiebel|50|g;Haferflocken|30|g;Rapsöl|1|TL", "cottage", "potato", "Die Kartoffelmasse nur dünn in der heißen Form verteilen, damit sie innen gart und außen bräunt."],
    ["Sächsische Wickelklöße mit Champignonsauce", "Gerollte Kartoffelklöße mit Semmelbröselfüllung und cremiger Champignonsauce.", "main", "vegetarian", 60, "saxon-stew", [25, 86, 21], "Kartoffeln|320|g;Weizenmehl|80|g;Ei|1|Stk.;Semmelbrösel|35|g;Champignons|220|g;Hafercuisine|100|ml;Petersilie|10|g", "cottage", "potato", "Die Rolle gleichmäßig formen und in nur siedendem Wasser ziehen lassen, damit die Klöße nicht aufbrechen."],
    ["Oberlausitzer Teichelmauke mit Rindfleisch", "Kartoffelstampf mit kräftiger Brühe, zartem Rindfleisch und Wurzelgemüse nach Oberlausitzer Vorbild.", "main", "omnivore", 55, "saxon-stew", [45, 66, 17], "Mageres Rindfleisch|180|g;Kartoffeln|330|g;Möhre|120|g;Sellerie|80|g;Rinderbrühe|300|ml;Zwiebel|60|g;Petersilie|10|g", "beef", "potato", "Eine Mulde in den Kartoffelstampf drücken und Brühe sowie Fleisch erst beim Anrichten hineingeben."],
    ["Lausitzer Karpfen mit Petersilienkartoffeln", "Schonend gegartes Karpfenfilet mit Petersilienkartoffeln, Gurke und einer leichten Dillsauce.", "main", "omnivore", 45, "saxon-fish", [42, 57, 19], "Karpfenfilet oder Seelachsfilet|190|g;Kartoffeln|300|g;Gurke|140|g;Skyr|90|g;Dill|8|g;Zitrone|0.5|Stk.;Rapsöl|1|TL", "fish", "potato", "Karpfenfilet ist saisonal erhältlich; außerhalb der Saison funktioniert dieselbe Zubereitung mit Seelachs."],
    ["Karpfenfilet mit Meerrettich und Ofengemüse", "Sächsisch inspirierter Ofenfisch mit milder Meerrettichcreme, Möhren und Kartoffeln.", "main", "omnivore", 45, "saxon-fish", [43, 61, 18], "Karpfenfilet oder Seelachsfilet|190|g;Kartoffeln|280|g;Möhre|150|g;Skyr|90|g;Meerrettich|1|TL;Zitrone|0.5|Stk.;Rapsöl|1|TL", "fish", "potato", "Den Fisch erst später zum Gemüse in den Ofen geben und die Meerrettichcreme kalt dazu servieren."],
    ["Sächsische Krautwickel mit Kartoffelstampf", "Wirsingrouladen mit magerer Hackfüllung, kräftiger Sauce und lockerem Kartoffelstampf.", "main", "omnivore", 55, "saxon-stew", [44, 66, 21], "Mageres Rinderhack|170|g;Kartoffeln|320|g;Wirsing|220|g;Möhre|100|g;Zwiebel|60|g;Gemüsebrühe|220|ml;Ei|1|Stk.", "beef", "potato", "Die Wirsingblätter kurz blanchieren und die dicke Blattrippe flach schneiden, damit sie sich gut rollen lassen."],
    ["Rinderroulade mit Rotkohl und grünen Klößen", "Klassische Rinderroulade mit Rotkohl und sächsisch-vogtländisch inspirierten Kartoffelklößen.", "main", "omnivore", 60, "saxon-stew", [48, 72, 20], "Rinderroulade|190|g;Kartoffelklöße|220|g;Rotkohl|180|g;Gewürzgurke|40|g;Zwiebel|60|g;Rinderbrühe|250|ml;Mittelscharfer Senf|1|TL", "beef", "potato", "Die Roulade kompakt aufrollen und bei kleiner Hitze schmoren, damit die Füllung an ihrem Platz bleibt."],
    ["Sächsischer Linseneintopf mit Backpflaumen", "Herzhafter Linseneintopf mit Kartoffeln, Wurzelgemüse und einer milden süß-sauren Pflaumennote.", "main", "vegan", 45, "saxon-stew", [28, 89, 10], "Gekochte Linsen|250|g;Kartoffeln|240|g;Möhre|120|g;Lauch|100|g;Backpflaumen|30|g;Gemüsebrühe|400|ml;Apfelessig|1|EL", "lentils", "potato", "Die Backpflaumen fein würfeln und sparsam einsetzen, damit der Eintopf ausgewogen statt süß schmeckt."],
    ["Erzgebirgische Klitscher mit Kräuterquark", "Knusprige Kartoffelplätzchen mit Kräuterquark, Radieschen und Gurkensalat.", "main", "vegetarian", 40, "saxon-pan", [31, 67, 18], "Kartoffeln|340|g;Magerquark|220|g;Radieschen|100|g;Gurke|140|g;Ei|1|Stk.;Weizenmehl|30|g;Rapsöl|2|TL", "skyr", "potato", "Die Klitscher klein und flach ausbacken und erst wenden, wenn die Unterseite vollständig stabil ist."],
    ["Herzhafter sächsischer Kartoffelkuchen", "Blechgericht aus Kartoffel-Hefeteig mit Lauch, Zwiebel und körnigem Frischkäse.", "main", "vegetarian", 55, "saxon-baked", [30, 78, 18], "Kartoffeln|260|g;Weizenmehl|100|g;Körniger Frischkäse|180|g;Lauch|140|g;Zwiebel|60|g;Ei|1|Stk.;Trockenhefe|0.5|Pkg.", "cottage", "potato", "Gekochte Kartoffeln vollständig ausdampfen lassen, bevor sie unter den Hefeteig gearbeitet werden."],
    ["Senfeier mit Petersilienkartoffeln und Gurke", "Bodenständige Senfeier mit kleinen Kartoffeln und frischem Gurkensalat.", "main", "vegetarian", 35, "saxon-pan", [33, 62, 19], "Eier|3|Stk.;Kartoffeln|300|g;Gurke|160|g;Milch|150|ml;Mittelscharfer Senf|1|EL;Petersilie|10|g;Weizenmehl|15|g", "egg", "potato", "Den Senf erst bei niedriger Hitze in die Sauce rühren und die Eier nur kurz darin erwärmen."],
    ["Erzgebirgischer Neunerlei-Gemüseteller", "Pflanzenbetonte Küchenenergie-Adaption der erzgebirgischen Festtagstradition mit neun vertrauten Bestandteilen.", "main", "vegetarian", 55, "saxon-oven", [30, 84, 17], "Kartoffeln|240|g;Linsen|160|g;Sauerkraut|100|g;Rote Bete|100|g;Möhre|100|g;Champignons|100|g;Apfel|80|g;Körniger Frischkäse|120|g;Vollkornbrot|60|g", "cottage", "potato", "Die neun Bestandteile klar getrennt anrichten, damit Texturen und Aromen einzeln wahrnehmbar bleiben."],
    ["Sächsische Quarkkäulchen mit Apfelmus", "Quarkkäulchen aus Quark und geriebenen Pellkartoffeln mit warmem Apfelmus.", "dessert", "vegetarian", 40, "saxon-pancake", [30, 64, 15], "Magerquark|220|g;Gekochte Kartoffeln|160|g;Apfel|200|g;Ei|1|Stk.;Weizenmehl|45|g;Zimt|1|TL;Rapsöl|1|TL", "dessert", "oats", "Die Kartoffeln kalt und fein reiben; so wird der Teig locker und benötigt weniger zusätzliches Mehl."],
    ["Eierschecke nach Dresdner Art", "Kleine Küchenenergie-Eierschecke mit Hefeboden, Quarkschicht und luftigem Eierguss.", "dessert", "vegetarian", 60, "saxon-baked", [28, 63, 18], "Magerquark|220|g;Weizenmehl|80|g;Eier|2|Stk.;Milch|120|ml;Vanillepuddingpulver|20|g;Zucker|25|g;Trockenhefe|0.5|Pkg.", "dessert", "oats", "Die Eiermasse nur vorsichtig aufstreichen und den Kuchen vollständig auskühlen lassen, bevor er geschnitten wird."],
    ["Sächsische Bäbe mit Rosinen", "Kleine Hefenapfkuchen-Adaption mit Rosinen, Zitrone und einer leichten Quarkcreme.", "dessert", "vegetarian", 60, "saxon-baked", [24, 68, 15], "Weizenmehl|90|g;Magerquark|160|g;Ei|1|Stk.;Rosinen|25|g;Milch|100|ml;Trockenhefe|0.5|Pkg.;Zitrone|0.25|Stk.", "dessert", "oats", "Den Hefeteig warm gehen lassen und die Rosinen erst nach der ersten Ruhephase gleichmäßig einarbeiten."],
    ["Süßer sächsischer Kartoffelkuchen", "Saftiger Hefekuchen mit gekochten Kartoffeln, Zimt und Apfelstücken.", "dessert", "vegetarian", 60, "saxon-baked", [23, 73, 13], "Gekochte Kartoffeln|160|g;Weizenmehl|90|g;Apfel|160|g;Magerquark|150|g;Ei|1|Stk.;Zimt|1|TL;Trockenhefe|0.5|Pkg.", "dessert", "oats", "Die Kartoffeln sehr fein pressen und vollständig auskühlen lassen, bevor der Hefeteig geknetet wird."],
    ["Sächsischer Kleckselkuchen im Kleinformat", "Hefekuchen mit kleinen Klecksen aus Quark, Mohn und Pflaumenmus.", "dessert", "vegetarian", 60, "saxon-baked", [27, 70, 17], "Magerquark|200|g;Weizenmehl|80|g;Mohn|20|g;Pflaumenmus|35|g;Ei|1|Stk.;Milch|100|ml;Trockenhefe|0.5|Pkg.", "dessert", "oats", "Quark, Mohn und Pflaumenmus als getrennte kleine Kleckse aufsetzen und nicht miteinander verstreichen."],
    ["Erzgebirgische Mohnklöße mit Vanillesauce", "Warme Brotklöße mit Mohn, Milch und einer leichten Vanillesauce.", "dessert", "vegetarian", 40, "saxon-pudding", [24, 67, 16], "Vollkornbrötchen|100|g;Milch|260|ml;Mohn|25|g;Skyr|150|g;Vanillepuddingpulver|18|g;Vanille|1|Prise;Honig|1|TL", "dessert", "oats", "Die Brotstücke nur sanft mit der heißen Mohnmilch tränken, damit sie weich werden und ihre Form behalten."],
    ["Sächsische Quarkplinsen mit Pflaumen", "Kleine Quarkplinsen aus der Pfanne mit warmem Pflaumen-Zimt-Kompott.", "dessert", "vegetarian", 35, "saxon-pancake", [31, 58, 14], "Magerquark|220|g;Pflaumen|200|g;Ei|1|Stk.;Weizenmehl|50|g;Skyr|80|g;Zimt|1|TL;Rapsöl|1|TL", "dessert", "oats", "Den Teig nur kurz rühren und die Plinsen klein halten, damit sie beim Wenden nicht reißen."],
    ["Marzipan-Mürbeteigtörtchen nach Leipziger Art", "Kleine Törtchen mit Marzipan, Beerenkonfitüre und typischem Teigkreuz – kein geschütztes Originalprodukt.", "dessert", "vegetarian", 55, "saxon-baked", [20, 68, 19], "Weizenmehl|85|g;Magerquark|150|g;Marzipan|35|g;Beerenkonfitüre|30|g;Ei|1|Stk.;Mandeln|15|g;Vanille|1|Prise", "dessert", "oats", "Die Formen nur dünn mit Teig auskleiden und aus Teigstreifen ein lockeres Kreuz auf die Füllung legen."]
  ];

  const saxonExpansionSpecs = [
    ["Seiffener Hagebutten-Apfel-Suppe", "Fruchtig-milde Vorsuppe nach erzgebirgischem Neunerlei-Vorbild, alltagstauglich mit Hagebuttentee, Apfel und Möhre gekocht.", "starter", "vegan", 30, "saxon-fruit-soup", [7, 46, 6], "Hagebuttentee|300|ml;Apfel|180|g;Möhre|100|g;Kartoffeln|100|g;Orangensaft|80|ml;Zitrone|0.5|Stk.;Zimt|1|Prise;Rapsöl|1|TL", "tofu", "bread", "Den Hagebuttentee kräftig ziehen lassen und den Orangensaft erst nach dem Pürieren zugeben, damit die Fruchtnote frisch bleibt."],
    ["Erzgebirgisches Häckerle mit Roter Bete", "Herzhafter Heringssalat aus Matjes, Apfel, Roter Bete und Gewürzgurke, serviert mit kräftigem Roggenbrot.", "starter", "omnivore", 20, "saxon-fish-salad", [30, 44, 13], "Matjesfilet|140|g;Rote Bete vorgegart|120|g;Apfel|100|g;Gewürzgurke|60|g;Rote Zwiebel|40|g;Skyr|80|g;Roggenbrot|80|g", "fish", "bread", "Matjes und Gemüse gleichmäßig klein würfeln und den Salat vor dem Servieren zehn Minuten durchziehen lassen."],
    ["Neunerlei-Rote-Bete-Linsensalat", "Erdiger Rote-Bete-Salat mit Linsen, Apfel und Feldsalat als proteinreiche Küchenenergie-Variante des Neunerlei-Bestandteils.", "starter", "vegan", 18, "saxon-lentil-salad", [19, 46, 9], "Gekochte Linsen|170|g;Rote Bete vorgegart|160|g;Apfel|100|g;Feldsalat|60|g;Meerrettich|1|TL;Apfelessig|1|EL;Rapsöl|1|TL;Sonnenblumenkerne|10|g", "lentils", "bread", "Rote Bete und Linsen zuerst mit dem Dressing vermengen und Feldsalat sowie Kerne erst direkt vor dem Essen unterheben."],
    ["Erzgebirgische Holunderbeersuppe mit Grießklößchen", "Warme Holunderbeersuppe mit Apfel und kleinen Grießklößchen, inspiriert vom festlichen Neunerlei.", "starter", "vegetarian", 30, "saxon-fruit-soup", [17, 50, 7], "Holunderbeersaft|250|ml;Apfel|120|g;Weichweizengrieß|35|g;Ei|1|Stk.;Skyr|100|g;Zitrone|0.5|Stk.;Zimt|1|Prise", "skyr", "bread", "Die Grießmasse kurz quellen lassen, kleine Klößchen abstechen und nur sanft in der Suppe ziehen lassen."],
    ["Saure Schwamme mit Kräuterkartoffeln", "Gebratene Champignons in milder süß-saurer Sauce mit kleinen Petersilienkartoffeln nach erzgebirgischem Vorbild.", "starter", "vegetarian", 35, "saxon-mushroom-pan", [16, 42, 12], "Champignons|240|g;Kartoffeln|220|g;Zwiebel|50|g;Gemüsebrühe|180|ml;Skyr|80|g;Apfelessig|1|EL;Petersilie|10|g;Rapsöl|1|TL", "cottage", "bread", "Die Pilze sehr heiß anbraten, erst danach mit Brühe ablöschen und die Säure zum Schluss fein ausbalancieren."],
    ["Dresdner Fettbemme mit Radieschen-Apfel-Salat", "Dünn mit Butterschmalz bestrichenes Roggenbrot mit körnigem Frischkäse und einem knackigen Radieschen-Apfel-Salat.", "starter", "vegetarian", 15, "saxon-bread", [16, 45, 16], "Roggenbrot|100|g;Butterschmalz|12|g;Körniger Frischkäse|100|g;Radieschen|100|g;Apfel|100|g;Gurke|80|g;Schnittlauch|8|g;Apfelessig|1|TL", "cottage", "bread", "Das warme Brot nur hauchdünn bestreichen und den frischen Salat separat daraufgeben, damit die Bemme knusprig bleibt."],
    ["Raacher Maad mit Apfel-Kräuterquark", "Goldbraun gebratene Kartoffelmasse aus dem Erzgebirge mit frischem Apfel-Kräuterquark.", "main", "vegetarian", 40, "saxon-potato-pan", [30, 68, 16], "Gekochte Kartoffeln|350|g;Magerquark|220|g;Apfel|120|g;Zwiebel|60|g;Ei|1|Stk.;Weizenmehl|30|g;Majoran|1|TL;Rapsöl|2|TL", "skyr", "potato", "Die Kartoffelmasse flach in der Pfanne verteilen und erst wenden, wenn sich eine kräftige goldbraune Kruste gebildet hat."],
    ["Aardäppelgetzen mit Lauch und Schnittlauchquark", "Herzhafter erzgebirgischer Kartoffelgetzen mit Buttermilch, Lauch und einem kühlen Schnittlauchquark.", "main", "vegetarian", 50, "saxon-potato-bake", [30, 72, 17], "Kartoffeln|380|g;Buttermilch|180|ml;Magerquark|180|g;Ei|1|Stk.;Lauch|120|g;Haferflocken|30|g;Schnittlauch|10|g;Rapsöl|1|TL", "skyr", "potato", "Die Form gut vorheizen und die Kartoffelmasse nicht zu dick einfüllen, damit der Getzen am Rand knusprig wird."],
    ["Griene Kließ mit Apfelsauerkraut und Röstzwiebeln", "Erzgebirgische Kartoffelklöße aus rohen und gekochten Kartoffeln mit mildem Apfelsauerkraut.", "main", "vegetarian", 60, "saxon-dumpling", [26, 78, 14], "Rohe Kartoffeln|300|g;Gekochte Kartoffeln|120|g;Sauerkraut|180|g;Apfel|100|g;Zwiebel|60|g;Semmelbrösel|25|g;Ei|1|Stk.;Petersilie|10|g", "cottage", "potato", "Die rohen Kartoffeln sehr trocken ausdrücken und die Klöße nur in siedendem, nicht sprudelndem Wasser gar ziehen lassen."],
    ["Erzgebirgischer Krautflammkuchen mit Putenstreifen", "Dünner Flammkuchen mit Sauerkraut, Apfel, roter Zwiebel und mageren Putenstreifen.", "main", "omnivore", 45, "saxon-flatbread", [43, 76, 16], "Weizenmehl|110|g;Putenbrust|160|g;Sauerkraut|150|g;Joghurt|100|g;Apfel|80|g;Rote Zwiebel|50|g;Trockenhefe|0.5|Pkg.;Rapsöl|1|TL", "turkey", "bread", "Den Teig sehr dünn ausrollen, Sauerkraut gut ausdrücken und die Putenstreifen gleichmäßig verteilen."],
    ["Neunerlei-Bratwurst mit Apfelsauerkraut", "Erzgebirgisch inspirierter Teller mit Bratwurst, Apfelsauerkraut und knusprigen Kartoffelstücken.", "main", "omnivore", 40, "saxon-sausage-pan", [32, 72, 23], "Fettreduzierte Bratwurst|180|g;Kartoffeln|300|g;Sauerkraut|180|g;Apfel|100|g;Zwiebel|60|g;Mittelscharfer Senf|1|TL;Rapsöl|1|TL", "turkey", "potato", "Bratwurst und Kartoffeln getrennt bräunen und erst zum Schluss mit dem nur kurz erwärmten Apfelsauerkraut anrichten."],
    ["Neunerlei-Hähnchenkeule mit Apfelrotkohl", "Alltagstauglicher Festtagsteller mit Hähnchenkeule, Apfelrotkohl und Kartoffelklößen nach Neunerlei-Vorbild.", "main", "omnivore", 55, "saxon-roast", [46, 78, 23], "Hähnchenkeule ohne Knochen|220|g;Kartoffelklöße|220|g;Rotkohl|180|g;Apfel|100|g;Zwiebel|60|g;Geflügelbrühe|180|ml;Mittelscharfer Senf|1|TL;Rapsöl|1|TL", "turkey", "potato", "Die Hähnchenkeule zuerst mit der Hautseite nach unten bräunen und den Rotkohl mit frischem Apfel nur behutsam erwärmen."],
    ["Kartoffelbrei mit sauren Schwammen und Spiegelei", "Erzgebirgisches Wohlfühlgericht aus lockerem Kartoffelbrei, süß-sauren Pilzen und Spiegelei.", "main", "vegetarian", 40, "saxon-mash", [31, 63, 18], "Kartoffeln|320|g;Champignons|240|g;Eier|2|Stk.;Milch|120|ml;Zwiebel|60|g;Skyr|80|g;Apfelessig|1|EL;Petersilie|10|g", "egg", "potato", "Die Pilze kräftig rösten, dann süß-sauer abschmecken und getrennt vom lockeren Kartoffelbrei anrichten."],
    ["Vogtländischer Spinat-Bambes mit Pilzen", "Knuspriger Kartoffelbambes mit Blattspinat, gebratenen Pilzen und leichtem Kräuterquark.", "main", "vegetarian", 45, "saxon-potato-pan", [32, 70, 18], "Kartoffeln|340|g;Blattspinat|150|g;Champignons|180|g;Magerquark|180|g;Ei|1|Stk.;Haferflocken|30|g;Petersilie|10|g;Rapsöl|2|TL", "skyr", "potato", "Spinat und Pilze separat trocken garen, damit die Kartoffelmasse beim Ausbacken fest und knusprig bleibt."],
    ["Vogtländischer Kürbis-Bambes mit Kräuterquark", "Herbstliche Bambes aus Kartoffeln und Hokkaido mit frischem Kräuterquark.", "main", "vegetarian", 45, "saxon-potato-pan", [30, 72, 16], "Kartoffeln|260|g;Hokkaidokürbis|180|g;Magerquark|220|g;Ei|1|Stk.;Weizenmehl|35|g;Schnittlauch|10|g;Muskat|1|Prise;Rapsöl|2|TL", "skyr", "potato", "Kartoffel und Kürbis fein raspeln, gründlich ausdrücken und in kleinen Portionen mit wenig Öl ausbacken."],
    ["Sächsischer Wiegebraten mit Bohnen und Kartoffeln", "Saftiger Hackbraten mit Senf und Zwiebel, dazu grüne Bohnen und Petersilienkartoffeln.", "main", "omnivore", 55, "saxon-meatloaf", [44, 66, 20], "Mageres Rinderhack|190|g;Kartoffeln|300|g;Grüne Bohnen|180|g;Zwiebel|60|g;Ei|1|Stk.;Semmelbrösel|30|g;Mittelscharfer Senf|1|EL;Rapsöl|1|TL", "beef", "potato", "Die Hackmasse nur kurz mischen und den Braten vor dem Anschneiden einige Minuten ruhen lassen, damit er saftig bleibt."],
    ["Vogtländisches Bierfleisch mit Wurzelgemüse", "Langsam geschmortes Rindfleisch mit dunklem Bier, Möhren und Kartoffeln als bodenständige Vogtland-Variante.", "main", "omnivore", 60, "saxon-beer-stew", [45, 62, 18], "Rindergulasch|190|g;Kartoffeln|280|g;Möhren|150|g;Zwiebel|70|g;Dunkles Bier|150|ml;Rinderbrühe|200|ml;Mittelscharfer Senf|1|TL;Rapsöl|1|TL", "beef", "potato", "Das Fleisch portionsweise dunkel anrösten und das Bier anschließend offen etwas einkochen lassen, bevor die Brühe dazukommt."],
    ["Erzgebirgischer Sauerkraut-Linsen-Auflauf", "Pflanzenbetonter Kartoffelauflauf mit Sauerkraut, Linsen, Apfel und einer milden Hafercreme.", "main", "vegan", 50, "saxon-lentil-bake", [29, 76, 12], "Gekochte Linsen|220|g;Kartoffeln|260|g;Sauerkraut|180|g;Apfel|100|g;Hafercuisine|80|ml;Zwiebel|60|g;Semmelbrösel|25|g;Rapsöl|1|TL", "lentils", "potato", "Sauerkraut gut ausdrücken und die Kartoffelscheiben dünn schneiden, damit der Auflauf gleichmäßig gart."],
    ["Erzgebirgische Heidelbeergetzen mit Vanille-Skyr", "Süße Kartoffelgetzen mit Heidelbeeren, Quark und einer kühlen Vanille-Skyr-Creme.", "dessert", "vegetarian", 40, "saxon-sweet-pan", [26, 68, 12], "Kartoffeln|220|g;Heidelbeeren|180|g;Magerquark|200|g;Ei|1|Stk.;Weizenmehl|40|g;Skyr|100|g;Vanille|1|Prise;Rapsöl|1|TL", "dessert", "oats", "Die Heidelbeeren erst nach dem Wenden auf die Getzen geben, damit der Teig stabil bleibt und die Früchte saftig bleiben."],
    ["Neunerlei-Semmelmilch mit Apfel und Mohn", "Warme Brotspeise aus Milch, Apfel und Mohn mit cremigem Skyr, angelehnt an den süßen Abschluss des Neunerlei.", "dessert", "vegetarian", 30, "saxon-bread-pudding", [24, 70, 12], "Vollkornbrötchen|110|g;Milch|300|ml;Skyr|160|g;Apfel|150|g;Mohn|15|g;Vanille|1|Prise;Zimt|1|Prise;Honig|1|TL", "dessert", "oats", "Die Brotstücke nur übergießen und ziehen lassen, nicht zerdrücken; so bleibt die Semmelmilch angenehm strukturiert."],
    ["Erzgebirgischer Stollen-Quark-Auflauf", "Stolleninspirierter Quarkauflauf mit Apfel, Rosinen, Mandeln, Orange und Zimt.", "dessert", "vegetarian", 45, "saxon-festive-bake", [28, 72, 15], "Magerquark|250|g;Haferflocken|50|g;Apfel|120|g;Rosinen|25|g;Mandeln|15|g;Ei|1|Stk.;Orange|0.5|Stk.;Zimt|1|TL", "dessert", "oats", "Rosinen kurz in Orangensaft einweichen und die Mandeln erst zum Ende der Backzeit aufstreuen."],
    ["Pflaumen-Quark-Bambes mit Zimt", "Süße vogtländische Kartoffelpuffer mit Quark, warmen Pflaumen und Zimt.", "dessert", "vegetarian", 40, "saxon-sweet-pan", [29, 66, 14], "Gekochte Kartoffeln|180|g;Magerquark|220|g;Pflaumen|200|g;Ei|1|Stk.;Weizenmehl|45|g;Zimt|1|TL;Zitrone|0.25|Stk.;Rapsöl|1|TL", "dessert", "oats", "Die Kartoffeln kalt verarbeiten und die Pflaumen separat nur kurz erhitzen, damit die Puffer knusprig bleiben."],
    ["Dresdner Schoko-Marzipan-Quarkwürfel", "Kleine Quarkwürfel mit Kakao, Marzipan und Beerenkonfitüre als alltagstaugliche Hommage an Dresdner Süßwarenkunst.", "dessert", "vegetarian", 50, "saxon-chocolate-bake", [27, 64, 17], "Magerquark|230|g;Weizenmehl|70|g;Marzipan|30|g;Beerenkonfitüre|25|g;Backkakao|10|g;Ei|1|Stk.;Milch|80|ml;Orange|0.25|Stk.", "dessert", "oats", "Marzipan sehr klein würfeln, gleichmäßig verteilen und die ausgekühlte Masse erst danach in kleine Stücke schneiden."],
    ["Sächsischer Apfel-Prasselkuchen mit Quark", "Knuspriger Blätterteigkuchen mit Apfel, Quark und Haferstreuseln in einer portionsgerechten Küchenenergie-Fassung.", "dessert", "vegetarian", 45, "saxon-pastry", [25, 72, 20], "Blätterteig|100|g;Magerquark|180|g;Apfel|180|g;Haferflocken|30|g;Ei|1|Stk.;Zimt|1|TL;Zitrone|0.25|Stk.;Vanille|1|Prise", "dessert", "oats", "Den Blätterteig gut gekühlt verarbeiten und die Haferstreusel erst kurz vor dem Backen locker aufsetzen."]
  ];

  function buildSaxonRecipes() {
    return [...saxonSpecs, ...saxonExpansionSpecs].map((spec) => {
      const [title, description, course, diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip] = spec;
      return { title, description, course, cuisine: "saechsisch", diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip, researchBasis: saxonSource };
    });
  }

  const snackSource = "Eigene Rezeptentwicklung nach Recherche zu alltagstauglichen Snackkategorien bei BZfE, REWE und FIT FOR FUN (Abruf Juli 2026); keine Rezepttexte übernommen";
  const snackSpecs = [
    ["Skyr-Apfel-Zimt-Becher", "Kühler Proteinbecher mit knackigem Apfel, Skyr und einem kleinen Hafer-Crunch.", "klassisch", "vegetarian", 5, "snack-sweet-cup", [22, 30, 5], "Skyr|200|g;Apfel|120|g;Haferflocken|20|g;Zimt|1|Prise;Zitrone|0.25|Stk.;Honig|1|TL", "skyr", "fruit", "Apfel erst kurz vor dem Essen schneiden und unterheben, damit er frisch und knackig bleibt."],
    ["Hüttenkäse-Gurken-Cup", "Herzhafter Mini-Becher mit körnigem Frischkäse, Gurke, Radieschen und Schnittlauch.", "deutsch", "vegetarian", 8, "snack-cup", [23, 12, 8], "Körniger Frischkäse|200|g;Gurke|120|g;Radieschen|80|g;Schnittlauch|8|g;Zitrone|0.25|Stk.;Roggenknäckebrot|25|g", "cottage", "bread", "Das Knäckebrot getrennt mitnehmen und erst beim Essen zerbrechen, damit es knusprig bleibt."],
    ["Paprika-Hummus-Boote", "Knackige Paprikastücke mit einer milden Hummusfüllung und frischen Kräutern.", "orientalisch", "vegan", 10, "snack-cup", [10, 29, 11], "Rote Paprika|180|g;Hummus|100|g;Gurke|80|g;Petersilie|8|g;Zitrone|0.25|Stk.;Vollkornknäckebrot|25|g", "tofu", "bread", "Die Paprika breit schneiden und trocken tupfen, damit die Hummusfüllung sicher darauf hält."],
    ["Chili-Edamame mit Limette", "Warme Edamame mit Limette, milder Chiliwürze und geröstetem Sesam.", "asiatisch", "vegan", 10, "snack-pan", [19, 18, 10], "Edamame ohne Schale|180|g;Limette|0.5|Stk.;Sesam|10|g;Chiliflocken|1|Prise;Sojasauce|1|TL;Frühlingszwiebel|25|g", "tofu", "rice", "Edamame nur kurz erhitzen und Limettensaft erst nach dem Garen darübergeben."],
    ["Bananen-Erdnuss-Kakao-Happen", "Schnelle Bananenscheiben mit Erdnussmus, Kakao und einem Hauch Zimt.", "klassisch", "vegan", 7, "snack-sweet-bites", [8, 35, 12], "Banane|140|g;Erdnussmus|25|g;Backkakao|1|TL;Zimt|1|Prise;Haferflocken|15|g;Zitrone|0.25|Stk.", "tofu", "oats", "Die Happen kurz kühlen, damit das Erdnussmus fester wird und nichts verrutscht."],
    ["Spinat-Rührei-Tasse", "Warmes Rührei mit Blattspinat, Tomate und Schnittlauch für den kleinen Hunger.", "deutsch", "vegetarian", 10, "snack-pan", [23, 10, 14], "Eier|2|Stk.;Blattspinat|80|g;Kirschtomaten|100|g;Körniger Frischkäse|70|g;Schnittlauch|8|g;Rapsöl|1|TL", "egg", "bread", "Das Ei bei milder Hitze nur knapp stocken lassen und den Frischkäse zum Schluss unterheben."],
    ["Thunfisch-Gurken-Taler", "Saftige Gurkenscheiben mit leichter Thunfischcreme und Dill.", "klassisch", "omnivore", 10, "snack-cup", [26, 9, 7], "Thunfisch im eigenen Saft|130|g;Gurke|180|g;Skyr|80|g;Dill|6|g;Zitrone|0.25|Stk.;Vollkornknäckebrot|20|g", "fish", "bread", "Die Gurkenscheiben trocken tupfen und die Creme erst unmittelbar vor dem Servieren aufsetzen."],
    ["Radieschen-Kräuterquark auf Knäckebrot", "Bodenständiger Quarksnack mit Radieschen, Gurke und knusprigem Roggenknäckebrot.", "deutsch", "vegetarian", 8, "snack-cup", [24, 31, 5], "Magerquark|200|g;Roggenknäckebrot|45|g;Radieschen|90|g;Gurke|80|g;Schnittlauch|8|g;Milch|25|ml", "skyr", "bread", "Den Quark separat transportieren und das Knäckebrot erst direkt vor dem Essen bestreichen."],
    ["Kichererbsen-Tomaten-Cup", "Mediterraner Bechersalat mit Kichererbsen, Tomate, Gurke und Petersilie.", "mediterran", "vegan", 10, "snack-cup", [11, 31, 9], "Gekochte Kichererbsen|150|g;Kirschtomaten|120|g;Gurke|100|g;Petersilie|8|g;Zitrone|0.5|Stk.;Olivenöl|1|TL", "lentils", "bread", "Tomaten und Gurke erst kurz vor dem Essen salzen, damit der Bechersalat nicht wässrig wird."],
    ["Beeren-Joghurt-Hafer-Glas", "Fruchtiges Joghurtglas mit Beeren, Haferflocken und Sonnenblumenkernen.", "klassisch", "vegetarian", 5, "snack-sweet-cup", [19, 35, 9], "Griechischer Joghurt|180|g;Beeren|140|g;Haferflocken|25|g;Sonnenblumenkerne|12|g;Zitrone|0.25|Stk.;Honig|1|TL", "skyr", "oats", "Haferflocken und Kerne obenauf geben und erst beim Essen unterrühren, damit sie Biss behalten."],
    ["Paprika-Knusper-Kichererbsen", "Ofengeröstete Kichererbsen mit Paprika, Knoblauch und frischer Petersilie.", "orientalisch", "vegan", 20, "snack-oven", [13, 38, 8], "Gekochte Kichererbsen|200|g;Rapsöl|1|TL;Paprikapulver|1|TL;Knoblauch|0.5|Stk.;Petersilie|8|g;Zitrone|0.25|Stk.", "lentils", "bread", "Die Kichererbsen vor dem Rösten sehr trocken tupfen und mit Abstand auf dem Blech verteilen."],
    ["Hüttenkäse-Tomaten-Bowl", "Kleine Schale aus körnigem Frischkäse, Tomaten, Paprika und Basilikum.", "mediterran", "vegetarian", 6, "snack-cup", [25, 16, 9], "Körniger Frischkäse|200|g;Kirschtomaten|140|g;Paprika|100|g;Basilikum|8|g;Balsamico|1|TL;Vollkornknäckebrot|20|g", "cottage", "bread", "Balsamico sparsam dosieren und erst ganz am Ende über die Schale träufeln."],
    ["Apfel-Quark-Creme mit Sonnenblumenkernen", "Cremiger Quarksnack mit Apfel, Zimt und gerösteten Sonnenblumenkernen.", "deutsch", "vegetarian", 7, "snack-sweet-cup", [25, 32, 7], "Magerquark|220|g;Apfel|130|g;Sonnenblumenkerne|15|g;Milch|30|ml;Zimt|1|Prise;Zitrone|0.25|Stk.", "skyr", "fruit", "Die Kerne trocken anrösten, vollständig abkühlen lassen und erst zum Schluss aufstreuen."],
    ["Räucherlachs-Gurken-Röllchen", "Kleine Gurkenröllchen mit Räucherlachs, Frischkäse und Dill.", "klassisch", "omnivore", 10, "snack-roll", [23, 8, 13], "Räucherlachs|100|g;Gurke|180|g;Frischkäse leicht|70|g;Dill|6|g;Zitrone|0.25|Stk.;Roggenknäckebrot|20|g", "fish", "bread", "Gurkenstreifen trocken tupfen und straff, aber ohne Druck um die Füllung rollen."],
    ["Tofu-Gemüse-Spieße aus der Pfanne", "Schnelle Mini-Spieße mit Tofu, Paprika, Zucchini und milder Sojawürze.", "asiatisch", "vegan", 15, "snack-skewer-pan", [22, 18, 13], "Naturtofu|180|g;Paprika|120|g;Zucchini|120|g;Sojasauce|1|EL;Sesam|8|g;Rapsöl|1|TL", "tofu", "rice", "Tofu und Gemüse separat bräunen und erst danach auf kurze Spieße stecken."],
    ["Mikrowellen-Beeren-Porridge", "Kleines warmes Porridge mit Beeren, Haferflocken und cremigem Skyr.", "klassisch", "vegetarian", 8, "snack-mug", [20, 42, 7], "Haferflocken|45|g;Milch|140|ml;Beeren|120|g;Skyr|130|g;Zimt|1|Prise;Sonnenblumenkerne|10|g", "skyr", "oats", "Die Tasse höchstens zu zwei Dritteln füllen und beim Erhitzen einmal gründlich umrühren."],
    ["Tomate-Mozzarella-Spieße", "Kleine Spieße mit Kirschtomaten, Mozzarella, Gurke und Basilikum.", "mediterran", "vegetarian", 10, "snack-skewer", [20, 13, 16], "Mozzarella leicht|150|g;Kirschtomaten|160|g;Gurke|100|g;Basilikum|8|g;Balsamico|1|TL;Vollkornbrot|35|g", "cottage", "bread", "Balsamico erst nach dem Aufspießen sparsam darübergeben, damit die Zutaten nicht abrutschen."],
    ["Puten-Gurken-Röllchen", "Herzhafte Röllchen aus Putenbrustaufschnitt, Gurke, Frischkäse und Paprika.", "deutsch", "omnivore", 8, "snack-roll", [26, 12, 8], "Putenbrustaufschnitt|120|g;Gurke|140|g;Frischkäse leicht|70|g;Paprika|100|g;Schnittlauch|8|g;Vollkornknäckebrot|20|g", "turkey", "bread", "Die Röllchen mit Schnittlauch fixieren und bis zum Servieren zugedeckt kühl stellen."],
    ["Kakao-Bananen-Skyr-Shake", "Sämiger Shake aus Banane, Skyr, Kakao und Haferflocken.", "klassisch", "vegetarian", 5, "snack-shake", [27, 44, 5], "Skyr|220|g;Banane|120|g;Milch|140|ml;Haferflocken|20|g;Backkakao|1|TL;Zimt|1|Prise", "skyr", "fruit", "Eine sehr reife Banane liefert genug Süße, sodass kein zusätzlicher Zucker nötig ist."],
    ["Linsen-Möhren-Salat im Glas", "Kleiner Linsensalat mit Möhre, Paprika und einem frischen Zitronendressing.", "deutsch", "vegan", 12, "snack-cup", [14, 38, 8], "Gekochte Linsen|180|g;Möhre|100|g;Rote Paprika|100|g;Petersilie|8|g;Zitrone|0.5|Stk.;Olivenöl|1|TL", "lentils", "bread", "Das Dressing unten ins Glas geben und den Salat erst kurz vor dem Essen durchschütteln."],
    ["Beeren-Protein-Tassenküchlein", "Schnelles kleines Küchlein mit Quark, Ei, Hafer und Beeren.", "klassisch", "vegetarian", 10, "snack-mug", [24, 30, 9], "Magerquark|160|g;Ei|1|Stk.;Haferflocken|35|g;Beeren|100|g;Backpulver|0.5|TL;Vanille|1|Prise", "dessert", "oats", "Eine ausreichend große Tasse verwenden und die Masse nur so lange garen, bis die Mitte fest ist."],
    ["Maiswaffeln mit Avocado-Hüttenkäse", "Knusprige Maiswaffeln mit Avocado, körnigem Frischkäse und Tomate.", "mediterran", "vegetarian", 8, "snack-cup", [20, 31, 14], "Maiswaffeln|40|g;Avocado|70|g;Körniger Frischkäse|160|g;Kirschtomaten|100|g;Zitrone|0.25|Stk.;Schnittlauch|8|g", "cottage", "bread", "Den Belag getrennt aufbewahren und die Maiswaffeln erst unmittelbar vor dem Essen bestreichen."],
    ["Süßkartoffel-Sticks mit Joghurtdip", "Kleine Ofenportion aus Süßkartoffelsticks mit würzigem Kräuterjoghurt.", "klassisch", "vegetarian", 20, "snack-oven", [15, 43, 8], "Süßkartoffel|240|g;Griechischer Joghurt|140|g;Rapsöl|1|TL;Paprikapulver|1|TL;Petersilie|8|g;Zitrone|0.25|Stk.", "skyr", "potato", "Die Sticks dünn und gleichmäßig schneiden und mit Abstand auf einem heißen Blech backen."],
    ["Sächsischer Leinölquark-Radieschen-Cup", "Kleiner Kräuterquark mit Leinöl, Radieschen, Gurke und Roggenknäckebrot.", "saechsisch", "vegetarian", 8, "snack-cup", [25, 28, 10], "Magerquark|220|g;Radieschen|100|g;Gurke|100|g;Leinöl|1|TL;Schnittlauch|8|g;Roggenknäckebrot|35|g", "skyr", "bread", "Leinöl nicht erhitzen, sondern erst kurz vor dem Essen auf den Quark träufeln."]
  ];

  function buildSnackRecipes() {
    return snackSpecs.map((spec) => {
      const [title, description, cuisine, diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip] = spec;
      return { title, description, course: "snack", cuisine, diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip, researchBasis: snackSource };
    });
  }

  const generalSpecs = [
    ...buildGeneralStarters(),
    ...buildGeneralMains(),
    ...buildGeneralDesserts()
  ];
  const saxonRecipeSpecs = buildSaxonRecipes();
  const snackRecipeSpecs = buildSnackRecipes();
  const extensionRecipes = [
    ...generalSpecs.map((spec, index) => makeRecipe(spec, index)),
    ...saxonRecipeSpecs.map((spec, index) => makeRecipe(spec, index, "sachsen")),
    ...snackRecipeSpecs.map((spec, index) => makeRecipe(spec, index, "snack"))
  ];
  const baseRecipes = baseCatalog.buildRecipes();
  const allRecipes = [...baseRecipes, ...extensionRecipes];

  if (generalSpecs.length !== 470 || saxonRecipeSpecs.length !== 54 || snackRecipeSpecs.length !== 24 || allRecipes.length !== 648) {
    throw new Error(`Unerwartete Kataloggröße: ${baseRecipes.length} + ${generalSpecs.length} + ${saxonRecipeSpecs.length} + ${snackRecipeSpecs.length}`);
  }

  global.KuechenenergieRecipeCatalog = {
    buildRecipes: () => allRecipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
      steps: [...recipe.steps]
    })),
    stats: {
      baseRecipes: allRecipes.length,
      adaptiveVariants: 25920,
      saxonRecipes: saxonRecipeSpecs.length + snackRecipeSpecs.filter((recipe) => recipe.cuisine === "saechsisch").length,
      snackRecipes: snackRecipeSpecs.length
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
