# NwT Lernlabor Klasse 9

Ein schülergerechter Lernpfad zur Seifenblasenmaschine mit 9 Kapiteln und 50 Lernschritten. Die Inhalte beruhen auf den bereitgestellten Unterrichtsfolien und Arbeitsblättern.

## Website lokal ansehen

Das ZIP entpacken und `index.html` im Browser öffnen. Die Dateien und Ordner zusammen lassen, damit Bilder, Arbeitsblätter und Programme erreichbar bleiben.

## Website veröffentlichen

Für GitHub die entpackten Dateien und Ordner in das Hauptverzeichnis von `NIT_9` hochladen. `index.html` muss direkt im Hauptverzeichnis liegen.

In den Repository-Einstellungen unter **Pages** als Quelle **Deploy from a branch** wählen. Anschließend **main** und **/(root)** auswählen und speichern. Die Website besteht aus statischen Dateien und benötigt keinen Build und keine Zugangsdaten.

## Lernen und Arbeiten

- Projektstart und Egg-Race
- Technische Systeme, EVA, Energie-, Stoff- und Informationsströme
- Arduino-Wiederholung mit vollständiger Befehlsübersicht
- Schreibtischlampe mit Taster, PWM und Entprellung
- Servomotor und mechanische Helligkeitsanzeige
- Motoransteuerung und Zahnradgetriebe
- Statik mit sämtlichen Aufgaben des Arbeitsblatts
- Seifenblasenversuche
- Projektplanung, Gesamttests und Reflexion

Die Schüler können Antworten eingeben, einzelne Tipps und Vergleichslösungen öffnen, Selbstchecks bearbeiten und Schritte markieren. Interaktive Modelle zeigen Tasterzustand, PWM, Lampenstufen, Zeigerposition, Getriebeübersetzung und Balkendurchbiegung. Diagramme zu den Reißkraft-Messreihen lassen sich nach der eigenen Auswertung einblenden. Ein Kriterienprüfer vergleicht drei Gesamttests mit dem Projektauftrag.

Unter **Material** stehen 6 Arbeitsblätter beziehungsweise Checklisten und 4 Foliensätze als PDFs bereit. Die Arduino-Programme stehen zusätzlich im Ordner `code` als `.ino` zur Verfügung.

## Antworten und Datenschutz

Antworten und Fortschritt werden ausschließlich im lokalen Browser gespeichert. Es gibt kein Login, keine automatische Abgabe und keine Synchronisation zwischen Geräten. **Mein Lernheft** ermöglicht einen Textdownload und das Drucken beziehungsweise Speichern als PDF. Auf gemeinsam genutzten Geräten muss nach der Sicherung der persönliche Stand zurückgesetzt werden. Wenn der Browser die Speicherung blockiert, erscheint ein Hinweis.

Die Website lädt keine externen Schriften, Videos, Analysewerkzeuge oder Programmbibliotheken. Externe Dokumentationslinks werden nur beim Anklicken geöffnet. Ein Sitzplan mit Schülernamen aus den Originalfolien und die Stundenverlaufspläne werden nicht veröffentlicht. Erwartungshorizonte sind aus den Schüler-Arbeitsblättern entfernt; Vergleichslösungen werden im Lernpfad bewusst geöffnet.

## Fachliche Präzisierungen

- Die Arduino-Beispiele beziehen sich auf den **Uno R3**. `INPUT_PULLUP` mit Taster nach GND bedeutet **gedrückt = LOW**.
- Die LED liegt an **Pin 5**, damit sie beim Einsatz der Servo-Bibliothek weiter gedimmt werden kann. Beim Uno R3 belegt die Bibliothek Timer 1; `analogWrite` an Pin 9 und 10 steht dann nicht für LED-PWM zur Verfügung. Das Servosignal kann auch über einen digitalen Pin ohne Hardware-PWM ausgegeben werden.
- Ein Servo benötigt geeignete Versorgung und gemeinsamen GND. Ein zusätzlicher gewöhnlicher DC-Motortreiber ist für seinen Signalanschluss nicht erforderlich. DC-Motoren werden über geeignete Leistungselektronik versorgt und nicht direkt über einen Signalpin.
- Die Angaben **1,0 N** und **265 N** im Statik-Arbeitsblatt werden unverändert übernommen und ausdrücklich als überprüfungsbedürftig behandelt. Keine vermutete Korrektur wird als bestätigter Messwert ausgegeben. Die Mittelwerte der Originalreihen lauten 6,90; 19,97; 106,50 und 29,90 N.
- Die Durchbiegungsbeziehung `w ∝ l³ / (b · h³)` wird mit ihren Modellbedingungen erläutert. Die Spannweite wirkt darin kubisch.
- Die Kickoff-Folien enthalten 20- und 30-Minuten-Varianten. Der Lernpfad erklärt diese Alternative.

Motor-/Getriebegrundlagen und die Versuchsführung zu Seifenblasen ergänzen den in den Folien genannten Qualifizierungsbedarf. Sie sind nicht als zusätzliche hochgeladene Fachfolien ausgegeben. Für die tatsächliche Motorbeschaltung sind der freigegebene Schaltplan und die konkreten Schulbauteile erforderlich.

## Dateien bearbeiten

`course.js` enthält Kapitel, Erklärungstexte, Aufgaben, Hilfen, Vergleichslösungen und die Materialliste. `app.js` stellt den Lernpfad und die Übungen dar. `styles.css` enthält das responsive Layout. Alle Links zu eigenen Dateien sind relativ, damit die Seite unter einem GitHub-Projektpfad funktioniert.

Die Originalmaterialien bleiben erhalten; die hier bereitgestellten PDFs sind Schülerfassungen beziehungsweise PDF-Exporte. Abbildungen behalten ihre Quelle im Unterrichtsmaterial. Daraus ergibt sich keine allgemeine Freigabe fremder Abbildungen für andere Veröffentlichungen.

Offizielle Arduino-Dokumentation:

- https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/
- https://support.arduino.cc/hc/en-us/articles/9350537961500-Use-PWM-output-with-Arduino
- https://docs.arduino.cc/libraries/servo/
- https://docs.arduino.cc/learn/electronics/servo-motors/
- https://docs.arduino.cc/learn/electronics/transistor-motor-control/
