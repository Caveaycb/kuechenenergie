# Küchenenergie: Content- und Qualitätsstandard

## Katalogmodell

- Ein **Grundrezept** ist ein eigenständiges Gericht mit natürlichem Titel,
  eigener Zutatenliste, passender Zubereitung und dokumentierter Herkunft.
- Änderungen an Portionsbasis, Proteinmenge oder Energiebeilage sind
  **adaptive Varianten** und werden nicht als neue Grundrezepte gezählt.
- Der Katalog umfasst 624 Grundrezepte: 105 Vorspeisen, 395 Hauptgerichte,
  100 Desserts und 24 schnelle Snacks. 31 davon gehören zum separat
  recherchierten Küchenstil **Typisch sächsisch**.

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

Der Status aller 624 Rezepte lautet zunächst `pending`. Menschliche
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

1. Die 624 Grundrezepte technisch prüfen und nach Rezeptfamilie stichprobenartig
   nachkochen.
2. Die 31 sächsischen Rezepte mit regionalen Fachleuten oder Gastronomiebetrieben
   abgleichen.
3. Nutzungsdaten und Rückmeldungen nach Rezeptfamilie auswerten.
4. Schwache oder missverständliche Gerichte vor jedem weiteren Ausbau ersetzen.
