(function initializeRecipeCatalog(global) {
  "use strict";

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
    if (/brot|toast|brötchen|mehl|panier|couscous|bulgur|pasta|spaghetti|nudel|gnocchi|wrap|tortilla|hafer|grieß/.test(text)) allergens.push("gluten");
    if (/joghurt|skyr|quark|feta|halloumi|mozzarella|frischkäse|milch|butter|parmesan|hüttenkäse|schmand/.test(text)) allergens.push("laktose");
    if (/walnuss|erdnuss|cashew|mandel|haselnuss|nussmus/.test(text)) allergens.push("nüsse");
    if (/tofu|sojajoghurt|sojasauce|tempeh/.test(text)) allergens.push("soja");
    if (/lachs|fisch|thunfisch|kabeljau|seelachs|garnele/.test(text)) allergens.push("fisch");
    return allergens;
  }

  const proteinBoosters = {
    chicken: ["Hähnchenbrust", "g", 250, "Die zusätzliche Hähnchenbrust gleichmäßig schneiden, passend zum Gericht würzen und vollständig durchgaren.", [110, 23, 0, 1.5]],
    turkey: ["Putenbrust", "g", 250, "Die zusätzliche Putenbrust in gleichmäßige Stücke schneiden, kräftig anbraten und vollständig durchgaren.", [108, 24, 0, 1]],
    beef: ["Mageres Rindfleisch", "g", 220, "Das zusätzliche Rindfleisch portionsweise scharf anbraten und erst kurz vor dem Servieren mit dem Gericht verbinden.", [137, 21, 0, 5]],
    fish: ["Seelachsfilet", "g", 220, "Das zusätzliche Seelachsfilet würzen, schonend garen und in saftigen Stücken zum Gericht geben.", [88, 20, 0, 1]],
    salmon: ["Lachsfilet", "g", 200, "Das zusätzliche Lachsfilet bei mittlerer Hitze garen, bis es sich leicht in saftige Lamellen teilen lässt.", [200, 20, 0, 13]],
    tuna: ["Thunfisch im eigenen Saft", "g", 200, "Den zusätzlichen Thunfisch gut abtropfen lassen und erst zum Schluss behutsam unterheben.", [116, 26, 0, 1]],
    shrimp: ["Garnelen", "g", 220, "Die zusätzlichen Garnelen trocken tupfen und nur kurz braten, bis sie gerade eben durchgegart sind.", [95, 20, 1, 1]],
    egg: ["Ei", "g", 180, "Das zusätzliche Ei verquirlen und passend zur Zubereitung vollständig stocken lassen, ohne es trocken zu garen.", [143, 13, 1, 10]],
    skyr: ["Skyr", "g", 300, "Den zusätzlichen Skyr mit Kräutern oder Gewürzen aus dem Rezept glatt rühren und als kühlen Dip servieren.", [63, 11, 4, 0.2]],
    cottage: ["Körniger Frischkäse", "g", 260, "Den zusätzlichen körnigen Frischkäse gut abtropfen lassen und kurz vor dem Servieren unterheben oder daraufgeben.", [98, 12, 3, 4]],
    tofu: ["Naturtofu", "g", 280, "Den zusätzlichen Tofu trocken tupfen, würfeln und in einer beschichteten Pfanne rundum goldbraun braten.", [152, 15, 5, 8]],
    lentils: ["Gekochte Linsen", "g", 300, "Die zusätzlichen Linsen abspülen, gut abtropfen lassen und während der letzten Garphase vollständig erhitzen.", [116, 9, 20, 0.5]],
    soy: ["Sojajoghurt natur", "g", 300, "Den zusätzlichen Sojajoghurt glatt rühren und passend gewürzt als Creme oder Dip ergänzen.", [54, 4, 3, 3]],
    dessert: ["Magerquark", "g", 300, "Den zusätzlichen Magerquark mit etwas Flüssigkeit und den Aromazutaten des Desserts cremig rühren.", [68, 12, 4, 0.3]],
    dessertVegan: ["Veganes Proteinpulver, neutral", "g", 70, "Das Proteinpulver portionsweise mit Pflanzendrink glatt rühren und klümpchenfrei in die Dessertmasse einarbeiten.", [375, 72, 8, 7]]
  };

  const energyBoosters = {
    rice: ["Langkornreis (Trockengewicht)", "g", 150, "Den zusätzlichen Reis mit Deckel nach Packungsangabe garen, ausdampfen lassen und als passende Beilage servieren.", [351, 7.5, 78, 1]],
    potato: ["Kartoffeln", "g", 350, "Die zusätzlichen Kartoffeln in gleich große Stücke schneiden und passend zum Grundrezept kochen, backen oder anbraten.", [77, 2, 17, 0.1]],
    pasta: ["Pasta (Trockengewicht)", "g", 140, "Die zusätzliche Pasta knapp bissfest garen und mit etwas Kochwasser direkt in der Sauce fertigziehen.", [350, 12, 70, 2]],
    couscous: ["Couscous (Trockengewicht)", "g", 140, "Den zusätzlichen Couscous mit heißer Flüssigkeit übergießen, zugedeckt quellen lassen und anschließend auflockern.", [360, 12, 72, 2]],
    bread: ["Vollkornbrot", "g", 180, "Das zusätzliche Vollkornbrot in Scheiben schneiden, nach Wunsch kurz rösten und zum Gericht reichen.", [230, 8, 43, 2]],
    oats: ["Haferflocken", "g", 150, "Die zusätzlichen Haferflocken in die Masse einarbeiten und genügend Flüssigkeit sowie Quellzeit einplanen.", [353, 13, 59, 7]],
    fruit: ["Zusätzliches Obst", "g", 300, "Das zusätzliche Obst vorbereiten und frisch, gedünstet oder gebacken passend zum Dessert ergänzen.", [55, 0.5, 13, 0.2]]
  };

  function booster(definition) {
    const [name, unit, maxAmount, instruction, values] = definition;
    return { name, unit, maxAmount, instruction, macros: macro(values[1], values[2], values[3]) };
  }

  const methods = {
    soup: (r) => [
      `Zuerst ${r.a}, ${r.b} und die übrigen Gemüsezutaten gründlich waschen, schälen und in gleich große Stücke schneiden.`,
      `${r.a} und ${r.b} in einem ausreichend großen Topf bei mittlerer Hitze kurz anschwitzen, ohne das Gemüse dunkel werden zu lassen.`,
      `Die vorgesehene Brühe angießen, alles einmal aufkochen und anschließend mit aufgelegtem Deckel sanft garen, bis das Gemüse weich ist.`,
      `Einen Teil der Einlage herausnehmen, die übrige Suppe fein pürieren und anschließend die Stücke für eine abwechslungsreiche Konsistenz zurückgeben.`,
      `Die Suppe erneut erhitzen und mit den im Rezept genannten Kräutern, Gewürzen und einer kleinen Menge Säure ausgewogen abschmecken.`,
      `Vor dem Servieren die Temperatur und Konsistenz prüfen; bei Bedarf esslöffelweise Wasser oder Brühe ergänzen und noch einmal umrühren.`,
      `${r.title} in vorgewärmte Schalen füllen, die vorgesehene Garnitur erst jetzt darübergeben und direkt servieren.`
    ],
    salad: (r) => [
      `${r.a}, ${r.b} und ${r.c} getrennt vorbereiten, waschen beziehungsweise abtropfen lassen und in gut essbare Stücke schneiden.`,
      `Feste oder rohe Bestandteile zunächst mit einer kleinen Prise Salz mischen und einige Minuten ziehen lassen, damit sie aromatischer werden.`,
      `Aus den flüssigen Würzzutaten, Kräutern und Gewürzen ein glattes Dressing rühren und dabei Säure und Salz schrittweise dosieren.`,
      `${r.a} und ${r.b} mit dem Dressing vermengen, empfindliche Blätter oder weiche Zutaten aber zunächst noch zurückhalten.`,
      `${r.c} und die übrigen frischen Bestandteile kurz vor dem Essen locker unterheben, damit der Salat Biss und Volumen behält.`,
      `Den fertigen Salat probieren und mit Pfeffer, Kräutern oder einem Spritzer Säure ausbalancieren, ohne ihn zu überwürzen.`,
      `${r.title} auf Tellern verteilen, knusprige Bestandteile zuletzt ergänzen und möglichst frisch servieren.`
    ],
    patties: (r) => [
      `${r.a} gut abtropfen lassen, ${r.b} fein vorbereiten und alle Zutaten für die Masse vollständig abwiegen.`,
      `${r.a} grob zerdrücken, mit ${r.b} und dem vorgesehenen Bindemittel mischen und fünf Minuten quellen lassen.`,
      `Die Masse kräftig abschmecken und mit angefeuchteten Händen gleich große, nicht zu dicke Taler formen.`,
      `Eine beschichtete Pfanne auf mittlere Hitze bringen und die Taler portionsweise braten, bis die Unterseite stabil und goldbraun ist.`,
      `Die Taler vorsichtig wenden und fertig garen; sie sollen außen knusprig sein und innen saftig zusammenhalten.`,
      `Währenddessen den Dip aus ${r.c} und den vorgesehenen Aromazutaten glatt rühren und bis zum Servieren kühl stellen.`,
      `${r.title} kurz auf Küchenpapier absetzen, mit dem Dip anrichten und sofort servieren.`
    ],
    potatoPatties: (r) => [
      `${r.a} schälen und grob reiben, ${r.b} waschen und ${r.c} sowie die übrigen Zutaten vollständig bereitstellen.`,
      `Die Kartoffelraspel kräftig ausdrücken, mit Ei, Haferflocken und Gewürzen mischen und fünf Minuten quellen lassen.`,
      `${r.b} getrennt in kleine Stücke schneiden und mit wenig Wasser sowie Zimt zu einer noch stückigen Beilage dünsten.`,
      `Aus der Kartoffelmasse flache Puffer formen und in einer beschichteten Pfanne bei mittlerer Hitze goldbraun braten.`,
      `Die Puffer erst wenden, wenn die Unterseite stabil ist, und anschließend die zweite Seite vollständig fertig garen.`,
      `${r.c} mit Kräutern, Salz und Pfeffer zu einem glatten Dip rühren und bis zum Servieren kühl halten.`,
      `${r.title} kurz abtropfen lassen und zusammen mit Apfelbeilage sowie Kräuterdip anrichten.`
    ],
    ovenStarter: (r) => [
      `Den Backofen passend vorheizen und ${r.a}, ${r.b} sowie ${r.c} waschen, trocken tupfen und gleichmäßig portionieren.`,
      `${r.a} auf einem kleinen Blech oder in einer flachen Form verteilen und nur dünn mit Öl sowie Gewürzen benetzen.`,
      `${r.b} und die übrigen Zutaten so ergänzen, dass nichts übereinanderliegt und die heiße Luft alle Stücke erreicht.`,
      `Alles backen, bis die Ränder sichtbar gebräunt sind; nach der Hälfte der Zeit wenden oder die Form einmal drehen.`,
      `Mit einer Gabel prüfen, ob die Hauptzutat weich, aber nicht zerfallen ist, und bei Bedarf wenige Minuten weitergaren.`,
      `${r.c} beziehungsweise die frische Komponente erst nach dem Backen ergänzen und die Würzung abschließend ausbalancieren.`,
      `${r.title} lauwarm auf kleinen Tellern anrichten und die knusprigen Stellen nach oben zeigen lassen.`
    ],
    toast: (r) => [
      `${r.a} sorgfältig säubern und klein schneiden, ${r.b} bereitstellen und die Brotscheiben gleichmäßig portionieren.`,
      `${r.a} in einer heißen Pfanne zunächst ohne viel Bewegung anrösten, damit Flüssigkeit verdampft und kräftige Röstaromen entstehen.`,
      `Hitze reduzieren, Würzzutaten und ${r.b} ergänzen und alles nur so lange garen, bis eine saftige, gebundene Auflage entsteht.`,
      `Das Brot parallel rösten, bis es außen knusprig ist, innen aber noch etwas weich bleibt und die Auflage tragen kann.`,
      `Die warme Mischung abschmecken und erst unmittelbar vor dem Essen gleichmäßig auf den gerösteten Scheiben verteilen.`,
      `${r.c} und frische Kräuter darübergeben, damit ein deutlicher Kontrast zur warmen, herzhaften Auflage entsteht.`,
      `${r.title} sofort auf einem Brett oder Teller servieren, solange das Brot noch knusprig ist.`
    ],
    omelette: (r) => [
      `${r.a} verquirlen und mit Salz sowie Pfeffer würzen; ${r.b}, ${r.c} und weitere Einlagen klein und gleichmäßig schneiden.`,
      `Die festen Einlagen in einer beschichteten Pfanne bei mittlerer Hitze vorgaren, bis sie weich sind und überschüssige Flüssigkeit verdampft ist.`,
      `${r.a} in die Pfanne geben, die Einlagen gleichmäßig verteilen und die Masse bei reduzierter Hitze langsam stocken lassen.`,
      `Mit einem Pfannenwender die Ränder lösen und noch flüssige Eimasse vorsichtig unter den bereits gestockten Teil laufen lassen.`,
      `Das Omelette zusammenklappen oder offen fertig garen; die Oberfläche soll gestockt, aber weiterhin saftig sein.`,
      `Die Garstufe kontrollieren, anschließend Kräuter und frische Zutaten aufstreuen und die Pfanne vom Herd nehmen.`,
      `${r.title} kurz ruhen lassen, auf einen vorgewärmten Teller gleiten lassen und direkt servieren.`
    ],
    panRice: (r) => [
      `${r.a} vorbereiten und trocken tupfen, ${r.b} abwiegen und ${r.c} sowie das übrige Gemüse mundgerecht schneiden.`,
      `${r.b} mit der passenden Wassermenge und einem Deckel garen, anschließend fünf Minuten ausdampfen lassen und auflockern.`,
      `${r.a} portionsweise in einer heißen Pfanne kräftig anbraten, bis deutliche Röstaromen entstehen, dann kurz herausnehmen.`,
      `${r.c} und das übrige Gemüse in derselben Pfanne bissfest garen; bei Bedarf nur wenig Flüssigkeit ergänzen.`,
      `Würzzutaten einrühren, ${r.a} zurückgeben und alles bei mittlerer Hitze vollständig erhitzen, ohne das Gemüse weich zu kochen.`,
      `Die Garstufe der Hauptzutat prüfen und Sauce sowie Gemüse mit Salz, Pfeffer und Säure ausgewogen abschmecken.`,
      `${r.title} mit dem lockeren Reis anrichten, frische Kräuter zuletzt darübergeben und heiß servieren.`
    ],
    stew: (r) => [
      `${r.a}, ${r.b}, ${r.c} und das weitere Gemüse vorbereiten und in ähnlich große Stücke schneiden, damit alles gleichmäßig gart.`,
      `Aromatische Grundzutaten in einem schweren Topf anschwitzen, anschließend ${r.a} zugeben und kurz mitrösten.`,
      `${r.b}, ${r.c} und die vorgesehene Flüssigkeit ergänzen, einmal aufkochen und die Hitze danach deutlich reduzieren.`,
      `Den Eintopf mit Deckel sanft köcheln lassen und gelegentlich vom Topfboden lösen, damit nichts ansetzt.`,
      `Nach der angegebenen Garzeit mehrere Stücke probieren; Hülsenfrüchte und Gemüse sollen weich sein, aber ihre Form behalten.`,
      `Die Konsistenz durch kurzes offenes Einkochen oder etwas zusätzliche Brühe anpassen und anschließend gründlich abschmecken.`,
      `${r.title} einige Minuten ruhen lassen, mit frischen Kräutern vollenden und in tiefen Tellern servieren.`
    ],
    schnitzel: (r) => [
      `${r.a} trocken tupfen und gleichmäßig flach klopfen; ${r.b}, ${r.c} und die übrigen Beilagen parallel vorbereiten.`,
      `${r.b} in gleich große Stücke schneiden und in wenig Salzwasser mit Deckel garen, bis die Stücke weich, aber nicht wässrig sind.`,
      `${r.a} würzen und in einer heißen, leicht geölten Pfanne von beiden Seiten goldbraun und vollständig durchgaren.`,
      `${r.c} frisch schneiden und mit dem vorgesehenen Dressing mischen, damit die kalte Beilage knackig bleibt.`,
      `Das Fleisch nach dem Braten kurz ruhen lassen; austretenden Saft nicht wegschütten, sondern über das Fleisch geben.`,
      `Kartoffeln und Salat abschmecken und an der dicksten Stelle prüfen, ob ${r.a} vollständig gegart und trotzdem saftig ist.`,
      `${r.title} auf vorgewärmten Tellern anrichten und ohne weitere Wartezeit servieren.`
    ],
    meatballs: (r) => [
      `${r.a} mit den vorgesehenen Gewürzen und Bindemitteln zügig mischen; ${r.b} und ${r.c} getrennt vorbereiten.`,
      `Aus der Masse mit leicht angefeuchteten Händen gleich große Bällchen formen und diese auf einem Teller bereitlegen.`,
      `Die Bällchen portionsweise rundum kräftig anbraten, anschließend herausnehmen und die Hitze etwas reduzieren.`,
      `${r.b} im Bratensatz anschwitzen, die Sauce angießen und einige Minuten offen einkochen lassen.`,
      `Die Bällchen in die Sauce zurückgeben und bei sanfter Hitze vollständig durchziehen lassen, ohne dass die Sauce stark kocht.`,
      `${r.c} beziehungsweise die Beilage fertigstellen und ein Bällchen anschneiden, um die vollständige Garung zu prüfen.`,
      `${r.title} mit reichlich Sauce anrichten, mit Kräutern bestreuen und heiß servieren.`
    ],
    ovenTray: (r) => [
      `Den Backofen vorheizen und ${r.a}, ${r.b}, ${r.c} sowie das restliche Gemüse in gleich große Stücke schneiden.`,
      `${r.b} und länger garende Zutaten zuerst mit wenig Öl und Gewürzen auf einem großen Blech verteilen.`,
      `Nach der ersten Garphase ${r.a}, ${r.c} und empfindlichere Zutaten ergänzen und alles einmal gründlich wenden.`,
      `Das Blech weiterbacken, bis die Kartoffeln oder das Gemüse gebräunt und die Hauptzutat vollständig gegart ist.`,
      `An mehreren Stellen eine Garprobe machen und das Blech nur bei Bedarf wenige Minuten länger im Ofen lassen.`,
      `Frische Sauce oder Kräuter getrennt anrühren und erst nach dem Backen über die heißen Zutaten geben.`,
      `${r.title} direkt vom Blech auf vorgewärmte Teller verteilen und die knusprigen Bestandteile obenauf legen.`
    ],
    bakedPotato: (r) => [
      `Den Backofen vorheizen, ${r.a} gründlich waschen und in gleich große Spalten schneiden; ${r.b} und ${r.c} kalt stellen.`,
      `${r.a} trocken tupfen, mit wenig Öl und Gewürzen mischen und mit Abstand auf einem großen Blech verteilen.`,
      `Die Kartoffelspalten backen und nach der Hälfte der Zeit wenden, damit mehrere Seiten gleichmäßig bräunen.`,
      `${r.b} währenddessen mit Kräutern, Salz, Pfeffer und wenig Wasser zu einem cremigen Dip rühren.`,
      `${r.c} und die übrige Rohkost waschen, mundgerecht schneiden und bis zum Anrichten knackig halten.`,
      `Eine Kartoffelspalte öffnen und prüfen, ob sie innen weich und außen deutlich gebräunt ist.`,
      `${r.title} mit dem kühlen Kräuterdip und der frischen Rohkost auf Tellern anrichten.`
    ],
    fricassee: (r) => [
      `${r.a} in gleichmäßige Stücke schneiden; ${r.b}, ${r.c} und die übrigen Zutaten vollständig vorbereiten.`,
      `${r.a} in Brühe oder wenig Wasser bei sanfter Hitze vollständig garen und danach kurz beiseitestellen.`,
      `Aus der vorgesehenen Flüssigkeit und dem Bindemittel eine glatte, helle Sauce rühren und ohne Klümpchen aufkochen.`,
      `${r.b}, ${r.c} und weitere Gemüsezutaten in der Sauce bissfest garen, ohne sie zu zerkochen.`,
      `${r.a} zurückgeben und alles nur noch sanft erhitzen; die Sauce soll cremig sein und die Zutaten gleichmäßig umhüllen.`,
      `Mit Säure, Salz und Pfeffer abschmecken und prüfen, ob das Fleisch vollständig durchgegart und weiterhin saftig ist.`,
      `${r.title} mit der separat gegarten Beilage anrichten und unmittelbar servieren.`
    ],
    ragout: (r) => [
      `${r.a} gründlich säubern und schneiden, ${r.b}, ${r.c} und weitere Beilagen vollständig bereitstellen.`,
      `${r.a} portionsweise in einer breiten Pfanne kräftig bräunen, damit keine Flüssigkeit stehen bleibt.`,
      `Aromatische Zutaten ergänzen, kurz mitrösten und anschließend mit der vorgesehenen Flüssigkeit ablöschen.`,
      `Das Ragout bei mittlerer Hitze offen einkochen lassen, bis eine cremige Sauce entsteht und die Aromen verbunden sind.`,
      `${r.b} und ${r.c} nach ihrer jeweils passenden Methode garen und so timen, dass alle Bestandteile gleichzeitig fertig sind.`,
      `Sauce und Einlage probieren, die Konsistenz bei Bedarf korrigieren und erst am Ende frische Kräuter ergänzen.`,
      `${r.title} großzügig auf Tellern anrichten und mit der heißen Sauce überziehen.`
    ],
    casserole: (r) => [
      `Den Backofen vorheizen, die Form dünn fetten und ${r.a}, ${r.b} sowie ${r.c} für gleichmäßige Schichten vorbereiten.`,
      `Länger garende Zutaten kurz vorgaren, damit später im Auflauf nichts hart bleibt oder unnötig trocken wird.`,
      `${r.a}, ${r.b} und ${r.c} abwechselnd in die Form geben und jede Lage sparsam würzen.`,
      `Die vorgesehene Sauce gleichmäßig darüber verteilen und die Oberfläche so abschließen, dass sie gut bräunen kann.`,
      `Den Auflauf backen, bis er am Rand sichtbar blubbert und die Oberfläche goldbraun geworden ist.`,
      `Mit einem Messer in der Mitte prüfen, ob alle Schichten heiß und weich sind, anschließend fünf Minuten ruhen lassen.`,
      `${r.title} in saubere Stücke teilen, mit frischen Kräutern garnieren und warm servieren.`
    ],
    pasta: (r) => [
      `${r.a}, ${r.b} und ${r.c} vorbereiten; einen großen Topf mit Wasser und eine breite Pfanne gleichzeitig erhitzen.`,
      `${r.b} in gut gesalzenem Wasser knapp bissfest garen und vor dem Abgießen eine Tasse Kochwasser zurückbehalten.`,
      `${r.a} beziehungsweise die Hauptkomponente in der Pfanne kräftig anbraten und anschließend kurz herausnehmen.`,
      `${r.c} und die Saucenzutaten im Bratensatz garen, bis eine aromatische, noch leicht konzentrierte Grundlage entsteht.`,
      `Die Pasta und ${r.a} in die Pfanne geben und mit wenig Kochwasser schwenken, bis die Sauce an den Nudeln haftet.`,
      `Eine Garprobe machen, die Sauce mit Salz, Pfeffer und Säure ausbalancieren und die Pfanne vom Herd nehmen.`,
      `${r.title} sofort auf warme Teller verteilen und frische oder knusprige Bestandteile zuletzt ergänzen.`
    ],
    fishOven: (r) => [
      `Den Backofen vorheizen, ${r.a} trocken tupfen und ${r.b}, ${r.c} sowie die übrigen Beilagen gleichmäßig schneiden.`,
      `${r.b} und länger garendes Gemüse zuerst in einer flachen Form mit wenig Öl und Gewürzen vorgaren.`,
      `${r.a} würzen, auf das Gemüse setzen und nur so lange mitgaren, bis der Fisch innen saftig und gerade eben gar ist.`,
      `${r.c} beziehungsweise die Sauce separat anrühren und bis zum Servieren kühl oder warm bereithalten.`,
      `Den Fisch an der dicksten Stelle mit einer Gabel prüfen; er soll sich leicht in Lamellen teilen lassen.`,
      `Gemüse und Sauce abschmecken und den Fisch nach dem Garen zwei Minuten außerhalb des Ofens ruhen lassen.`,
      `${r.title} vorsichtig anrichten, damit das Filet ganz bleibt, und die Sauce erst am Tisch darübergeben.`
    ],
    risotto: (r) => [
      `${r.a}, ${r.b} und ${r.c} vorbereiten; die Brühe in einem zweiten Topf erhitzen und warm halten.`,
      `${r.b} in wenig Öl glasig anschwitzen, ${r.a} zugeben und unter Rühren kurz mitrösten.`,
      `Die heiße Brühe portionsweise angießen und jeweils erst nachgießen, wenn die Flüssigkeit nahezu aufgenommen ist.`,
      `${r.c} entsprechend seiner Garzeit rechtzeitig ergänzen und das Risotto regelmäßig, aber nicht ununterbrochen rühren.`,
      `${r.d} separat in einer heißen Pfanne kurz und passend zur Zutat garen, damit sie saftig bleibt und deutliche Röstaromen bekommt.`,
      `Den Topf vom Herd ziehen, die vorgesehenen cremigen Zutaten einarbeiten und das Risotto zwei Minuten ruhen lassen.`,
      `${r.title} nach einer Garprobe fließend auf tiefe Teller geben, ${r.d} darauf anrichten und sofort servieren.`
    ],
    gnocchi: (r) => [
      `${r.a}, ${r.b} und ${r.c} vorbereiten und eine möglichst große Pfanne erhitzen, damit die Zutaten Platz zum Bräunen haben.`,
      `${r.b} direkt in wenig Öl rundum goldbraun rösten und anschließend an den Pfannenrand schieben.`,
      `${r.a} beziehungsweise die Hauptkomponente ergänzen und unter regelmäßigem Wenden vollständig erhitzen.`,
      `${r.c} und die übrigen Gemüsezutaten nur so lange mitgaren, dass sie ihre Farbe und etwas Biss behalten.`,
      `Saucenzutaten einrühren und alles mit wenig Wasser verbinden, ohne die knusprige Oberfläche vollständig aufzuweichen.`,
      `Eine Gnocchi und die Hauptzutat probieren, dann Salz, Pfeffer und Säure sorgfältig ausbalancieren.`,
      `${r.title} direkt aus der Pfanne auf Teller verteilen und mit der vorgesehenen Garnitur servieren.`
    ],
    grill: (r) => [
      `${r.a} gleichmäßig schneiden und würzen, ${r.b}, ${r.c} und die kalten Komponenten separat vorbereiten.`,
      `${r.b} nach Packungsangabe oder mit passender Wassermenge garen und anschließend locker ausdampfen lassen.`,
      `${r.a} in einer sehr heißen Grill- oder Bratpfanne portionsweise garen, damit kräftige Röststreifen entstehen.`,
      `${r.c} kurz mitgrillen oder frisch schneiden und aus den vorgesehenen Zutaten eine passende Sauce anrühren.`,
      `Die Hauptzutat an der dicksten Stelle prüfen und nach dem Garen wenige Minuten ruhen lassen.`,
      `Beilage, Gemüse und Sauce einzeln abschmecken, damit die Schüssel später ausgewogen und nicht einheitlich gewürzt schmeckt.`,
      `${r.title} in klar getrennten Komponenten anrichten und erst beim Essen miteinander verbinden.`
    ],
    curry: (r) => {
      const riceSide = /reis/i.test(r.b);
      const delicateFish = /fisch|lachs|kabeljau|seelachs/i.test(r.a);
      return [
        `${r.a}, ${r.b}, ${r.c} und alle Gewürze vorbereiten, damit während des Kochens nichts gesucht werden muss.`,
        delicateFish
          ? `Die trockenen Gewürze kurz anrösten und die aromatische Saucengrundlage aufbauen; ${r.a} zunächst noch kühl beiseitestellen.`
          : `Die trockenen Gewürze kurz anrösten, anschließend aromatische Zutaten und ${r.a} zugeben und vorsichtig mitrösten.`,
        `${riceSide ? r.c : `${r.b} und ${r.c}`} sowie die vorgesehene Flüssigkeit ergänzen, einmal aufkochen und danach sanft köcheln lassen.`,
        riceSide
          ? `${r.b} separat mit Deckel garen, anschließend fünf Minuten ausdampfen lassen und mit einer Gabel auflockern.`
          : `Das Curry regelmäßig umrühren und bei Bedarf wenig Wasser ergänzen, bis Gemüse und Hülsenfrüchte passend gegart sind.`,
        delicateFish
          ? `${r.a} in die leise köchelnde Sauce legen und nur so lange ziehen lassen, bis sich der Fisch leicht in saftige Lamellen teilen lässt.`
          : `Die Hauptzutat probieren und die Sauce offen einkochen, bis sie cremig an einem Löffel haftet.`,
        `Erst zum Schluss Salz, Säure und frische Kräuter ergänzen, damit das Curry lebendig und ausgewogen schmeckt.`,
        `${r.title} mit der vorgesehenen Beilage anrichten und heiß servieren.`
      ];
    },
    wok: (r) => [
      `${r.a} trocken tupfen und schneiden, ${r.b}, ${r.c} und alle weiteren Zutaten in griffbereiten Schalen bereitstellen.`,
      `Die Beilage separat garen und einen Wok oder eine große Pfanne sehr stark erhitzen.`,
      `${r.a} portionsweise kurz und kräftig anbraten, anschließend herausnehmen, damit die Stücke saftig bleiben.`,
      `${r.b}, ${r.c} und das übrige Gemüse nach Garzeit nacheinander in die heiße Pfanne geben und bissfest braten.`,
      `Sauce und Hauptzutat zurückgeben und alles nur kurz schwenken, bis die Sauce glänzt und sämtliche Zutaten heiß sind.`,
      `Gargrad und Würzung prüfen; die Sauce soll aromatisch sein, das Gemüse aber weiterhin deutlich Biss besitzen.`,
      `${r.title} sofort auf der Beilage verteilen und mit frischen oder knusprigen Zutaten abschließen.`
    ],
    noodleSoup: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die Aromazutaten vorbereiten; Brühe und Einlagen getrennt bereithalten.`,
      `Die Brühe mit den vorgesehenen Gewürzen sanft erhitzen und mehrere Minuten ziehen lassen, ohne sie stark einzukochen.`,
      `${r.a} in der Brühe oder separat vollständig garen und anschließend in mundgerechte Stücke teilen.`,
      `${r.b} nach Packungsangabe garen, abgießen und auf vorgewärmte Schalen verteilen.`,
      `${r.c} und das weitere Gemüse nur kurz in der heißen Brühe gar ziehen lassen, damit Farbe und Biss erhalten bleiben.`,
      `Brühe und Einlagen probieren, Salz und Säure ausbalancieren und die Temperatur noch einmal kontrollieren.`,
      `${r.title} über die Nudeln schöpfen, frische Garnitur ergänzen und sehr heiß servieren.`
    ],
    friedRice: (r) => [
      `${r.a}, ${r.b}, ${r.c} und das Gemüse vorbereiten; idealerweise bereits gegarten und vollständig ausgekühlten Reis verwenden.`,
      `${r.a} beziehungsweise die Hauptkomponente in einer großen heißen Pfanne garen und danach kurz beiseitestellen.`,
      `${r.c} und das übrige Gemüse unter häufigem Wenden bissfest braten, ohne die Pfanne zu überfüllen.`,
      `${r.b} zugeben, Klümpchen mit dem Pfannenwender lösen und den Reis an mehreren Stellen leicht anrösten lassen.`,
      `Hauptzutat und Würzsauce ergänzen und alles so lange schwenken, bis der Reis gleichmäßig heiß und aromatisch ist.`,
      `Die Garstufe prüfen und mit Säure, Pfeffer oder Kräutern nachwürzen, bevor die Pfanne vom Herd kommt.`,
      `${r.title} direkt in Schalen füllen und die frischen Bestandteile erst jetzt darübergeben.`
    ],
    coldNoodles: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die übrigen Gemüsezutaten waschen, trocken tupfen und in feine Streifen schneiden.`,
      `${r.b} nach Packungsangabe garen, kalt abspülen und sehr gut abtropfen lassen, damit das Dressing nicht verwässert.`,
      `${r.a} nach der vorgesehenen Methode knusprig oder bissfest garen und anschließend kurz abkühlen lassen.`,
      `Aus den Würzzutaten ein kräftiges Dressing rühren, das zunächst etwas intensiver als ein gewöhnliches Salatdressing schmecken darf.`,
      `Nudeln, ${r.a}, ${r.c} und das weitere Gemüse sorgfältig mit dem Dressing mischen und zehn Minuten ziehen lassen.`,
      `Noch einmal probieren und Säure sowie Salz korrigieren, da die Nudeln während der Ruhezeit Würze aufnehmen.`,
      `${r.title} locker in Schalen anrichten und mit der vorgesehenen knusprigen Garnitur servieren.`
    ],
    fajita: (r) => [
      `${r.a} in dünne Streifen schneiden, ${r.b}, ${r.c} und weitere Gemüsezutaten ebenfalls gleichmäßig vorbereiten.`,
      `${r.a} in einer sehr heißen Pfanne portionsweise kräftig braten und anschließend kurz herausnehmen.`,
      `${r.c} und das übrige Gemüse im Bratensatz bissfest garen, sodass die Ränder Farbe bekommen, aber nicht weich werden.`,
      `Gewürze, Hauptzutat und einen kleinen Schluck Wasser ergänzen und alles kurz miteinander glasieren.`,
      `Tortillas oder die vorgesehene Beilage parallel erwärmen und frische Saucen getrennt vorbereiten.`,
      `Die Hauptzutat vollständig durchgaren, anschließend Pfanneninhalt und kalte Komponenten einzeln abschmecken.`,
      `${r.title} direkt am Tisch zusammenstellen, damit warme Füllung und frische Beilagen ihren Kontrast behalten.`
    ],
    stuffed: (r) => [
      `Den Backofen vorheizen und ${r.a} so vorbereiten, dass eine stabile Hülle oder Mulde für die Füllung entsteht.`,
      `${r.b}, ${r.c} und die weiteren Füllzutaten separat vorgaren, bis überschüssige Flüssigkeit verdampft ist.`,
      `Die Füllung kräftig abschmecken, in ${r.a} verteilen und dabei leicht andrücken, ohne die Hülle zu beschädigen.`,
      `Alles in eine passende Form setzen, wenig Flüssigkeit angießen und zugedeckt oder offen nach Rezeptvorgabe garen.`,
      `Zum Ende die Abdeckung entfernen und die Oberfläche bräunen lassen, ohne dass die Füllung austrocknet.`,
      `Mit einem Messer prüfen, ob ${r.a} weich und die Füllung in der Mitte vollständig heiß ist.`,
      `${r.title} fünf Minuten ruhen lassen, mit der vorgesehenen Sauce anrichten und warm servieren.`
    ],
    quesadilla: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die übrigen Füllzutaten klein schneiden und getrennt bereitstellen.`,
      `${r.a}, ${r.c} und weitere Gemüsezutaten in einer Pfanne vorgaren, bis die Füllung aromatisch und nicht mehr wässrig ist.`,
      `Eine Tortilla in eine saubere Pfanne legen, die Füllung dünn darauf verteilen und eine zweite Hälfte darüberklappen.`,
      `Die Quesadilla bei mittlerer Hitze braten, bis die Unterseite goldbraun und die Füllung vollständig heiß ist.`,
      `Vorsichtig wenden und die zweite Seite bräunen; die Hitze reduzieren, falls die Tortilla zu schnell dunkel wird.`,
      `Die frische Beilage aus den übrigen Gemüsezutaten abschmecken und die Quesadilla kurz auf einem Brett ruhen lassen.`,
      `${r.title} in saubere Stücke schneiden und zusammen mit der frischen Beilage servieren.`
    ],
    couscous: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die übrigen Gemüsezutaten vorbereiten; Wasser oder Brühe separat aufkochen.`,
      `${r.b} mit der heißen Flüssigkeit übergießen, abdecken und nach Packungsangabe ungestört quellen lassen.`,
      `${r.a} würzen und in einer heißen Pfanne oder im Ofen vollständig garen, anschließend kurz ruhen lassen.`,
      `${r.c} und das übrige Gemüse bissfest braten oder frisch vorbereiten, je nachdem welche Textur vorgesehen ist.`,
      `Couscous mit einer Gabel gründlich auflockern und mit Kräutern, Säure und wenig Öl aromatisieren.`,
      `Alle Bestandteile einzeln probieren und die Garung der Hauptzutat kontrollieren, bevor angerichtet wird.`,
      `${r.title} mit Couscous als Basis anrichten, Sauce oder Dip zuletzt ergänzen und servieren.`
    ],
    kofta: (r) => [
      `${r.a} mit den vorgesehenen Gewürzen zügig vermengen; ${r.b}, ${r.c} und die Beilagen vollständig vorbereiten.`,
      `Aus der Masse längliche, gleich dicke Rollen formen und diese bis zum Braten kurz kühl stellen.`,
      `${r.b} nach Packungsangabe garen und anschließend mit einer Gabel auflockern beziehungsweise ausdampfen lassen.`,
      `Die Rollen in einer heißen Pfanne rundum kräftig bräunen und bei reduzierter Hitze vollständig durchgaren.`,
      `${r.c} klein schneiden und zusammen mit den vorgesehenen Zutaten zu einer frischen Beilage oder Sauce verarbeiten.`,
      `Eine Rolle anschneiden und die Garung prüfen, anschließend sämtliche Komponenten ausgewogen abschmecken.`,
      `${r.title} mit der Beilage anrichten, frische Kräuter darübergeben und heiß servieren.`
    ],
    cream: (r) => [
      `${r.a}, ${r.b}, ${r.c} und sämtliche Aromazutaten genau abwiegen; gekühlte Zutaten bis zur Verwendung kalt halten.`,
      `${r.a} mit den vorgesehenen Gewürzen glatt rühren, bis keine Klümpchen mehr sichtbar sind und eine cremige Masse entsteht.`,
      `${r.b} waschen beziehungsweise auftauen, trocken tupfen und je nach Größe schneiden oder leicht zerdrücken.`,
      `${r.c} separat vorbereiten und erst kurz vor dem Schichten zur Creme geben, damit die knusprige Struktur erhalten bleibt.`,
      `Creme und Früchte gleichmäßig auf Gläser verteilen und die Oberfläche sauber glattstreichen.`,
      `Süße und Säure probieren und das Dessert mindestens zwanzig Minuten kalt stellen, damit sich die Aromen verbinden.`,
      `${r.title} unmittelbar vor dem Servieren mit dem knusprigen Bestandteil und frischem Obst vollenden.`
    ],
    bakedDessert: (r) => [
      `Den Backofen vorheizen und ${r.a}, ${r.b}, ${r.c} sowie alle weiteren Zutaten genau abwiegen.`,
      `${r.a} glatt rühren und trockene Zutaten separat mischen, damit sich Backtriebmittel und Gewürze gleichmäßig verteilen.`,
      `Die trockenen Zutaten nur kurz unter die feuchte Masse arbeiten und ${r.b} anschließend behutsam unterheben.`,
      `Die Masse in eine passende Form geben, glattstreichen und ${r.c} beziehungsweise die Garnitur gleichmäßig darauf verteilen.`,
      `Das Dessert backen, bis die Oberfläche leicht gebräunt und die Mitte gerade eben gestockt beziehungsweise weich ist.`,
      `Mit einem Holzstäbchen oder leichtem Druck die Garung prüfen und anschließend außerhalb des Ofens kurz ruhen lassen.`,
      `${r.title} lauwarm oder vollständig ausgekühlt portionieren und mit der vorgesehenen Creme servieren.`
    ],
    bakedApple: (r) => [
      `Den Backofen vorheizen, ${r.b} waschen und das Kerngehäuse so entfernen, dass der Boden der Frucht geschlossen bleibt.`,
      `${r.c} mit Rosinen, Zimt und wenig von ${r.a} zu einer feuchten, aber lockeren Füllung vermengen.`,
      `Die Mischung in ${r.b} füllen, die Frucht in eine kleine Form setzen und wenig Wasser angießen.`,
      `Den Apfel backen, bis die Schale leicht aufspringt und das Fruchtfleisch weich, aber noch formstabil ist.`,
      `${r.a} mit Vanille glatt rühren und bis zum Servieren kalt stellen, damit ein deutlicher Temperaturkontrast entsteht.`,
      `Mit einem kleinen Messer prüfen, ob der Apfel bis zur Mitte weich ist, und ihn anschließend kurz ruhen lassen.`,
      `${r.title} lauwarm mit dem gekühlten Vanillequark anrichten und den Saft aus der Form darübergeben.`
    ],
    bakedBanana: (r) => [
      `Den Backofen vorheizen, ${r.b} samt Schale waschen und längs einschneiden, ohne die Unterseite vollständig zu durchtrennen.`,
      `Die Banane leicht öffnen, mit Kakao und Zimt würzen und in einer kleinen ofenfesten Form stabil platzieren.`,
      `${r.c} separat trocken rösten, bis es duftet, und anschließend auf einem Teller abkühlen lassen.`,
      `Die Banane backen, bis die Schale dunkel und das Fruchtfleisch sichtbar weich und heiß geworden ist.`,
      `${r.a} mit Erdnussmus glatt rühren und bei Bedarf mit wenig Wasser zu einer löffelfähigen Creme verdünnen.`,
      `Die weiche Banane vorsichtig öffnen, die Temperatur prüfen und den austretenden Fruchtsaft in der Schale belassen.`,
      `${r.title} in der Schale mit Erdnuss-Joghurt und den gerösteten Haferflocken servieren.`
    ],
    pudding: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die weiteren Zutaten abwiegen; einen Topf mit schwerem Boden und einen Schneebesen bereitlegen.`,
      `Einen kleinen Teil der Flüssigkeit mit Stärke oder Grieß glatt rühren, bis keinerlei trockene Klümpchen mehr vorhanden sind.`,
      `Die übrige Flüssigkeit erhitzen, die angerührte Mischung unter ständigem Rühren zugeben und kurz aufkochen lassen.`,
      `Die Hitze reduzieren und den Pudding so lange rühren, bis er sichtbar andickt und gleichmäßig cremig ist.`,
      `${r.b} beziehungsweise die Fruchtkomponente separat vorbereiten und mit wenig Süße sowie Säure abschmecken.`,
      `Den Pudding probieren, in Schalen füllen und mit Folie oder regelmäßigem Rühren vor einer Haut schützen.`,
      `${r.title} warm oder gekühlt mit der Fruchtkomponente und ${r.c} servieren.`
    ],
    grainPudding: (r) => [
      `${r.a}, ${r.b}, ${r.c} und alle Aromazutaten genau abwiegen und einen Topf mit schwerem Boden bereitstellen.`,
      `${r.a} mit Vanille langsam erhitzen und ${r.b} unter ständigem Rühren gleichmäßig einstreuen.`,
      `Die Hitze stark reduzieren und die Mischung nach Packungsart quellen lassen, dabei regelmäßig über den Topfboden rühren.`,
      `${r.c} parallel in einem kleinen Topf mit wenig Wasser und Gewürzen zu einem noch stückigen Kompott erhitzen.`,
      `Den Pudding probieren und die Konsistenz mit wenig zusätzlicher Flüssigkeit cremig einstellen, ohne ihn zu verdünnen.`,
      `Pudding und Kompott jeweils abschmecken und je nach Rezept warm servieren oder vollständig abkühlen lassen.`,
      `${r.title} in Schalen füllen, das Fruchtkompott darübergeben und mit der vorgesehenen Creme vollenden.`
    ],
    oatPudding: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die übrigen Zutaten genau abwiegen; einige Früchte für die Garnitur zurücklegen.`,
      `${r.a} langsam erhitzen, ${r.c} unter Rühren einstreuen und die Mischung bei kleiner Hitze quellen lassen.`,
      `Einen Teil von ${r.b} leicht zerdrücken und unter den Haferpudding rühren, damit Farbe und Fruchtgeschmack entstehen.`,
      `Den Pudding regelmäßig vom Topfboden lösen und bei Bedarf esslöffelweise zusätzliche Flüssigkeit ergänzen.`,
      `Die Konsistenz prüfen; die Haferflocken sollen weich sein, der Pudding aber weiterhin cremig vom Löffel fallen.`,
      `Süße und Säure ausbalancieren und den Pudding anschließend warm lassen oder portionsweise kalt stellen.`,
      `${r.title} mit den zurückgelegten Früchten und der vorgesehenen Joghurtcreme servieren.`
    ],
    crumble: (r) => [
      `Den Backofen vorheizen und ${r.a}, ${r.b}, ${r.c} sowie die Gewürze vollständig abwiegen.`,
      `${r.b} waschen, entsteinen oder schälen, in gleich große Stücke schneiden und in eine flache Form geben.`,
      `${r.a} mit den vorgesehenen Fett- und Bindemitteln zu lockeren Streuseln verarbeiten; ${r.c} für das Servieren kalt stellen.`,
      `Die Streusel ohne starkes Andrücken auf dem Obst verteilen, damit beim Backen knusprige Zwischenräume entstehen.`,
      `Alles backen, bis das Obst am Rand sichtbar saftet und die Streusel gleichmäßig goldbraun sind.`,
      `Die Frucht mit einem Messer prüfen und das Dessert nach dem Backen mindestens zehn Minuten abkühlen lassen.`,
      `${r.title} lauwarm portionieren und mit der vorgesehenen kalten Creme servieren.`
    ],
    pancake: (r) => [
      `${r.a}, ${r.b}, ${r.c} und die restlichen Zutaten abwiegen; eine beschichtete Pfanne und einen Teller bereithalten.`,
      `${r.a} mit den flüssigen Zutaten glatt rühren, trockene Zutaten separat mischen und anschließend nur kurz unterarbeiten.`,
      `Den Teig mehrere Minuten quellen lassen und in dieser Zeit ${r.b} beziehungsweise die Fruchtbeilage vorbereiten.`,
      `Kleine Portionen des Teigs bei mittlerer Hitze in die Pfanne geben und backen, bis sich an der Oberfläche Bläschen zeigen.`,
      `Die Pfannkuchen vorsichtig wenden und die zweite Seite goldbraun backen, ohne die Mitte auszutrocknen.`,
      `Einen Pfannkuchen öffnen und prüfen, ob er vollständig gegart ist; fertige Stücke kurz warm halten.`,
      `${r.title} mit der vorbereiteten Frucht und der vorgesehenen Creme anrichten und direkt servieren.`
    ]
  };

  const entries = [
    // 15 Vorspeisen
    ["kartoffel-lauch-suppe", "Kartoffel-Lauch-Suppe mit Schnittlauch", "Eine bodenständige, cremige Suppe mit Kartoffeln, Lauch und frischem Schnittlauch.", "starter", "deutsch", "vegetarian", 30, "soup", [13, 48, 12], "Kartoffeln|220|g;Lauch|120|g;Gemüsebrühe|350|ml;Skyr|60|g;Schnittlauch|10|g;Rapsöl|1|TL", "skyr", "bread", "Einen Teil der Kartoffeln nur zerdrücken statt pürieren – dadurch wirkt die Suppe cremig und behält trotzdem Struktur."],
    ["rote-linsen-moehren-suppe", "Rote-Linsen-Suppe mit Möhre und Zitrone", "Wärmende Linsensuppe mit Möhre, Tomate und einem frischen Zitronenabschluss.", "starter", "orientalisch", "vegan", 30, "soup", [18, 44, 8], "Rote Linsen|80|g;Möhren|140|g;Passierte Tomaten|160|g;Gemüsebrühe|320|ml;Zitrone|0.5|Stk.;Petersilie|10|g;Olivenöl|1|TL", "lentils", "bread", "Zitronensaft erst nach dem Garen ergänzen, damit die Linsen zuverlässig weich werden."],
    ["tomaten-paprika-suppe", "Tomaten-Paprika-Suppe mit Basilikum", "Fruchtige Gemüsesuppe aus gerösteter Paprika, Tomaten und frischem Basilikum.", "starter", "mediterran", "vegan", 35, "soup", [8, 32, 10], "Rote Paprika|180|g;Gehackte Tomaten|250|g;Zwiebel|60|g;Gemüsebrühe|250|ml;Basilikum|12|g;Knoblauch|1|Stk.;Olivenöl|2|TL", "tofu", "bread", "Röste die Paprika kräftig an, bevor Flüssigkeit dazukommt – das macht die Suppe deutlich aromatischer."],
    ["brokkoli-cremesuppe", "Brokkoli-Cremesuppe mit gerösteten Kernen", "Milde Brokkolisuppe mit Kartoffelbindung und knusprigen Sonnenblumenkernen.", "starter", "klassisch", "vegan", 25, "soup", [12, 30, 11], "Brokkoli|250|g;Kartoffeln|100|g;Gemüsebrühe|350|ml;Hafercuisine|50|ml;Sonnenblumenkerne|15|g;Zitrone|0.25|Stk.", "tofu", "bread", "Einige kleine Brokkoliröschen separat garen und als bissfeste Einlage zurück in die pürierte Suppe geben."],
    ["gurken-radieschen-salat", "Gurken-Radieschen-Salat mit Hüttenkäse", "Knackiger Gurkensalat mit Radieschen, körnigem Frischkäse und Dill.", "starter", "deutsch", "vegetarian", 15, "salad", [25, 18, 10], "Gurke|180|g;Radieschen|100|g;Körniger Frischkäse|150|g;Dill|8|g;Zitrone|0.5|Stk.;Rapsöl|1|TL", "cottage", "bread", "Salze die Gurke nur leicht und gieße überschüssige Flüssigkeit vor dem Mischen ab."],
    ["weisse-bohnen-tomatensalat", "Weiße-Bohnen-Salat mit Tomate und Petersilie", "Sättigender, frischer Bohnensalat mit Tomaten, roter Zwiebel und Petersilie.", "starter", "mediterran", "vegan", 15, "salad", [15, 36, 10], "Weiße Bohnen|180|g;Kirschtomaten|150|g;Rote Zwiebel|40|g;Petersilie|12|g;Zitrone|0.5|Stk.;Olivenöl|2|TL", "lentils", "bread", "Ein Löffel Bohnenflüssigkeit bindet das Dressing und macht zusätzliches Öl überflüssig."],
    ["rote-bete-apfel-salat", "Rote-Bete-Apfel-Salat mit Walnüssen", "Erdiger Rote-Bete-Salat mit säuerlichem Apfel, Feldsalat und gerösteten Walnüssen.", "starter", "deutsch", "vegan", 15, "salad", [8, 31, 16], "Gegarte Rote Bete|180|g;Apfel|100|g;Feldsalat|60|g;Walnüsse|20|g;Mittelscharfer Senf|1|TL;Apfelessig|1|EL;Rapsöl|1|TL", "tofu", "bread", "Trage beim Schneiden der Roten Bete Handschuhe und mische den Feldsalat erst unmittelbar vor dem Essen unter."],
    ["kichererbsen-kraeuter-taler", "Kichererbsen-Kräuter-Taler mit Joghurtdip", "Knusprige Kichererbsentaler mit Petersilie, Haferflocken und einem frischen Dip.", "starter", "orientalisch", "vegetarian", 30, "patties", [23, 46, 14], "Kichererbsen|180|g;Zwiebel|50|g;Griechischer Joghurt|100|g;Haferflocken|30|g;Petersilie|12|g;Zitrone|0.5|Stk.;Rapsöl|2|TL", "skyr", "bread", "Lass die Masse vor dem Formen kurz quellen; dann halten die Taler auch mit wenig Öl zuverlässig zusammen."],
    ["raeucherlachs-gurken-happen", "Gurken-Happen mit Räucherlachs und Dillcreme", "Kühle Gurkenscheiben mit Räucherlachs, Skyr und frischem Dill.", "starter", "klassisch", "omnivore", 15, "salad", [27, 10, 12], "Räucherlachs|100|g;Gurke|180|g;Skyr|100|g;Dill|8|g;Zitrone|0.5|Stk.;Schwarzer Pfeffer|1|Prise", "salmon", "bread", "Tupfe die Gurkenscheiben trocken, damit die Dillcreme beim Anrichten nicht abrutscht."],
    ["ofen-zucchini-feta", "Gebackene Zucchini-Happen mit Feta", "Kleine Zucchini-Happen aus dem Ofen mit Feta, Tomaten und Kräutern.", "starter", "mediterran", "vegetarian", 30, "ovenStarter", [18, 18, 19], "Zucchini|250|g;Feta|80|g;Kirschtomaten|120|g;Italienische Kräuter|1|TL;Zitrone|0.25|Stk.;Olivenöl|1|TL", "cottage", "bread", "Lege die Zucchini mit Abstand auf das Blech, damit sie röstet und nicht im eigenen Saft dünstet."],
    ["pilztoast-thymian", "Pilztoast mit Thymian und Frischkäse", "Geröstetes Vollkornbrot mit kräftig gebratenen Champignons und Thymian.", "starter", "deutsch", "vegetarian", 20, "toast", [19, 38, 14], "Champignons|180|g;Zwiebel|40|g;Frischkäse light|60|g;Vollkornbrot|90|g;Thymian|1|TL;Rapsöl|1|TL", "cottage", "bread", "Brate Pilze in zwei Portionen, damit sie Farbe bekommen und nicht zu viel Wasser abgeben."],
    ["moehren-ingwer-suppe", "Möhren-Ingwer-Suppe mit Orange", "Leichte Möhrensuppe mit frischem Ingwer, Orange und mildem Kokos.", "starter", "asiatisch", "vegan", 25, "soup", [7, 39, 9], "Möhren|260|g;Orange|0.5|Stk.;Gemüsebrühe|350|ml;Kokosmilch|60|ml;Frischer Ingwer|8|g;Rapsöl|1|TL", "tofu", "bread", "Reibe den Ingwer fein und dosiere ihn schrittweise, damit er die Süße der Möhren nicht überdeckt."],
    ["linsen-apfel-salat", "Linsen-Apfel-Salat mit Senfdressing", "Herzhafter Linsensalat mit Apfel, Möhre und einem milden Senfdressing.", "starter", "deutsch", "vegan", 20, "salad", [16, 41, 8], "Gekochte Linsen|200|g;Apfel|100|g;Möhre|80|g;Feldsalat|50|g;Mittelscharfer Senf|1|TL;Apfelessig|1|EL;Rapsöl|1|TL", "lentils", "bread", "Mische die noch leicht warmen Linsen mit dem Dressing; so nehmen sie die Würze besonders gut auf."],
    ["spinat-mini-omelett", "Spinat-Omelett mit Tomatenwürfeln", "Saftiges Omelett mit Babyspinat, Tomaten und körnigem Frischkäse.", "starter", "klassisch", "vegetarian", 15, "omelette", [29, 12, 20], "Eier|3|Stk.;Babyspinat|80|g;Tomate|120|g;Körniger Frischkäse|80|g;Schnittlauch|8|g;Rapsöl|1|TL", "egg", "bread", "Gare das Omelett bei mittlerer statt hoher Hitze – dadurch bleibt es weich und lässt sich sauber zusammenklappen."],
    ["paprika-thunfisch-bohnensalat", "Paprika-Bohnensalat mit Thunfisch", "Proteinreicher Salat mit Thunfisch, weißen Bohnen, Paprika und Zitronendressing.", "starter", "mediterran", "omnivore", 15, "salad", [35, 31, 11], "Thunfisch im eigenen Saft|130|g;Weiße Bohnen|140|g;Rote Paprika|120|g;Petersilie|10|g;Zitrone|0.5|Stk.;Olivenöl|1|TL", "tuna", "bread", "Hebe den Thunfisch nur locker unter, damit saftige Stücke erhalten bleiben und der Salat nicht breiig wird."],

    // 65 Hauptgerichte
    ["haehnchen-geschnetzeltes-paprika", "Hähnchen-Geschnetzeltes mit Paprika und Reis", "Saftige Hähnchenstreifen in einer milden Paprikasauce mit lockerem Langkornreis.", "main", "deutsch", "omnivore", 30, "panRice", [48, 70, 17], "Hähnchenbrust|180|g;Langkornreis|80|g;Rote Paprika|150|g;Zwiebel|60|g;Hafercuisine|80|ml;Paprikapulver|1|TL;Rapsöl|1|TL", "chicken", "rice", "Brate das Fleisch in zwei Portionen und gib es erst am Ende zurück in die Sauce, damit es saftig bleibt."],
    ["kartoffel-linsen-eintopf", "Kartoffel-Linsen-Eintopf mit Majoran", "Bodenständiger Eintopf aus Kartoffeln, Berglinsen, Möhren und Majoran.", "main", "deutsch", "vegan", 45, "stew", [27, 78, 10], "Kartoffeln|280|g;Gekochte Berglinsen|220|g;Möhren|120|g;Lauch|100|g;Gemüsebrühe|400|ml;Majoran|1|TL;Rapsöl|1|TL", "lentils", "potato", "Zerdrücke einige Kartoffelstücke am Topfrand, um den Eintopf ohne Mehl oder zusätzliche Sahne zu binden."],
    ["putenschnitzel-petersilienkartoffeln", "Putenschnitzel mit Petersilienkartoffeln und Gurkensalat", "Mageres Putenschnitzel mit kleinen Kartoffeln und einem frischen Gurkensalat.", "main", "deutsch", "omnivore", 35, "schnitzel", [49, 66, 16], "Putenbrust|180|g;Kartoffeln|300|g;Gurke|160|g;Skyr|70|g;Petersilie|12|g;Zitrone|0.5|Stk.;Rapsöl|1|TL", "turkey", "potato", "Lass das gebratene Schnitzel zwei Minuten ruhen und mische die Petersilie erst dann unter die heißen Kartoffeln."],
    ["rinderbaellchen-tomatensauce", "Rinderbällchen in Tomatensauce mit Kartoffelstampf", "Kräftige Rinderbällchen in fruchtiger Tomatensauce mit cremigem Kartoffelstampf.", "main", "klassisch", "omnivore", 45, "meatballs", [43, 68, 22], "Mageres Rinderhack|180|g;Passierte Tomaten|220|g;Kartoffeln|280|g;Milch|60|ml;Zwiebel|60|g;Petersilie|10|g;Rapsöl|1|TL", "beef", "potato", "Forme alle Bällchen gleich groß; so sind sie gleichzeitig gar und bleiben in der Sauce saftig."],
    ["ofen-hackbraten-gemuese", "Ofen-Hackbraten mit Möhren und Kartoffeln", "Kompakter Hackbraten mit gerösteten Möhren, Kartoffeln und kräftiger Bratensauce.", "main", "deutsch", "omnivore", 55, "ovenTray", [45, 63, 24], "Mageres Rinderhack|190|g;Kartoffeln|260|g;Möhren|160|g;Zwiebel|60|g;Haferflocken|25|g;Ei|1|Stk.;Mittelscharfer Senf|1|TL", "beef", "potato", "Lass den Hackbraten vor dem Anschneiden fünf Minuten ruhen, damit der Fleischsaft im Inneren bleibt."],
    ["haehnchenfrikassee-erbsen", "Hähnchenfrikassee mit Erbsen und Reis", "Leichtes Hähnchenfrikassee mit Erbsen, Möhren, Champignons und Reis.", "main", "deutsch", "omnivore", 40, "fricassee", [49, 72, 14], "Hähnchenbrust|180|g;Grüne Erbsen|100|g;Möhren|100|g;Langkornreis|75|g;Champignons|100|g;Milch|100|ml;Gemüsebrühe|200|ml", "chicken", "rice", "Nutze die Garflüssigkeit des Hähnchens als Saucenbasis – darin steckt bereits viel Geschmack."],
    ["pilzragout-semmelknoedel", "Pilzragout mit Semmelknödeln", "Cremiges Champignonragout mit Thymian und lockeren Semmelknödeln.", "main", "deutsch", "vegetarian", 45, "ragout", [25, 78, 22], "Champignons|250|g;Semmelknödel|180|g;Hafercuisine|100|ml;Zwiebel|60|g;Thymian|1|TL;Petersilie|10|g;Rapsöl|2|TL", "cottage", "bread", "Bräune die Pilze portionsweise und salze sie erst danach, damit das Ragout kräftig statt wässrig schmeckt."],
    ["spinat-kartoffel-auflauf", "Spinat-Kartoffel-Auflauf mit Ei", "Herzhafter Kartoffelauflauf mit Blattspinat, Ei und einer leichten Käsekruste.", "main", "klassisch", "vegetarian", 50, "casserole", [31, 58, 25], "Kartoffeln|300|g;Babyspinat|160|g;Eier|2|Stk.;Milch|120|ml;Geriebener Käse|50|g;Zwiebel|50|g;Muskat|1|Prise", "egg", "potato", "Schneide die Kartoffeln dünn und gleichmäßig, damit alle Scheiben in derselben Zeit weich werden."],
    ["linsen-bolognese", "Linsen-Bolognese mit Vollkornspaghetti", "Kräftige Tomatensauce mit Linsen, Möhren und Vollkornspaghetti.", "main", "klassisch", "vegan", 35, "pasta", [29, 91, 10], "Gekochte Linsen|220|g;Vollkornspaghetti|100|g;Möhren|100|g;Passierte Tomaten|250|g;Zwiebel|60|g;Italienische Kräuter|1|TL;Olivenöl|1|TL", "lentils", "pasta", "Lass die Sauce offen einkochen und ziehe die Pasta anschließend mit etwas Kochwasser direkt darin fertig."],
    ["gefuellte-paprika-pute", "Gefüllte Paprika mit Putenhack und Reis", "Ofenpaprika mit saftiger Puten-Reis-Füllung und fruchtiger Tomatensauce.", "main", "deutsch", "omnivore", 50, "stuffed", [45, 67, 18], "Rote Paprika|2|Stk.;Putenhack|180|g;Langkornreis|65|g;Passierte Tomaten|200|g;Zwiebel|60|g;Petersilie|10|g;Rapsöl|1|TL", "turkey", "rice", "Gare den Reis nur knapp vor; im Ofen nimmt er noch Flüssigkeit aus der Füllung auf."],
    ["sauerkraut-kartoffel-pfanne", "Sauerkraut-Kartoffel-Pfanne mit Räuchertofu", "Herzhafte Pfanne aus Kartoffeln, mildem Sauerkraut und knusprigem Räuchertofu.", "main", "deutsch", "vegan", 35, "gnocchi", [33, 66, 19], "Räuchertofu|180|g;Kartoffeln|300|g;Sauerkraut|180|g;Zwiebel|60|g;Apfel|80|g;Majoran|1|TL;Rapsöl|1|TL", "tofu", "potato", "Drücke das Sauerkraut leicht aus und gib es erst zu den gebräunten Kartoffeln, damit diese knusprig bleiben."],
    ["erbseneintopf-pute", "Erbseneintopf mit Putenwürstchen", "Sämiger Erbseneintopf mit Kartoffeln, Wurzelgemüse und mageren Putenwürstchen.", "main", "deutsch", "omnivore", 50, "stew", [42, 72, 17], "Grüne Schälerbsen|90|g;Putenwürstchen|140|g;Kartoffeln|180|g;Möhren|100|g;Lauch|80|g;Gemüsebrühe|450|ml;Majoran|1|TL", "turkey", "potato", "Schneide die Würstchen erst zum Schluss in den Eintopf, damit sie saftig bleiben und nicht aufplatzen."],
    ["seelachs-senfsauce", "Seelachs mit Senfsauce und Kartoffeln", "Schonend gegarter Seelachs mit milder Senfsauce, Kartoffeln und grünen Bohnen.", "main", "deutsch", "omnivore", 35, "fishOven", [42, 55, 18], "Seelachsfilet|190|g;Kartoffeln|280|g;Grüne Bohnen|150|g;Skyr|80|g;Mittelscharfer Senf|1|EL;Zitrone|0.5|Stk.;Dill|8|g", "fish", "potato", "Rühre den Senf erst nach dem Erhitzen in die Sauce, damit sein Aroma frisch und deutlich bleibt."],
    ["kraeuterquark-kartoffel-teller", "Ofenkartoffeln mit Kräuterquark und Rohkost", "Knusprige Kartoffelspalten mit proteinreichem Kräuterquark und bunter Rohkost.", "main", "deutsch", "vegetarian", 40, "bakedPotato", [38, 72, 15], "Kartoffeln|350|g;Magerquark|250|g;Gurke|100|g;Möhren|100|g;Radieschen|80|g;Schnittlauch|10|g;Rapsöl|1|TL", "dessert", "potato", "Tupfe die Kartoffelspalten trocken und verteile sie mit Abstand, bevor sie in den heißen Ofen kommen."],
    ["kartoffelpuffer-apfelquark", "Kartoffelpuffer mit Apfel und Kräuterquark", "Knusprige Kartoffelpuffer mit frischem Apfel und einem herzhaften Quarkdip.", "main", "deutsch", "vegetarian", 40, "potatoPatties", [30, 72, 22], "Kartoffeln|320|g;Apfel|120|g;Magerquark|180|g;Ei|1|Stk.;Haferflocken|25|g;Schnittlauch|8|g;Rapsöl|2|TL", "dessert", "potato", "Drücke die geriebenen Kartoffeln gründlich aus; trockene Raspel werden mit deutlich weniger Öl knusprig."],
    ["brokkoli-haehnchen-pasta", "Cremige Brokkoli-Pasta mit Hähnchen", "Vollkornpasta mit Brokkoli, Hähnchen und einer leichten Frischkäsesauce.", "main", "mediterran", "omnivore", 25, "pasta", [52, 78, 17], "Hähnchenbrust|180|g;Vollkornpasta|90|g;Brokkoli|180|g;Frischkäse light|60|g;Zitrone|0.25|Stk.;Knoblauch|1|Stk.;Olivenöl|1|TL", "chicken", "pasta", "Gib den Brokkoli für die letzten vier Minuten direkt zum Nudelwasser – das spart einen zusätzlichen Topf."],
    ["ofenlachs-zitronenkartoffeln", "Ofenlachs mit Zitronenkartoffeln", "Saftiger Lachs mit kleinen Ofenkartoffeln, grünen Bohnen und Dill.", "main", "mediterran", "omnivore", 40, "fishOven", [44, 57, 27], "Lachsfilet|180|g;Kartoffeln|280|g;Grüne Bohnen|150|g;Zitrone|0.5|Stk.;Dill|8|g;Olivenöl|2|TL;Knoblauch|1|Stk.", "salmon", "potato", "Lege den Lachs erst später zu den Kartoffeln, damit er saftig bleibt und nicht länger als nötig gart."],
    ["putenbaellchen-tomaten-orzo", "Putenbällchen mit kleinen Tomatennudeln", "Saftige Putenbällchen in einer würzigen Tomatensauce mit kleinen Nudeln.", "main", "mediterran", "omnivore", 35, "meatballs", [48, 75, 16], "Putenhack|180|g;Passierte Tomaten|230|g;Kleine Nudeln|85|g;Zucchini|120|g;Zwiebel|50|g;Petersilie|10|g;Olivenöl|1|TL", "turkey", "pasta", "Lass die kleinen Nudeln direkt in der Sauce garen und rühre regelmäßig, damit sie gleichmäßig weich werden."],
    ["zucchini-lasagne-rind", "Zucchini-Lasagne mit Rinderhack", "Schichtauflauf mit Zucchini, magerem Rinderhack, Tomatensauce und Mozzarella.", "main", "mediterran", "omnivore", 55, "casserole", [46, 42, 28], "Zucchini|300|g;Mageres Rinderhack|180|g;Passierte Tomaten|250|g;Mozzarella light|80|g;Lasagneplatten|60|g;Zwiebel|60|g;Italienische Kräuter|1|TL", "beef", "pasta", "Salze die Zucchinischeiben kurz vor und tupfe sie trocken, damit der Auflauf nicht wässrig wird."],
    ["mediterranes-kichererbsen-blech", "Mediterranes Kichererbsen-Gemüse vom Blech", "Geröstete Kichererbsen mit Kartoffeln, Zucchini, Paprika und Zitronenkräutern.", "main", "mediterran", "vegan", 45, "ovenTray", [24, 79, 18], "Kichererbsen|220|g;Kartoffeln|250|g;Zucchini|160|g;Rote Paprika|150|g;Zitrone|0.5|Stk.;Italienische Kräuter|1|TL;Olivenöl|2|TL", "tofu", "potato", "Trockne die Kichererbsen sorgfältig und verteile das Gemüse auf einem großen statt einem kleinen Blech."],
    ["tomatenrisotto-garnelen", "Tomatenrisotto mit Garnelen", "Cremiges Tomatenrisotto mit kurz gebratenen Garnelen, Zucchini und Petersilie.", "main", "mediterran", "omnivore", 40, "risotto", [43, 78, 14], "Risottoreis|90|g;Zwiebel|50|g;Zucchini|140|g;Garnelen|170|g;Gehackte Tomaten|180|g;Gemüsebrühe|450|ml;Petersilie|10|g;Olivenöl|1|TL", "shrimp", "rice", "Brate die Garnelen separat und lege sie erst auf das fertige Risotto, damit sie nicht zäh werden."],
    ["gnocchi-spinat-bohnen", "Gnocchi-Pfanne mit Spinat und weißen Bohnen", "Goldbraune Gnocchi mit weißen Bohnen, Blattspinat und Kirschtomaten.", "main", "mediterran", "vegan", 25, "gnocchi", [23, 91, 17], "Weiße Bohnen|200|g;Gnocchi|220|g;Babyspinat|100|g;Kirschtomaten|150|g;Knoblauch|1|Stk.;Zitrone|0.25|Stk.;Olivenöl|1|TL", "lentils", "pasta", "Röste die Gnocchi ungekocht in der Pfanne; so bekommen sie eine feste, goldene Oberfläche."],
    ["thunfisch-pasta-erbsen", "Thunfisch-Pasta mit Erbsen und Zitrone", "Schnelle Vollkornpasta mit Thunfisch, grünen Erbsen und einer leichten Zitronensauce.", "main", "mediterran", "omnivore", 20, "pasta", [50, 79, 14], "Thunfisch im eigenen Saft|160|g;Vollkornpasta|95|g;Grüne Erbsen|120|g;Frischkäse light|50|g;Zitrone|0.5|Stk.;Petersilie|10|g;Olivenöl|1|TL", "tuna", "pasta", "Hebe den Thunfisch erst beim Schwenken unter, damit größere Stücke erhalten bleiben."],
    ["auberginen-tomaten-auflauf", "Auberginen-Tomaten-Auflauf mit Mozzarella", "Mediterraner Gemüseauflauf mit Aubergine, Tomaten, weißen Bohnen und Mozzarella.", "main", "mediterran", "vegetarian", 50, "casserole", [30, 52, 27], "Aubergine|260|g;Gehackte Tomaten|240|g;Weiße Bohnen|160|g;Mozzarella light|90|g;Zwiebel|60|g;Basilikum|10|g;Olivenöl|2|TL", "cottage", "bread", "Bräune die Auberginenscheiben vor dem Schichten kurz an, damit sie aromatisch und nicht schwammig werden."],
    ["haehnchen-souvlaki-reis", "Hähnchen-Souvlaki mit Reis und Tzatziki", "Zitroniges Hähnchen mit Kräuterreis, Tomaten-Gurken-Salat und leichtem Tzatziki.", "main", "mediterran", "omnivore", 35, "grill", [51, 72, 18], "Hähnchenbrust|190|g;Langkornreis|75|g;Gurke|140|g;Tomate|140|g;Griechischer Joghurt|100|g;Zitrone|0.5|Stk.;Italienische Kräuter|1|TL", "chicken", "rice", "Mariniere das Hähnchen schon während der Reis gart; länger braucht die milde Zitronenmarinade nicht."],
    ["kabeljau-tomaten-oliven", "Kabeljau in Tomaten-Oliven-Sauce", "Schonend gegarter Kabeljau mit Tomaten, Oliven, Kartoffeln und grünen Bohnen.", "main", "mediterran", "omnivore", 40, "fishOven", [43, 56, 19], "Kabeljaufilet|190|g;Kartoffeln|260|g;Gehackte Tomaten|220|g;Grüne Bohnen|150|g;Oliven|25|g;Zitrone|0.5|Stk.;Olivenöl|1|TL", "fish", "potato", "Setze den Fisch auf die bereits heiße Sauce und gare ihn zugedeckt, damit er besonders saftig bleibt."],
    ["weisse-bohnen-gruenkohl-eintopf", "Weiße-Bohnen-Eintopf mit Grünkohl", "Herzhafter mediterraner Eintopf mit weißen Bohnen, Grünkohl, Tomaten und Kartoffeln.", "main", "mediterran", "vegan", 40, "stew", [25, 76, 13], "Weiße Bohnen|240|g;Grünkohl|180|g;Kartoffeln|200|g;Gehackte Tomaten|200|g;Gemüsebrühe|350|ml;Knoblauch|1|Stk.;Olivenöl|1|TL", "lentils", "potato", "Massiere den geschnittenen Grünkohl kurz mit den Händen, bevor er in den Topf kommt; dadurch wird er schneller zart."],
    ["pesto-tofu-pasta", "Pesto-Tofu-Pasta mit Kirschtomaten", "Knuspriger Tofu mit Vollkornpasta, Tomaten, Spinat und Basilikumpesto.", "main", "mediterran", "vegan", 25, "pasta", [39, 79, 23], "Naturtofu|200|g;Vollkornpasta|90|g;Kirschtomaten|160|g;Babyspinat|80|g;Veganes Basilikumpesto|25|g;Zitrone|0.25|Stk.;Olivenöl|1|TL", "tofu", "pasta", "Verdünne das Pesto mit Nudelwasser statt zusätzlichem Öl, damit es sich gleichmäßig verteilt."],
    ["puten-zucchini-couscous", "Puten-Zucchini-Pfanne mit Couscous", "Schnelle Putenpfanne mit Zucchini, Tomaten, Couscous und Zitronenkräutern.", "main", "mediterran", "omnivore", 25, "couscous", [48, 73, 15], "Putenbrust|180|g;Couscous|80|g;Zucchini|160|g;Kirschtomaten|140|g;Zitrone|0.5|Stk.;Petersilie|10|g;Olivenöl|1|TL", "turkey", "couscous", "Lockere den Couscous ausschließlich mit einer Gabel, damit er körnig und nicht kompakt wird."],
    ["pilzpolenta-spinat", "Cremige Polenta mit Pilzen und Spinat", "Weiche Polenta mit gebräunten Champignons, Blattspinat und Parmesan.", "main", "mediterran", "vegetarian", 30, "ragout", [27, 69, 23], "Champignons|220|g;Polenta|90|g;Babyspinat|120|g;Milch|150|ml;Parmesan|30|g;Thymian|1|TL;Olivenöl|1|TL", "cottage", "couscous", "Rühre die Polenta nach dem Garen mit einem Schluck warmer Milch locker, falls sie zu fest wird."],
    ["ingwer-haehnchen-brokkoli", "Ingwer-Hähnchen mit Brokkoli und Reis", "Schnelle Reispfanne mit Hähnchen, Brokkoli, Möhre und milder Ingwersauce.", "main", "asiatisch", "omnivore", 25, "wok", [51, 75, 14], "Hähnchenbrust|180|g;Langkornreis|80|g;Brokkoli|180|g;Möhre|100|g;Sojasauce|1.5|EL;Frischer Ingwer|8|g;Rapsöl|1|TL", "chicken", "rice", "Schneide Brokkolistiel und Röschen getrennt; der feste Stiel darf zuerst in die Pfanne."],
    ["erdnuss-tofu-nudeln", "Erdnuss-Tofu-Nudeln mit Spitzkohl", "Cremige Erdnussnudeln mit knusprigem Tofu, Spitzkohl und Champignons.", "main", "asiatisch", "vegan", 25, "wok", [39, 78, 25], "Naturtofu|200|g;Vollkornnudeln|85|g;Spitzkohl|160|g;Champignons|120|g;Erdnussmus|25|g;Sojasauce|1|EL;Zitrone|0.5|Stk.", "tofu", "pasta", "Rühre das Erdnussmus zuerst mit warmem Nudelwasser glatt, bevor es in die heiße Pfanne kommt."],
    ["teriyaki-lachs-bohnen", "Teriyaki-Lachs mit grünen Bohnen", "Gebratener Lachs mit grünen Bohnen, Möhren, Reis und einer milden Teriyakisauce.", "main", "asiatisch", "omnivore", 30, "panRice", [43, 72, 25], "Lachsfilet|170|g;Langkornreis|75|g;Grüne Bohnen|160|g;Möhre|100|g;Sojasauce|1.5|EL;Honig|1|TL;Frischer Ingwer|6|g", "salmon", "rice", "Reduziere die Sauce separat und glasiere den Lachs nur kurz, damit der Honig nicht verbrennt."],
    ["puten-bratreis-ei", "Gebratener Reis mit Pute und Ei", "Lockerer Bratreis mit Putenstreifen, Ei, Erbsen und Möhren.", "main", "asiatisch", "omnivore", 25, "friedRice", [53, 78, 17], "Putenbrust|160|g;Gekochter Langkornreis|240|g;Eier|2|Stk.;Grüne Erbsen|100|g;Möhre|90|g;Sojasauce|1|EL;Rapsöl|1|TL", "turkey", "rice", "Verwende vollständig ausgekühlten Reis vom Vortag oder breite frisch gegarten Reis zum schnellen Abkühlen aus."],
    ["rind-paprika-sesamnudeln", "Rindfleischstreifen mit Paprika und Sesamnudeln", "Kräftig gebratenes Rindfleisch mit Paprika, Brokkoli und würzigen Nudeln.", "main", "asiatisch", "omnivore", 30, "wok", [47, 76, 20], "Rindfleischstreifen|170|g;Vollkornnudeln|85|g;Rote Paprika|150|g;Brokkoli|140|g;Sojasauce|1.5|EL;Sesam|10|g;Rapsöl|1|TL", "beef", "pasta", "Brate das Rindfleisch sehr kurz in zwei Portionen und gib es erst nach der Sauce zurück in den Wok."],
    ["rote-linsen-kokos-curry", "Mildes Rote-Linsen-Kokos-Curry", "Cremiges Linsencurry mit Spinat, Tomaten, Kokosmilch und Reis.", "main", "indisch", "vegan", 30, "curry", [27, 91, 18], "Rote Linsen|100|g;Langkornreis|65|g;Babyspinat|120|g;Passierte Tomaten|200|g;Kokosmilch|100|ml;Currypulver|2|TL;Zitrone|0.5|Stk.", "lentils", "rice", "Gib Zitrone und Salz erst zum Schluss dazu, damit die Linsen ohne Verzögerung weich werden."],
    ["kichererbsen-spinat-curry", "Kichererbsen-Spinat-Curry mit Reis", "Mildes Tomatencurry mit Kichererbsen, Spinat, Paprika und Langkornreis.", "main", "indisch", "vegan", 30, "curry", [24, 92, 16], "Kichererbsen|220|g;Langkornreis|70|g;Babyspinat|120|g;Rote Paprika|130|g;Gehackte Tomaten|220|g;Currypulver|2|TL;Rapsöl|1|TL", "tofu", "rice", "Röste das Currypulver nur kurz und bei mittlerer Hitze, damit es aromatisch wird, ohne bitter zu schmecken."],
    ["tofu-gemuese-cashew-pfanne", "Tofu-Gemüse-Pfanne mit Cashewkernen", "Knuspriger Tofu mit Brokkoli, Paprika, Möhren, Reis und gerösteten Cashews.", "main", "asiatisch", "vegan", 30, "wok", [39, 74, 27], "Naturtofu|200|g;Langkornreis|70|g;Brokkoli|150|g;Rote Paprika|120|g;Möhre|90|g;Cashewkerne|20|g;Sojasauce|1|EL", "tofu", "rice", "Röste die Cashewkerne trocken und streue sie erst beim Anrichten über das Gericht."],
    ["haehnchen-nudelsuppe-ingwer", "Hähnchen-Nudelsuppe mit Ingwer", "Klare Brühe mit Hähnchen, Vollkornnudeln, Möhren, Lauch und frischem Ingwer.", "main", "asiatisch", "omnivore", 35, "noodleSoup", [48, 65, 12], "Hähnchenbrust|180|g;Vollkornnudeln|80|g;Möhren|120|g;Lauch|100|g;Gemüsebrühe|500|ml;Frischer Ingwer|8|g;Zitrone|0.25|Stk.", "chicken", "pasta", "Gare die Nudeln separat, wenn Reste geplant sind; so saugen sie über Nacht nicht die gesamte Brühe auf."],
    ["ei-bratreis-erbsen", "Eier-Bratreis mit Erbsen und Möhren", "Schneller gebratener Reis mit Ei, Erbsen, Möhren und Frühlingszwiebeln.", "main", "asiatisch", "vegetarian", 20, "friedRice", [29, 82, 19], "Eier|3|Stk.;Gekochter Langkornreis|260|g;Grüne Erbsen|120|g;Möhren|100|g;Frühlingszwiebel|2|Stk.;Sojasauce|1|EL;Rapsöl|1|TL", "egg", "rice", "Schiebe den Reis an den Pfannenrand und lasse das Ei zuerst in der freien Mitte stocken, bevor du alles mischst."],
    ["reisnudelsalat-tofu", "Reisnudelsalat mit Tofu und Gurke", "Frischer Nudelsalat mit knusprigem Tofu, Gurke, Möhre und Zitronen-Soja-Dressing.", "main", "asiatisch", "vegan", 25, "coldNoodles", [34, 78, 21], "Naturtofu|200|g;Reisnudeln|85|g;Gurke|140|g;Möhre|100|g;Sojasauce|1|EL;Zitrone|0.5|Stk.;Sesam|10|g", "tofu", "pasta", "Spüle die Reisnudeln nur kurz kalt ab und mische sie noch leicht feucht mit dem Dressing."],
    ["suess-sauer-pute-ananas", "Süß-saure Pute mit Ananas und Reis", "Putenstreifen mit Paprika, Ananas und einer ausgewogenen süß-sauren Sauce.", "main", "asiatisch", "omnivore", 30, "wok", [48, 83, 13], "Putenbrust|180|g;Langkornreis|75|g;Ananas|120|g;Rote Paprika|150|g;Tomatenmark|15|g;Sojasauce|1|EL;Apfelessig|1|EL", "turkey", "rice", "Brate die Ananas kurz mit an; die gebräunten Kanten machen die Sauce aromatisch statt nur süß."],
    ["pilz-ramen-ei", "Pilz-Ramen mit Ei und Spinat", "Wärmende Nudelsuppe mit Champignons, Ei, Spinat und milder Ingwerbrühe.", "main", "asiatisch", "vegetarian", 30, "noodleSoup", [31, 67, 17], "Eier|2|Stk.;Vollkornnudeln|80|g;Champignons|180|g;Babyspinat|100|g;Gemüsebrühe|500|ml;Sojasauce|1|EL;Frischer Ingwer|6|g", "egg", "pasta", "Koche die Eier separat auf den gewünschten Punkt und halbiere sie erst direkt vor dem Anrichten."],
    ["chili-con-carne", "Chili con Carne mit Reis", "Klassisches Chili mit magerem Rinderhack, Kidneybohnen, Mais und Langkornreis.", "main", "mexikanisch", "omnivore", 35, "stew", [45, 88, 19], "Mageres Rinderhack|170|g;Kidneybohnen|180|g;Langkornreis|65|g;Mais|80|g;Gehackte Tomaten|220|g;Rote Paprika|120|g;Paprikapulver|1|TL", "beef", "rice", "Lass das Hack zunächst ungestört bräunen, bevor du es zerteilst; das verstärkt den herzhaften Geschmack."],
    ["chili-sin-carne-suesskartoffel", "Chili sin Carne mit Süßkartoffel", "Veganes Chili mit Kidneybohnen, roten Linsen, Süßkartoffel und Mais.", "main", "mexikanisch", "vegan", 40, "stew", [27, 96, 13], "Kidneybohnen|180|g;Süßkartoffel|240|g;Rote Linsen|60|g;Mais|80|g;Gehackte Tomaten|250|g;Rote Paprika|120|g;Paprikapulver|1|TL", "lentils", "potato", "Schneide die Süßkartoffel klein genug, damit sie gleichzeitig mit den roten Linsen gar wird."],
    ["haehnchen-fajita-pfanne", "Hähnchen-Fajitas mit Paprika", "Gebratene Hähnchenstreifen mit Paprika, Zwiebel, Tortillas und frischer Joghurtsauce.", "main", "mexikanisch", "omnivore", 25, "fajita", [51, 68, 19], "Hähnchenbrust|180|g;Vollkorn-Tortillas|2|Stk.;Rote Paprika|150|g;Zwiebel|70|g;Skyr|80|g;Tomate|100|g;Paprikapulver|1|TL", "chicken", "bread", "Erwärme die Tortillas erst kurz vor dem Servieren und halte sie unter einem sauberen Tuch weich."],
    ["puten-burrito-bowl", "Puten-Burrito-Bowl mit Mais und Bohnen", "Würzige Putenstreifen mit Zitronenreis, Bohnen, Mais und frischer Tomatensalsa.", "main", "mexikanisch", "omnivore", 30, "panRice", [50, 83, 17], "Putenbrust|180|g;Langkornreis|70|g;Kidneybohnen|120|g;Mais|80|g;Tomate|140|g;Zitrone|0.5|Stk.;Paprikapulver|1|TL", "turkey", "rice", "Würze Reis, Fleisch und Salsa jeweils separat; dadurch schmeckt die Bowl vielschichtig statt einheitlich."],
    ["gefuellte-suesskartoffel-bohnen", "Gefüllte Süßkartoffel mit Bohnen und Hüttenkäse", "Ofen-Süßkartoffel mit Kidneybohnen, Mais, Tomaten und körnigem Frischkäse.", "main", "mexikanisch", "vegetarian", 50, "stuffed", [32, 87, 17], "Süßkartoffel|350|g;Kidneybohnen|170|g;Körniger Frischkäse|150|g;Mais|70|g;Tomate|120|g;Zitrone|0.5|Stk.;Paprikapulver|1|TL", "cottage", "potato", "Stich die Süßkartoffel mehrfach ein und backe sie direkt auf dem Rost, damit die Schale trocken bleibt."],
    ["rind-quesadilla-paprikasalat", "Rindfleisch-Quesadilla mit Paprikasalat", "Knusprige Tortilla mit würzigem Rinderhack, Käse und einem frischen Paprikasalat.", "main", "mexikanisch", "omnivore", 30, "quesadilla", [45, 64, 26], "Mageres Rinderhack|160|g;Vollkorn-Tortillas|2|Stk.;Rote Paprika|160|g;Geriebener Käse|60|g;Tomate|120|g;Zitrone|0.5|Stk.;Paprikapulver|1|TL", "beef", "bread", "Verteile die Füllung dünn; eine überladene Quesadilla wird außen dunkel, bevor sie innen heiß ist."],
    ["mexikanische-linsen-reispfanne", "Mexikanische Linsen-Reis-Pfanne", "Sättigende Pfanne mit Linsen, Reis, Paprika, Mais und Tomaten.", "main", "mexikanisch", "vegan", 30, "friedRice", [25, 94, 13], "Gekochte Linsen|220|g;Gekochter Langkornreis|230|g;Rote Paprika|140|g;Mais|80|g;Gehackte Tomaten|180|g;Zwiebel|60|g;Paprikapulver|1|TL", "lentils", "rice", "Lass den Reis an einigen Stellen ungestört rösten, bevor du die Tomaten unterhebst."],
    ["couscous-haehnchen-gemuese", "Couscous-Schale mit Hähnchen und Ofengemüse", "Zitroniger Couscous mit Hähnchen, Zucchini, Paprika und einem leichten Joghurtdip.", "main", "orientalisch", "omnivore", 35, "couscous", [51, 74, 18], "Hähnchenbrust|180|g;Couscous|80|g;Zucchini|150|g;Rote Paprika|140|g;Griechischer Joghurt|80|g;Zitrone|0.5|Stk.;Petersilie|10|g", "chicken", "couscous", "Übergieße den Couscous mit exakt abgemessener Flüssigkeit und lasse ihn zugedeckt vollständig quellen."],
    ["falafel-kartoffel-blech", "Falafel-Kartoffel-Blech mit Joghurtsauce", "Knusprige Falafel mit Kartoffeln, Möhren, Zucchini und einer frischen Joghurtsauce.", "main", "orientalisch", "vegetarian", 45, "ovenTray", [30, 76, 22], "Falafel|180|g;Kartoffeln|260|g;Möhren|130|g;Zucchini|140|g;Griechischer Joghurt|100|g;Zitrone|0.5|Stk.;Petersilie|10|g", "cottage", "potato", "Gib die Falafel erst später auf das Blech als die Kartoffeln, damit sie außen knusprig und innen saftig bleiben."],
    ["putenkofta-bulgur", "Puten-Kofta mit Bulgur und Gurkensalat", "Würzige Putenrollen mit lockerem Bulgur, Gurke und Zitronen-Joghurtsauce.", "main", "orientalisch", "omnivore", 35, "kofta", [50, 72, 17], "Putenhack|180|g;Bulgur|80|g;Gurke|160|g;Griechischer Joghurt|90|g;Zitrone|0.5|Stk.;Petersilie|10|g;Paprikapulver|1|TL", "turkey", "couscous", "Kühle die geformten Kofta zehn Minuten; dadurch bleiben sie beim Braten stabil."],
    ["linsen-spinat-topf", "Linsen-Spinat-Topf mit Zitrone", "Wärmender Topf mit braunen Linsen, Spinat, Möhren, Tomaten und Zitronenreis.", "main", "orientalisch", "vegan", 35, "stew", [27, 89, 12], "Gekochte Linsen|240|g;Langkornreis|65|g;Babyspinat|140|g;Möhren|120|g;Gehackte Tomaten|200|g;Zitrone|0.5|Stk.;Petersilie|10|g", "lentils", "rice", "Hebe den Spinat erst am Ende unter und lass ihn nur zusammenfallen, damit Farbe und Frische erhalten bleiben."],
    ["ofenfeta-kichererbsen", "Ofen-Feta mit Kichererbsen und Tomaten", "Gebackener Feta auf Kichererbsen, Tomaten, Zucchini und Paprika.", "main", "orientalisch", "vegetarian", 40, "ovenTray", [31, 55, 29], "Feta|120|g;Kichererbsen|200|g;Kirschtomaten|180|g;Zucchini|150|g;Rote Paprika|120|g;Zitrone|0.5|Stk.;Olivenöl|1|TL", "cottage", "bread", "Setze den Feta oben auf das Gemüse, damit er bräunt und nicht in der austretenden Flüssigkeit liegt."],
    ["harissa-lachs-couscous", "Paprika-Lachs mit Couscous und Zucchini", "Saftiger Lachs mit mildem Paprikamark, Kräutercouscous und gebratener Zucchini.", "main", "orientalisch", "omnivore", 35, "couscous", [45, 70, 26], "Lachsfilet|170|g;Couscous|75|g;Zucchini|170|g;Paprikamark|15|g;Zitrone|0.5|Stk.;Petersilie|10|g;Olivenöl|1|TL", "salmon", "couscous", "Streiche das Paprikamark nur dünn auf den Lachs, damit es beim Braten nicht dunkel und bitter wird."],
    ["kuerbis-kichererbsen-tahini", "Kürbis-Kichererbsen-Topf mit Sesamsauce", "Cremiger Kürbistopf mit Kichererbsen, Tomaten, Spinat und Zitronen-Sesamsauce.", "main", "orientalisch", "vegan", 40, "stew", [25, 79, 21], "Hokkaidokürbis|280|g;Kichererbsen|220|g;Gehackte Tomaten|200|g;Babyspinat|100|g;Sojajoghurt|80|g;Sesam|15|g;Zitrone|0.5|Stk.", "tofu", "potato", "Rühre Sojajoghurt, Sesam und Zitronensaft zunächst glatt und gib die Sauce erst beim Servieren darüber."],
    ["haehnchen-shawarma-reis", "Gewürz-Hähnchen mit Petersilienkartoffeln und Krautsalat", "Kräftig gebratenes Hähnchen mit Petersilienkartoffeln, frischem Krautsalat und Joghurtsauce.", "main", "orientalisch", "omnivore", 40, "grill", [51, 69, 18], "Hähnchenbrust|190|g;Kartoffeln|280|g;Spitzkohl|140|g;Möhre|90|g;Griechischer Joghurt|90|g;Zitrone|0.5|Stk.;Petersilie|10|g", "chicken", "potato", "Schneide das Hähnchen erst nach einer kurzen Ruhezeit in Streifen, damit weniger Saft austritt."],
    ["haehnchen-erbsen-curry", "Hähnchen-Curry mit Erbsen und Reis", "Mildes Tomaten-Curry mit Hähnchen, Erbsen, Möhren und Langkornreis.", "main", "indisch", "omnivore", 35, "curry", [50, 78, 16], "Hähnchenbrust|180|g;Langkornreis|75|g;Grüne Erbsen|120|g;Möhren|100|g;Passierte Tomaten|200|g;Kokosmilch|70|ml;Currypulver|2|TL", "chicken", "rice", "Gib das angebratene Hähnchen erst für die letzten Minuten in die Sauce zurück."],
    ["tofu-tikka-blumenkohl", "Tofu-Tikka mit Blumenkohl und Reis", "Gebratener Tofu mit Blumenkohl, Paprika und einer cremigen Tomatensauce.", "main", "indisch", "vegan", 35, "curry", [38, 76, 22], "Naturtofu|220|g;Langkornreis|70|g;Blumenkohl|200|g;Rote Paprika|130|g;Passierte Tomaten|200|g;Sojajoghurt|80|g;Currypulver|2|TL", "tofu", "rice", "Rühre den Sojajoghurt erst bei reduzierter Hitze ein, damit die Sauce glatt bleibt."],
    ["linsen-dal-spinat", "Linsen-Dal mit Blumenkohl und Kartoffeln", "Cremiges Dal aus roten Linsen mit Blumenkohl, Kartoffeln und einem frischen Zitronenabschluss.", "main", "indisch", "vegan", 40, "curry", [28, 88, 14], "Rote Linsen|105|g;Kartoffeln|200|g;Blumenkohl|180|g;Babyspinat|100|g;Gehackte Tomaten|180|g;Currypulver|2|TL;Zitrone|0.5|Stk.", "lentils", "potato", "Rühre regelmäßig am Topfboden, denn rote Linsen setzen kurz vor dem Zerfallen besonders leicht an."],
    ["puten-keema-kartoffeln", "Puten-Keema mit Kartoffeln und Erbsen", "Würzige Putenhackpfanne mit Kartoffelwürfeln, Erbsen, Tomaten und mildem Curry.", "main", "indisch", "omnivore", 40, "stew", [45, 63, 18], "Putenhack|180|g;Kartoffeln|260|g;Grüne Erbsen|120|g;Gehackte Tomaten|220|g;Zwiebel|60|g;Currypulver|2|TL;Rapsöl|1|TL", "turkey", "potato", "Schneide die Kartoffeln klein und gleichmäßig, damit sie in der würzigen Sauce vollständig weich werden."],
    ["kichererbsen-tomaten-curry-brokkoli", "Kichererbsen-Tomaten-Curry mit Brokkoli", "Mildes Kichererbsencurry mit Brokkoli, Tomaten, Kokosmilch und Reis.", "main", "indisch", "vegan", 35, "curry", [25, 94, 17], "Kichererbsen|220|g;Langkornreis|70|g;Brokkoli|180|g;Gehackte Tomaten|220|g;Kokosmilch|80|ml;Currypulver|2|TL;Zitrone|0.5|Stk.", "tofu", "rice", "Gib die Brokkoliröschen gestaffelt dazu: Stiele zuerst, empfindliche Röschen einige Minuten später."],
    ["fischcurry-paprika-reis", "Fischcurry mit Paprika und Reis", "Schonendes Curry mit Seelachs, Paprika, Spinat und einer milden Kokos-Tomatensauce.", "main", "indisch", "omnivore", 35, "curry", [43, 73, 19], "Seelachsfilet|190|g;Langkornreis|75|g;Rote Paprika|150|g;Babyspinat|100|g;Passierte Tomaten|180|g;Kokosmilch|80|ml;Currypulver|2|TL", "fish", "rice", "Lege die Fischstücke oben auf die leise köchelnde Sauce und wende sie möglichst nicht."],
    ["halloumi-tomaten-spinat", "Halloumi in Tomaten-Spinat-Sauce", "Gebratener Halloumi mit cremiger Tomatensauce, Blattspinat und Langkornreis.", "main", "indisch", "vegetarian", 30, "curry", [34, 71, 29], "Halloumi|140|g;Langkornreis|70|g;Babyspinat|130|g;Passierte Tomaten|220|g;Zwiebel|50|g;Currypulver|2|TL;Rapsöl|1|TL", "cottage", "rice", "Brate den Halloumi separat und lege ihn erst beim Servieren auf die Sauce, damit er eine Kruste behält."],

    // 20 Desserts
    ["quarkcreme-kirschen-crunch", "Quarkcreme mit warmen Kirschen und Hafercrunch", "Cremiger Magerquark mit warmen Kirschen, Vanille und knusprigen Haferflocken.", "dessert", "deutsch", "vegetarian", 20, "cream", [31, 48, 9], "Magerquark|250|g;Kirschen|160|g;Haferflocken|30|g;Vanille|1|Prise;Honig|1|TL;Zimt|1|Prise", "dessert", "oats", "Röste die Haferflocken trocken und gib sie erst kurz vor dem Essen auf die Creme."],
    ["apfel-zimt-skyr", "Apfel-Zimt-Skyr mit gerösteten Mandeln", "Kühler Skyr mit warmen Apfelwürfeln, Zimt und gerösteten Mandeln.", "dessert", "deutsch", "vegetarian", 15, "cream", [31, 36, 12], "Skyr|250|g;Apfel|180|g;Mandeln|15|g;Zimt|1|TL;Honig|1|TL;Zitrone|0.25|Stk.", "dessert", "fruit", "Brate die Apfelwürfel nur kurz, damit sie weich werden und trotzdem ihre Form behalten."],
    ["beeren-joghurt-parfait", "Beeren-Joghurt-Parfait mit Haferflocken", "Geschichteter griechischer Joghurt mit Beeren und knusprigen Haferflocken.", "dessert", "klassisch", "vegetarian", 15, "cream", [24, 42, 14], "Griechischer Joghurt|220|g;Beeren|170|g;Haferflocken|30|g;Honig|1|TL;Vanille|1|Prise;Zitrone|0.25|Stk.", "dessert", "oats", "Zerdrücke nur einen Teil der Beeren; ganze Früchte sorgen im Glas für mehr Struktur."],
    ["ofenapfel-vanillequark", "Ofenapfel mit Vanillequark", "Warmer Apfel aus dem Ofen mit Haferfüllung und kühlem Vanillequark.", "dessert", "deutsch", "vegetarian", 35, "bakedApple", [29, 54, 10], "Magerquark|220|g;Apfel|1|Stk.;Haferflocken|30|g;Rosinen|15|g;Vanille|1|Prise;Zimt|1|TL", "dessert", "oats", "Gib einen kleinen Schluck Wasser in die Form, damit der Apfel gleichmäßig weich wird, ohne auszutrocknen."],
    ["schoko-bananen-pudding", "Schoko-Bananen-Pudding mit Skyr", "Cremiger Kakao-Pudding mit Banane und einem Klecks gekühltem Skyr.", "dessert", "klassisch", "vegetarian", 20, "pudding", [25, 50, 9], "Milch|250|ml;Banane|120|g;Skyr|150|g;Speisestärke|18|g;Backkakao|12|g;Vanille|1|Prise", "dessert", "fruit", "Rühre Kakao und Stärke zuerst mit kalter Milch glatt, bevor die Mischung in den heißen Topf kommt."],
    ["milchreis-beeren", "Milchreis mit warmen Beeren", "Cremiger Milchreis mit Vanille, Zimt und einer warmen Beerensauce.", "dessert", "deutsch", "vegetarian", 35, "grainPudding", [19, 69, 10], "Milch|300|ml;Milchreis|70|g;Beeren|160|g;Skyr|100|g;Vanille|1|Prise;Zimt|1|Prise", "dessert", "fruit", "Lass den Milchreis bei kleinster Hitze quellen und rühre regelmäßig über den Topfboden."],
    ["pflaumen-hafer-crumble", "Pflaumen-Hafer-Crumble", "Warme Pflaumen unter knusprigen Haferstreuseln mit kühlem Sojajoghurt.", "dessert", "deutsch", "vegan", 35, "crumble", [12, 60, 18], "Haferflocken|50|g;Pflaumen|220|g;Sojajoghurt|150|g;Margarine|15|g;Zimt|1|TL;Ahornsirup|1|TL", "dessertVegan", "oats", "Lass das Crumble zehn Minuten stehen; in dieser Zeit bindet der austretende Fruchtsaft leicht an."],
    ["zitronen-cheesecake-glas", "Zitronen-Cheesecake im Glas", "Frische Quarkcreme mit Zitrone, Beeren und einem knusprigen Haferboden.", "dessert", "mediterran", "vegetarian", 20, "cream", [32, 43, 10], "Magerquark|250|g;Beeren|120|g;Haferkeks|30|g;Zitrone|0.5|Stk.;Honig|1|TL;Vanille|1|Prise", "dessert", "oats", "Reibe nur die gelbe Schale der Zitrone ab; die weiße Schicht darunter schmeckt bitter."],
    ["mango-sojajoghurt-creme", "Mango-Sojajoghurt-Creme mit Kokos", "Fruchtige Mango mit Sojajoghurt, Zitrone und gerösteten Kokosraspeln.", "dessert", "asiatisch", "vegan", 15, "cream", [14, 42, 17], "Sojajoghurt|250|g;Mango|180|g;Kokosraspel|15|g;Zitrone|0.5|Stk.;Ahornsirup|1|TL;Vanille|1|Prise", "dessertVegan", "fruit", "Püriere nur die Hälfte der Mango und hebe den Rest als saftige Würfel unter die Creme."],
    ["kirsch-griesspudding", "Grießpudding mit Kirschkompott", "Cremiger Vanillegrieß mit warmen Kirschen und einem Klecks Skyr.", "dessert", "deutsch", "vegetarian", 25, "grainPudding", [24, 57, 8], "Milch|250|ml;Weichweizengrieß|45|g;Kirschen|160|g;Skyr|150|g;Vanille|1|Prise;Zimt|1|Prise", "dessert", "fruit", "Streue den Grieß langsam in die heiße Milch und rühre dabei durchgehend mit dem Schneebesen."],
    ["apfel-baked-oats", "Apfel-Baked-Oats mit Skyr", "Saftiger Haferauflauf mit Apfel, Zimt und einer kühlen Skyrcreme.", "dessert", "klassisch", "vegetarian", 35, "bakedDessert", [28, 62, 13], "Skyr|200|g;Apfel|170|g;Haferflocken|60|g;Ei|1|Stk.;Milch|100|ml;Zimt|1|TL", "dessert", "oats", "Lass die Masse vor dem Backen fünf Minuten quellen, damit die Haferflocken gleichmäßig weich werden."],
    ["schoko-tofu-mousse", "Schoko-Sojajoghurt-Creme mit Himbeeren", "Cremige Kakaocreme aus Sojajoghurt mit Himbeeren und gerösteten Mandeln.", "dessert", "klassisch", "vegan", 15, "cream", [15, 32, 18], "Sojajoghurt|250|g;Himbeeren|150|g;Mandeln|15|g;Backkakao|15|g;Ahornsirup|1|EL;Vanille|1|Prise", "dessertVegan", "fruit", "Rühre Kakao und Ahornsirup zuerst glatt, bevor du sie unter den kalten Sojajoghurt ziehst."],
    ["erdbeer-quark-pfannkuchen", "Quark-Pfannküchlein mit Erdbeeren", "Kleine Quarkpfannkuchen mit frischen Erdbeeren und Vanille.", "dessert", "deutsch", "vegetarian", 25, "pancake", [32, 48, 13], "Magerquark|220|g;Erdbeeren|180|g;Ei|1|Stk.;Hafermehl|45|g;Skyr|80|g;Vanille|1|Prise;Rapsöl|1|TL", "dessert", "oats", "Backe lieber mehrere kleine statt weniger großer Pfannkuchen; sie lassen sich leichter wenden."],
    ["birnen-walnuss-skyr", "Birnen-Walnuss-Skyr mit Zimt", "Cremiger Skyr mit saftiger Birne, gerösteten Walnüssen und Zimt.", "dessert", "deutsch", "vegetarian", 15, "cream", [31, 37, 15], "Skyr|250|g;Birne|180|g;Walnüsse|20|g;Zimt|1|TL;Honig|1|TL;Zitrone|0.25|Stk.", "dessert", "fruit", "Röste die Walnüsse ohne Fett und lasse sie vor dem Hacken kurz abkühlen."],
    ["heidelbeer-hafer-pudding", "Heidelbeer-Hafer-Pudding", "Warmer Haferpudding mit Heidelbeeren, Vanille und Sojajoghurt.", "dessert", "klassisch", "vegan", 20, "oatPudding", [14, 58, 13], "Haferdrink|260|ml;Heidelbeeren|170|g;Haferflocken|55|g;Sojajoghurt|120|g;Vanille|1|Prise;Ahornsirup|1|TL", "dessertVegan", "oats", "Zerdrücke einige Heidelbeeren im Topf; ihr Saft färbt und aromatisiert den gesamten Pudding."],
    ["vanillepudding-himbeeren", "Vanillepudding mit Himbeersauce", "Klassischer Vanillepudding mit fruchtiger Himbeersauce und einem Skyrtopping.", "dessert", "klassisch", "vegetarian", 25, "pudding", [23, 52, 8], "Milch|250|ml;Himbeeren|170|g;Skyr|150|g;Speisestärke|20|g;Vanille|1|TL;Honig|1|TL", "dessert", "fruit", "Drücke die Himbeersauce nur bei Bedarf durch ein Sieb; die Kerne liefern ansonsten zusätzliche Struktur."],
    ["quarkkeulchen-apfelkompott", "Quarkkeulchen mit Apfelkompott", "Kleine Quarkkeulchen aus der Pfanne mit warmem Apfel-Zimt-Kompott.", "dessert", "deutsch", "vegetarian", 35, "pancake", [30, 60, 15], "Magerquark|220|g;Apfel|200|g;Ei|1|Stk.;Hafermehl|50|g;Zimt|1|TL;Zitrone|0.25|Stk.;Rapsöl|1|TL", "dessert", "oats", "Lass den Quark in einem Sieb abtropfen, falls er sehr feucht ist; dann braucht der Teig weniger Mehl."],
    ["kakao-quark-orange", "Kakao-Quarkcreme mit Orange", "Schokoladige Quarkcreme mit frischen Orangenstücken und gerösteten Haferflocken.", "dessert", "klassisch", "vegetarian", 15, "cream", [33, 42, 9], "Magerquark|250|g;Orange|1|Stk.;Haferflocken|25|g;Backkakao|12|g;Honig|1|TL;Vanille|1|Prise", "dessert", "oats", "Filetiere die Orange über einer Schüssel, damit der austretende Saft direkt in die Creme gelangt."],
    ["ofenbanane-erdnussjoghurt", "Ofenbanane mit Erdnuss-Joghurt", "Warme Banane mit cremigem Sojajoghurt, Erdnussmus und Kakao.", "dessert", "asiatisch", "vegan", 20, "bakedBanana", [15, 47, 18], "Sojajoghurt|220|g;Banane|1|Stk.;Haferflocken|25|g;Erdnussmus|20|g;Backkakao|8|g;Zimt|1|Prise", "dessertVegan", "oats", "Backe die Banane in der Schale und öffne sie erst danach; so bleibt das Fruchtfleisch besonders saftig."],
    ["kirsch-schoko-haferauflauf", "Kirsch-Schoko-Haferauflauf", "Saftiger Haferauflauf mit Kirschen, Kakao und einer kühlen Quarkcreme.", "dessert", "deutsch", "vegetarian", 35, "bakedDessert", [29, 62, 13], "Magerquark|180|g;Kirschen|180|g;Haferflocken|60|g;Ei|1|Stk.;Milch|100|ml;Backkakao|10|g;Vanille|1|Prise", "dessert", "oats", "Tupfe aufgetaute Kirschen trocken, damit der Auflauf in der Mitte zuverlässig stockt."]
  ];

  function emojiFor(method, course) {
    if (course === "starter") return method === "soup" ? "🥣" : method === "salad" ? "🥗" : "🍽️";
    if (course === "dessert") return method === "crumble" ? "🥧" : method === "pancake" ? "🥞" : "🍮";
    if (["stew", "curry", "noodleSoup"].includes(method)) return "🍲";
    if (["pasta", "gnocchi"].includes(method)) return "🍝";
    if (["ovenTray", "casserole", "fishOven", "stuffed"].includes(method)) return "🥘";
    if (["friedRice", "panRice", "wok"].includes(method)) return "🍚";
    return "🍽️";
  }

  function buildRecipe(entry, index) {
    const [
      id, title, description, course, cuisine, diet, time, method,
      macroValues, ingredientText, proteinBoost, energyBoost, tip
    ] = entry;
    const ingredients = parseIngredients(ingredientText);
    const [a, b, c, d] = ingredients.map((item) => item.name);
    const methodBuilder = methods[method];
    if (!methodBuilder) throw new Error(`Unbekannte Zubereitungsmethode: ${method}`);
    return {
      id: `pilot-${id}`,
      baseRecipeId: id,
      title,
      description,
      course,
      cuisine,
      diet,
      time,
      level: time <= 20 ? "Sehr einfach" : time <= 40 ? "Einfach" : "Mittel",
      emoji: emojiFor(method, course),
      theme: themes[index % themes.length],
      family: method,
      allergens: inferAllergens(ingredients),
      macros: macro(...macroValues),
      ingredients,
      steps: methodBuilder({ title, a, b, c, d }),
      tip,
      variantPolicy: {
        proteinBooster: booster(proteinBoosters[proteinBoost]),
        energyBooster: booster(energyBoosters[energyBoost])
      },
      provenance: {
        type: "original",
        label: "Küchenenergie-Eigenentwicklung",
        externalContentUsed: false
      },
      humanReview: {
        status: "pending",
        label: "Menschliche Freigabe ausstehend"
      }
    };
  }

  function buildRecipes() {
    return entries.map(buildRecipe);
  }

  global.KuechenenergieRecipeCatalog = {
    buildRecipes,
    stats: { baseRecipes: entries.length, adaptiveVariants: 4000 }
  };
}(typeof window !== "undefined" ? window : globalThis));
