(function attachRecipeFactory(global) {
  const profiles = [
    {
      id: "mediterran",
      cuisine: "mediterran",
      label: "Mediterrane",
      aroma: "Zitrone, Kräutern und geröstetem Knoblauch",
      ingredients: [
        { name: "Zitrone", amount: 0.5, unit: "Stk." },
        { name: "Italienische Kräuter", amount: 1, unit: "TL" },
        { name: "Knoblauch", amount: 1, unit: "Stk." }
      ],
      macros: { kcal: 18, protein: 1, carbs: 4, fat: 0 },
      allergens: []
    },
    {
      id: "asiatisch",
      cuisine: "asiatisch",
      label: "Milde Ingwer",
      aroma: "Ingwer, Zitrone und etwas Sesam",
      ingredients: [
        { name: "Frischer Ingwer", amount: 8, unit: "g" },
        { name: "Zitrone", amount: 0.5, unit: "Stk." },
        { name: "Sesam", amount: 8, unit: "g" }
      ],
      macros: { kcal: 52, protein: 2, carbs: 4, fat: 4 },
      allergens: []
    },
    {
      id: "mexikanisch",
      cuisine: "mexikanisch",
      label: "Paprika-Mais",
      aroma: "Paprika, Mais und einer milden Chilinote",
      ingredients: [
        { name: "Mais", amount: 50, unit: "g" },
        { name: "Paprikapulver", amount: 1, unit: "TL" },
        { name: "Chiliflocken", amount: 1, unit: "Prise" }
      ],
      macros: { kcal: 55, protein: 2, carbs: 10, fat: 1 },
      allergens: []
    },
    {
      id: "orientalisch",
      cuisine: "orientalisch",
      label: "Paprika-Kräuter",
      aroma: "Paprikamark, Petersilie und Zitronenabrieb",
      ingredients: [
        { name: "Paprikamark", amount: 15, unit: "g" },
        { name: "Petersilie", amount: 10, unit: "g" },
        { name: "Zitrone", amount: 0.5, unit: "Stk." }
      ],
      macros: { kcal: 25, protein: 1, carbs: 5, fat: 0 },
      allergens: []
    },
    {
      id: "indisch",
      cuisine: "indisch",
      label: "Mildes Curry",
      aroma: "mildem Currypulver, Paprika und Petersilie",
      ingredients: [
        { name: "Currypulver", amount: 1.5, unit: "TL" },
        { name: "Paprikapulver", amount: 0.5, unit: "TL" },
        { name: "Petersilie", amount: 10, unit: "g" }
      ],
      macros: { kcal: 18, protein: 1, carbs: 3, fat: 0 },
      allergens: []
    },
    {
      id: "klassisch",
      cuisine: "klassisch",
      label: "Gartenkräuter",
      aroma: "Senf, Schnittlauch und mildem Pfeffer",
      ingredients: [
        { name: "Körniger Senf", amount: 1, unit: "TL" },
        { name: "Schnittlauch", amount: 10, unit: "g" },
        { name: "Schwarzer Pfeffer", amount: 1, unit: "Prise" }
      ],
      macros: { kcal: 14, protein: 1, carbs: 2, fat: 0 },
      allergens: []
    },
    {
      id: "deutsch",
      cuisine: "deutsch",
      label: "Deutsche Kräuter",
      aroma: "mildem Senf, Petersilie und Majoran",
      ingredients: [
        { name: "Mittelscharfer Senf", amount: 1, unit: "TL" },
        { name: "Petersilie", amount: 10, unit: "g" },
        { name: "Majoran", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 15, protein: 1, carbs: 2, fat: 0 },
      allergens: []
    }
  ];

  const starterTemplates = [
    {
      id: "soup",
      title: "Samt-Suppe",
      emoji: "🥣",
      theme: "sunset",
      time: 25,
      level: "Einfach",
      ingredients: [
        { name: "Gemüsebrühe", amount: 280, unit: "ml" },
        { name: "Zwiebel", amount: 45, unit: "g" },
        { name: "Olivenöl", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 105, protein: 3, carbs: 13, fat: 5 },
      allergens: [],
      steps: [
        "Zwiebel klein schneiden. Die Hauptzutaten nach Bedarf abspülen, abtropfen lassen oder portionieren und anschließend zusammen mit der Zwiebel in wenig Öl anschwitzen.",
        "Gewürze kurz mitrösten, mit Brühe auffüllen und alles weich köcheln lassen.",
        "Die Suppe fein pürieren und mit Salz, Pfeffer sowie etwas Säure ausbalancieren.",
        "In kleinen Schalen anrichten und den frischen Akzent erst direkt vor dem Servieren zugeben."
      ],
      tip: "Ein Teil der Einlage bleibt vor dem Pürieren zurück und sorgt beim Servieren für angenehmen Biss."
    },
    {
      id: "salad",
      title: "Crunch-Salat",
      emoji: "🥗",
      theme: "olive",
      time: 15,
      level: "Sehr einfach",
      ingredients: [
        { name: "Blattsalat", amount: 70, unit: "g" },
        { name: "Gurke", amount: 100, unit: "g" },
        { name: "Olivenöl", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 92, protein: 3, carbs: 8, fat: 5 },
      allergens: [],
      steps: [
        "Blattsalat und Gemüse gründlich waschen, trocknen und mundgerecht vorbereiten.",
        "Die Protein-Komponente je nach Produkt abspülen, schneiden oder kurz anbraten.",
        "Aus den Würzzutaten, Öl und einem Schluck Wasser ein kräftiges Dressing rühren.",
        "Alles erst unmittelbar vor dem Servieren locker vermengen und mit dem Akzent toppen."
      ],
      tip: "Gut getrocknete Salatblätter nehmen das Dressing besser an und bleiben länger knackig."
    },
    {
      id: "bites",
      title: "Ofen-Happen",
      emoji: "🧆",
      theme: "clay",
      time: 35,
      level: "Einfach",
      ingredients: [
        { name: "Haferflocken", amount: 25, unit: "g" },
        { name: "Zwiebel", amount: 40, unit: "g" },
        { name: "Olivenöl", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 150, protein: 5, carbs: 20, fat: 6 },
      allergens: ["gluten"],
      steps: [
        "Die Hauptzutaten gut abtropfen lassen, bei Bedarf klein schneiden und mit Zwiebel sowie Haferflocken zu einer groben Masse verarbeiten.",
        "Würzzutaten einarbeiten und die Masse einige Minuten quellen lassen.",
        "Kleine mundgerechte Happen formen, leicht ölen und im heißen Ofen goldbraun backen.",
        "Mit dem frischen Akzent und einem Spritzer Zitrusfrucht als Vorspeise anrichten."
      ],
      tip: "Die Masse lässt sich am besten formen, wenn sie vor dem Backen zehn Minuten ruht."
    },
    {
      id: "cups",
      title: "Salat-Schiffchen",
      emoji: "🥬",
      theme: "indigo",
      time: 20,
      level: "Einfach",
      ingredients: [
        { name: "Romana-Salatherzen", amount: 100, unit: "g" },
        { name: "Karotte", amount: 70, unit: "g" },
        { name: "Frühlingszwiebel", amount: 1, unit: "Stk." }
      ],
      macros: { kcal: 62, protein: 3, carbs: 11, fat: 1 },
      allergens: [],
      steps: [
        "Große, stabile Salatblätter ablösen, waschen und sorgfältig trocken tupfen.",
        "Die Füllung mit fein geschnittenem Gemüse in einer Pfanne kurz und heiß garen.",
        "Mit dem gewählten Aromaprofil kräftig abschmecken und etwas abkühlen lassen.",
        "Füllung in die Blätter setzen, mit dem Akzent vollenden und als kleine Cups servieren."
      ],
      tip: "Zwei ineinandergelegte Salatblätter machen die Cups stabil und leichter aus der Hand zu essen."
    },
    {
      id: "mezze",
      title: "Vorspeisenteller",
      emoji: "🫒",
      theme: "plum",
      time: 15,
      level: "Sehr einfach",
      ingredients: [
        { name: "Rohkost-Mix", amount: 160, unit: "g" },
        { name: "Vollkorn-Cracker", amount: 30, unit: "g" },
        { name: "Olivenöl", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 185, protein: 5, carbs: 26, fat: 7 },
      allergens: ["gluten"],
      steps: [
        "Die Hauptzutat zu einem groben Dip verarbeiten und mit dem Aromaprofil abschmecken.",
        "Rohkost in handliche Stifte oder Spalten schneiden und gut trocken tupfen.",
        "Den Dip in einer kleinen Schale verstreichen und mit Öl sowie Gewürzen vollenden.",
        "Mit Rohkost, Crackern und dem frischen Akzent als bunten Vorspeisenteller servieren."
      ],
      tip: "Streiche den Dip flach aus – so verteilen sich Toppings und Gewürze mit jedem Bissen."
    },
    {
      id: "taler",
      title: "Knusper-Taler",
      emoji: "🥞",
      theme: "sunset",
      time: 25,
      level: "Einfach",
      ingredients: [
        { name: "Kartoffel", amount: 100, unit: "g" },
        { name: "Speisestärke", amount: 12, unit: "g" },
        { name: "Rapsöl", amount: 1, unit: "TL" }
      ],
      macros: { kcal: 155, protein: 3, carbs: 27, fat: 5 },
      allergens: [],
      steps: [
        "Kartoffel grob raspeln, ausdrücken und mit der vorbereiteten Hauptzutat vermengen.",
        "Stärke und das Aromaprofil einarbeiten, bis die Masse gut zusammenhält.",
        "Kleine flache Taler formen und in einer beschichteten Pfanne beidseitig knusprig braten.",
        "Auf Küchenpapier kurz abtropfen lassen und mit dem frischen Akzent servieren."
      ],
      tip: "Flache, kleine Taler werden gleichmäßiger kross und eignen sich ideal als Vorspeise."
    }
  ];

  const starterCores = [
    { id: "chickpea", name: "Kichererbsen", diet: "vegan", amount: 120, unit: "g", macros: { kcal: 195, protein: 10, carbs: 27, fat: 4 }, allergens: [] },
    { id: "lentil", name: "Rote Linsen", diet: "vegan", amount: 90, unit: "g", macros: { kcal: 305, protein: 22, carbs: 47, fat: 2 }, allergens: [] },
    { id: "peas", name: "Grüne Erbsen", diet: "vegan", amount: 150, unit: "g", macros: { kcal: 120, protein: 8, carbs: 18, fat: 1 }, allergens: [] },
    { id: "beans", name: "Weiße Bohnen", diet: "vegan", amount: 140, unit: "g", macros: { kcal: 155, protein: 10, carbs: 25, fat: 1 }, allergens: [] },
    { id: "shrimp", name: "Garnelen", diet: "omnivore", amount: 120, unit: "g", macros: { kcal: 115, protein: 25, carbs: 1, fat: 1 }, allergens: ["fisch"] },
    { id: "salmon", name: "Räucherlachs", diet: "omnivore", amount: 90, unit: "g", macros: { kcal: 160, protein: 20, carbs: 0, fat: 9 }, allergens: ["fisch"] },
    { id: "cottage", name: "Körniger Frischkäse", diet: "vegetarian", amount: 150, unit: "g", macros: { kcal: 150, protein: 20, carbs: 5, fat: 5 }, allergens: ["laktose"] },
    { id: "tofu", name: "Tofu", diet: "vegan", amount: 140, unit: "g", macros: { kcal: 190, protein: 21, carbs: 3, fat: 11 }, allergens: ["soja"] }
  ];

  const starterAccents = [
    { id: "apple", name: "Apfelwürfel", amount: 50, unit: "g", macros: { kcal: 28, protein: 0, carbs: 7, fat: 0 }, allergens: [] },
    { id: "cucumber", name: "Gurken-Kräuter", amount: 80, unit: "g", macros: { kcal: 18, protein: 1, carbs: 3, fat: 0 }, allergens: [] },
    { id: "pepper", name: "Röstpaprika", amount: 80, unit: "g", macros: { kcal: 28, protein: 1, carbs: 5, fat: 0 }, allergens: [] }
  ];

  const mainTemplates = [
    {
      id: "bowl", title: "Reis-Bowl", emoji: "🥗", theme: "olive", time: 30, level: "Einfach",
      ingredients: [{ name: "Langkornreis", amount: 70, unit: "g" }, { name: "Blattsalat", amount: 50, unit: "g" }, { name: "Rapsöl", amount: 1, unit: "TL" }],
      macros: { kcal: 315, protein: 7, carbs: 57, fat: 6 }, allergens: [],
      steps: ["Reis nach Packungsangabe garen und kurz ausdampfen lassen.", "Die Protein-Komponente würzen und passend zum Produkt goldbraun braten oder rösten.", "Das Gemüse bissfest garen und mit dem gewählten Aromaprofil abschmecken.", "Reis, Salat, Gemüse und Protein in einer Bowl anrichten und mit den frischen Würzzutaten vollenden."],
      tip: "Ordne die Komponenten nebeneinander an. So bleibt jede Textur erhalten und jeder Bissen lässt sich neu kombinieren."
    },
    {
      id: "curry", title: "Cremiges Curry", emoji: "🍛", theme: "clay", time: 35, level: "Einfach",
      ingredients: [{ name: "Langkornreis", amount: 65, unit: "g" }, { name: "Kokosmilch", amount: 100, unit: "ml" }, { name: "Gemüsebrühe", amount: 100, unit: "ml" }],
      macros: { kcal: 350, protein: 6, carbs: 57, fat: 10 }, allergens: [],
      steps: ["Reis nach Packungsangabe garen.", "Die Protein-Komponente in einem breiten Topf anbraten und wieder herausnehmen.", "Gemüse und Gewürze rösten, mit Kokosmilch sowie Brühe ablöschen und bissfest köcheln.", "Protein wieder zugeben, das Curry abschmecken und mit Reis sowie frischen Kräutern servieren."],
      tip: "Röste trockene Gewürze kurz an, bevor Flüssigkeit dazukommt. Das macht ihr Aroma deutlich voller."
    },
    {
      id: "pasta", title: "Tomatenpasta", emoji: "🍝", theme: "sunset", time: 25, level: "Einfach",
      ingredients: [{ name: "Vollkornpasta", amount: 90, unit: "g" }, { name: "Passierte Tomaten", amount: 180, unit: "g" }, { name: "Olivenöl", amount: 1, unit: "TL" }],
      macros: { kcal: 390, protein: 14, carbs: 67, fat: 7 }, allergens: ["gluten"],
      steps: ["Pasta in Salzwasser knapp al dente kochen und etwas Kochwasser auffangen.", "Protein und Gemüse in einer großen Pfanne kräftig anbraten.", "Tomaten und Aromazutaten zugeben, kurz einkochen und mit Kochwasser sämig rühren.", "Pasta in der Sauce vollenden und mit frischen Kräutern direkt servieren."],
      tip: "Das stärkehaltige Pastawasser verbindet Sauce und Nudeln, ohne dass zusätzliche Sahne nötig ist."
    },
    {
      id: "tray", title: "Ofengericht", emoji: "🥘", theme: "sunset", time: 45, level: "Einfach",
      ingredients: [{ name: "Drillinge", amount: 260, unit: "g" }, { name: "Rote Zwiebel", amount: 60, unit: "g" }, { name: "Olivenöl", amount: 2, unit: "TL" }],
      macros: { kcal: 315, protein: 7, carbs: 52, fat: 9 }, allergens: [],
      steps: ["Backofen kräftig vorheizen und Kartoffeln sowie Gemüse mundgerecht schneiden.", "Alles mit Öl und dem Aromaprofil auf einem Blech vermengen.", "Protein passend zur Garzeit zugeben und rösten, bis die Ränder goldbraun sind.", "Direkt auf dem Blech mit Zitrusfrucht, Kräutern und schwarzem Pfeffer vollenden."],
      tip: "Verteile alles in nur einer Lage. Zu dicht belegte Bleche dämpfen das Gemüse, statt es zu rösten."
    },
    {
      id: "stew", title: "One-Pot Eintopf", emoji: "🍲", theme: "plum", time: 40, level: "Einfach",
      ingredients: [{ name: "Weiße Bohnen", amount: 100, unit: "g" }, { name: "Gehackte Tomaten", amount: 200, unit: "g" }, { name: "Gemüsebrühe", amount: 220, unit: "ml" }],
      macros: { kcal: 230, protein: 11, carbs: 36, fat: 4 }, allergens: [],
      steps: ["Protein in einem großen Topf anbraten und je nach Produkt kurz beiseitestellen.", "Gemüse und Gewürze im Bratensatz anschwitzen.", "Bohnen, Tomaten und Brühe zugeben und alles offen sämig köcheln lassen.", "Protein wieder unterheben, kräftig abschmecken und mit frischen Aromazutaten servieren."],
      tip: "Zerdrücke einige Bohnen am Topfrand. Das bindet den Eintopf ganz natürlich."
    },
    {
      id: "wrap", title: "Gefüllter Wrap", emoji: "🌯", theme: "clay", time: 25, level: "Einfach",
      ingredients: [{ name: "Vollkorn-Wrap", amount: 1, unit: "Stk." }, { name: "Blattsalat", amount: 50, unit: "g" }, { name: "Tomaten-Salsa", amount: 80, unit: "g" }],
      macros: { kcal: 270, protein: 9, carbs: 43, fat: 7 }, allergens: ["gluten"],
      steps: ["Protein klein schneiden oder zerbröseln und mit dem Aromaprofil kräftig anbraten.", "Gemüse garen, dabei etwas Biss bewahren.", "Wrap kurz erwärmen und mit Salat, Salsa, Gemüse sowie Protein belegen.", "Seiten einschlagen, fest aufrollen und für eine knusprige Naht kurz in die Pfanne legen."],
      tip: "Wärme den Wrap wenige Sekunden an. Dadurch wird er elastisch und reißt beim Rollen nicht."
    },
    {
      id: "risotto", title: "Kräuter-Risotto", emoji: "🍚", theme: "olive", time: 40, level: "Mittel",
      ingredients: [{ name: "Risottoreis", amount: 85, unit: "g" }, { name: "Gemüsebrühe", amount: 420, unit: "ml" }, { name: "Olivenöl", amount: 1, unit: "TL" }],
      macros: { kcal: 350, protein: 7, carbs: 69, fat: 6 }, allergens: [],
      steps: ["Protein separat goldbraun braten und warm halten.", "Reis mit einem Teil des Gemüses glasig anschwitzen.", "Heiße Brühe portionsweise einrühren, übriges Gemüse zugeben und den Reis cremig garen.", "Protein und Aromazutaten unterheben, kurz ruhen lassen und fließend-cremig servieren."],
      tip: "Heiße Brühe hält die Gartemperatur konstant und sorgt für ein gleichmäßiges, cremiges Ergebnis."
    },
    {
      id: "noodles", title: "Schnelle Nudelpfanne", emoji: "🍜", theme: "indigo", time: 20, level: "Sehr einfach",
      ingredients: [{ name: "Vollkornnudeln", amount: 80, unit: "g" }, { name: "Gemüsebrühe", amount: 80, unit: "ml" }, { name: "Rapsöl", amount: 1, unit: "TL" }],
      macros: { kcal: 335, protein: 5, carbs: 66, fat: 6 }, allergens: ["gluten"],
      steps: ["Vollkornnudeln nach Packungsangabe kochen und gründlich abtropfen lassen.", "Protein in einer sehr heißen Pfanne kräftig anbraten.", "Gemüse und Aromazutaten kurz mitrösten, dann Nudeln und Brühe zugeben.", "Bei hoher Hitze durchschwenken, bis die Flüssigkeit aufgenommen ist, und sofort servieren."],
      tip: "Bereite alle Zutaten vor dem Braten vor – im heißen Wok zählt jede Sekunde."
    }
  ];

  const mainProteins = [
    { id: "chicken", name: "Hähnchen", diet: "omnivore", amount: 170, unit: "g", macros: { kcal: 190, protein: 39, carbs: 0, fat: 4 }, allergens: [] },
    { id: "turkey", name: "Puten", diet: "omnivore", amount: 170, unit: "g", macros: { kcal: 185, protein: 40, carbs: 0, fat: 2 }, allergens: [] },
    { id: "beef", name: "Rinder", diet: "omnivore", amount: 160, unit: "g", macros: { kcal: 250, protein: 34, carbs: 0, fat: 12 }, allergens: [] },
    { id: "salmon", name: "Lachs", diet: "omnivore", amount: 160, unit: "g", macros: { kcal: 320, protein: 34, carbs: 0, fat: 20 }, allergens: ["fisch"] },
    { id: "egg", name: "Ei", diet: "vegetarian", amount: 3, unit: "Stk.", macros: { kcal: 225, protein: 19, carbs: 1, fat: 16 }, allergens: [] },
    { id: "halloumi", name: "Halloumi", diet: "vegetarian", amount: 120, unit: "g", macros: { kcal: 300, protein: 25, carbs: 2, fat: 21 }, allergens: ["laktose"] },
    { id: "tofu", name: "Tofu", diet: "vegan", amount: 200, unit: "g", macros: { kcal: 270, protein: 30, carbs: 5, fat: 15 }, allergens: ["soja"] },
    { id: "kidney-beans", name: "Kidneybohnen", diet: "vegan", amount: 220, unit: "g", macros: { kcal: 250, protein: 17, carbs: 36, fat: 2 }, allergens: [] },
    { id: "chickpeas", name: "Kichererbsen", diet: "vegan", amount: 220, unit: "g", macros: { kcal: 300, protein: 17, carbs: 43, fat: 6 }, allergens: [] },
    { id: "lentil", name: "Linsen", diet: "vegan", amount: 220, unit: "g", macros: { kcal: 255, protein: 20, carbs: 40, fat: 2 }, allergens: [] }
  ];

  const mainVegetables = [
    { id: "green", name: "Brokkoli & Karotte", ingredients: [{ name: "Brokkoli", amount: 140, unit: "g" }, { name: "Karotte", amount: 80, unit: "g" }], macros: { kcal: 83, protein: 6, carbs: 13, fat: 1 } },
    { id: "med", name: "Zucchini & Tomate", ingredients: [{ name: "Zucchini", amount: 140, unit: "g" }, { name: "Kirschtomaten", amount: 120, unit: "g" }], macros: { kcal: 52, protein: 4, carbs: 9, fat: 1 } },
    { id: "power", name: "Spinat & Erbsen", ingredients: [{ name: "Babyspinat", amount: 100, unit: "g" }, { name: "Grüne Erbsen", amount: 100, unit: "g" }], macros: { kcal: 105, protein: 9, carbs: 15, fat: 1 } },
    { id: "color", name: "Paprika & Mais", ingredients: [{ name: "Rote Paprika", amount: 140, unit: "g" }, { name: "Mais", amount: 80, unit: "g" }], macros: { kcal: 110, protein: 4, carbs: 21, fat: 2 } }
  ];

  const dessertTemplates = [
    {
      id: "parfait", title: "Knusper-Schichtdessert", emoji: "🍨", theme: "plum", time: 15, level: "Sehr einfach",
      ingredients: [{ name: "Hafer-Crunch", amount: 30, unit: "g" }], macros: { kcal: 125, protein: 4, carbs: 20, fat: 4 }, allergens: ["gluten"],
      steps: ["Die Cremebasis mit den Aromazutaten glatt rühren.", "Früchte klein schneiden oder kurz zu einem groben Kompott erwärmen.", "Creme, Früchte und Crunch abwechselnd in ein Glas schichten.", "Vor dem Servieren kurz kalt stellen und mit etwas frischem Aroma vollenden."],
      tip: "Gib den obersten Crunch erst beim Servieren dazu, damit er hörbar knusprig bleibt."
    },
    {
      id: "mousse", title: "Cremiges Fruchtdessert", emoji: "🍮", theme: "indigo", time: 15, level: "Sehr einfach",
      ingredients: [{ name: "Ahornsirup", amount: 1, unit: "TL" }], macros: { kcal: 28, protein: 0, carbs: 7, fat: 0 }, allergens: [],
      steps: ["Cremebasis und die Hälfte der Früchte sehr fein mixen. Anschließend Aromazutaten einarbeiten.", "Die Masse abschmecken und bei Bedarf mit einem Schluck Wasser luftig aufschlagen.", "In kleine Dessertschalen füllen und kurz kalt stellen.", "Mit den übrigen Früchten und einer Prise des passenden Gewürzes servieren."],
      tip: "Sehr kalte Zutaten ergeben beim Mixen eine luftigere, stabilere Mousse."
    },
    {
      id: "baked", title: "Ofen-Creme", emoji: "🍮", theme: "sunset", time: 35, level: "Einfach",
      ingredients: [{ name: "Speisestärke", amount: 10, unit: "g" }, { name: "Ahornsirup", amount: 2, unit: "TL" }], macros: { kcal: 75, protein: 0, carbs: 18, fat: 0 }, allergens: [],
      steps: ["Backofen vorheizen und eine kleine ofenfeste Form bereitstellen.", "Cremebasis mit Stärke und der Hälfte der Früchte glatt rühren. Anschließend Aromazutaten einarbeiten.", "Masse in die Form geben und backen, bis der Rand fest und die Mitte noch leicht weich ist.", "Lauwarm abkühlen lassen und mit den übrigen Früchten servieren."],
      tip: "Nimm die Creme aus dem Ofen, solange die Mitte noch leicht wackelt – sie zieht beim Abkühlen nach."
    },
    {
      id: "cheesecake", title: "Keks-Creme", emoji: "🍰", theme: "plum", time: 20, level: "Sehr einfach",
      ingredients: [{ name: "Haferkeks", amount: 25, unit: "g" }, { name: "Zitrone", amount: 0.25, unit: "Stk." }], macros: { kcal: 120, protein: 2, carbs: 18, fat: 5 }, allergens: ["gluten"],
      steps: ["Keks grob zerbröseln und einen Teil davon auf dem Schalenboden verteilen.", "Cremebasis mit Zitronenabrieb glatt rühren. Anschließend Aromazutaten einarbeiten.", "Früchte vorbereiten und leicht zerdrücken, damit etwas Saft austritt.", "Creme und Früchte einschichten und mit den restlichen Keksbröseln vollenden."],
      tip: "Eine kleine Prise Salz in der Creme macht Frucht und Süße deutlich lebendiger."
    },
    {
      id: "pudding", title: "Hafer-Pudding", emoji: "🥄", theme: "olive", time: 15, level: "Sehr einfach",
      ingredients: [{ name: "Zarte Haferflocken", amount: 35, unit: "g" }, { name: "Milch oder Haferdrink", amount: 120, unit: "ml" }], macros: { kcal: 180, protein: 6, carbs: 28, fat: 5 }, allergens: ["gluten"],
      steps: ["Haferflocken mit Milch oder Haferdrink in einen kleinen Topf geben. Anschließend Aromazutaten einarbeiten.", "Unter Rühren sanft köcheln, bis ein cremiger Pudding entsteht.", "Die Cremebasis unterrühren und alles kurz abkühlen lassen.", "Früchte daraufgeben und lauwarm oder gut gekühlt servieren."],
      tip: "Zarte Haferflocken werden besonders schnell cremig und sind in jedem Supermarkt erhältlich."
    },
    {
      id: "crumble", title: "Obst mit Haferstreuseln", emoji: "🥧", theme: "clay", time: 35, level: "Einfach",
      ingredients: [{ name: "Haferflocken", amount: 35, unit: "g" }, { name: "Margarine", amount: 10, unit: "g" }], macros: { kcal: 205, protein: 5, carbs: 25, fat: 10 }, allergens: ["gluten"],
      steps: ["Backofen vorheizen und die Früchte mundgerecht in eine kleine Form geben.", "Haferflocken und Margarine zu groben Streuseln verkneten. Anschließend Aromazutaten einarbeiten.", "Streusel über den Früchten verteilen und alles goldbraun backen.", "Kurz abkühlen lassen und mit der kalten Cremebasis servieren."],
      tip: "Unterschiedlich große Streusel ergeben gleichzeitig knusprige Spitzen und saftige Zwischenräume."
    }
  ];

  const dessertBases = [
    { id: "skyr", name: "Skyr", diet: "vegetarian", amount: 250, unit: "g", macros: { kcal: 160, protein: 28, carbs: 10, fat: 1 }, allergens: ["laktose"] },
    { id: "quark", name: "Magerquark", diet: "vegetarian", amount: 250, unit: "g", macros: { kcal: 170, protein: 30, carbs: 10, fat: 1 }, allergens: ["laktose"] },
    { id: "soy-yogurt", name: "Sojajoghurt", diet: "vegan", amount: 250, unit: "g", macros: { kcal: 170, protein: 12, carbs: 10, fat: 8 }, allergens: ["soja"] },
    { id: "oat-yogurt", name: "Haferjoghurt", diet: "vegan", amount: 250, unit: "g", macros: { kcal: 190, protein: 4, carbs: 24, fat: 9 }, allergens: [] },
    { id: "greek", name: "Griechischer Joghurt", diet: "vegetarian", amount: 250, unit: "g", macros: { kcal: 240, protein: 22, carbs: 10, fat: 12 }, allergens: ["laktose"] }
  ];

  const dessertFlavors = [
    { id: "vanilla", name: "Vanille-Zimt", cuisine: "klassisch", aroma: "Vanille und Zimt", ingredient: { name: "Vanille & Zimt", amount: 1, unit: "TL" }, macros: { kcal: 8, protein: 0, carbs: 2, fat: 0 }, allergens: [] },
    { id: "lemon", name: "Zitrone-Vanille", cuisine: "mediterran", aroma: "Zitrone und Vanille", ingredient: { name: "Zitrone & Vanille", amount: 10, unit: "g" }, macros: { kcal: 18, protein: 0, carbs: 4, fat: 0 }, allergens: [] },
    { id: "cocoa", name: "Kakao-Espresso", cuisine: "klassisch", aroma: "Kakao und Espresso", ingredient: { name: "Backkakao & Espresso", amount: 12, unit: "g" }, macros: { kcal: 35, protein: 2, carbs: 4, fat: 1 }, allergens: [] },
    { id: "chai", name: "Zimt-Kardamom", cuisine: "indisch", aroma: "Zimt und etwas Kardamom", ingredient: { name: "Zimt & Kardamom", amount: 1, unit: "TL" }, macros: { kcal: 8, protein: 0, carbs: 2, fat: 0 }, allergens: [] },
    { id: "coconut", name: "Kokos-Zitrone", cuisine: "asiatisch", aroma: "Kokos und Zitrone", ingredient: { name: "Kokosraspel & Zitrone", amount: 12, unit: "g" }, macros: { kcal: 70, protein: 1, carbs: 3, fat: 6 }, allergens: [] },
    { id: "orange-rose", name: "Orange-Zimt", cuisine: "orientalisch", aroma: "Orange und Zimt", ingredient: { name: "Orange & Zimt", amount: 20, unit: "g" }, macros: { kcal: 18, protein: 0, carbs: 4, fat: 0 }, allergens: [] },
    { id: "chili-cocoa", name: "Kakao-Orange", cuisine: "mexikanisch", aroma: "Backkakao und Orange", ingredient: { name: "Backkakao & Orange", amount: 12, unit: "g" }, macros: { kcal: 34, protein: 2, carbs: 4, fat: 1 }, allergens: [] },
    { id: "german-caramel", name: "Karamell-Vanille", cuisine: "deutsch", aroma: "braunem Zucker und Vanille", ingredient: { name: "Brauner Zucker & Vanille", amount: 12, unit: "g" }, macros: { kcal: 45, protein: 0, carbs: 11, fat: 0 }, allergens: [] }
  ];

  const dessertFruits = [
    { id: "berry", name: "Beeren", amount: 160, unit: "g", macros: { kcal: 75, protein: 2, carbs: 14, fat: 1 } },
    { id: "apple", name: "Apfel", amount: 180, unit: "g", macros: { kcal: 95, protein: 1, carbs: 24, fat: 0 } },
    { id: "mango", name: "Mango", amount: 160, unit: "g", macros: { kcal: 100, protein: 1, carbs: 24, fat: 1 } },
    { id: "cherry", name: "Kirschen", amount: 170, unit: "g", macros: { kcal: 105, protein: 2, carbs: 23, fat: 1 } }
  ];

  function addMacros(...entries) {
    return entries.reduce((total, macros) => ({
      kcal: total.kcal + macros.kcal,
      protein: total.protein + macros.protein,
      carbs: total.carbs + macros.carbs,
      fat: total.fat + macros.fat
    }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  }

  function unique(values) {
    return [...new Set(values.flat())];
  }

  function replaceTerms(step, replacements) {
    return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), step);
  }

  function addStepDetails(steps, details) {
    return steps.map((step, index) => `${step} ${details[index]}`);
  }

  function detailedStarterSteps(template, core, profile, accent) {
    const cookingSteps = addStepDetails(template.steps.map((step) => replaceTerms(step, [
      [/mit der vorbereiteten Hauptzutat/g, `mit ${core.name}`],
      [/Die Hauptzutaten/g, core.name],
      [/die Hauptzutaten/g, core.name],
      [/Hauptzutaten/g, core.name],
      [/Die Hauptzutat/g, core.name],
      [/die Hauptzutat/g, core.name],
      [/Hauptzutat/g, core.name],
      [/Die Protein-Komponente/g, core.name],
      [/Protein-Komponente/g, core.name],
      [/Würzzutaten/g, "Gewürzzutaten"],
      [/Aromaprofil/g, "Gewürzen"],
      [/frischen Akzent/g, accent.name],
      [/dem Akzent/g, accent.name]
    ])), [
      "Auf möglichst gleichmäßige Stücke achten, damit alle Bestandteile später zur gleichen Zeit fertig werden.",
      "Portionsweise arbeiten und regelmäßig rühren oder wenden, damit nichts ansetzt und sich die Aromen gleichmäßig verteilen.",
      "Flüssigkeit und Gewürze schrittweise zugeben, zwischendurch probieren und die Hitze bei Bedarf reduzieren.",
      "Erst kurz vor dem Servieren zusammenführen, damit warme Bestandteile heiß und frische Zutaten knackig bleiben."
    ]);
    return [
      `Zuerst alle Zutaten abwiegen und bereitstellen. ${core.name} abtropfen lassen oder nach Packungsangabe vorbereiten; Gemüse und Kräuter waschen und sorgfältig trocken tupfen.`,
      ...cookingSteps,
      `Konsistenz und Würzung prüfen. Falls die Mischung zu fest ist, esslöffelweise Wasser zugeben; ist sie zu weich, noch kurz einkochen oder einige Minuten ruhen lassen.`,
      `Die Vorspeise kurz vor dem Essen noch einmal probieren, mit Salz und Pfeffer abschmecken, ${accent.name} darübergeben und mit ${profile.aroma} abrunden.`
    ];
  }

  function proteinInstructionName(protein) {
    const names = { turkey: "Putenfleisch", beef: "Rindfleisch" };
    return names[protein.id] || protein.name;
  }

  function donenessInstruction(protein) {
    if (["chicken", "turkey"].includes(protein.id)) {
      return "Die Garstufe prüfen: Das Fleisch an der dicksten Stelle anschneiden. Es soll vollständig durchgegart, innen nicht mehr rosa und trotzdem saftig sein.";
    }
    if (protein.id === "salmon") {
      return "Die Garstufe prüfen: Der Lachs ist fertig, wenn er sich mit der Gabel leicht in Lamellen teilen lässt und innen noch saftig aussieht.";
    }
    if (protein.id === "beef") {
      return "Die Garstufe prüfen: Das Rindfleisch rundum kräftig bräunen und anschließend je nach gewünschter Garstufe nur noch kurz weitergaren.";
    }
    if (protein.id === "egg") {
      return "Die Garstufe prüfen: Das Ei soll sichtbar gestockt und heiß sein, ohne trocken zu werden.";
    }
    return `${proteinInstructionName(protein)} probieren und prüfen, ob alles vollständig erhitzt, gut gewürzt und außen angenehm gebräunt ist.`;
  }

  function detailedMainSteps(template, protein, profile, vegetables) {
    const instructionName = proteinInstructionName(protein);
    const vegetableName = vegetables.name.replace(" & ", " und ");
    const cookingSteps = addStepDetails(template.steps.map((step) => replaceTerms(step, [
      [/Reis, Salat, Gemüse und Protein in einer Bowl anrichten/g, `Reis und Salat in eine Bowl geben. ${vegetableName} sowie ${instructionName} darauf anrichten`],
      [/Die Protein-Komponente/g, instructionName],
      [/Protein und Gemüse/g, `${instructionName} zusammen mit ${vegetableName}`],
      [/Gemüse und Protein/g, `${vegetableName}, dazu ${instructionName}`],
      [/Gemüse und Gewürze/g, `${vegetableName} zusammen mit den Gewürzen`],
      [/Gemüse und Aromazutaten/g, `${vegetableName} zusammen mit den Gewürzzutaten`],
      [/mit dem gewählten Aromaprofil/g, "mit den vorbereiteten Gewürzen"],
      [/gewählten Aromaprofil/g, "vorbereiteten Gewürzen"],
      [/dem Aromaprofil/g, "den vorbereiteten Gewürzen"],
      [/Aromaprofil/g, "Gewürzen"],
      [/Zitrusfrucht/g, "Zitrone"],
      [/frischen Würzzutaten/g, "Kräutern und Gewürzen"],
      [/Protein-Komponente/g, instructionName],
      [/\bProtein\b/g, instructionName],
      [/Das Gemüse/g, vegetableName],
      [/einem Teil des Gemüses/g, `einem Teil von ${vegetableName}`],
      [/übriges Gemüse/g, vegetableName],
      [/\bGemüse\b/g, vegetableName],
      [/Aromazutaten/g, "Gewürzzutaten"]
    ])), [
      "Die angegebene Garzeit im Blick behalten und währenddessen bereits die Zutaten für den nächsten Arbeitsschritt vorbereiten.",
      "Pfanne oder Topf vorab gut erhitzen und nicht überfüllen, damit Röstaromen entstehen und die Zutaten nicht nur im eigenen Saft garen.",
      "Bei mittlerer Hitze regelmäßig rühren oder wenden; Flüssigkeit nur portionsweise ergänzen, damit die gewünschte Konsistenz erhalten bleibt.",
      "Zum Ende die Hitze reduzieren und alle Bestandteile behutsam verbinden, ohne das gegarte Gemüse oder die Beilage zu zerdrücken."
    ]);
    return [
      `Alle Zutaten abwiegen und griffbereit stellen. ${vegetableName} waschen und mundgerecht schneiden. ${instructionName} trocken tupfen beziehungsweise abtropfen lassen und gleichmäßig portionieren.`,
      ...cookingSteps,
      donenessInstruction(protein),
      `Das Gericht zwei Minuten ruhen lassen. Danach mit Salz und Pfeffer abschmecken, mit ${profile.aroma} abrunden, auf vorgewärmten Tellern verteilen und direkt servieren.`
    ];
  }

  function fruitInstructionName(fruit) {
    const names = { apple: "Apfelstücke", mango: "Mangostücke" };
    return names[fruit.id] || fruit.name;
  }

  function detailedDessertSteps(template, base, flavor, fruit) {
    const fruitName = fruitInstructionName(fruit);
    const flavorMethodName = flavor.id === "german-caramel"
      ? "braunen Zucker und Vanille"
      : flavor.ingredient.name.replace(" & ", " und ");
    const cookingSteps = addStepDetails(template.steps.map((step) => replaceTerms(step, [
      [/mit der kalten Cremebasis/g, `mit kaltem ${base.name}`],
      [/mit den Aromazutaten/g, `mit ${flavor.aroma}`],
      [/Die Cremebasis/g, base.name],
      [/die Cremebasis/g, base.name],
      [/Cremebasis/g, base.name],
      [/Aromazutaten/g, flavorMethodName],
      [/mit den übrigen Früchten/g, `mit den restlichen ${fruitName}`],
      [/Creme, Früchte/g, `${base.name}, ${fruitName}`],
      [/\bFrüchte\b/g, fruitName],
      [/mit etwas frischem Aroma/g, `mit ${flavor.aroma}`],
      [/Crunch/g, template.ingredients[0]?.name || "knusprigen Haferflocken"]
    ])), [
      "Mit einem sauberen Schneebesen oder Löffel gründlich arbeiten, bis keine Klümpchen mehr sichtbar sind.",
      "Die Zutaten nach und nach zugeben und nur so lange rühren oder erhitzen, bis die gewünschte Konsistenz erreicht ist.",
      "Die Masse gleichmäßig verteilen beziehungsweise schichten, damit jede Portion denselben Anteil an Creme und Frucht erhält.",
      "Vor dem Servieren ausreichend ruhen lassen und erst dann die letzten knusprigen oder frischen Bestandteile ergänzen."
    ]);
    return [
      `Alle Zutaten genau abwiegen. ${fruitName} waschen beziehungsweise auftauen, trocken tupfen und bei Bedarf klein schneiden. ${base.name} bis zur Verwendung kalt stellen.`,
      ...cookingSteps,
      `Konsistenz und Süße probieren. Die Creme soll glatt und löffelfest sein; bei Bedarf teelöffelweise Flüssigkeit oder etwas ${base.name} einrühren.`,
      `Das Dessert je nach Rezept lauwarm servieren oder mindestens 20 Minuten kalt stellen. Kurz vor dem Servieren ${flavorMethodName} darübergeben.`
    ];
  }

  function buildStarters() {
    const generated = [];
    for (const template of starterTemplates) {
      for (const core of starterCores) {
        for (const profile of profiles) {
          for (const accent of starterAccents) {
            generated.push({
              id: `starter-${template.id}-${core.id}-${profile.id}-${accent.id}`,
              title: `${profile.label} ${core.name}-${template.title} mit ${accent.name}`,
              description: `Kleine ${template.title.toLowerCase()} mit ${core.name}, ${profile.aroma} und frischem ${accent.name}.`,
              cuisine: profile.cuisine,
              course: "starter",
              diet: core.diet,
              allergens: unique([template.allergens, core.allergens, profile.allergens, accent.allergens]),
              time: template.time,
              level: template.level,
              emoji: template.emoji,
              theme: template.theme,
              macros: addMacros(template.macros, core.macros, profile.macros, accent.macros),
              ingredients: [
                { name: core.name, amount: core.amount, unit: core.unit },
                ...template.ingredients,
                ...profile.ingredients,
                { name: accent.name, amount: accent.amount, unit: accent.unit }
              ],
              steps: detailedStarterSteps(template, core, profile, accent),
              tip: template.tip
            });
          }
        }
      }
    }
    return generated;
  }

  function buildMains() {
    const generated = [];
    for (const template of mainTemplates) {
      for (const protein of mainProteins) {
        for (const profile of profiles) {
          for (const vegetables of mainVegetables) {
            generated.push({
              id: `main-${template.id}-${protein.id}-${profile.id}-${vegetables.id}`,
              title: `${profile.label} ${protein.name}-${template.title} mit ${vegetables.name}`,
              description: `${template.title} mit ${protein.name}, ${vegetables.name} und ${profile.aroma} – sättigend und proteinbewusst.`,
              cuisine: profile.cuisine,
              course: "main",
              diet: protein.diet,
              allergens: unique([template.allergens, protein.allergens, profile.allergens]),
              time: template.time,
              level: template.level,
              emoji: template.emoji,
              theme: template.theme,
              macros: addMacros(template.macros, protein.macros, profile.macros, vegetables.macros),
              ingredients: [
                { name: protein.name, amount: protein.amount, unit: protein.unit },
                ...template.ingredients,
                ...vegetables.ingredients,
                ...profile.ingredients
              ],
              steps: detailedMainSteps(template, protein, profile, vegetables),
              tip: template.tip
            });
          }
        }
      }
    }
    return generated;
  }

  function buildDesserts() {
    const generated = [];
    for (const template of dessertTemplates) {
      for (const base of dessertBases) {
        for (const flavor of dessertFlavors) {
          for (const fruit of dessertFruits) {
            const baseTitle = base.id === "greek" ? "griechischem Joghurt" : base.name;
            generated.push({
              id: `dessert-${template.id}-${base.id}-${flavor.id}-${fruit.id}`,
              title: `${flavor.name} ${fruit.name}-${template.title} auf ${baseTitle}`,
              description: `Proteinbewusstes Dessert aus ${base.name}, ${fruit.name} und ${flavor.aroma} – frisch, cremig und nicht zu schwer.`,
              cuisine: flavor.cuisine,
              course: "dessert",
              diet: base.diet,
              allergens: unique([template.allergens, base.allergens, flavor.allergens]),
              time: template.time,
              level: template.level,
              emoji: template.emoji,
              theme: template.theme,
              macros: addMacros(template.macros, base.macros, flavor.macros, fruit.macros),
              ingredients: [
                { name: base.name, amount: base.amount, unit: base.unit },
                { name: fruit.name, amount: fruit.amount, unit: fruit.unit },
                ...template.ingredients,
                flavor.ingredient
              ],
              steps: detailedDessertSteps(template, base, flavor, fruit),
              tip: template.tip
            });
          }
        }
      }
    }
    return generated;
  }

  function buildRecipes() {
    return [...buildStarters(), ...buildMains(), ...buildDesserts()];
  }

  global.KuechenenergieRecipeFactory = { buildRecipes };
})(typeof window !== "undefined" ? window : globalThis);
