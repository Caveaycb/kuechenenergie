# Küchenenergie: Content- und Qualitätsstandard

## Katalogmodell

- Ein **Grundrezept** ist ein eigenständiges Gericht mit natürlichem Titel,
  eigener Zutatenliste, passender Zubereitung und dokumentierter Herkunft.
- Änderungen an Portionsbasis, Proteinmenge oder Energiebeilage sind
  **adaptive Varianten** und werden nicht als neue Grundrezepte gezählt.
- Der Pilot umfasst 100 Grundrezepte: 15 Vorspeisen, 65 Hauptgerichte und
  20 Desserts. Der nächste Ausbau erfolgt erst nach der Pilotfreigabe.

## Automatische Qualitätsprüfung

`validate-recipes.js` prüft:

- eindeutige IDs und Titel;
- Verteilung nach Gang, Ernährungsweise und Küche;
- Titel- und Zutatenähnlichkeit;
- mindestens sechs ausführliche Arbeitsschritte;
- vollständige Zutaten mit positiven Mengen und Einheiten;
- Konsistenz von Kalorien, Protein, Kohlenhydraten und Fett;
- passende Protein- und Energievarianten;
- dokumentierte Herkunft ohne übernommene Fremdinhalte;
- Erreichbarkeit der Standard-Makrospanne.

Ein bestandener automatischer Test darf nur als **automatisch
qualitätsgeprüft** bezeichnet werden.

## Menschliche Freigabe

Die Kennzeichnung **redaktionell geprüft** darf erst gesetzt werden, wenn eine
verantwortliche Person folgende Punkte bestätigt hat:

1. Titel klingt natürlich, verständlich und unterscheidbar.
2. Zutaten sind in deutschen Supermärkten regulär erhältlich.
3. Mengen und Portion wirken beim Nachkochen realistisch.
4. Arbeitsschritte sind in der richtigen Reihenfolge und vollständig.
5. Garprobe und Hinweise zur Lebensmittelsicherheit sind korrekt.
6. Zeit, Schwierigkeit, Allergene und Ernährungsform stimmen.
7. Geschmack, Konsistenz und Anrichtung wurden plausibilisiert.
8. Makro-Varianten passen kulinarisch zum Grundgericht.

Der Pilotstatus aller 100 Rezepte lautet zunächst `pending`. Menschliche
Freigaben sollen mit Datum, Kürzel und optionaler Änderungsnotiz dokumentiert
werden.

## Quellen- und Lizenzregeln

- Rezepttexte, Bilder, Bewertungen und strukturierte Daten fremder Plattformen
  werden nicht automatisiert ausgelesen oder übernommen.
- Das gilt ausdrücklich auch für Chefkoch.
- Externe Inhalte dürfen nur nach dokumentierter Lizenz oder Kooperation
  importiert werden. Die Vereinbarung muss Nutzung, Bearbeitung, Quellenhinweis,
  Bilder, Nährwerte, Laufzeit und Löschung eindeutig regeln.
- Manuelle Marktbeobachtung darf nur dazu dienen, fehlende Kategorien oder
  saisonale Themen zu erkennen. Formulierungen und konkrete Rezeptausarbeitungen
  bleiben Küchenenergie-Eigenentwicklungen.

## Geplanter Ausbau

1. 100 Grundrezepte technisch und redaktionell pilotieren.
2. Nutzungsdaten und Rückmeldungen nach Rezeptfamilie auswerten.
3. Auf 250 Grundrezepte erweitern und schwache Familien ersetzen.
4. Erst nach stabiler Freigabe auf 500 bis 600 Grundrezepte skalieren.
