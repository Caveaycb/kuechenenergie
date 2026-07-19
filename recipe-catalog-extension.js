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
    if (/walnuss|erdnuss|cashew|mandel|haselnuss|nussmus|marzipan/.test(text)) allergens.push("nüsse");
    if (/tofu|sojajoghurt|sojasauce|tempeh/.test(text)) allergens.push("soja");
    if (/lachs|fisch|thunfisch|kabeljau|seelachs|garnele|karpfen/.test(text)) allergens.push("fisch");
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
              ingredients: `${proteinName}|${proteinName === "Eier" ? 2 : proteinName.includes("Linsen") || proteinName.includes("Bohnen") || proteinName.includes("Kichererbsen") ? 220 : 180}|${proteinName === "Eier" ? "Stk." : "g"};${sideName}|${energyBoost === "rice" || energyBoost === "pasta" || energyBoost === "couscous" ? 80 : 260}|g;${firstVegetable}|160|g;${secondVegetable}|120|g;${culture.sauce}|180|${culture.sauce.includes("cuisine") || culture.sauce.includes("brühe") ? "ml" : "g"};${aromatic}|60|g;${culture.spice}|1|TL;${finish}|${finish === "Sesam" ? 10 : finish === "Petersilie" ? 10 : 0.5}|${finish === "Sesam" || finish === "Petersilie" ? "g" : "Stk."};Rapsöl|1|TL`,
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

  const saxonSource = "Regionales Sachsen (LfULG), Sachsen-Publikationen sowie offizielle Tourismusinformationen aus Leipzig und Dresden";
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

  function buildSaxonRecipes() {
    return saxonSpecs.map((spec) => {
      const [title, description, course, diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip] = spec;
      return { title, description, course, cuisine: "saechsisch", diet, time, family, macros, ingredients, proteinBoost, energyBoost, tip, researchBasis: saxonSource };
    });
  }

  const generalSpecs = [
    ...buildGeneralStarters(),
    ...buildGeneralMains(),
    ...buildGeneralDesserts()
  ];
  const saxonRecipeSpecs = buildSaxonRecipes();
  const extensionRecipes = [
    ...generalSpecs.map((spec, index) => makeRecipe(spec, index)),
    ...saxonRecipeSpecs.map((spec, index) => makeRecipe(spec, index, "sachsen"))
  ];
  const baseRecipes = baseCatalog.buildRecipes();
  const allRecipes = [...baseRecipes, ...extensionRecipes];

  if (generalSpecs.length !== 470 || saxonRecipeSpecs.length !== 30 || allRecipes.length !== 600) {
    throw new Error(`Unerwartete Kataloggröße: ${baseRecipes.length} + ${generalSpecs.length} + ${saxonRecipeSpecs.length}`);
  }

  global.KuechenenergieRecipeCatalog = {
    buildRecipes: () => allRecipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
      steps: [...recipe.steps]
    })),
    stats: {
      baseRecipes: allRecipes.length,
      adaptiveVariants: 24000,
      saxonRecipes: saxonRecipeSpecs.length
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
