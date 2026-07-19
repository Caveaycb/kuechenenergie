# Küchenenergie

**Online ausprobieren:** [caveaycb.github.io/kuechenenergie](https://caveaycb.github.io/kuechenenergie/)

Ein responsiver Mahlzeiten-Konfigurator im eins-energie-Look mit 624 eigenständigen
Grundrezepten und 24.960 möglichen Makro-Anpassungen. Aus Kalorien- und
Proteinspanne, Gang, Ernährungsweise, Küchenstil, Zeitlimit und Ausschlüssen entsteht
ein vollständiges Rezept mit Zutatenliste und Zubereitung. Der Katalog enthält
105 Vorspeisen, 395 Hauptspeisen, 100 Desserts und 24 schnelle Snacks. Dazu gehören
31 separat recherchierte Gerichte im Küchenstil „Typisch sächsisch“. Die Gerichte verwenden
überwiegend alltagstaugliche Zutaten aus deutschen Supermärkten.

Ein Tagesplaner kombiniert Vorspeise, Hauptspeise und Dessert zu einem
Drei-Gänge-Menü. Der Wochenplaner erzeugt sieben möglichst abwechslungsreiche
Tagesmenüs mit zusammen 21 Rezepten und weist Nährwerte sowie geschätzte
Kochenergie aus. Wochenpläne lassen sich lokal im jeweiligen Browser speichern
und auf einer eigenen, kompakten Unterseite ansehen, drucken oder löschen.
Allergene lassen sich am Einzelrezept und in jedem Plan per Knopfdruck einblenden.

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

Mit `node build-standalone.js` entstehen zusätzlich die beiden weitergebbaren
Einzeldateien `Kuechenenergie.html` und `Kuechenenergie-Wochenplaene.html`.

## Rezeptmethodik

Der Katalog trennt echte Grundrezepte von automatisch berechneten Varianten. Jedes
Grundrezept besitzt einen natürlichen Namen, eine eigene Zutatenliste, eine von
87 passenden Zubereitungsfamilien und rezeptverträgliche Regeln für Protein- und
Energieanpassungen. Eine angepasste Portionsgröße oder zusätzliche Beilage wird
nicht als neues Grundrezept gezählt.

Die Bibliothek ist eine Küchenenergie-Eigenentwicklung. Rezepttexte, Bilder,
Bewertungen und strukturierte Rezeptdaten fremder Plattformen – insbesondere von
Chefkoch – werden weder automatisiert ausgelesen noch übernommen. Eine spätere
Einbindung externer Inhalte setzt eine dokumentierte Lizenz oder Kooperation voraus.
Die sächsische Recherche und die Abgrenzung geschützter Produktbezeichnungen sind
in `SAECHSISCHE-RECHERCHE.md` dokumentiert. Die Kategorie- und Marktbeobachtung
für schnelle Snacks steht in `SNACK-RECHERCHE.md`.

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
