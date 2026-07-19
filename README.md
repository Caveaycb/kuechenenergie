# Küchenenergie

**Online ausprobieren:** [caveaycb.github.io/kuechenenergie](https://caveaycb.github.io/kuechenenergie/)

Ein responsiver Mahlzeiten-Konfigurator im eins-energie-Look mit 600 eigenständigen
Grundrezepten und mehr als 24.000 möglichen Makro-Anpassungen. Aus Kalorien- und
Proteinspanne, Gang, Ernährungsweise, Küchenstil, Zeitlimit und Ausschlüssen entsteht
ein vollständiges Rezept mit Zutatenliste und Zubereitung. Der Katalog enthält
105 Vorspeisen, 395 Hauptspeisen und 100 Desserts. Dazu gehören 30 separat
recherchierte Gerichte im Küchenstil „Typisch sächsisch“. Die Gerichte verwenden
überwiegend alltagstaugliche Zutaten aus deutschen Supermärkten.

Jedes Rezept enthält mindestens sechs ausführliche Arbeitsschritte inklusive
Vorbereitung, Garprobe, Abschmecken und Servierhinweisen.

Alle Grundrezepte durchlaufen einen automatischen Qualitäts- und Korrekturlauf:
Zutaten und Mengen, ausführliche Schritte, plausible Makros, Zeitangaben, Gang,
Ernährungsform, Allergene, eindeutige Identität, Variantenregeln und Herkunft werden
kontrolliert. Doppelte Zutaten werden zusammengeführt und Texte formal
vereinheitlicht. Eine menschliche Freigabe ist davon klar getrennt und im Pilotstand
noch als ausstehend markiert. Eine fehlertolerante Suche findet Gerichte über Titel,
Beschreibung und Zutaten – auch bei Umlauten und typischen Pluralformen.

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

Der Katalog trennt echte Grundrezepte von automatisch berechneten Varianten. Jedes
Grundrezept besitzt einen natürlichen Namen, eine eigene Zutatenliste, eine von
77 passenden Zubereitungsfamilien und rezeptverträgliche Regeln für Protein- und
Energieanpassungen. Eine angepasste Portionsgröße oder zusätzliche Beilage wird
nicht als neues Grundrezept gezählt.

Die Bibliothek ist eine Küchenenergie-Eigenentwicklung. Rezepttexte, Bilder,
Bewertungen und strukturierte Rezeptdaten fremder Plattformen – insbesondere von
Chefkoch – werden weder automatisiert ausgelesen noch übernommen. Eine spätere
Einbindung externer Inhalte setzt eine dokumentierte Lizenz oder Kooperation voraus.
Die sächsische Recherche und die Abgrenzung geschützter Produktbezeichnungen sind
in `SAECHSISCHE-RECHERCHE.md` dokumentiert.

Kalorien werden konsistent aus Protein, Kohlenhydraten und Fett berechnet. Die
Zutatenmengen werden innerhalb realistischer Grenzen an die gewählten Kalorien-
und Proteinspannen angepasst. Nicht realistisch erfüllbare Kombinationen werden
nicht als Treffer ausgegeben.

Alle Nährwerte sind rechnerische Näherungen pro Portion und keine medizinische
oder ernährungstherapeutische Beratung.

## Qualität prüfen

`validate-recipes.js` kontrolliert unter anderem Anzahl und Verteilung, eindeutige
Titel, Ähnlichkeit, Zutaten, Arbeitsschritte, Makroformel, Anpassungsfähigkeit und
Herkunftskennzeichnung:

```bash
node validate-recipes.js
```
