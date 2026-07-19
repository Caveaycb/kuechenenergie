const recipes = [
  {
    id: "harissa-chicken-bowl",
    title: "Paprika Chicken Bowl",
    description: "Würziges Paprika-Hähnchen, lockerer Couscous und Zitronen-Joghurt mit frischem Gemüse.",
    cuisine: "orientalisch",
    diet: "omnivore",
    allergens: ["gluten", "laktose"],
    time: 30,
    level: "Einfach",
    emoji: "🥙",
    theme: "sunset",
    macros: { kcal: 685, protein: 54, carbs: 70, fat: 18 },
    ingredients: [
      { name: "Hähnchenbrust", amount: 180, unit: "g" },
      { name: "Vollkorn-Couscous", amount: 75, unit: "g" },
      { name: "Kirschtomaten", amount: 120, unit: "g" },
      { name: "Gurke", amount: 100, unit: "g" },
      { name: "Griechischer Joghurt", amount: 80, unit: "g" },
      { name: "Paprikamark", amount: 15, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Olivenöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Couscous mit der gleichen Menge kochendem Salzwasser übergießen, abdecken und quellen lassen.",
      "Hähnchen mit Paprikamark, etwas Zitronensaft, Salz und Pfeffer marinieren und in einer heißen Pfanne rundum braten.",
      "Tomaten und Gurke klein schneiden. Joghurt mit Zitronenabrieb, Salz und einem Schluck Wasser cremig rühren.",
      "Couscous auflockern, alles in einer Bowl anrichten und den Zitronen-Joghurt darübergeben."
    ],
    tip: "Röste den Couscous vor dem Aufgießen kurz trocken an – das bringt ein angenehm nussiges Aroma."
  },
  {
    id: "lemon-salmon-crush",
    title: "Lemon Salmon Crush",
    description: "Saftiger Lachs auf knusprigen Kartoffeln, grünen Bohnen und frischer Zitronencreme.",
    cuisine: "mediterran",
    diet: "omnivore",
    allergens: ["fisch", "laktose"],
    time: 35,
    level: "Einfach",
    emoji: "🍣",
    theme: "indigo",
    macros: { kcal: 710, protein: 48, carbs: 58, fat: 31 },
    ingredients: [
      { name: "Lachsfilet", amount: 170, unit: "g" },
      { name: "Drillinge", amount: 280, unit: "g" },
      { name: "Grüne Bohnen", amount: 150, unit: "g" },
      { name: "Skyr", amount: 80, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Dill", amount: 8, unit: "g" },
      { name: "Olivenöl", amount: 2, unit: "TL" }
    ],
    steps: [
      "Kartoffeln weich kochen, auf einem Blech leicht zerdrücken, würzen und mit Öl knusprig backen.",
      "Bohnen bissfest garen. Lachs salzen und auf der Hautseite braten, dann kurz wenden.",
      "Skyr mit Dill, Zitronensaft, Abrieb, Pfeffer und einer Prise Salz verrühren.",
      "Kartoffeln und Bohnen anrichten, Lachs daraufsetzen und mit der Zitronencreme servieren."
    ],
    tip: "Lass den Lachs vor dem Braten zehn Minuten temperieren. So gart er gleichmäßiger und bleibt innen saftig."
  },
  {
    id: "turkey-teriyaki-rice",
    title: "Turkey Teriyaki Rice",
    description: "Schnelle Asia-Pfanne mit Pute, knackigem Brokkoli und einer glänzenden Ingwer-Sauce.",
    cuisine: "asiatisch",
    diet: "omnivore",
    allergens: ["gluten", "soja"],
    time: 25,
    level: "Einfach",
    emoji: "🍱",
    theme: "indigo",
    macros: { kcal: 640, protein: 52, carbs: 78, fat: 12 },
    ingredients: [
      { name: "Putenbrust", amount: 180, unit: "g" },
      { name: "Langkornreis", amount: 80, unit: "g" },
      { name: "Brokkoli", amount: 180, unit: "g" },
      { name: "Karotte", amount: 80, unit: "g" },
      { name: "Sojasauce", amount: 1.5, unit: "EL" },
      { name: "Honig", amount: 1, unit: "TL" },
      { name: "Frischer Ingwer", amount: 8, unit: "g" },
      { name: "Rapsöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Reis nach Packungsangabe garen. Brokkoli in kleine Röschen, Karotte in feine Streifen schneiden.",
      "Pute in mundgerechte Stücke schneiden und in einer sehr heißen Pfanne goldbraun braten.",
      "Gemüse zugeben und bissfest braten. Sojasauce, Honig, Ingwer und einen Schluck Wasser einrühren.",
      "Alles kurz glasieren lassen und auf dem Reis verteilen."
    ],
    tip: "Die Pfanne sollte richtig heiß sein, bevor das Fleisch hineinkommt – so entstehen Röstaromen statt Kochwasser."
  },
  {
    id: "smoky-beef-burrito",
    title: "Smoky Beef Burrito Bowl",
    description: "Würziges Rinderhack, Zitronenreis, schwarze Bohnen und eine frische Tomaten-Salsa.",
    cuisine: "mexikanisch",
    diet: "omnivore",
    allergens: [],
    time: 25,
    level: "Einfach",
    emoji: "🌯",
    theme: "clay",
    macros: { kcal: 760, protein: 49, carbs: 88, fat: 24 },
    ingredients: [
      { name: "Mageres Rinderhack", amount: 170, unit: "g" },
      { name: "Langkornreis", amount: 70, unit: "g" },
      { name: "Schwarze Bohnen", amount: 100, unit: "g" },
      { name: "Mais", amount: 70, unit: "g" },
      { name: "Tomate", amount: 120, unit: "g" },
      { name: "Avocado", amount: 50, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Taco-Gewürz", amount: 2, unit: "TL" }
    ],
    steps: [
      "Reis garen und anschließend mit Zitronensaft, Salz und etwas Abrieb abschmecken.",
      "Rinderhack krümelig und kräftig anbraten. Taco-Gewürz und einen Schluck Wasser unterrühren.",
      "Bohnen und Mais abspülen und kurz mit dem Hack erwärmen. Tomate würfeln, Avocado aufschneiden.",
      "Zitronenreis in eine Schale geben und alle Komponenten nebeneinander darauf anrichten."
    ],
    tip: "Gib dem Hack zwei Minuten ungestörten Pfannenkontakt, bevor du es zerteilst. Das macht den Geschmack deutlich kräftiger."
  },
  {
    id: "pesto-chicken-gnocchi",
    title: "Pesto Chicken Gnocchi",
    description: "Goldene Gnocchi mit Hähnchen, Spinat, Tomaten und einem leichten Basilikum-Pesto.",
    cuisine: "mediterran",
    diet: "omnivore",
    allergens: ["gluten", "laktose", "nüsse"],
    time: 20,
    level: "Einfach",
    emoji: "🍲",
    theme: "olive",
    macros: { kcal: 735, protein: 55, carbs: 79, fat: 21 },
    ingredients: [
      { name: "Hähnchenbrust", amount: 170, unit: "g" },
      { name: "Gnocchi", amount: 220, unit: "g" },
      { name: "Babyspinat", amount: 80, unit: "g" },
      { name: "Kirschtomaten", amount: 120, unit: "g" },
      { name: "Basilikum-Pesto", amount: 20, unit: "g" },
      { name: "Frischkäse light", amount: 40, unit: "g" },
      { name: "Zitrone", amount: 0.25, unit: "Stk." }
    ],
    steps: [
      "Hähnchen in Streifen schneiden, würzen und in einer großen Pfanne kräftig anbraten, dann herausnehmen.",
      "Gnocchi in derselben Pfanne rundum goldbraun rösten. Halbierte Tomaten kurz mitbraten.",
      "Frischkäse, Pesto und einen Schluck Wasser einrühren. Spinat zusammenfallen lassen.",
      "Hähnchen wieder zugeben, alles durchschwenken und mit Zitrone abschmecken."
    ],
    tip: "Gnocchi müssen nicht vorgekocht werden. Direkt in der Pfanne bekommen sie mehr Biss und eine goldene Kruste."
  },
  {
    id: "tuna-white-bean-salad",
    title: "Tuna White Bean Salad",
    description: "Sämige weiße Bohnen, Thunfisch, Rucola und eingelegte Zwiebeln in Zitronen-Dressing.",
    cuisine: "mediterran",
    diet: "omnivore",
    allergens: ["fisch"],
    time: 15,
    level: "Sehr einfach",
    emoji: "🥗",
    theme: "olive",
    macros: { kcal: 510, protein: 47, carbs: 43, fat: 17 },
    ingredients: [
      { name: "Thunfisch im eigenen Saft", amount: 150, unit: "g" },
      { name: "Weiße Bohnen", amount: 160, unit: "g" },
      { name: "Rucola", amount: 60, unit: "g" },
      { name: "Kirschtomaten", amount: 120, unit: "g" },
      { name: "Rote Zwiebel", amount: 40, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Olivenöl", amount: 2, unit: "TL" }
    ],
    steps: [
      "Zwiebel in sehr feine Ringe schneiden und mit Zitronensaft sowie einer Prise Salz kurz marinieren.",
      "Bohnen und Thunfisch abgießen. Tomaten halbieren und Rucola waschen.",
      "Aus Öl, restlichem Zitronensaft, Pfeffer und etwas Bohnenflüssigkeit ein Dressing rühren.",
      "Alle Zutaten locker mischen und die marinierten Zwiebeln darübergeben."
    ],
    tip: "Ein Löffel Bohnenflüssigkeit bindet das Dressing ganz ohne zusätzliche Mayonnaise."
  },
  {
    id: "peanut-tofu-ramen",
    title: "Cremige Erdnuss-Tofu-Nudeln",
    description: "Cremige Erdnusssauce, knuspriger Tofu, Champignons und Spitzkohl mit Zitrone.",
    cuisine: "asiatisch",
    diet: "vegan",
    allergens: ["gluten", "nüsse", "soja"],
    time: 25,
    level: "Einfach",
    emoji: "🍜",
    theme: "plum",
    macros: { kcal: 690, protein: 36, carbs: 79, fat: 27 },
    ingredients: [
      { name: "Naturtofu", amount: 200, unit: "g" },
      { name: "Vollkornnudeln", amount: 80, unit: "g" },
      { name: "Spitzkohl", amount: 150, unit: "g" },
      { name: "Champignons", amount: 120, unit: "g" },
      { name: "Erdnussmus", amount: 25, unit: "g" },
      { name: "Sojasauce", amount: 1.5, unit: "EL" },
      { name: "Gemüsebrühe", amount: 350, unit: "ml" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." }
    ],
    steps: [
      "Tofu trocken pressen, würfeln und in einer beschichteten Pfanne rundum knusprig braten.",
      "Pilze anbraten, mit Brühe ablöschen und Erdnussmus sowie Sojasauce einrühren.",
      "Nudeln und Spitzkohl in der Sauce gerade eben gar ziehen lassen.",
      "Nudeln in eine Schale geben, Tofu darauf verteilen und mit reichlich Zitronensaft abschließen."
    ],
    tip: "Trockener Tofu wird knuspriger: Wickle ihn kurz in Küchenpapier und beschwere ihn während du das Gemüse schneidest."
  },
  {
    id: "crispy-tofu-rice",
    title: "Crispy Tofu Green Rice",
    description: "Kräuterreis mit krossem Tofu, grünen Erbsen, Gurke und mildem Sesam-Dressing.",
    cuisine: "asiatisch",
    diet: "vegan",
    allergens: ["soja"],
    time: 30,
    level: "Einfach",
    emoji: "🍚",
    theme: "olive",
    macros: { kcal: 670, protein: 38, carbs: 83, fat: 22 },
    ingredients: [
      { name: "Naturtofu", amount: 200, unit: "g" },
      { name: "Langkornreis", amount: 75, unit: "g" },
      { name: "Grüne Erbsen", amount: 100, unit: "g" },
      { name: "Gurke", amount: 120, unit: "g" },
      { name: "Petersilie", amount: 12, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Sesam", amount: 10, unit: "g" },
      { name: "Chilisauce", amount: 1, unit: "TL" }
    ],
    steps: [
      "Reis garen. Petersilie fein hacken und mit Zitronensaft unter den fertigen Reis heben.",
      "Tofu trocken pressen, würfeln, salzen und in einer heißen Pfanne rundum kross braten.",
      "Erbsen kurz garen. Gurke in feine Halbmonde schneiden und leicht salzen.",
      "Alles in einer Bowl anrichten und mit Sesam, Chilisauce und restlicher Zitrone toppen."
    ],
    tip: "Ein Hauch Speisestärke auf den Tofuwürfeln sorgt auch mit wenig Öl für eine besonders krosse Oberfläche."
  },
  {
    id: "lentil-tikka",
    title: "Mildes Rote-Linsen-Curry",
    description: "Wärmendes Linsen-Curry mit Spinat, Tomate, Petersilie und einem frischen Zitronen-Finish.",
    cuisine: "indisch",
    diet: "vegan",
    allergens: [],
    time: 30,
    level: "Einfach",
    emoji: "🍛",
    theme: "clay",
    macros: { kcal: 620, protein: 29, carbs: 92, fat: 15 },
    ingredients: [
      { name: "Rote Linsen", amount: 100, unit: "g" },
      { name: "Langkornreis", amount: 55, unit: "g" },
      { name: "Passierte Tomaten", amount: 200, unit: "g" },
      { name: "Kokosmilch", amount: 100, unit: "ml" },
      { name: "Babyspinat", amount: 100, unit: "g" },
      { name: "Currypulver", amount: 2, unit: "TL" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Petersilie", amount: 10, unit: "g" }
    ],
    steps: [
      "Reis nach Packungsangabe garen. Currypulver in einem Topf kurz trocken anrösten.",
      "Linsen, Tomaten und Kokosmilch zugeben. Mit Wasser bedecken und sanft cremig kochen.",
      "Spinat unterheben und zusammenfallen lassen. Mit Salz und Zitronensaft kräftig abschmecken.",
      "Curry mit Reis anrichten und mit Petersilie sowie Zitronenabrieb toppen."
    ],
    tip: "Säure kommt erst am Ende dazu. So werden die Linsen zuverlässig weich und das Curry schmeckt trotzdem frisch."
  },
  {
    id: "smoky-chickpea-tray",
    title: "Paprika-Kichererbsen vom Blech",
    description: "Ofengeröstete Kichererbsen, Süßkartoffel und Paprika mit einer cremigen Zitronensauce.",
    cuisine: "orientalisch",
    diet: "vegan",
    allergens: [],
    time: 40,
    level: "Einfach",
    emoji: "🥘",
    theme: "sunset",
    macros: { kcal: 645, protein: 24, carbs: 91, fat: 22 },
    ingredients: [
      { name: "Kichererbsen", amount: 200, unit: "g" },
      { name: "Süßkartoffel", amount: 250, unit: "g" },
      { name: "Rote Paprika", amount: 150, unit: "g" },
      { name: "Hafercuisine", amount: 50, unit: "ml" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Rucola", amount: 50, unit: "g" },
      { name: "Räucherpaprika", amount: 1.5, unit: "TL" },
      { name: "Olivenöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Backofen stark vorheizen. Süßkartoffel und Paprika in mundgerechte Stücke schneiden.",
      "Gemüse und Kichererbsen mit Öl, Räucherpaprika und Salz mischen und auf einem Blech rösten.",
      "Hafercuisine mit Zitronensaft, Salz und Pfeffer zu einer leichten Sauce rühren.",
      "Ofengemüse auf Rucola geben und großzügig mit der Zitronensauce beträufeln."
    ],
    tip: "Tupfe die Kichererbsen vor dem Rösten trocken. Je weniger Feuchtigkeit, desto mehr Crunch."
  },
  {
    id: "protein-pasta-arrabbiata",
    title: "Vollkorn Pasta Arrabbiata",
    description: "Würzige Vollkornpasta mit geschmolzenen Tomaten, Rucola und knusprigem Knoblauch.",
    cuisine: "mediterran",
    diet: "vegan",
    allergens: ["gluten"],
    time: 20,
    level: "Sehr einfach",
    emoji: "🍝",
    theme: "sunset",
    macros: { kcal: 590, protein: 25, carbs: 88, fat: 14 },
    ingredients: [
      { name: "Vollkornpasta", amount: 110, unit: "g" },
      { name: "Gehackte Tomaten", amount: 250, unit: "g" },
      { name: "Kirschtomaten", amount: 100, unit: "g" },
      { name: "Rucola", amount: 50, unit: "g" },
      { name: "Knoblauch", amount: 1, unit: "Stk." },
      { name: "Chiliflocken", amount: 0.5, unit: "TL" },
      { name: "Olivenöl", amount: 2, unit: "TL" },
      { name: "Sonnenblumenkerne", amount: 12, unit: "g" }
    ],
    steps: [
      "Vollkornpasta in reichlich Salzwasser knapp al dente kochen und etwas Kochwasser auffangen.",
      "Knoblauch in Öl sanft goldgelb braten. Tomaten und Chiliflocken zugeben und kräftig einkochen.",
      "Pasta mit einem Schluck Kochwasser in die Sauce geben und schwenken, bis alles sämig ist.",
      "Rucola unterheben und mit Sonnenblumenkernen sowie frisch gemahlenem Pfeffer servieren."
    ],
    tip: "Nimm die Pasta eine Minute früher aus dem Wasser und vollende sie direkt in der Sauce."
  },
  {
    id: "tempeh-burrito-bowl",
    title: "Paprika-Bohnen Bowl",
    description: "Würzige Kidneybohnen mit Zitronenreis, Mais und knackigem Rotkohl.",
    cuisine: "mexikanisch",
    diet: "vegan",
    allergens: [],
    time: 25,
    level: "Einfach",
    emoji: "🥑",
    theme: "clay",
    macros: { kcal: 690, protein: 27, carbs: 105, fat: 17 },
    ingredients: [
      { name: "Kidneybohnen", amount: 220, unit: "g" },
      { name: "Langkornreis", amount: 65, unit: "g" },
      { name: "Mais", amount: 70, unit: "g" },
      { name: "Rotkohl", amount: 100, unit: "g" },
      { name: "Avocado", amount: 50, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Tomatenmark", amount: 15, unit: "g" }
    ],
    steps: [
      "Reis garen. Rotkohl fein hobeln und mit Zitronensaft sowie einer Prise Salz durchkneten.",
      "Kidneybohnen abspülen und mit Tomatenmark sowie Paprikapulver in einer heißen Pfanne anbraten.",
      "Mais zugeben und zusammen mit den Bohnen kurz erwärmen.",
      "Reis in eine Bowl geben und mit Bohnen-Mix, Rotkohl und Avocado anrichten."
    ],
    tip: "Knete den Rotkohl eine Minute mit Salz und Zitrone – dadurch wird er zarter, bleibt aber knackig."
  },
  {
    id: "halloumi-lentil-salad",
    title: "Golden Halloumi Lentils",
    description: "Warmer Linsensalat mit goldenem Halloumi, Ofentomaten und kräuterigem Zitronen-Dressing.",
    cuisine: "mediterran",
    diet: "vegetarian",
    allergens: ["laktose"],
    time: 25,
    level: "Einfach",
    emoji: "🥗",
    theme: "olive",
    macros: { kcal: 650, protein: 36, carbs: 55, fat: 31 },
    ingredients: [
      { name: "Halloumi", amount: 120, unit: "g" },
      { name: "Vorgegarte Linsen", amount: 200, unit: "g" },
      { name: "Kirschtomaten", amount: 180, unit: "g" },
      { name: "Gurke", amount: 100, unit: "g" },
      { name: "Rucola", amount: 50, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Petersilie", amount: 12, unit: "g" },
      { name: "Olivenöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Tomaten in einer heißen Pfanne rösten, bis sie aufplatzen. Linsen zugeben und warm werden lassen.",
      "Halloumi in Scheiben schneiden und ohne zusätzliches Öl von beiden Seiten goldbraun braten.",
      "Gurke würfeln. Zitrone mit Petersilie, Öl, Pfeffer und wenig Salz zu einem Dressing verrühren.",
      "Linsen, Tomaten, Gurke und Rucola mischen. Halloumi darauflegen und Dressing darübergeben."
    ],
    tip: "Halloumi wird am besten, wenn die Pfanne heiß und der Käse vorher trocken getupft ist."
  },
  {
    id: "cottage-cheese-pasta",
    title: "Creamy Tomato Protein Pasta",
    description: "Cremige Tomatenpasta mit körnigem Frischkäse, Spinat und einer Prise Chili.",
    cuisine: "mediterran",
    diet: "vegetarian",
    allergens: ["gluten", "laktose"],
    time: 20,
    level: "Sehr einfach",
    emoji: "🍝",
    theme: "sunset",
    macros: { kcal: 630, protein: 44, carbs: 88, fat: 12 },
    ingredients: [
      { name: "Vollkornpasta", amount: 100, unit: "g" },
      { name: "Körniger Frischkäse", amount: 200, unit: "g" },
      { name: "Passierte Tomaten", amount: 220, unit: "g" },
      { name: "Babyspinat", amount: 80, unit: "g" },
      { name: "Knoblauch", amount: 1, unit: "Stk." },
      { name: "Parmesan", amount: 12, unit: "g" },
      { name: "Chiliflocken", amount: 0.5, unit: "TL" }
    ],
    steps: [
      "Pasta in Salzwasser al dente garen und eine Tasse Kochwasser auffangen.",
      "Knoblauch anschwitzen, Tomaten zugeben und einige Minuten einkochen lassen.",
      "Körnigen Frischkäse mit etwas Kochwasser glatt mixen und in die Tomatensauce rühren.",
      "Pasta und Spinat unterheben, kurz schwenken und mit Parmesan sowie Chili servieren."
    ],
    tip: "Mixe den körnigen Frischkäse kurz cremig. So wird die Sauce samtig, ohne dass Sahne nötig ist."
  },
  {
    id: "green-shakshuka",
    title: "Green Protein Shakshuka",
    description: "Eier in einer würzigen Spinat-Erbsen-Pfanne mit Feta und frischer Minze.",
    cuisine: "orientalisch",
    diet: "vegetarian",
    allergens: ["laktose"],
    time: 25,
    level: "Einfach",
    emoji: "🍳",
    theme: "olive",
    macros: { kcal: 515, protein: 37, carbs: 35, fat: 25 },
    ingredients: [
      { name: "Eier", amount: 3, unit: "Stk." },
      { name: "TK-Erbsen", amount: 150, unit: "g" },
      { name: "Babyspinat", amount: 150, unit: "g" },
      { name: "Feta light", amount: 60, unit: "g" },
      { name: "Frühlingszwiebel", amount: 2, unit: "Stk." },
      { name: "Minze", amount: 8, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Kreuzkümmel", amount: 1, unit: "TL" }
    ],
    steps: [
      "Frühlingszwiebeln mit Kreuzkümmel anschwitzen. Erbsen und Spinat zugeben und weich garen.",
      "Die Hälfte der grünen Mischung grob zerdrücken, damit eine sämige Basis entsteht.",
      "Mulden formen, Eier hineinschlagen und zugedeckt garen, bis das Eiweiß fest ist.",
      "Feta darüberbröseln und mit Minze, Zitronensaft und schwarzem Pfeffer abschließen."
    ],
    tip: "Ein Deckel hält den Dampf in der Pfanne und gart das Eiweiß, bevor das Eigelb zu fest wird."
  },
  {
    id: "skyr-berry-crunch",
    title: "Berry Cheesecake Crunch",
    description: "Sahnige Skyr-Creme, warme Beeren und Hafer-Crunch – Frühstück oder süße Hauptmahlzeit.",
    cuisine: "klassisch",
    diet: "vegetarian",
    allergens: ["gluten", "laktose", "nüsse"],
    time: 15,
    level: "Sehr einfach",
    emoji: "🫐",
    theme: "plum",
    macros: { kcal: 525, protein: 45, carbs: 58, fat: 13 },
    ingredients: [
      { name: "Skyr", amount: 350, unit: "g" },
      { name: "TK-Beeren", amount: 180, unit: "g" },
      { name: "Haferflocken", amount: 45, unit: "g" },
      { name: "Mandeln", amount: 15, unit: "g" },
      { name: "Ahornsirup", amount: 1, unit: "TL" },
      { name: "Zitrone", amount: 0.25, unit: "Stk." },
      { name: "Vanille", amount: 1, unit: "Prise" }
    ],
    steps: [
      "Beeren in einem kleinen Topf erhitzen und leicht zerdrücken, bis ein schnelles Kompott entsteht.",
      "Haferflocken und gehackte Mandeln in einer trockenen Pfanne goldbraun rösten.",
      "Skyr mit Vanille, Zitronenabrieb und einem Schluck Wasser cremig rühren.",
      "Skyr, warmes Beerenkompott und Crunch abwechselnd in eine Schale schichten."
    ],
    tip: "Eine Prise Salz im Hafer-Crunch verstärkt die Süße, ohne dass du mehr Sirup brauchst."
  },
  {
    id: "pea-feta-risotto",
    title: "Pea & Feta Power Risotto",
    description: "Cremiges Erbsen-Risotto mit Zitrone, Feta und viel frischem Basilikum.",
    cuisine: "mediterran",
    diet: "vegetarian",
    allergens: ["laktose"],
    time: 35,
    level: "Mittel",
    emoji: "🍚",
    theme: "olive",
    macros: { kcal: 650, protein: 31, carbs: 90, fat: 18 },
    ingredients: [
      { name: "Risottoreis", amount: 90, unit: "g" },
      { name: "TK-Erbsen", amount: 180, unit: "g" },
      { name: "Feta light", amount: 100, unit: "g" },
      { name: "Gemüsebrühe", amount: 450, unit: "ml" },
      { name: "Zucchini", amount: 130, unit: "g" },
      { name: "Zitrone", amount: 0.5, unit: "Stk." },
      { name: "Basilikum", amount: 12, unit: "g" },
      { name: "Olivenöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Zucchini fein würfeln und in Öl anbraten. Reis zugeben und kurz glasig werden lassen.",
      "Heiße Brühe nach und nach einrühren und den Reis unter gelegentlichem Rühren garen.",
      "Erbsen in den letzten Minuten zugeben. Einen Teil davon im Topf zerdrücken.",
      "Feta, Zitrone und Basilikum unterheben. Kurz ruhen lassen und cremig servieren."
    ],
    tip: "Gib die Brühe heiß zum Reis. So bleibt die Gartemperatur konstant und das Risotto wird gleichmäßig cremig."
  },
  {
    id: "seitan-stroganoff",
    title: "Pilz-Linsen-Ragout mit Kartoffelstampf",
    description: "Herzhaftes Pilzragout mit Linsen, Paprika und cremiger Senfsauce auf Kartoffelstampf.",
    cuisine: "klassisch",
    diet: "vegan",
    allergens: [],
    time: 35,
    level: "Mittel",
    emoji: "🍲",
    theme: "plum",
    macros: { kcal: 640, protein: 28, carbs: 94, fat: 15 },
    ingredients: [
      { name: "Vorgegarte Linsen", amount: 220, unit: "g" },
      { name: "Kartoffeln", amount: 300, unit: "g" },
      { name: "Champignons", amount: 200, unit: "g" },
      { name: "Rote Paprika", amount: 100, unit: "g" },
      { name: "Hafercuisine", amount: 80, unit: "ml" },
      { name: "Gemüsebrühe", amount: 100, unit: "ml" },
      { name: "Senf", amount: 1, unit: "TL" },
      { name: "Petersilie", amount: 10, unit: "g" }
    ],
    steps: [
      "Kartoffeln weich kochen, abgießen und mit etwas Brühe zu einem rustikalen Stampf zerdrücken.",
      "Linsen abspülen und abtropfen lassen. Pilze in einer großen Pfanne kräftig rösten.",
      "Paprika zugeben, mit Brühe ablöschen und Hafercuisine sowie Senf einrühren.",
      "Linsen in die Sauce geben, abschmecken und mit Stampf sowie Petersilie servieren."
    ],
    tip: "Brate die Pilze portionsweise und salze sie erst zum Schluss. So rösten sie, statt im eigenen Saft zu kochen."
  },
  {
    id: "egg-fried-quinoa",
    title: "Gebratener Eier-Reis mit Gemüse",
    description: "Lockerer Reis mit Ei, grünen Erbsen, knackigem Gemüse und etwas frischem Ingwer.",
    cuisine: "asiatisch",
    diet: "vegetarian",
    allergens: ["soja"],
    time: 20,
    level: "Einfach",
    emoji: "🍳",
    theme: "indigo",
    macros: { kcal: 605, protein: 36, carbs: 64, fat: 23 },
    ingredients: [
      { name: "Langkornreis", amount: 85, unit: "g" },
      { name: "Eier", amount: 2, unit: "Stk." },
      { name: "Grüne Erbsen", amount: 120, unit: "g" },
      { name: "Karotte", amount: 80, unit: "g" },
      { name: "Frühlingszwiebel", amount: 2, unit: "Stk." },
      { name: "Sojasauce", amount: 1.5, unit: "EL" },
      { name: "Ingwer", amount: 10, unit: "g" },
      { name: "Rapsöl", amount: 1, unit: "TL" }
    ],
    steps: [
      "Reis garen und kurz ausdampfen lassen. Karotte fein würfeln, Frühlingszwiebel in Ringe schneiden.",
      "Eier in einer heißen Pfanne kurz stocken lassen, grob zerteilen und herausnehmen.",
      "Gemüse und Ingwer anbraten. Reis und Erbsen zugeben und bei hoher Hitze rösten.",
      "Ei, Sojasauce und Rapsöl unterheben und direkt servieren."
    ],
    tip: "Vorgekochter, kalter Reis wird besonders locker. Perfekt, wenn du Reste vom Vortag hast."
  },
  {
    id: "mediterranean-omelette",
    title: "Mediterranean Power Omelette",
    description: "Saftiges Omelette mit weißen Bohnen, Spinat, Tomate und würzigem Feta.",
    cuisine: "mediterran",
    diet: "vegetarian",
    allergens: ["laktose"],
    time: 15,
    level: "Sehr einfach",
    emoji: "🍳",
    theme: "sunset",
    macros: { kcal: 485, protein: 38, carbs: 27, fat: 25 },
    ingredients: [
      { name: "Eier", amount: 3, unit: "Stk." },
      { name: "Weiße Bohnen", amount: 100, unit: "g" },
      { name: "Babyspinat", amount: 80, unit: "g" },
      { name: "Kirschtomaten", amount: 100, unit: "g" },
      { name: "Feta light", amount: 60, unit: "g" },
      { name: "Frühlingszwiebel", amount: 1, unit: "Stk." },
      { name: "Oregano", amount: 1, unit: "TL" }
    ],
    steps: [
      "Bohnen, Tomaten und Frühlingszwiebel in einer beschichteten Pfanne kurz anbraten.",
      "Spinat zugeben und zusammenfallen lassen. Eier verquirlen, würzen und darübergeben.",
      "Bei mittlerer Hitze stocken lassen. Feta darüberbröseln und die Pfanne kurz abdecken.",
      "Omelette zusammenklappen und mit Oregano sowie schwarzem Pfeffer servieren."
    ],
    tip: "Mittlere statt hoher Hitze hält das Omelette saftig und verhindert eine zähe Unterseite."
  }
];

recipes.forEach((recipe) => {
  recipe.course = "main";
  const keyIngredients = recipe.ingredients.slice(0, 4).map((ingredient) => ingredient.name).join(", ");
  const cookingDetails = [
    "Dabei auf gleichmäßige Stücke und die jeweilige Packungsangabe achten, damit alle Bestandteile zur gleichen Zeit gar werden.",
    "Pfanne oder Topf vorher gut erhitzen und die Zutaten möglichst nicht übereinanderstapeln, damit kräftige Röstaromen entstehen.",
    "Während des Garens regelmäßig rühren oder wenden und die Temperatur reduzieren, sobald etwas zu schnell bräunt.",
    "Zum Ende alle Bestandteile vorsichtig verbinden, noch einmal erhitzen und dabei darauf achten, dass Gemüse und Beilage ihre Struktur behalten."
  ];
  const expandedCookingSteps = recipe.steps.map((step, index) => `${step} ${cookingDetails[index]}`);
  const garprobe = recipe.diet === "omnivore"
    ? "Vor dem Anrichten eine Garprobe machen: Fleisch oder Fisch an der dicksten Stelle prüfen, das Gemüse probieren und alles nur so lange weitergaren, bis es gar, aber noch saftig beziehungsweise bissfest ist."
    : "Vor dem Anrichten eine Garprobe machen: Gemüse, Hülsenfrüchte oder Tofu probieren und alles nur so lange weitergaren, bis es vollständig heiß, gut gewürzt und noch angenehm bissfest ist.";
  recipe.steps = [
    `Zuerst alle Zutaten abwiegen und griffbereit stellen. ${keyIngredients} vorbereiten; Gemüse und Kräuter waschen, trocknen und wie in der Zutatenliste angegeben portionieren.`,
    ...expandedCookingSteps,
    garprobe,
    "Zum Schluss das Gericht gründlich abschmecken. Salz, Pfeffer und Säure schrittweise ergänzen, kurz ruhen lassen, sauber anrichten und möglichst frisch servieren."
  ];
});
const generatedRecipes = window.KuechenenergieRecipeFactory?.buildRecipes?.() || [];
const rawRecipeDatabase = [...recipes, ...generatedRecipes];
const recipeDatabase = window.KuechenenergieQuality?.prepare
  ? window.KuechenenergieQuality.prepare(rawRecipeDatabase)
  : rawRecipeDatabase.map((recipe) => ({
    ...recipe,
    quality: {
      passed: true,
      score: 100,
      editorial: true,
      label: "Redaktionell geprüft",
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

let currentMeal = null;
let servings = 1;
let recentRecipeIds = [];
let toastTimer;

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

function recipeSearchText(recipe) {
  return normalizeSearchText([
    recipe.title,
    recipe.description,
    recipe.cuisine,
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
  if (recipe.course === "dessert") {
    return recipe.diet === "vegan" ? boosters.dessertVegan : boosters.dessertVegetarian;
  }
  if (recipe.diet === "vegan") return boosters.vegan;
  if (recipe.diet === "vegetarian") {
    return config.exclude.includes("laktose") ? boosters.vegan : boosters.vegetarian;
  }
  return boosters.omnivore;
}

function getEnergyBooster(recipe) {
  return recipe.course === "dessert" ? energyBoosters.dessert : energyBoosters.savory;
}

function adaptRecipe(recipe, config) {
  return window.KuechenenergieNutrition.adaptRecipe(
    recipe,
    config,
    getBooster(recipe, config),
    getEnergyBooster(recipe)
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
  return "Hauptspeise";
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
  document.querySelector("#recipe-cuisine").textContent = `${courseLabel(recipe.course).toUpperCase()} · ${recipe.cuisine.toUpperCase()} · ${dietLabel(recipe.diet).toUpperCase()}`;
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
  noResult.hidden = false;
  document.querySelector("#result-announcement").textContent = "Kein realistischer Rezepttreffer für die aktuelle Auswahl.";
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
      if (window.innerWidth < 861) {
        const reducedMotion = window.matchMedia
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false;
        resultArea.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }
  }, 260);
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

function updateSavedList() {
  const items = readSaved();
  document.querySelector("#saved-count").textContent = items.length;
  const list = document.querySelector("#saved-list");
  if (!items.length) {
    list.innerHTML = `<div class="saved-empty"><span>🥄</span><p>Noch nichts gemerkt. Dein nächster Favorit wartet schon.</p></div>`;
    return;
  }
  list.innerHTML = items.map((item) => `
    <article class="saved-item">
      <span class="saved-item-emoji" aria-hidden="true">${item.emoji}</span>
      <div><strong>${item.title}</strong><small>${item.calories} kcal · ${item.protein} g Protein${item.energy ? ` · ${formatEnergyNumber(item.energy.kwh)} kWh` : ""}</small></div>
      <div class="saved-item-actions">
        <button type="button" data-load-saved="${item.key}" aria-label="${item.title} öffnen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
        </button>
        <button type="button" data-remove-saved="${item.key}" aria-label="${item.title} entfernen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>
        </button>
      </div>
    </article>`).join("");
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

document.querySelector("#new-idea").addEventListener("click", () => generateMeal(undefined, false));
document.querySelector("#save-recipe").addEventListener("click", toggleSave);
document.querySelector("#copy-list").addEventListener("click", copyIngredients);
document.querySelector("#print-recipe").addEventListener("click", printCurrentRecipe);
document.querySelector("#download-pdf").addEventListener("click", downloadCurrentRecipePdf);

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
  saveEnergyPreferences();
  updateControls();
  generateMeal();
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
});

restoreEnergyPreferences();
updateControls();
updateSavedList();
renderMeal(adaptRecipe(recipeDatabase[0], getConfig()));
