# Küchenenergie

**Online ausprobieren:** [caveaycb.github.io/kuechenenergie](https://caveaycb.github.io/kuechenenergie/)

Ein responsiver Mahlzeiten-Konfigurator im eins-energie-Look mit 4.228 Rezeptideen. Aus Kalorien- und
Proteinspanne, Gang, Ernährungsweise, Küchenstil, Zeitlimit und Ausschlüssen entsteht
ein vollständiges Rezept mit Zutatenliste und Zubereitung. Die Bibliothek enthält
Vorspeisen, Hauptspeisen und Desserts. Das Küchenprofil „Deutsch & bodenständig“
und die übrigen Profile verwenden überwiegend Zutaten, die in deutschen
Supermärkten regulär erhältlich sind.

Jedes Rezept enthält mindestens sechs ausführliche Arbeitsschritte inklusive
Vorbereitung, Garprobe, Abschmecken und Servierhinweisen.

Alle 4.228 Rezepte durchlaufen denselben redaktionellen Prüf- und Korrekturlauf:
Zutaten und Mengen, ausführliche Schritte, plausible Makros, Zeitangaben, Gang,
Ernährungsform und Allergene werden kontrolliert. Doppelte Zutaten werden dabei
zusammengeführt und Texte formal vereinheitlicht. Eine fehlertolerante Suche findet
Gerichte über Titel, Beschreibung und Zutaten – auch bei Umlauten und typischen
Pluralformen.

Die Rezeptdarstellung verwendet wieder verspielte, vollständig codebasierte
Food-Grafiken. Hauptmotiv, zwei Zutatenmotive, Anordnung und Dekoration werden
rezeptabhängig kombiniert, sodass deutlich mehr visuelle Varianten entstehen – ohne
Fotodateien, externes Tracking oder Bild-CDN.

Für die Barrierefreiheit enthält die Oberfläche unter anderem einen Skip-Link,
sichtbare Tastaturfokusse, eigene Statusansagen für Such- und Rezeptwechsel,
eindeutige Form-Zuordnungen, deaktivierte Portionsgrenzen sowie
Varianten für reduzierte Bewegung, erhöhten Kontrast und erzwungene Systemfarben.

Fertige Rezepte lassen sich direkt über den Druckdialog ausgeben oder als echte,
mehrseitige PDF-Datei mit Zutaten, Nährwerten und allen Zubereitungsschritten
herunterladen. Der PDF-Export funktioniert vollständig lokal und ohne externen Dienst.

Die Phase-2-Energiefunktionen ergänzen eine Gerätewahl, einen lokal gespeicherten
persönlichen Energiepreis sowie geschätzte kWh und Kochkosten pro Zubereitung.
Zu jedem Rezept werden außerdem eine sparsamere Zubereitungsvariante und ein
gerätespezifischer Energiespartipp ausgegeben. Alle Werte sind transparente
Modellschätzungen und werden auch in Druckansicht und PDF übernommen.

## Starten

Die App benötigt keine Installation. `index.html` kann direkt im Browser geöffnet
oder über einen kleinen lokalen Server ausgeliefert werden:

```bash
python3 -m http.server 8765
```

Danach ist die App unter `http://localhost:8765` erreichbar.

## Rezeptmethodik

Die Bibliothek kopiert keine Fremdrezepte. Sie kombiniert eigene Kochvorlagen,
Proteinbausteine, Gemüse, Küchenprofile und Dessertkomponenten zu eindeutigen
Rezepten. Als strukturelle Inspiration dienten:

- [BZfE: Mahlzeiten planen und genießen](https://www.bzfe.de/essen-und-gesundheit/ernaehrungspyramide/mahlzeiten-planen-und-geniessen)
- [EAT SMARTER: Eiweißreiche Rezepte](https://eatsmarter.de/rezepte/ernaehrung/eiweissreich)
- [Good Food: High-Protein-Rezepte](https://www.bbcgoodfood.com/recipes/collection/high-protein-recipes)
- [USDA MyPlate: Desserts](https://www.myplate.gov/taxonomy/term/120?page=9)

Kalorien werden konsistent aus Protein, Kohlenhydraten und Fett berechnet. Die
Zutatenmengen werden innerhalb realistischer Grenzen an die gewählten Kalorien-
und Proteinspannen angepasst. Nicht realistisch erfüllbare Kombinationen werden
nicht als Treffer ausgegeben.

Alle Nährwerte sind rechnerische Näherungen pro Portion und keine medizinische
oder ernährungstherapeutische Beratung.
