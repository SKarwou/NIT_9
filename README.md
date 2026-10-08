# NwT Lernlabor Klasse 9

Ein schülergerechter Lernpfad zur Seifenblasenmaschine mit **11 Kapiteln und 86 Lernschritten**. Grundlage sind die bereitgestellten Folien, Arbeitsblätter und Quiztabellen. Ergänzungsstand: 8. Oktober 2026.

Die Website ist unter **https://skarwou.github.io/NIT_9/** erreichbar, sobald die Dateien dieser Fassung auf dem von GitHub Pages veröffentlichten Branch liegen.

## Handschriftliche Heftarbeit

Alle schriftlichen Aufgaben werden im physischen Heft bearbeitet. Jeder Aufgabenblock fordert aktiv zum Schreiben auf und gibt eine eindeutige Überschrift vor. Datum, nummerierte Antworten, beschriftete Zeichnungen, Rechenwege und Versuchstabellen gehören ins Heft. Es gibt keine freien Antwort-Textfelder auf der Website. Auch die Befehlsübersicht wird im Heft ausgefüllt; die Vergleichstabelle kann anschließend geöffnet werden.

Die Ansicht **Dein Heft** erklärt die Arbeitsweise, zeigt ein Inhaltsverzeichnis und eine Abgabe-Checkliste. Heftantworten werden durch die Website nicht bewertet oder automatisch abgegeben. Frühere digitale Heftantworten aus der ersten Fassung bleiben im selben Browser erhalten und können in einem ausdrücklich als frühere Eingaben bezeichneten Bereich heruntergeladen werden.

## Lernen und Selbstchecks

- Projektstart, Egg-Race und Zusammenarbeit
- Technische Systeme, EVA und Energie-, Stoff- und Informationsströme
- Arduino-Befehle und 11 Quizfragen mit Erklärungen
- Drei-Stufen-Lampe mit Taster, PWM und Entprellung
- Positionsservo, Pinvergleich und mechanische Zeigeranzeige
- DC-Motor, Motorleistung, TIP120, Wasserventil-Modell und vollständiger Transistorzweig
- Getriebearten, radiale und axiale Lagerung, Fest-/Loslager, Übersetzung und Drehmoment
- Statik mit allen Aufgaben aus V4, Balkenmodell und 15 Quizfragen mit Erklärungen
- Zwei Seifenblasenrezepte, vier Probebecher und dokumentierte Vergleichsversuche
- Arbeitsplan, Meilensteine, kurze Teamsitzungen, Gesamttests und Abgabe
- Alle acht Bereiche der technischen, Team- und persönlichen Reflexion

Interaktive Modelle zu Taster, PWM, Lampe, Servo, Getriebe und Balken bleiben erhalten. Zahlenfelder dienen ausschließlich überprüfbaren Selbstchecks: Mittelwertrechnung und Vergleich der Gesamttests mit den Projektkriterien. Die zugehörigen Rechnungen und Messprotokolle werden zuerst ins Heft geschrieben. Quizantworten können ohne Zeitlimit geprüft und verbessert werden; jede Frage hat eine fachliche Erklärung.

Unter **Material** stehen **21 PDFs** bereit. Das sind Arbeitsblätter, Vorlagen und Foliensätze. Doppeluploads wurden zusammengeführt; beide Quiztabellen sind als Website-Selbstchecks umgesetzt. Lehrer-Erwartungshorizonte, namentliche Gruppen- oder Sitzlisten und alte Projekttermine sind nicht in den öffentlichen Schülerfassungen enthalten. Die sechs Beispielprogramme liegen als `.ino` im Ordner `code`.

## GitHub Pages und lokales Öffnen

Die entpackten Dateien und Ordner gehören ins Hauptverzeichnis des Repositorys. `index.html` liegt direkt dort; `assets`, `material` und `code` bleiben zusammen mit den JavaScript- und CSS-Dateien erhalten. Die bestehende `.nojekyll` wird erhalten.

Die vorhandene Pages-Konfiguration **main / (root)** kann weiterverwendet werden. Es ist kein Build erforderlich. Zum lokalen Ansehen `index.html` im Browser öffnen oder das Verzeichnis mit einem einfachen statischen HTTP-Server bereitstellen. Alle eigenen Dateiverweise sind relativ und funktionieren auch unter dem GitHub-Projektpfad `/NIT_9/`.

## Fortschritt und frühere Eingaben

Fortschritt, Quizantworten und Zahlen der Selbstchecks werden ausschließlich in diesem Browser gespeichert. Es gibt keinen Login, keine automatische Abgabe und keine Synchronisation zwischen Geräten. Auf gemeinsam genutzten Geräten kann der Stand unter **Dein Heft** zurückgesetzt werden. Die vorhandenen Kapitel- und Schritt-IDs sowie der bisherige Speichername bleiben erhalten; die Abfolge einiger Schritte wurde für den Arbeitsablauf angepasst.

Die Website lädt keine externen Schriften, Videos, Analysewerkzeuge oder Programmbibliotheken. Externe Dokumentationslinks werden erst beim Anklicken geöffnet. Schriftliche Ergebnisse bleiben im Heft; die Lehrkraft vereinbart Kontrolle und Abgabe.

## Fachliche Präzisierungen

- Beispiele gelten für den **Uno R3**. Taster nach GND mit `INPUT_PULLUP`: **gedrückt = LOW**.
- Vereinheitlichte Anschlüsse: **LED 5, Taster 2, Servo-Signal 8, DC-Motor-Steuersignal 3**. Das alleinige Winkelbeispiel aus dem Arbeitsblatt nutzt zunächst Servo-Pin 10 und erklärt den Vergleich mit 8. Die Servo-Bibliothek beeinflusst am Uno R3 die normale PWM-Funktion an 9 und 10.
- Ein Positionsservo benötigt geeignete Versorgung und gemeinsamen GND; keinen gewöhnlichen DC-Motortreiber für den Signalanschluss. Er wird nicht mit Gewalt von Hand verdreht oder blockiert.
- Arduino nennt **20 mA pro I/O-Pin**. Die ursprüngliche Angabe „200 mA pro Pin“ wurde korrigiert. `5 V · 0,020 A = 0,10 W` dient als vereinfachter Leistungsvergleich und erlaubt keinen direkten Motoranschluss an Signalpins.
- Der TIP120-Motorzweig zeigt Basiswiderstand, Motorversorgung, gemeinsamen GND und Freilaufdiode: **Kathode an Plus, Anode an Kollektor**. Bauteilwerte und Versorgung werden passend zum konkreten Schulmotor festgelegt. Unvollständige oder direkte GPIO-Motorschaltungen sind aus den neuen Folienschülerfassungen entfernt. `analogWrite(...,128)` bedeutet etwa halbe Einschaltzeit, nicht zwingend halbe Drehzahl.
- Bei Getrieben gilt `i = n1/n2 = z2/z1`; Durchmesserverhältnisse beziehen sich auf Teilkreise. Mehrere Stufen werden multipliziert. Schneckenübersetzung berücksichtigt die Gangzahl; Selbsthemmung ist keine allgemeine Eigenschaft jedes Schneckengetriebes.
- Website, Mittelwertprüfer und PDF verwenden dieselbe neue Messreihe aus **Statik V4**. Sie ersetzt die früheren Werte ausdrücklich durch die neue bereitgestellte Quelle. Die Mittelwerte der Querschnittsreihen lauten **9,90; 19,97; 27,00 und 39,93 N**. Die Längenreihe bleibt bei 7,89; 7,21; 7,72 und 8,13 N.
- Das Balkenmodell `w ∝ l³ / (b · h³)` nennt seine Bedingungen: gleicher Werkstoff, gleiche Last und passende gleiche Auflagerung. Zug unten und Druck oben beziehen sich auf den dargestellten, nach unten durchgebogenen Balken auf Endauflagern.
- Die beiden Rezeptmengen wurden originalgetreu übernommen und auf ein Fünftel skaliert. Ein Vergleich der Originalrezepte ändert mehrere Zutaten gleichzeitig; ein gezielter Optimierungsversuch ändert deshalb nur eine Einflussgröße.
- Quizfragen wurden an uneindeutigen Stellen präzisiert: `Serial.println("Hallo")`, 100 % PWM bei 255, Reißkraft statt Material-Zugfestigkeit und eindeutige Randbedingungen bei Biegung.

## Dateien bearbeiten

`course.js` enthält die bisherigen Grundinhalte. `course-extra.js` ergänzt und ordnet die neuen Inhalte und enthält die zwei Quizbanken. `app.js` rendert Heftaufträge, Hilfen, Modelle und Selbstchecks. `styles.css` enthält das responsive Layout. Die PDF-Schülerfassungen beruhen auf den bereitgestellten Unterrichtsmaterialien; einzelne fachliche Angaben sind korrigiert und begleitend erklärt. Die Originaluploads und die Lehrkraftlösungen werden nicht mitveröffentlicht.

## Offizielle Arduino-Dokumentation

- https://store.arduino.cc/products/arduino-uno-rev3
- https://docs.arduino.cc/resources/pinouts/A000066-full-pinout.pdf
- https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/
- https://support.arduino.cc/hc/en-us/articles/9350537961500-Use-PWM-output-with-Arduino
- https://docs.arduino.cc/libraries/servo/
- https://docs.arduino.cc/learn/electronics/servo-motors/
- https://docs.arduino.cc/learn/electronics/transistor-motor-control/
