/* Die Inhalte sind bewusst ohne externe Dienste nutzbar. */
(() => {
  const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const code = (s,label='Arduino · C++') => `<div class="code-block"><div class="code-toolbar"><span>${label}</span><button type="button" class="copy-code">Code kopieren</button></div><pre><code>${esc(s)}</code></pre></div>`;
  const figure = (src,alt,caption='',narrow=false) => `<figure class="figure"><img src="assets/${src}" alt="${alt}" ${narrow?'class="narrow"':''} loading="lazy"><figcaption>${caption||'Abbildung aus deinem Unterrichtsmaterial.'}</figcaption></figure>`;
  const note = (title,text,warning=false) => `<div class="callout ${warning?'warning':''}"><strong>${title}</strong><p>${text}</p></div>`;
  const table = (head,rows) => `<div class="table-wrap"><table><thead><tr>${head.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const fields = (...labels) => labels.map((label,i)=>({key:String(i),label}));
  const step = (id,title,body,taskFields=[],extra={}) => ({id,title,body,fields:taskFields,...extra});
  const quiz = (question,options,answer,explanation) => ({question,options,answer,explanation});
  const CODES = {
    blink:`const int ledPin = 5;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
    button:`const int tasterPin = 2;

void setup() {
  pinMode(tasterPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int zustand = digitalRead(tasterPin);
  Serial.println(zustand);
  delay(50);
}`,
    lamp:`const int ledPin = 5;
const int tasterPin = 2;
int stufe = 0;
int letzterRohwert = HIGH;
int stabilerZustand = HIGH;
unsigned long letzteAenderung = 0;
const unsigned long entprellzeit = 30;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(tasterPin, INPUT_PULLUP);
  analogWrite(ledPin, 0);
}

void loop() {
  int rohwert = digitalRead(tasterPin);

  // Bei jeder elektrischen Änderung beginnt die Wartezeit neu.
  if (rohwert != letzterRohwert) {
    letzteAenderung = millis();
  }

  // Erst ein 30 ms lang stabiler Wert wird übernommen.
  if (millis() - letzteAenderung >= entprellzeit) {
    if (rohwert != stabilerZustand) {
      stabilerZustand = rohwert;
      if (stabilerZustand == LOW) {
        stufe = stufe + 1;
        if (stufe > 2) {
          stufe = 0;
        }
      }
    }
  }
  letzterRohwert = rohwert;

  int helligkeit = 0;
  if (stufe == 1) {
    helligkeit = 128;
  } else if (stufe == 2) {
    helligkeit = 255;
  }
  analogWrite(ledPin, helligkeit);
}`,
    servo:`#include <Servo.h>
Servo servoblau;

void setup() {
  servoblau.attach(10);
}

void loop() {
  servoblau.write(0);
  delay(3000);
  servoblau.write(90);
  delay(3000);
  servoblau.write(180);
  delay(3000);
  servoblau.write(20);
  delay(3000);
}`,
    servoLamp:`#include <Servo.h>
Servo anzeige;
const int ledPin = 5;
const int tasterPin = 2;
int stufe = 0;
int letzterRohwert = HIGH;
int stabilerZustand = HIGH;
unsigned long letzteAenderung = 0;
const unsigned long entprellzeit = 30;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(tasterPin, INPUT_PULLUP);
  anzeige.attach(8);
  anzeige.write(40);
  analogWrite(ledPin, 0);
}

void loop() {
  int rohwert = digitalRead(tasterPin);
  if (rohwert != letzterRohwert) {
    letzteAenderung = millis();
  }
  if (millis() - letzteAenderung >= entprellzeit) {
    if (rohwert != stabilerZustand) {
      stabilerZustand = rohwert;
      if (stabilerZustand == LOW) {
        stufe = stufe + 1;
        if (stufe > 2) stufe = 0;
      }
    }
  }
  letzterRohwert = rohwert;

  if (stufe == 0) {
    analogWrite(ledPin, 0);
    anzeige.write(40);
  } else if (stufe == 1) {
    analogWrite(ledPin, 128);
    anzeige.write(90);
  } else {
    analogWrite(ledPin, 255);
    anzeige.write(140);
  }
}`
  };
  const COURSE = [
    {
      id:'start',number:'00',title:'Projektstart',subtitle:'Auftrag und Zusammenarbeit',time:'ca. 45–60 Min.',source:'Kickoff-Folien und Projektauftrag',
      intro:'Du entwickelst mit deinem Team eine Maschine, die eine große Seifenblase erzeugt. Zuerst klärst du das Ziel und übst, eine technische Idee gemeinsam zu verbessern.',
      steps:[
        step('auftrag','Was soll deine Maschine können?',`<p class="lead">Eure Maschine soll <strong>auf Knopfdruck innerhalb von 15 Sekunden</strong> eine Seifenblase mit einem <strong>Durchmesser von mindestens 7 cm</strong> erzeugen. Diese Seifenblase soll <strong>mindestens 8 Sekunden lang schweben</strong>.</p><p>Ein Projektauftrag beschreibt das Ergebnis, das ihr erreichen sollt. Er schreibt euch noch nicht vor, wie eure Maschine aussehen muss. Die Zahlen machen das Ziel überprüfbar: Ihr könnt später messen, ob eure Idee funktioniert.</p>${table(['Vorgabe aus den Folien','So prüfst du sie'],[['Knopfdruck','Die Maschine startet durch einen Taster.'],['Innerhalb von 15 s','Stoppuhr ab dem Tastendruck bis zur fertigen Seifenblase.'],['Mindestens 7 cm Durchmesser','Eine Messskala oder eine 7-cm-Vergleichsschablone verwenden.'],['Mindestens 8 s Schwebezeit','Vom Ablösen der Blase bis zum Zerplatzen oder Bodenkontakt stoppen.']])}${note('So arbeitest du mit dem Lernpfad','Lies einen Schritt, bearbeite die Aufgabe und prüfe deine Antwort. Du kannst Tipps einzeln öffnen. Markiere anschließend den Schritt als bearbeitet. Praktische Versuche führst du mit dem bereitgestellten Schulmaterial durch. Deine schriftlichen Antworten speichert dieser Browser; sichere sie regelmäßig über „Mein Lernheft“.')}`,
          fields('Formuliere den Projektauftrag in deinen eigenen Worten.','Welche Messgeräte oder Hilfsmittel braucht ihr, um alle Kriterien zu überprüfen?'),{
            hints:['Trenne „Was soll passieren?“ und „Wie messen wir den Erfolg?“.','Du brauchst eine Zeitmessung und eine Möglichkeit, einen Durchmesser zu vergleichen.'],
            quiz:quiz('Ein Prototyp erzeugt nach 12 s eine 8 cm große Blase. Sie schwebt 6 s. Ist der Auftrag erfüllt?',['Ja, weil die Blase groß genug ist.','Nein, die Schwebezeit ist zu kurz.','Nein, die Maschine muss genau 15 s warten.'],1,'12 s liegt unter der Höchstzeit und 8 cm über dem Mindestdurchmesser. Die Schwebezeit muss aber mindestens 8 s betragen.')
          }),
        step('eggrace','Ordnerklammer-Weitflug',`<p>Ein <strong>Egg-Race</strong> ist eine kurze Konstruktionsaufgabe: Du bekommst ein Ziel, wenig Zeit und festes Material. Eine fertige Bauanleitung gibt es nicht. Auch ein misslungener Versuch liefert dir Hinweise.</p>${figure('klammer.png','Eine Ordnerklammer mit zwei Metallbügeln','Die Ordnerklammer ist die Last, die eure Konstruktion tragen soll.',true)}<ol><li>Bildet Teams aus <strong>3 Personen</strong>.</li><li>Entwickelt eine Konstruktion, die eine Ordnerklammer möglichst lange in der Luft hält.</li><li>Nutzt ausschließlich das gestellte Baumaterial.</li><li>Die Klammer startet <strong>2 m über dem Boden</strong>. Die Lehrkraft organisiert einen sicheren Startplatz.</li><li>Stoppt die Zeit vom Loslassen bis zum Auftreffen auf dem Boden. Bei der Präsentation hat jedes Team einen Versuch.</li></ol>${note('Zeit vereinbaren','Die Folien enthalten Varianten mit 20 und 30 Minuten Bauzeit. Wenn eure Lehrkraft nichts anderes festlegt, plant mit 20 Minuten: 4 Minuten Ideen, 12 Minuten Bauen und 4 Minuten Testen. Werft die Klammer nicht hoch; ihr lasst sie los.')}`,
          fields('Skizziere deine Idee auf Papier. Beschreibe hier, wie sie die Fallzeit verlängern könnte.','Welche Aufgabe übernimmt jedes Teammitglied?'),{
            hints:['Überlege, was den Fall bremst. Welche Rolle könnte der Luftwiderstand spielen?','Eine große leichte Fläche kann Luft bremsen. Sie muss mit der Klammer verbunden sein und sich beim Fallen sinnvoll ausrichten.'],
            solution:'<p>Es gibt mehrere mögliche Konstruktionen. Ein Fallschirm mit großer, leichter Fläche kann den Luftwiderstand erhöhen. Ob er sich zuverlässig öffnet, musst du testen. Entscheidend ist euer gemessenes Ergebnis und eine nachvollziehbare Begründung.</p>'
          }),
        step('reflexion','Aus dem Versuch lernen',`<p>Schreibe nach dem Test auf, was du <strong>beobachtet</strong> hast. „Der Fallschirm blieb zusammengefaltet“ beschreibt eine Beobachtung. „Die Fläche war zu schwer“ ist bereits eine mögliche Erklärung. Beides ist nützlich, aber du solltest es auseinanderhalten.</p><p>Ändere beim nächsten Test möglichst nur eine Sache. Wenn du gleichzeitig Material, Form und Aufhängung änderst, weißt du anschließend kaum, welche Änderung geholfen hat.</p>`,
          fields('Wie lange war eure Klammer in der Luft? Was hat gut funktioniert?','Was hat nicht wie geplant funktioniert? Nenne eine konkrete Beobachtung.','Was würdest du beim nächsten Versuch ändern und warum?','Was braucht ein Team für einen erfolgreichen Projektabschluss?'),{
            hints:['Denke auch an Absprachen, Aufgabenverteilung, Tests und Dokumentation.'],
            solution:'<p>Ein möglicher Reflexionssatz: „Unsere Klammer fiel nach 1,9 s zu Boden. Der Schirm öffnete sich erst spät. Beim nächsten Test kürzen wir nur die Aufhängung und vergleichen die Fallzeit.“ Die Zahl ist ein Beispiel, kein vorgegebener Messwert.</p>'
          }),
        step('team','Fünf Minuten Projektplanung',`<p>Ein guter Arbeitsstart spart später Zeit. Nehmt euch vor jeder Doppelstunde fünf Minuten für die Checkliste. Eure Rollen können wechseln; jede Person soll auch fachlich mitdenken.</p>${table(['Frage','Deine Entscheidung'],[['Rückblick','Was haben wir geschafft? Was ist noch offen?'],['Ziel heute','Welches konkrete Ergebnis wollen wir am Ende sehen?'],['Rollen','Wer konstruiert, programmiert, testet und dokumentiert?'],['Hindernisse','Welches Material oder welche Hilfe fehlt?'],['Dokumentation','Welche Skizzen, Messwerte und Änderungen halten wir fest?']])}<p>Auch deine Lernbedingungen gehören dazu: Was brauchst du, um konzentriert mitzuarbeiten, ohne andere abzulenken?</p><a class="inline-link" href="material/Checkliste_Projektmanagement.pdf" target="_blank" rel="noopener">Checkliste als PDF öffnen</a>`,
          fields('Unser Ziel für heute und woran wir den Erfolg erkennen:','Unsere Rollen und nächsten Arbeitsschritte:','Das brauche ich, um gut zu lernen und andere nicht zu stören:'),{
            solution:'<p>Ein überprüfbares Ziel lautet zum Beispiel: „Am Ende haben wir den Taster angeschlossen und können seinen Zustand im seriellen Monitor sehen.“ „Wir machen Arduino“ ist dafür zu ungenau.</p>'
          })
      ]
    },
    {
      id:'systeme',number:'01',title:'Technische Systeme',subtitle:'EVA, Teilsysteme und Ströme',time:'ca. 90 Min.',source:'Systemanalyse-Folien I/II und Arbeitsblatt Systemanalyse',
      intro:'Du zerlegst eine Maschine in überschaubare Teile. So erkennst du, welche Aufgabe jedes Teil erfüllt und wie die Teile zusammenarbeiten.',
      steps:[
        step('begriff','Was ist ein technisches System?',`<p>Ein <strong>technisches System</strong> besteht aus Bauteilen, die gemeinsam eine Aufgabe erfüllen. Beim Fahrrad reicht ein einzelnes Pedal nicht zum Fahren. Erst das Zusammenspiel von Rahmen, Rädern, Antrieb, Lenkung und Bremsen macht das Fahrrad nutzbar.</p>${figure('bicycle.png','Fahrrad mit Rahmen, Rädern, Lenker und Antrieb','Beispiel aus dem Arbeitsblatt: Ein Fahrrad besitzt mehrere Teilsysteme.',true)}<p>Ein <strong>Teilsystem</strong> erfüllt eine bestimmte Teilaufgabe. Zum Antrieb gehören beispielsweise Pedale, Kette und Zahnräder. Je nach Fragestellung kannst du ein Teilsystem noch genauer unterteilen. Es gibt deshalb nicht für jede Maschine genau eine richtige Liste.</p>`,fields('Wähle ein technisches System aus deinem Alltag. Was ist seine Gesamtaufgabe?','Nenne mindestens drei Teilsysteme und beschreibe jeweils ihre Funktion.'),{
          hints:['Denke an ein Fahrrad, einen Föhn, ein Auto oder einen Getränkeautomaten.','Schreibe jeweils „Das Teilsystem … sorgt dafür, dass …“.'],
          solution:'<p>Beispiel Fahrrad: Der Rahmen trägt die Bauteile und die fahrende Person. Der Antrieb überträgt die Bewegung der Pedale auf das Hinterrad. Die Bremsen verringern die Geschwindigkeit. Die Lenkung ermöglicht Richtungsänderungen.</p>'
        }),
        step('eva','Das EVA-Prinzip verstehen',`<p><strong>EVA</strong> steht für <strong>Eingabe, Verarbeitung, Ausgabe</strong>. Du schaust zuerst auf die Grenzen des gesamten Systems: Was kommt hinein? Was geschieht darin? Was kommt heraus?</p><div class="flow-grid"><div class="flow-column"><h4>Eingabe</h4><p>Was erhält das System? Zum Beispiel einen Tastendruck, elektrische Energie oder einen Stoff.</p></div><div class="flow-column"><h4>Verarbeitung</h4><p>Was machen die Teilsysteme damit? Zum Beispiel Daten auswerten, erhitzen oder einen Motor bewegen.</p></div><div class="flow-column"><h4>Ausgabe</h4><p>Welches Ergebnis entsteht? Zum Beispiel eine Bewegung, ein Bild oder eine Seifenblase.</p></div></div><p>Bei einer Leselampe sind elektrische Energie und das Betätigen des Schalters Eingaben. Die Elektronik und die LED verarbeiten sie. Licht und Wärme sind Ausgaben.</p>${note('EVA ist mehr als Computertechnik','In der Systemanalyse können Information, Energie und Materie sowohl Eingaben als auch Ausgaben sein. Frage bei jedem Beispiel, welche Systemgrenze du gewählt hast.')}`,fields('Erkläre EVA an deinem selbst gewählten Beispiel aus dem vorigen Schritt.'),{
          quiz:quiz('Welche Zuordnung passt zur Seifenblasenmaschine?',['Eingabe: fertige Seifenblase; Ausgabe: Tastendruck.','Eingabe: Tastendruck und Seifenlösung; Verarbeitung: Ring benetzen und anblasen; Ausgabe: Seifenblase.','EVA bedeutet Energie, Volt, Ampere.'],1,'EVA beschreibt den Ablauf vom Eingang über die Verarbeitung zum Ergebnis. Elektrische Energie ist ebenfalls eine Eingabe.'),
          hints:['Schreibe drei Sätze: „Hinein kommt …“, „Im System passiert …“, „Heraus kommt …“.'],
          solution:'<p>Seifenblasenmaschine: Eingaben sind Tastendruck, elektrische Energie, Luft und Seifenblasenflüssigkeit. Die Steuerung bewegt den Dispenser und aktiviert den Luftstrom. Als gewünschtes Ergebnis löst sich eine Seifenblase ab; außerdem entsteht unter anderem Wärme.</p>'
        }),
        step('stroeme','Energie, Stoff oder Information?',`<p>Zwischen Teilsystemen wird etwas weitergegeben. In deinem Schaubild zeichnest du dafür Pfeile mit einer <strong>Richtung</strong> und einer <strong>Beschriftung</strong>. Die Farbe allein erklärt noch nicht, was weitergegeben wird.</p>${table(['Strom','Was wird übertragen?','Beispiel und Farbe'],[['Energie','Energie, etwa elektrisch oder mechanisch','Batterie versorgt Motor · rot'],['Stoff / Material','Materie, etwa Wasser, Luft oder Seifenlösung','Behälter benetzt Ring · grün'],['Information','Ein Signal oder eine Messinformation','Taster meldet Tastendruck · blau']])}<p>Ein elektrisches Kabel kann Energie übertragen und zugleich ein Signal führen. Für die Darstellung fragst du: Welche Funktion betrachten wir gerade?</p>`,fields('Ordne zu und begründe: Batterie zum Motor; Taster zum Arduino; Wasserleitung zur Waschmaschine.'),{
          widget:'flow',
          hints:['Elektrische Versorgung gehört zum Energiestrom. Eine Anweisung gehört zum Informationsstrom. Bewegte Flüssigkeit gehört zum Stoffstrom.'],
          solution:'<p>Batterie zum Motor: elektrische Energie. Taster zum Arduino: Information über den Schaltzustand. Wasserleitung zur Waschmaschine: Stoffstrom Wasser.</p>'
        }),
        step('waschmaschine','Eine Waschmaschine untersuchen',`<p>Bearbeite Aufgabe 1 des Arbeitsblatts jetzt in kleinen Teilen. Eine Waschmaschine braucht unter anderem eine Trommel, einen Antrieb, eine Heizung, Ventile, eine Pumpe und eine elektronische Steuerung.</p>${figure('washing-machine.jpeg','Eine Waschmaschine als Beispiel eines technischen Systems','Du untersuchst Funktionen und Zusammenhänge, nicht die äußere Form.',true)}<p>Stell dir den Ablauf vor: Wasser gelangt über ein Ventil hinein. Waschmittel kommt hinzu. Die Heizung erwärmt das Wasser. Der Motor bewegt die Trommel. Zum Schluss pumpt die Maschine das Abwasser ab.</p>${note('Verarbeitung genauer betrachten','Überlege bei jeder Teilaufgabe, was sich verändert: die Bewegung, die Temperatur, der Ort eines Stoffes oder die Information im Steuergerät.')}`,
          fields('1a: Nenne mindestens drei wesentliche Teilsysteme und erkläre ihre Funktion.','1b: Welche Energie nimmt die Waschmaschine auf? In welche Energieformen wandelt sie diese um?','1c: Welche Stoffe gelangen hinein und welche hinaus? Beschreibe ihre Wege.','1d: Welche Sensoren sind sinnvoll? Was misst jeder Sensor und wie nutzt die Steuerung die Information?','1e: Was könnte sich bei einem intensiveren Waschprogramm ändern? Begründe die Änderungen.'),{
            hints:['Beginne mit Trommel, Motor, Heizung und Pumpe.','Ein Temperatursensor liefert eine Information. Er ist nicht selbst die Heizung.','Ein intensiveres Programm kann länger waschen, stärker bewegen oder eine geeignete höhere Temperatur nutzen. Die genaue Einstellung hängt vom Programm und den Textilien ab.'],
            solution:'<p><strong>1a:</strong> Trommel: enthält und bewegt Wäsche. Motor: treibt die Trommel an. Heizung: erwärmt Wasser. Ablaufpumpe: fördert Abwasser hinaus. Steuerung: koordiniert den Ablauf.</p><p><strong>1b:</strong> Elektrische Energie wird unter anderem in Bewegungsenergie und thermische Energie umgewandelt. <strong>1c:</strong> Wasser, Waschmittel und Wäsche kommen hinein; gereinigte Wäsche und Abwasser verlassen das System.</p><p><strong>1d:</strong> Ein Temperaturfühler meldet die Temperatur, ein Wasserstandssensor den Füllstand und ein Drehzahlsensor die Drehzahl. Die Elektronik nutzt diese Werte, um passende Aktionen auszulösen. <strong>1e:</strong> Beispielsweise längere Waschdauer oder angepasste Trommelbewegung; mehr Wasser oder höhere Temperatur sind keine zwingenden Merkmale jedes Intensivprogramms.</p>'
          }),
        step('steuerung','Steuerung und Regelung unterscheiden',`<p>Eine <strong>Steuerung</strong> führt einen vorgegebenen Ablauf aus. Beispiel: Der Arduino schaltet den Motor für drei Sekunden ein, ohne zu messen, ob der Ring seine Zielposition erreicht hat.</p><p>Eine <strong>Regelung</strong> misst eine Größe, vergleicht sie mit einem Zielwert und korrigiert Abweichungen. Beispiel: Die Waschmaschine misst die Wassertemperatur und schaltet die Heizung passend ein oder aus.</p>${note('Die Rückmeldung ist entscheidend','Eine Eingabe durch einen Taster macht aus einer Steuerung noch keine Regelung. Dafür braucht es eine Rückmeldung über die zu regelnde Größe.')}`,fields('Formuliere je ein Beispiel für eine Steuerung und eine Regelung an einer Maschine.'),{
          quiz:quiz('Ein Sensor misst ständig die Temperatur und die Elektronik hält das Wasser bei 40 °C. Was ist das?',['Eine Regelung mit Rückmeldung.','Eine Steuerung ohne Rückmeldung.','Ein reiner Stoffstrom.'],0,'Die gemessene Temperatur wird mit dem Zielwert verglichen. Bei Abweichung kann die Elektronik nachsteuern.')
        }),
        step('seifensystem','Die Maschine in acht Teilsysteme zerlegen',`<p>Übertrage deine Methode auf den Projektauftrag. Die Folien fassen die Maschine in <strong>acht Funktionsgruppen</strong> zusammen. Die beiden Motoren haben unterschiedliche Aufgaben, gehören hier aber zur Funktionsgruppe „Motoren“.</p>${table(['Funktionsgruppe','Frage an dich'],[['Batterie / Stromversorgung','Woher kommt die elektrische Energie?'],['Arduino','Wer koordiniert den Ablauf?'],['Motoren','Was treibt Luftschraube und Dispenser an?'],['Getriebe','Wie passt du Drehzahl und Bewegung an?'],['Luftschraube','Wie erzeugst du einen Luftstrom?'],['Behälter','Wo liegt die Seifenblasenlösung?'],['Dispenser / Ring','Wie entsteht und bewegt sich der Flüssigkeitsfilm?'],['Gehäuse mit Knopf','Was trägt, schützt und startet die Maschine?']])}<p>Zeichne die acht Gruppen als beschriftete Kästen auf Papier. Ordne sie nach ihrer Funktion und lasse Platz für Verbindungen.</p>`,fields('2.1: Beschreibe die Aufgabe jeder der acht Funktionsgruppen.','2.2: Zeichne dein Systembild auf Papier. Notiere hier mindestens fünf gerichtete und beschriftete Verbindungen.'),{
          hints:['Starte mit dem Tastendruck: Wer erhält diese Information zuerst?','Verfolge dann die Energie von der Stromversorgung zu den Motoren. Verfolge die Flüssigkeit vom Behälter zum Ring.'],
          solution:`${figure('system-uebersicht.png','Systembild der Seifenblasenmaschine mit Bauteilen und roten, blauen und grünen Verbindungen','Vereinfachtes Systembild aus den Folien. Eine geeignete Motoransteuerung zwischen Arduino und Motor behandelst du später.')}<p>Mögliche Verbindungen: Taster meldet Zustand an Arduino (Information). Arduino gibt Steuersignal an Motoransteuerung (Information). Stromversorgung versorgt Motoren (Energie). Motor überträgt Bewegung auf Getriebe und Dispenser (Energie). Behälter liefert Flüssigkeit an Ring (Stoff). Luftschraube erzeugt einen Luftstrom zum Film (Stoff und Energie).</p>`
        }),
        step('lernplan','Was musst du für das Projekt lernen?',`<p>Du kennst jetzt die Funktionen deiner Maschine. Daraus kannst du ableiten, welches Wissen du brauchst. Wenn der Arduino den Taster erkennen soll, musst du digitale Eingänge lesen können. Wenn der Dispenser langsam laufen soll, musst du Drehzahl und Getriebe verstehen.</p><p>Die Folien nennen <strong>Arduino-Programmierung, Taster auslesen, Motoransteuerung, Getriebe, Grundlagen der Seifenblasen und Statik</strong>. Statik hilft dir, eine stabile Konstruktion und gegebenenfalls eine erhöhte Startposition zu planen.</p>`,fields('Ordne jedem benötigten Thema eine konkrete Aufgabe in deiner Seifenblasenmaschine zu.'),{
          solution:`${figure('qualifizierung.png','Systemübersicht mit zugeordneten Lerninhalten Arduino, Taster, Motoren, Getriebe und Seifenblasen','Dein Lernbedarf ergibt sich aus den Funktionen der Maschine.')}<p>Beispiel: „Statik brauche ich, damit mein Turm trotz der Motorbewegung stabil bleibt.“ Ein höherer Start kann die Zeit bis zum Bodenkontakt verlängern. Die tatsächliche Schwebezeit hängt auch von Blase und Luftbewegung ab.</p>`
        })
      ]
    },
    {
      id:'arduino',number:'02',title:'Arduino wiederholen',subtitle:'Befehle wirklich verstehen',time:'ca. 60–90 Min.',source:'Arduino-Folien und Befehls-Arbeitsblatt',
      intro:'Du liest kleine Programme, erklärst ihre Wirkung und erinnerst dich an die Befehle, die du für Taster, LED und Motoren brauchst. Die Beispiele beziehen sich auf den Arduino Uno R3.',
      steps:[
        step('aufbau','Was macht der Arduino?',`<p>Der Arduino ist eine kleine programmierbare Steuerung. Er kann Informationen an <strong>Eingängen</strong> lesen und an <strong>Ausgängen</strong> Bauteile ansteuern. Dein Programm entscheidet, wie er auf eine Eingabe reagiert.</p><p><code>setup()</code> läuft einmal nach dem Einschalten oder Zurücksetzen. Hier bereitest du die Pins vor. <code>loop()</code> läuft danach immer wieder. Hier prüfst du Eingaben und veränderst Ausgaben.</p>${code('void setup() {\n  // Einmal vorbereiten\n}\n\nvoid loop() {\n  // Immer wieder ausführen\n}')}<p>Text nach <code>//</code> ist ein Kommentar. Er hilft Menschen beim Verstehen; der Arduino führt ihn nicht aus. Geschweifte Klammern begrenzen einen Anweisungsblock. Viele Befehle enden mit einem Semikolon.</p>`,fields('Warum steht pinMode normalerweise in setup, eine Tasterabfrage aber in loop?'),{
          quiz:quiz('Wie oft führt der Arduino setup nach einem einzelnen Neustart aus?',['Einmal.','Ständig.','Nur wenn der Taster gedrückt wird.'],0,'setup bereitet den Ablauf einmal vor. Danach wiederholt sich loop.'),
          solution:'<p>Die Richtung eines Pins bleibt normalerweise gleich und wird einmal vorbereitet. Ein Taster kann jederzeit gedrückt werden; deshalb prüfst du seinen Zustand wiederholt in loop.</p>'
        }),
        step('pins','Eingänge und Ausgänge',`<p>Mit <code>pinMode(pin, modus)</code> legst du fest, wie du einen Pin verwendest. Ein <strong>Ausgang</strong> gibt ein Signal aus. Ein <strong>Eingang</strong> liest ein Signal. Bei <code>INPUT_PULLUP</code> schaltet der Arduino zusätzlich einen internen Widerstand zu.</p>${table(['Befehl','Wirkung am Uno R3'],[['<code>pinMode(5, OUTPUT);</code>','Pin 5 als Ausgang vorbereiten.'],['<code>digitalWrite(5, HIGH);</code>','Ausgang auf HIGH setzen, hier ungefähr 5 V.'],['<code>digitalWrite(5, LOW);</code>','Ausgang auf LOW setzen, hier ungefähr 0 V.'],['<code>pinMode(2, INPUT_PULLUP);</code>','Pin 2 als Eingang mit internem Pullup vorbereiten.'],['<code>digitalRead(2);</code>','HIGH oder LOW an Pin 2 lesen.']])}${note('Signal und Bauteil unterscheiden','LOW bedeutet einen niedrigen Signalpegel. Ob ein Bauteil dadurch ausgeschaltet ist, hängt von der Schaltung ab. In unserer LED-Schaltung bedeutet LOW: aus.')}`,fields('Was musst du ändern, wenn die LED von Pin 5 an Pin 6 umgesteckt wird?'),{
          solution:'<p>Die Pinangabe muss an allen betreffenden Stellen stimmen. Besonders übersichtlich ist eine Konstante wie const int ledPin = 6; Dann beziehen sich pinMode und digitalWrite auf ledPin.</p>'
        }),
        step('variablen','Variablen und Bedingungen',`<p>Eine <strong>Variable</strong> speichert einen Wert. Bei der Lampe speichert sie zum Beispiel die Helligkeitsstufe. <code>int stufe = 0;</code> legt eine Variable für ganze Zahlen an und weist ihr den Anfangswert 0 zu.</p>${table(['Schreibweise','Bedeutung'],[['<code>int</code>','Ganze Zahl; beim Uno R3 begrenzter Wertebereich.'],['<code>long</code>','Ganze Zahl mit größerem Wertebereich.'],['<code>float</code>','Zahl mit Nachkommastellen, etwa 3.14.'],['<code>=</code>','Einen Wert zuweisen.'],['<code>==</code>','Zwei Werte auf Gleichheit vergleichen.'],['<code>+, -, *, /</code>','Addieren, subtrahieren, multiplizieren, dividieren.']])}${code('if (stufe == 0) {\n  // Anweisungen für Stufe 0\n} else if (stufe == 1) {\n  // Anweisungen für Stufe 1\n} else {\n  // Anweisungen für alle übrigen Fälle\n}')}<p><code>if</code> bedeutet „falls“. <code>else if</code> prüft eine weitere Bedingung, wenn die vorige falsch war. <code>else</code> erfasst die übrigen Fälle.</p>`,fields('Erkläre den Unterschied zwischen stufe = 1 und stufe == 1.','Welche Werte hat stufe nach diesen Zeilen? int stufe = 0; stufe = stufe + 1; stufe = stufe + 1;'),{
          quiz:quiz('Welcher Ausdruck prüft, ob der Taster LOW meldet?',['zustand = LOW','zustand == LOW','zustand + LOW'],1,'== vergleicht zwei Werte. = weist der Variablen einen Wert zu.'),
          solution:'<p>stufe = 1 speichert den Wert 1. stufe == 1 prüft, ob der gespeicherte Wert 1 ist. In der zweiten Aufgabe ist die Reihenfolge 0, dann 1, dann 2.</p>'
        }),
        step('zeit-schleifen','Wiederholung, Zeit und Zufall',`<p><code>delay(1000)</code> wartet 1000 Millisekunden, also eine Sekunde. Währenddessen arbeitet das Programm seine nächsten normalen Anweisungen nicht ab. Eine <code>for</code>-Schleife eignet sich für eine bekannte Anzahl Wiederholungen. Eine <code>while</code>-Schleife läuft, solange ihre Bedingung wahr ist.</p>${code('for (int i = 0; i < 3; i++) {\n  Serial.println(i);\n}\n\nwhile (digitalRead(2) == LOW) {\n  // Wird wiederholt, solange der Taster gedrückt ist.\n}')}<p><code>Serial.begin(9600)</code> startet die serielle Kommunikation. <code>Serial.print(...)</code> gibt Text oder Zahlen aus; <code>Serial.println(...)</code> setzt anschließend einen Zeilenumbruch. Stelle im seriellen Monitor ebenfalls 9600 Baud ein.</p><p><code>random(10, 20)</code> liefert eine ganze Zufallszahl von 10 bis 19. Die obere Grenze ist ausgeschlossen. <code>randomSeed(analogRead(A0))</code> setzt einen Startwert für den Zufallsgenerator; dafür kann ein unbeschalteter Analogeingang wechselnde Messwerte liefern.</p>`,fields('Welche drei Zahlen gibt die for-Schleife aus?','Wie viele Sekunden sind delay(10), delay(200) und delay(3000)?','Welche Werte kann random(10, 20) liefern?'),{
          hints:['i beginnt bei 0. Der Block wird nur ausgeführt, wenn i kleiner als 3 ist.','1000 Millisekunden ergeben eine Sekunde.'],
          solution:'<p>Die for-Schleife gibt 0, 1 und 2 aus. Die Wartezeiten sind 0,01 s, 0,2 s und 3 s. random(10, 20) kann 10, 11, …, 19 liefern.</p>'
        }),
        step('befehle','Deine Befehlsübersicht ausfüllen',`<p>Bearbeite die Tabelle aus dem Wiederholungs-Arbeitsblatt. Versuche zunächst, die Lücken aus dem Gedächtnis zu ergänzen. Du kannst die vorigen Schritte nachlesen. Öffne den Vergleich erst nach deinem eigenen Versuch.</p><p>Bei einer fehlenden Erklärung genügt ein verständlicher Satz. Bei einem fehlenden Befehl müssen Schreibweise, Klammern und gegebenenfalls Semikolon stimmen.</p><a class="inline-link" href="material/Arduino_Befehle.pdf" target="_blank" rel="noopener">Arbeitsblatt ohne Lösung als PDF öffnen</a>`,[],{
          widget:'commands',
          hints:['Sortiere nach Gruppen: Programmaufbau, Pins, Variablen, Bedingungen, Schleifen und serielle Ausgabe.']
        }),
        step('blinken','Ein Programm Zeile für Zeile lesen',`<p>Bevor du etwas hochlädst, sagst du voraus, was passieren wird. Lies von oben nach unten und beachte, wann loop wieder von vorn beginnt.</p>${code(CODES.blink)}<p>Wenn du das praktisch testen willst, nutze die LED mit Vorwiderstand aus dem nächsten Kapitel. Wähle in der Arduino IDE das passende Board und den richtigen Anschluss. Prüfe zuerst das Programm und lade es dann hoch.</p>`,fields('Beschreibe genau, was die LED tut. Wie lange dauert ein vollständiger Durchlauf von loop?','Ändere das Programm auf Papier oder in der IDE so, dass die LED 0,2 s leuchtet und 0,8 s ausgeschaltet bleibt.'),{
          hints:['HIGH schaltet unsere LED ein. Jedes delay ist eine eigene Wartezeit.'],
          solution:`<p>Die LED leuchtet eine Sekunde und bleibt eine Sekunde aus. Ein Durchlauf dauert ungefähr zwei Sekunden. Für die Änderung setzt du die erste Wartezeit auf 200 und die zweite auf 800 Millisekunden.</p><a href="code/blink.ino" download>Beispielprogramm herunterladen</a>`
        })
      ]
    },
    {
      id:'lampe',number:'03',title:'Schreibtischlampe',subtitle:'Taster, Helligkeit und PWM',time:'ca. 90–135 Min.',source:'Arduino-Folien 10/11 und Arbeitsblatt Schreibtischlampe',
      intro:'Du baust eine LED-Lampe mit den drei Zuständen aus, hell und sehr hell. Jeder Tastendruck wechselt genau eine Stufe weiter.',
      steps:[
        step('schaltung','Die Lampe anschließen',`<p>Lege Arduino Uno R3, Steckbrett, LED, einen geeigneten Vorwiderstand, Taster und Leitungen bereit. Eine LED darf in dieser Schaltung <strong>nicht ohne Vorwiderstand</strong> betrieben werden. Für eine übliche kleine LED am Uno ist beispielsweise 330 Ω häufig passend; nutze den von der Lehrkraft für eure LED vorgesehenen Widerstand.</p>${table(['Verbindung','Warum?'],[['Pin 5 → Vorwiderstand → LED-Anode','Pin 5 ist PWM-fähig; der Widerstand begrenzt den Strom.'],['LED-Kathode → GND','GND ist der gemeinsame Bezug und Rückweg. Die Kathode liegt meist am kürzeren Bein und an der abgeflachten Gehäuseseite.'],['Pin 2 → Taster → GND','Der Taster zieht den Eingang beim Drücken auf LOW.'],['<code>pinMode(2, INPUT_PULLUP);</code>','Ohne Tastendruck hält der interne Pullup den Eingang auf HIGH.']])}<p>Beim vierbeinigen Taster sind jeweils zwei Beine intern verbunden. Nutze Kontakte, die <em>erst beim Drücken</em> verbunden werden; die Pinbelegung eures Tasters hilft dir dabei. Trenne die Stromversorgung, bevor du umsteckst.</p>${note('Unsere Pinwahl','Wir verwenden die LED von Anfang an an Pin 5. Dadurch kannst du später einen Servo ergänzen, ohne die LED wegen eines Timerkonflikts an Pin 9 oder 10 umstecken zu müssen.')}`,fields('Zeichne den Stromweg der LED und die Tasterverbindung auf Papier. Beschreibe deine Pinbelegung.'),{
          hints:['Die LED braucht einen geschlossenen Stromweg vom Ausgang über Widerstand und LED nach GND.','Ein LED-Bein und beide Widerstandsbeine dürfen nicht versehentlich in derselben verbundenen Steckbrettreihe liegen.'],
          quiz:quiz('Was meldet der Eingang bei INPUT_PULLUP und einem Taster nach GND, wenn du drückst?',['HIGH','LOW','Immer 128'],1,'Beim Drücken verbindet der Taster den Eingang mit GND. Deshalb wird LOW gelesen.')
        }),
        step('taster','Den Taster zuerst allein testen',`<p>Teste zunächst nur eine Teilfunktion. Sonst weißt du bei einem Fehler kaum, ob Taster, LED oder Programm die Ursache sind.</p>${code(CODES.button)}<ol><li>Lade das Programm hoch.</li><li>Öffne den seriellen Monitor mit 9600 Baud.</li><li>Drücke den Taster und lasse ihn los.</li><li>Vergleiche die angezeigten Zahlen mit deiner Vorhersage.</li></ol><p>Beim Uno wird HIGH als 1 und LOW als 0 ausgegeben. Ein Taster nach GND mit INPUT_PULLUP zeigt ungedrückt 1 und gedrückt 0.</p>`,fields('Notiere die Anzeigen bei „nicht gedrückt“ und „gedrückt“.','Wenn der Wert nie wechselt: Welche drei Dinge prüfst du zuerst?'),{
          widget:'button',
          hints:['Prüfe richtigen Pin, GND-Verbindung und die beiden tatsächlich schaltenden Kontakte.'],
          solution:`<p>Nicht gedrückt: 1. Gedrückt: 0. Prüfe die Pinzahl im Programm, den Kontakt nach GND und die Lage des Tasters auf dem Steckbrett. Prüfe anschließend Board, Anschluss und Upload.</p><a href="code/button.ino" download>Testprogramm herunterladen</a>`
        }),
        step('pwm','Wie dimmt der Arduino eine LED?',`<p><code>digitalWrite</code> kennt nur HIGH und LOW. <code>analogWrite(pin, wert)</code> kann auf einem PWM-fähigen Pin die Einschaltzeit verändern. Beim Uno R3 sind die Werte normalerweise <strong>0 bis 255</strong> möglich.</p><p><strong>Pulsweitenmodulation (PWM)</strong> bedeutet: Der Ausgang schaltet sehr schnell zwischen ein und aus. Bei einem kleinen Wert ist die LED pro Zeitabschnitt kurz an. Bei einem großen Wert ist sie länger an. Unser Auge nimmt diese schnelle Folge als unterschiedliche Helligkeit wahr.</p>${note('Was am Pin wirklich passiert','Bei PWM liegen hier abwechselnd ungefähr 0 V und 5 V an. 128 bedeutet etwa 50 % Einschaltzeit; es ist keine dauerhaft ausgegebene Spannung von 2,5 V. Wahrgenommene Helligkeit und Einschaltanteil sind außerdem nicht exakt proportional.')}`,fields('Erkläre PWM in eigenen Worten.','Was unterscheidet analogWrite(5, 0), analogWrite(5, 128) und analogWrite(5, 255)?'),{
          widget:'pwm',
          hints:['Beschreibe, wie lange der Pin innerhalb einer Periode HIGH ist.'],
          solution:`${figure('pwm-original.jpg','PWM-Zeitdiagramme mit zunehmender Einschaltzeit von 0 bis 100 Prozent','Das PWM-Diagramm aus deinen Folien. Der Simulator zeigt dasselbe Prinzip.')}<p>0: aus. 128: ungefähr die halbe Zeit eingeschaltet. 255: dauerhaft eingeschaltet. Auf dem Uno R3 tragen die PWM-Pins 3, 5, 6, 9, 10 und 11 ein Tildezeichen.</p>`
        }),
        step('zustaende','Drei Zustände planen',`<p>Speichere den Zustand in einer Variablen <code>stufe</code>. Du kannst die Stufen 0, 1 und 2 verwenden. Lege zuerst eine Tabelle an, bevor du Bedingungen programmierst.</p>${table(['Stufe','Anzeige','PWM-Wert'],[['0','aus','0'],['1','hell','128'],['2','sehr hell','255']])}<p>Nach Stufe 2 soll der nächste Tastendruck wieder zu Stufe 0 führen. Ein gehalten gedrückter Taster soll die Stufe nicht ständig weiterzählen. Du willst den <strong>neuen Tastendruck</strong> erkennen.</p>`,fields('Welche Stufen entstehen bei fünf Tastendrücken, wenn die Lampe mit Stufe 0 startet?','Schreibe den Ablauf in Alltagssprache: Taster lesen, neuen Druck erkennen, Stufe ändern, Helligkeit ausgeben.'),{
          widget:'lamp',
          quiz:quiz('Die Stufe ist 2. Was soll nach dem nächsten Tastendruck gespeichert werden?',['3','0','255'],1,'Die drei gültigen Stufen sind 0, 1 und 2. Danach beginnt der Zyklus wieder bei 0.'),
          solution:'<p>Die Reihenfolge lautet 1, 2, 0, 1, 2. Du erhöhst die Stufe um 1 und setzt sie wieder auf 0, sobald sie größer als 2 ist. Anschließend gibst du den PWM-Wert der aktuellen Stufe aus.</p>'
        }),
        step('programm','Dein Lampenprogramm entwickeln',`<p>Baue das Programm in kleinen Schritten. Prüfe nach jedem Schritt, ob die erwartete Wirkung eintritt.</p><ol><li>Lege die Konstanten für LED-Pin 5 und Taster-Pin 2 an.</li><li>Bereite die Pins in setup vor.</li><li>Lass die LED zunächst fest mit PWM-Wert 128 leuchten.</li><li>Lege die Variable stufe mit dem Anfangswert 0 an.</li><li>Ordne mit if / else if / else die PWM-Werte zu.</li><li>Ergänze den Zustandswechsel bei einem neuen Tastendruck.</li></ol>${code('const int ledPin = 5;\nconst int tasterPin = 2;\nint stufe = 0;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n  pinMode(tasterPin, INPUT_PULLUP);\n}\n\nvoid loop() {\n  // 1. Taster lesen\n  // 2. Neuen Tastendruck erkennen\n  // 3. Stufe weiterzählen\n  // 4. Passenden PWM-Wert ausgeben\n}')}`,[{key:'code',label:'Dein Programm oder der Teil, an dem du gerade arbeitest:',type:'code'}],{
          hints:['Für einen ersten Test kannst du nur die Helligkeitsausgabe programmieren und stufe von Hand ändern.','Speichere zusätzlich den vorherigen Tasterzustand. Ein Wechsel von HIGH zu LOW ist ein neuer Tastendruck.','Mechanische Taster können kurz mehrfach schalten. Dafür brauchst du im nächsten Schritt eine Entprellung.'],
          solution:'<p>Die vollständige Vergleichslösung folgt im nächsten Schritt. Kontrolliere zuerst, ob deine Pinvorbereitung und die Zuordnung von Stufe zu PWM-Wert stimmen. Es ist normal, zunächst nur eine Teilfunktion zu testen.</p>'
        }),
        step('entprellen','Ein Druck soll genau einmal zählen',`<p>Ein echter Taster schließt oft nicht sofort sauber. Seine Kontakte können wenige Millisekunden zwischen HIGH und LOW wechseln. Das heißt <strong>Prellen</strong>. Dein Programm könnte dadurch mehrere Tastendrücke zählen.</p><p>Die Vergleichslösung übernimmt einen neuen Zustand erst, wenn der gelesene Wert 30 ms lang stabil geblieben ist. <code>millis()</code> gibt die vergangene Zeit seit dem Start in Millisekunden an. Mit <code>millis() - letzteAenderung</code> berechnest du die Wartezeit, während loop weiterläuft.</p>${table(['Variable','Aufgabe'],[['letzterRohwert','Der Wert aus dem vorigen loop-Durchlauf.'],['stabilerZustand','Der zuletzt bestätigte Zustand.'],['letzteAenderung','Zeitpunkt des letzten elektrischen Wechsels.'],['stufe','Der gespeicherte Lampenzustand.']])}<p>Teste kurz drücken, lange gedrückt halten und dreimal getrennt drücken. Notiere zuerst, was du jeweils erwartest.</p>`,fields('Was muss bei einem langen Tastendruck passieren?','Beschreibe dein Testergebnis. Was hast du bei einem Fehler geändert?'),{
          hints:['Eine neue Stufe entsteht beim bestätigten Wechsel auf LOW. Ein dauerhaftes LOW ist kein neuer Wechsel.'],
          solution:`${code(CODES.lamp)}<p>Die Zeitvariablen sind unsigned long, weil millis eine nichtnegative, große Millisekundenzahl liefert. Das Programm braucht kein langes delay und kann später weitere Aufgaben in loop erledigen.</p><a href="code/lamp.ino" download>Vollständige Vergleichslösung herunterladen</a>`
        })
      ]
    },
    {
      id:'servo',number:'04',title:'Servomotoren',subtitle:'Positionen gezielt ansteuern',time:'ca. 90 Min.',source:'Arduino-Folien 12/13 und Arbeitsblatt Servomotor',
      intro:'Du untersuchst einen Positionsservo, steuerst Winkel an und ergänzt deine Lampe um eine mechanische Helligkeitsanzeige.',
      steps:[
        step('motor','Was unterscheidet einen Servo?',`<p>Ein gewöhnlicher <strong>DC-Motor</strong> dreht sich bei geeigneter Versorgung fortlaufend. Ein <strong>Positionsservo</strong> fährt dagegen eine vorgegebene Winkelstellung an und versucht, diese zu halten. Im SG90 arbeiten ein Motor, ein Getriebe und eine Elektronik zusammen.</p>${figure('servo-bauteil.png','Ein kleiner blauer Servo mit Anschlussleitung, Achse und Aufsätzen','Bauteilübersicht aus der PWM-Folie. Kabel- und Anschlussfarben hängen vom konkreten Modell ab.')}<p>Der Servo misst seine Position intern und korrigiert Abweichungen. Das ist eine <strong>Regelung</strong>. Der hier behandelte SG90 ist ein Positionsservo mit ungefähr 180° Stellbereich; ein Servo für endlose Rotation arbeitet anders.</p>${note('Sorgfältig mit dem Bauteil umgehen','Drehe die Achse nicht mit Gewalt von Hand und halte sie nicht fest, während der Servo arbeitet. Das Getriebe kann beschädigt werden. Prüfe Bewegungen zuerst ohne Last und beginne mit kleinen Winkelschritten.',true)}`,fields('Erkläre, warum der SG90 eine Regelung enthält.','Welcher Motortyp passt besser zu einer Luftschraube, welcher zu einem Zeiger? Begründe.'),{
          solution:'<p>Ein Sensor misst im Servo die Position. Die Elektronik vergleicht Istposition und Zielposition und bewegt den Motor bei einer Abweichung nach. Ein DC-Motor passt zu einer dauerhaft rotierenden Luftschraube. Ein Positionsservo passt zu einem Zeiger, der bestimmte Winkel anzeigen soll.</p>'
        }),
        step('pins','Versorgung und Signal unterscheiden',`<p>Der Servo hat drei Anschlüsse: Versorgung, GND und Signal. Die Energie kommt aus einer <strong>geeigneten Versorgung</strong>; die Signalleitung sagt dem Servo, welche Stellung er anfahren soll. Sie liefert nicht den Motorstrom.</p>${table(['Anschluss','Verbindung'],[['Versorgung, meist rot','Geeignete 5-V-Versorgung für den verwendeten SG90. Spannung und Strombedarf prüfen.'],['GND, meist braun oder schwarz','GND der Versorgung und GND des Arduino verbinden.'],['Signal, meist orange, gelb oder weiß','Digitaler Arduino-Pin, zum Beispiel Pin 10 oder Pin 8.']])}<p>Nutze die im Unterricht vorgesehene Versorgung; für Motorversuche ist eine geeignete separate Versorgung sinnvoll. Ein kräftiger Servo oder mehrere Servos dürfen nicht einfach aus dem Arduino-Pin versorgt werden. Ein Servo benötigt normalerweise keinen zusätzlichen DC-Motortreiber, weil seine Ansteuerungselektronik schon eingebaut ist.</p>${note('Aufgabe aus dem Arbeitsblatt: Pin 10 oder Pin 8?','Beim Uno R3 ist Pin 10 PWM-fähig, Pin 8 nicht. Die Servo-Bibliothek erzeugt ihre Steuerimpulse selbst. Deshalb kannst du das Servosignal an beiden Pins ausgeben. Wenn die Bibliothek einen Servo ansteuert, steht analogWrite-PWM am Uno R3 an Pin 9 und 10 nicht mehr zur Verfügung. Unsere LED bleibt an Pin 5.')}`,fields('Beantworte die Pin-Aufgabe: Was unterscheidet 10 und 8? Warum funktionieren beide für das Servosignal?'),{
          quiz:quiz('Woher bekommt ein Servo seine elektrische Energie?',['Aus dem Signalkabel allein.','Über seinen Versorgungsanschluss und GND.','Aus der Gradzahl im Programm.'],1,'Die Signalleitung steuert die Position. Der Motorstrom fließt über Versorgung und GND.'),
          hints:['Unterscheide analogWrite für LED-PWM und die Impulserzeugung durch die Servo-Bibliothek.'],
          solution:'<p>Pin 10 besitzt hardwareseitige PWM für analogWrite, Pin 8 nicht. Servo.attach kann trotzdem beide digitalen Pins nutzen. Entscheidend ist, dass die Zahl in attach zur tatsächlichen Signalleitung passt.</p>'
        }),
        step('bibliothek','Eine Bibliothek erleichtert die Arbeit',`<p>Eine <strong>Bibliothek</strong> enthält fertige Programmbausteine. Du musst dadurch die genauen Zeitimpulse des Servos nicht selbst erzeugen.</p>${code('#include <Servo.h>\nServo servoblau;\n\nvoid setup() {\n  servoblau.attach(10);\n  servoblau.write(90);\n}\n\nvoid loop() {\n}')}${table(['Zeile','Bedeutung'],[['<code>#include &lt;Servo.h&gt;</code>','Macht die Servo-Bibliothek verfügbar. Fehlt sie, installiere „Servo“ über den Bibliotheksverwalter.'],['<code>Servo servoblau;</code>','Erstellt ein Servo-Objekt mit dem Namen servoblau.'],['<code>servoblau.attach(10);</code>','Ordnet dem Objekt die Signalleitung an Pin 10 zu.'],['<code>servoblau.write(90);</code>','Fordert beim Positionsservo eine Stellung von ungefähr 90° an.']])}<p>Prüfe vor dem Einschalten Anschlussbelegung und freie Bewegung. Teste zunächst 90°, dann beispielsweise 70° und 110°. Fährt dein Modell an einen Anschlag, wähle einen kleineren Stellbereich.</p>`,fields('Erkläre jede der vier wichtigen Zeilen ohne sie nur zu übersetzen.','Welche Zeile änderst du, wenn das Signalkabel an Pin 8 liegt?'),{
          solution:'<p>Du änderst servoblau.attach(10); in servoblau.attach(8);. write(90) legt die Zielposition fest, attach dagegen die Verbindung zum Arduino-Pin.</p>'
        }),
        step('folge','Die Winkelreihenfolge testen',`<p>Im Arbeitsblatt fährt der Servo die Stellungen <strong>0°, 90°, 180° und 20°</strong> an. Zwischen den Stellungen wartet das Programm jeweils drei Sekunden. Schreibe das Programm ab und erkläre zuerst die erwartete Bewegung.</p><p>Führe den vollen Bereich nur aus, wenn euer Modell die Endstellungen ohne Anschlag erreicht. Nutze sonst einen kleineren Bereich, etwa 40° bis 140°, und dokumentiere die Änderung.</p>${code(CODES.servo)}`,fields('Welche Positionen fährt der Servo an? Wie lange dauert ein kompletter loop-Durchlauf ungefähr?','Teste eine eigene Winkelreihenfolge und notiere Codeänderung und Beobachtung.'),{
          hints:['Es gibt vier Wartezeiten mit jeweils 3000 ms. Die Bewegung erfolgt während dieser Pausen.'],
          solution:'<p>Die Reihenfolge ist 0°, 90°, 180°, 20°, danach wieder 0°. Vier Pausen ergeben ungefähr 12 s pro loop-Durchlauf. Die angegebene Gradzahl ist ein Sollwert; die tatsächliche Stellung hängt vom Servo ab.</p><p><a href="code/servo.ino" download>Programm aus dem Arbeitsblatt herunterladen</a></p>'
        }),
        step('anzeige','Deine Lampe bekommt einen Zeiger',`<p>Jetzt bearbeitest du die Erweiterung aus Folie 13. Ergänze deine Lampenschaltung um einen Servo. Der Zeiger soll die aktuelle Helligkeitsstufe sichtbar machen.</p>${table(['Lampenstufe','LED-PWM','Beispielwinkel'],[['aus','0','40°'],['hell','128','90°'],['sehr hell','255','140°']])}<ol><li>Zeichne eine beschriftete Skala mit drei Bereichen.</li><li>Schließe das Servosignal an Pin 8 an; nutze eine geeignete Versorgung mit gemeinsamem GND.</li><li>Ergänze Bibliothek, Servo-Objekt und attach.</li><li>Ergänze in jedem Lampenzustand die passende write-Anweisung.</li><li>Teste jeden Zustand und einen langen Tastendruck.</li></ol><p>Die Winkel sind ein sinnvoller Beispielbereich. Du darfst sie an deine Skala und deinen Servo anpassen.</p>`,fields('Plane deine drei Winkel und begründe sie.','Dokumentiere deinen Test: Stimmen LED und Zeiger in allen drei Zuständen überein?'),{
          widget:'servo',
          hints:['Nutze dieselbe Variable stufe für LED und Servo. Zwei getrennte Zustandsvariablen könnten auseinanderlaufen.','Pin 5 bleibt LED-Ausgang. Pin 8 wird in anzeige.attach(8) dem Servo zugeordnet.'],
          solution:`${code(CODES.servoLamp)}<p>Hier hängen Licht und Zeiger immer von derselben stufe ab. So zeigen beide Teile denselben Zustand.</p><a href="code/servo-lamp.ino" download>Vergleichslösung für Lampe mit Zeiger herunterladen</a>`
        })
      ]
    },
    {
      id:'antrieb',number:'05',title:'Motor und Getriebe',subtitle:'Antrieb für deine Maschine',time:'ca. 60–90 Min.',source:'Qualifizierungsbedarf aus den Folien; ergänzende Grundlagen',
      intro:'Für die Seifenblasenmaschine brauchst du Luftbewegung und eine Bewegung des Dispensers. Du unterscheidest ihre Anforderungen und planst passende Antriebe.',
      steps:[
        step('anforderung','Welche Bewegung braucht welcher Teil?',`<p>Die Luftschraube soll Luft am Seifenfilm vorbeibewegen. Der Dispenser soll einen Ring benetzen und in eine passende Position bringen. Beide Aufgaben brauchen nicht automatisch dieselbe Drehzahl.</p><p>Ein schnell laufender Motor kann für den Dispenser zu schnell sein. Ein Getriebe überträgt Bewegung und kann Drehzahl sowie Drehmoment verändern. Das <strong>Drehmoment</strong> beschreibt die Drehwirkung einer Kraft um eine Achse.</p>`,fields('Beschreibe die gewünschte Bewegung der Luftschraube und des Dispensers.','Welche Bewegung muss besonders gut dosiert werden? Begründe.'),{
          solution:'<p>Die Luftschraube benötigt eine geeignete kontinuierliche Drehung, um den Luftstrom zu erzeugen. Der Dispenser muss kontrolliert benetzen und positionieren; je nach Konstruktion dreht er langsam oder bewegt sich zwischen festen Positionen. Die beste Lösung hängt von eurem Aufbau ab.</p>'
        }),
        step('transistor','Warum braucht ein DC-Motor eine Ansteuerung?',`<p>Ein Arduino-Ausgang ist für Signale und kleine Ströme gedacht. Ein DC-Motor braucht gewöhnlich mehr Strom. Deshalb schaltet eine geeignete <strong>Transistorstufe oder ein Motortreiber</strong> die Energie einer passenden Motorversorgung. Der Arduino liefert das Steuersignal.</p><div class="flow-grid"><div class="flow-column"><h4>Arduino</h4><p>Gibt das Steuersignal aus.</p></div><div class="flow-column"><h4>Motoransteuerung</h4><p>Schaltet den Strom aus der Motorversorgung.</p></div><div class="flow-column"><h4>DC-Motor</h4><p>Wandelt elektrische Energie in Bewegung um.</p></div></div><p>Eine <strong>Freilaufdiode</strong> kann in einer geeigneten Transistorschaltung Spannungsspitzen beim Abschalten des Motors abfangen. Bei vielen Treibern ist die Schutzfunktion schon vorgesehen. Ob und wie sie angeschlossen wird, hängt von eurer Schaltung ab.</p>${note('Vor dem praktischen Anschluss','Verwende den Schaltplan und die Bauteile, die für euren Motor freigegeben sind. Prüfe Versorgungsspannung, Strombedarf, Anschlusspins und gemeinsamen GND. Schließe einen DC-Motor nicht direkt an einen Arduino-Signalpin an. Ein Positionsservo besitzt seine Ansteuerungselektronik bereits im Gehäuse.',true)}`,fields('Erkläre, warum Steuersignal und Motorversorgung unterschiedliche Aufgaben haben.','Ergänze dein Systembild: Wo gehört die Motoransteuerung hin?'),{
          quiz:quiz('Welche Verbindung ist für einen typischen DC-Motor sinnvoll?',['Arduino-Signalpin direkt an den Motor.','Arduino-Signal an geeigneten Treiber; Treiber schaltet die passende Motorversorgung.','Motorversorgung an einen beliebigen Eingangspin.'],1,'Der Treiber übernimmt das Schalten des Motorstroms. Der Arduino steuert ihn mit einem Signal.'),
          solution:'<p>Der Arduino entscheidet, wann und wie der Motor laufen soll. Die geeignete Versorgung liefert seine elektrische Energie. Dazwischen sitzt die Motoransteuerung. Im Systembild ist das Arduino-Signal ein Informationsstrom; die Versorgung des Motors ist ein Energiestrom.</p>'
        }),
        step('uebersetzung','Ein Zahnradgetriebe verstehen',`<p>Bei zwei ineinandergreifenden Zahnrädern treibt ein Zahnrad das andere an. Hat das angetriebene Rad mehr Zähne, braucht es länger für eine Umdrehung. Seine Drehzahl sinkt. Bei einem idealen Getriebe nimmt dabei das Drehmoment zu; in einem echten Getriebe gibt es Verluste.</p><div class="formula">n<sub>aus</sub> = n<sub>ein</sub> · z<sub>ein</sub> / z<sub>aus</sub></div><p><strong>n</strong> steht für Drehzahl, zum Beispiel Umdrehungen pro Minute. <strong>z</strong> ist die Anzahl der Zähne. Beispiel: Ein 10-Zähne-Rad treibt ein 30-Zähne-Rad an. Das zweite dreht sich mit einem Drittel der Drehzahl. Zwei direkt ineinandergreifende Räder drehen in entgegengesetzte Richtungen.</p>`,fields('Ein Motor dreht mit 120 U/min. Das antreibende Rad hat 10, das angetriebene 40 Zähne. Berechne die Ausgangsdrehzahl.','Warum kann eine kleinere Drehzahl für den Dispenser hilfreich sein?'),{
          widget:'gear',
          hints:['Setze ein: 120 · 10 / 40.','Eine langsamere Bewegung lässt mehr Zeit für Benetzen und Positionieren.'],
          solution:'<p>n_aus = 120 · 10 / 40 = 30 U/min. Eine Umdrehung dauert dann 60 / 30 = 2 s. Das Beispiel sagt noch nicht, welche Drehzahl für eure Maschine optimal ist; das musst du am Aufbau prüfen.</p>'
        }),
        step('test','Den Antrieb in kleinen Schritten testen',`<p>Teste zuerst eine Bewegung allein. Notiere vor dem Versuch die erwartete Wirkung. Erst wenn sie zuverlässig funktioniert, verbindest du sie mit dem übrigen System.</p><ol><li>Lege die gewünschte Bewegung und ihre Dauer fest.</li><li>Prüfe die freigegebene Schaltung und die freie Bewegung.</li><li>Teste kurz ohne Last, dann mit der vorgesehenen Last.</li><li>Beobachte Richtung, Geschwindigkeit und Funktion.</li><li>Ändere jeweils nur eine Einstellung und vergleiche.</li></ol>${note('Luftschraube','Halte Hände, Haare und lose Gegenstände vom drehenden Propeller fern. Nutze die im Unterricht vorgesehene Befestigung und Abdeckung. Trenne die Versorgung, bevor du eine mechanische Verbindung änderst.',true)}`,fields('Unser Antriebstest: Aufbau, Einstellung und erwartete Bewegung.','Unsere Beobachtung und nächste gezielte Änderung.'),{
          solution:'<p>Ein aussagekräftiger Testeintrag nennt zum Beispiel die Zahnräder, die gemessene Zeit für eine Umdrehung und das Verhalten des benetzten Rings. „Läuft“ reicht nicht, um später zwei Varianten zu vergleichen.</p>'
        })
      ]
    },
    {
      id:'statik',number:'06',title:'Statik',subtitle:'Stabil konstruieren und auswerten',time:'mehrere Arbeitsphasen',source:'Arbeitsblatt Statik – Bauteile unter Belastung',
      intro:'Du erkennst Belastungen, wertest die Messreihen aus deinem Arbeitsblatt aus und entwickelst Regeln für eine stabile Konstruktion.',
      steps:[
        step('lasten','Vier Belastungsarten erkennen',`<p><strong>Statik</strong> hilft dir, Bauteile unter Belastung zu verstehen. Kräfte können einen Körper zusammendrücken, auseinanderziehen, gegeneinander verschieben oder durchbiegen.</p><div class="figure-grid">${figure('druck.png','Körper wird von oben und unten zusammengedrückt','Skizze 1')}${figure('zug.png','Körper wird nach oben und unten auseinandergezogen','Skizze 2')}${figure('schub.png','Gegengerichtete seitliche Kräfte verschieben einen Körper','Skizze 3')}${figure('biegung.png','Ein Balken wird in der Mitte nach unten belastet','Skizze 4')}</div>${table(['Begriff','Wirkung'],[['Druck','Stauchung: Der Körper wird zusammengedrückt.'],['Zug','Dehnung: Der Körper wird auseinandergezogen.'],['Schub','Scherung: Teile verschieben sich gegeneinander.'],['Biegung','Das Bauteil krümmt sich.']])}`,fields('Aufgabe 1a: Ordne den Skizzen 1 bis 4 die Belastungsart und Wirkung zu.'),{
          quiz:quiz('Ein gespanntes Seil trägt einen hängenden Behälter. Welche Belastung nimmt es hauptsächlich auf?',['Druck','Zug','Nur Biegung'],1,'Das hängende Gewicht zieht am Seil. Ein Seil kann Zug aufnehmen, aber keine tragende Druckkraft.'),
          solution:'<p>1: Druck und Stauchung. 2: Zug und Dehnung. 3: Schub und Scherung. 4: Biegung und Durchbiegung.</p>'
        }),
        step('schaukel','Belastungen an einer Schaukel',`<p>In einer echten Konstruktion treten oft mehrere Belastungen gleichzeitig auf. Für deine erste Analyse suchst du die wesentliche Belastung des jeweiligen Bauteils.</p>${figure('schaukel.jpeg','Schaukel mit tragenden Pfosten, oberem Balken, Seilen und Sitzflächen','Welche Aufgabe hat jedes Bauteil?')}<p>Gehe nacheinander Ketten oder Seile, Pfosten, oberen Balken, Sitzfläche und das gesamte Gerüst durch. Stelle dir die Gewichtskraft der sitzenden Person nach unten vor.</p>`,fields('Aufgabe 1b: Ordne allen fünf Teilen eine wesentliche Belastung zu und begründe sie.'),{
          hints:['Ein Seil wird durch die Last gespannt. Pfosten tragen die Last zum Boden.','Ein Balken zwischen zwei Stützen kann sich unter einer Last durchbiegen. Das ganze Gerüst kann seitlich verschoben werden.'],
          solution:'<p>Seile: Zug. Pfosten: überwiegend Druck. Oberer Balken: Biegung. Sitzfläche: Biegung. Seitlich belastetes Gerüst: Schub beziehungsweise Verformung des Rahmens. Bei Bewegung können zusätzliche und wechselnde Belastungen auftreten.</p>'
        }),
        step('zug-laenge','Messreihe A: Spielt die Seillänge eine Rolle?',`<p>Im Versuch hängt eine belastete Flasche an einem dünnen Faden. Du untersuchst, bei welcher Kraft der Faden reißt. Bei dieser Messreihe wird die <strong>Länge</strong> verändert; Material und Dicke sollen gleich bleiben.</p><p>Ein <strong>Mittelwert</strong> fasst mehrere Messungen zusammen. Addiere die drei Kräfte und teile durch drei. Beispiel aus der ersten Zeile: (7,18 + 9,50 + 6,99) / 3.</p><div class="formula">Mittelwert = (Messwert 1 + Messwert 2 + Messwert 3) / 3</div><p>Trage die Mittelwerte auf zwei Nachkommastellen ein. Zeichne danach selbst ein Diagramm auf Papier: Länge in cm auf die x-Achse, mittlere Reißkraft in N auf die y-Achse. Nutze einzelne Messpunkte und eine geeignete Ausgleichslinie.</p>`,fields('Aufgabe 2a: Beschreibe dein Diagramm. Ist eine klare Abhängigkeit von der Seillänge erkennbar?','Aufgabe 2c: Wie würde ein stabileres Material das Diagramm verändern?'),{
          widget:'means-length',
          hints:['Die Mittelwerte liegen alle ungefähr im selben Bereich. Achte auf die Streuung zwischen Einzelmessungen.','Ein höher gelegener Graph bedeutet: Es ist eine größere Kraft bis zum Reißen nötig.'],
          solution:'<p>Die Mittelwerte sind 7,89 N; 7,21 N; 7,72 N; 8,13 N. Eine klare systematische Zu- oder Abnahme mit der Länge ist in diesen Daten nicht erkennbar. Für gleichartige Fäden wird die Zugbelastbarkeit hauptsächlich von Material und Querschnitt beeinflusst. Reale Fehlstellen und Versuchsstreuung können ebenfalls eine Rolle spielen. Stabileres Material verschiebt die Werte nach oben.</p>'
        }),
        step('zug-flaeche','Messreihe B: Die Fadendicke vergleichen',`<p>Nun wird der Faden einfach, zweifach, dreifach und vierfach verwendet. Mehr parallele Fäden entsprechen einer größeren gesamten Querschnittsfläche. Die Reißkräfte stehen unten so, wie sie im hochgeladenen Arbeitsblatt angegeben sind.</p>${note('Zwei Messwerte kritisch prüfen','Die Werte 1,0 N in der ersten Reihe und 265 N in der dritten Reihe wirken auffällig. Sie könnten Messausreißer oder Schreibfehler sein. Ändere sie nicht stillschweigend. Rechne zunächst mit den angegebenen Werten und kläre eine Korrektur mit eurer Lehrkraft.','warning')}<p>Zeichne Fadenzahl beziehungsweise relative Querschnittsfläche auf die x-Achse und mittlere Reißkraft auf die y-Achse. Vergleiche die einzelnen Messwerte innerhalb jeder Reihe, bevor du eine Regel formulierst.</p>`,fields('Aufgabe 2b: Berechne die Mittelwerte und beschreibe, weshalb zwei Reihen überprüft werden müssen.','Was kannst du aus den unauffälligen Reihen über den Einfluss des Querschnitts sagen?','Wie würde sich die Belastbarkeit bei einem stabileren Fadenmaterial verändern?'),{
          widget:'means-area',
          hints:['Berechne zum Beispiel (27,0 + 265 + 27,5) / 3. Der große Wert beeinflusst den Mittelwert sehr stark.','Die zweifache und vierfache Reihe enthalten jeweils drei ähnliche Werte. Vergleiche deren Mittelwerte.'],
          solution:'<p>Mit den unveränderten Originalwerten lauten die Mittelwerte 6,90 N; 19,97 N; 106,50 N; 29,90 N. Der Wert 106,50 N ist wegen der Angabe 265 N auffällig. Diese Tabelle erlaubt ohne Prüfung keine saubere quantitative Ausgleichsgerade.</p><p>Als allgemeine Konstruktionsregel gilt: Bei gleichem Material und vergleichbaren Bedingungen kann ein größerer tragender Querschnitt mehr Zugkraft aufnehmen. Die genauen Werte und die Verteilung der Last auf mehrere Fäden musst du jedoch prüfen.</p>'
        }),
        step('stuetzen','Druckbelastung: Stützen vergleichen',`<p><strong>Stützen</strong> tragen Lasten unter Druck. Beispiele sind Tischbeine, Säulen oder tragende Wände. Bei kurzen, ausreichend breiten Proben steht das Zusammendrücken des Materials im Vordergrund.</p><p>Im Arbeitsblatt wurden getrocknete Toastbrotproben belastet. Lies zuerst Achsen, Einheiten und Verlauf beider Diagramme.</p><div class="figure-grid">${figure('toast-flaeche.png','Toastbrot-Diagramm: Bruchkraft steigt mit der Querschnittsfläche','Querschnittsfläche und Bruchkraft')}${figure('toast-laenge.png','Toastbrot-Diagramm: Bruchkraft bleibt bei verschiedenen Probenlängen ungefähr gleich','Länge und Bruchkraft')}</div>`,fields('Aufgabe 3.1a: Beschreibe beide Diagramme mit Achsen und Verlauf.','Aufgabe 3.1b: Welche Abhängigkeit von Querschnitt und Länge zeigen diese Proben?'),{
          hints:['Links steigt die Bruchkraft. Rechts bleiben die Punkte etwa auf derselben Höhe.','Übertrage die Aussage nicht ungeprüft auf sehr lange, schlanke Stäbe. Die können knicken.'],
          solution:'<p>Links steigt die Bruchkraft mit der Querschnittsfläche. Rechts verändert sie sich bei den untersuchten kurzen Proben mit der Länge kaum. Mehr Querschnitt verteilt die Last auf mehr Material. Für lange, schlanke Bauteile muss zusätzlich das Knicken betrachtet werden.</p>'
        }),
        step('knicken','Warum lange Stäbe ausknicken',`<p>Ein langer, dünner Stab kann seitlich ausweichen, bevor das Material stark zusammengedrückt wird. Das heißt <strong>Knicken</strong>. Daher reicht die Aussage „Länge spielt keine Rolle“ bei Druckstäben nicht aus.</p>${table(['Stab','Durchmesser','Länge'],[['1','2 mm','15 cm'],['2','3 mm','15 cm'],['3','2 mm','30 cm'],['4','2 mm','30 cm, mit seitlicher Halterung in der Mitte']])}<p>Nutze den bereitgestellten Teststand und belaste vorsichtig nach der Versuchsanweisung. Vergleiche zuerst 1 und 2, dann 1 und 3, schließlich 3 und 4. So veränderst du jeweils möglichst nur einen Einfluss.</p><div class="figure-grid">${figure('knick-test.png','Teststand zur Untersuchung der Knickstabilität','Teststand aus dem Arbeitsblatt')}${figure('wasserturm.png','Wasserturm mit langen Pfosten und verbindenden Querstreben','Welche Aufgabe haben die Querstreben?')}</div>`,fields('Aufgabe 3.2a: Ordne die Stäbe 1, 2 und 3 nach erwarteter Knickstabilität. Notiere danach deine Beobachtung.','Aufgabe 3.2b: Vergleiche 3 und 4. Wie wirkt die Halterung in der Mitte?','Aufgabe 3.2c/d: Erkläre die Querstreben am Wasserturm und formuliere Regeln gegen Knicken.'),{
          hints:['Bei gleicher Länge ist der dickere Stab stabiler. Bei gleichem Durchmesser ist der kürzere Stab stabiler.','Eine seitliche Halterung verringert die frei ausweichende Länge.'],
          solution:'<p>Erwartete Reihenfolge: 2 stabiler als 1, 1 stabiler als 3. Stab 4 ist durch die seitliche Halterung stabiler als Stab 3. Dickere Stäbe, kürzere freie Längen und geeignete Querstreben erhöhen die Knickstabilität. Die Wirkung hängt auch von Material und Befestigung ab.</p>'
        }),
        step('luecken','Deine Regeln zu Zug und Druck sichern',`<p>Vervollständige die Zusammenfassung aus dem Arbeitsblatt. Schreibe den ganzen Text in dein Lernheft:</p><blockquote>Seile sind geeignet, um ___ aufzunehmen, Stützen für ___. Ihre Belastbarkeit hängt jeweils von ihrer ___ (Dicke) und dem Material ab. Bei ___ oder ___ kann man auch Stäbe einsetzen. Um Knicken unter Druckbelastung zu vermeiden, dürfen sie nicht zu ___ und zu ___ sein. Oder sie müssen durch ___ stabilisiert werden.</blockquote>`,fields('Deine vervollständigte Zusammenfassung:'),{
          hints:['Wörter, die helfen: Zugbelastung, Druckbelastung, Querschnittsfläche, dünn, lang, Querstreben.'],
          solution:'<p>Seile sind geeignet, um <strong>Zugbelastung</strong> aufzunehmen, Stützen für <strong>Druckbelastung</strong>. Ihre Belastbarkeit hängt jeweils von ihrer <strong>Querschnittsfläche</strong> und dem Material ab. Bei <strong>Zug</strong> oder <strong>Druck</strong> kann man auch Stäbe einsetzen. Um Knicken zu vermeiden, dürfen sie nicht zu <strong>dünn</strong> und zu <strong>lang</strong> sein oder müssen durch <strong>Querstreben</strong> stabilisiert werden.</p>'
        }),
        step('dreiecke','Ein Viereck gegen Schub stabilisieren',`<p>Ein Rahmen aus vier gelenkig verbundenen Stäben kann sich vom Rechteck zum schiefen Viereck verformen. Eine zusätzliche Diagonale teilt ihn in Dreiecke. Ein Dreieck aus ausreichend steifen Stäben kann seine Form nicht genauso frei verändern.</p>${figure('schub-rahmen.png','Viereckiger Rahmen mit gegengerichteten seitlichen Kräften','Aufgabe 4: Untersuche Möglichkeiten zur Aussteifung.',true)}<ol><li>Baue einen Rahmen aus Eisstielen mit Musterbeutelklammern an den Ecken.</li><li>Teste eine Diagonalstrebe aus einem Stab.</li><li>Teste eine einzelne Seildiagonale in beiden Belastungsrichtungen.</li><li>Teste zwei sich kreuzende Seile.</li><li>Teste ein gut befestigtes Papierblatt als flächige Scheibe.</li></ol><p>Eine <strong>Scheibe</strong> ist hier ein flächiges Bauteil zur Aussteifung, zum Beispiel die Rückwand eines Schranks.</p>`,fields('Aufgabe 4a–c: Skizziere deine Varianten auf Papier. Welche verhindern die Verformung in welcher Richtung?','Aufgabe 4d: Formuliere deinen Merksatz für stabile Stabwerke.','Aufgabe 4e: Genügen beim Regal zwei gekreuzte Seile? Warum genügt ein einzelnes Seil nicht in beiden Richtungen?'),{
          hints:['Ein Seil kann Zug aufnehmen. Bei Druck wird es schlaff.','Bei zwei gekreuzten Seilen steht je nach Richtung eine andere Diagonale unter Zug.'],
          solution:`${figure('regal.png','Ein verformtes Regal und ein Regal mit Kreuzverstrebung','Kreuzverstrebung aus dem Arbeitsblatt.')}<p>Ein geeigneter Diagonalstab kann Zug und Druck aufnehmen. Ein Seil stabilisiert nur die Richtung, in der es gespannt wird. Zwei gekreuzte Seile können beide Richtungen sichern. Eine gut mit dem Rahmen verbundene Scheibe kann ebenfalls aussteifen. Die Verbindungen müssen die Kräfte übertragen.</p>`
        }),
        step('spannweite','Biegung: Die freie Spannweite verringern',`<p>Die <strong>Spannweite</strong> ist der Abstand zwischen den Auflagern eines Balkens. Eine zusätzliche Stütze verkürzt die frei überspannte Strecke. Bei sonst gleichen Bedingungen biegt sich der Balken dadurch deutlich weniger durch.</p>${figure('spannweite.png','Ein Schaumstoffbalken ohne und mit zusätzlicher mittlerer Stütze','Vergleiche die frei überspannten Abschnitte.')}<p>Lasten können auf unterschiedlichen Wegen weitergeleitet werden: Eine Stütze trägt sie senkrecht nach unten, eine Strebe schräg zu einer Befestigung, ein Seil nach oben zu seinem Aufhängepunkt.</p>${figure('stuetze-strebe-seil.png','Drei Abstützungen eines Balkens: Stütze, schräge Strebe und Aufhängung an Seilen','Aufgabe 5.1: Zeichne die Kräfte an a), b) und c) ein.')}`,fields('Aufgabe 5.1: Benenne die Belastung von Stütze, Strebe und Seil. Zeichne die Kräfte auf Papier ein.','Wie könntest du die freie Spannweite in deiner Maschine verringern?'),{
          hints:['Ein von unten belasteter Träger drückt auf seine Stütze. Ein aufgehängter Träger zieht an seinen Seilen.'],
          solution:'<p>a: Stütze unter Druck. b: Die gezeigte stützende Strebe steht unter Druck; je nach Anordnung können Streben auch Zug tragen. c: Seile stehen unter Zug. Die zusätzliche Abstützung oder Aufhängung verringert die freie Spannweite des Balkens.</p>'
        }),
        step('profile','Höhe, Breite und Profile vergleichen',`<p>Stelle einen rechteckigen Balken einmal flach und einmal hochkant auf. Material, Länge und Last bleiben gleich. Hochkant wird er in der gezeigten Belastungsrichtung deutlich biegesteifer.</p>${figure('balken-hochkant.png','Gleicher Schaumstoffbalken flach und hochkant unter Belastung','Aufgabe 5.2: Vergleiche die Durchbiegung.')}<p>Für gleichartige rechteckige Balken bei gleicher mittiger Last und gleicher Auflagerung gilt die vereinfachte Beziehung:</p><div class="formula">w ∝ l<sup>3</sup> / (b · h<sup>3</sup>)</div><p><strong>w</strong> ist die Durchbiegung, <strong>l</strong> die Spannweite, <strong>b</strong> die Breite und <strong>h</strong> die Höhe in Biegerichtung. Doppelte Höhe bedeutet in diesem Modell ein Achtel der Durchbiegung; doppelte Breite die Hälfte. Doppelte Spannweite ergibt die achtfache Durchbiegung.</p>${note('Die Bedingungen gehören zur Formel','Die Beziehung gilt für denselben Werkstoff, gleiche Last und passende Auflagerung im vereinfachten Balkenmodell. Vergleiche deshalb jeweils nur eine Größe.')}`,fields('Aufgabe 5.2a: Beschreibe den Einfluss der Balkenhöhe.','Aufgabe 5.2b: Vergleiche die Wirkung von doppelter Breite, doppelter Höhe und doppelter Spannweite.','Wie könnte ein T-Profil eine leichte, biegesteife Konstruktion ermöglichen?'),{
          widget:'beam',
          hints:['Die dritte Potenz von 2 ist 8. Höhe und Spannweite wirken deshalb stärker als die Breite.'],
          solution:`${figure('balken-kraefte.png','Gebogener Balken mit Druck an der Oberseite und Zug an der Unterseite','Beim dargestellten, nach unten gebogenen Balken: oben Druck, unten Zug. Im Inneren tritt auch Schub auf.')}${figure('t-profil.png','Ein flacher Träger und ein zusätzlicher hochkant stehender Steg bilden ein T-Profil','Ein Profil ordnet Material so an, dass es zur gewünschten Steifigkeit beiträgt.')}<p>Doppelte Breite: w/2. Doppelte Höhe: w/8. Doppelte Spannweite: 8w. Ein T-Profil verbindet einen breiten Bereich mit einem hohen Steg. Höhe verbessert die Biegesteifigkeit; die Gesamtform und Befestigung müssen auch seitlich stabil bleiben.</p>`
        })
      ]
    },
    {
      id:'blasen',number:'07',title:'Seifenblasen untersuchen',subtitle:'Film, Luftstrom und Flugzeit',time:'ca. 45–90 Min.',source:'Qualifizierungsbedarf und Flugzeitfrage aus den Folien; ergänzende Versuchsführung',
      intro:'Du testest, wie deine Konstruktion einen Film bildet und daraus eine große, haltbare Blase erzeugt. Deine Beobachtungen entscheiden, welche Einstellungen funktionieren.',
      steps:[
        step('film','Vom benetzten Ring zur Seifenblase',`<p>Eine Seifenblase hat eine sehr dünne Flüssigkeitshaut, die Luft einschließt. Die Seifenlösung erleichtert es, einen zusammenhängenden Film am Ring zu bilden. Ein geeigneter Luftstrom wölbt diesen Film nach außen, bis sich eine Blase ablöst.</p><p>Der Ring muss zuverlässig benetzt werden. Zu viel Luftbewegung kann den Film oder die Blase zerstören. Zu wenig Luftbewegung erzeugt möglicherweise keine ausreichend große Blase. Du findest die passende Einstellung durch kontrollierte Tests.</p>`,fields('Beschreibe den Weg vom Eintauchen des Rings bis zum Ablösen der Blase.','Welche zwei Stellen in diesem Ablauf könnten scheitern?'),{
          solution:'<p>Der Ring wird benetzt, ein zusammenhängender Film entsteht, der Ring erreicht den Luftstrom, der Film wölbt sich und eine Blase löst sich ab. Mögliche Fehler: Der Film ist unterbrochen, der Ring ist schlecht ausgerichtet oder der Luftstrom ist ungeeignet.</p>'
        }),
        step('versuch','Einen fairen Vergleich planen',`<p>Wähle eine Einflussgröße, zum Beispiel den Abstand zwischen Ring und Luftschraube. Halte andere Bedingungen möglichst gleich: Ring, Lösung, Benetzungszeit, Ort und Motoransteuerung.</p><ol><li>Notiere eine Vermutung.</li><li>Wähle drei Einstellungen der Einflussgröße.</li><li>Führe pro Einstellung möglichst drei Versuche durch.</li><li>Erfasse Erfolg, Durchmesser und Schwebezeit.</li><li>Vergleiche die Ergebnisse und ändere erst dann den nächsten Einfluss.</li></ol>${note('Mit dem vorgesehenen Material arbeiten','Verwende die Seifenlösung und Geräte aus dem Unterricht. Halte Flüssigkeit von Elektronik fern und wische verschüttete Lösung weg. Mische keine zusätzlichen Chemikalien ohne Versuchsanweisung.',true)}`,fields('Meine Vermutung: Wenn …, dann …, weil …','Unsere Einflussgröße, drei Einstellungen und konstanten Bedingungen:','Unsere Versuchsergebnisse und Schlussfolgerung:'),{
          hints:['Eine überprüfbare Vermutung nennt eine konkrete Veränderung und eine messbare Wirkung.'],
          solution:'<p>Beispiel: „Wenn wir den Abstand des Rings zum Propeller vergrößern, könnte der Luftstrom am Film schwächer werden.“ Ob das bei eurem Aufbau stimmt, entscheidet der Versuch. Das ist eine Vermutung, kein vorweggenommenes Ergebnis.</p>'
        }),
        step('flugzeit','Wie verlängerst du die Schwebezeit?',`<p>Die Folien fragen nach einer möglichst langen Flugzeit und nennen einen Turm als Möglichkeit. Ein höherer Start gibt einer sinkenden Blase mehr Weg bis zum Boden. Ein Turm muss aber standsicher sein und zum zulässigen Aufbau passen.</p><p>Auch Luftbewegung, Entstehung der Blase und Haltbarkeit des Films beeinflussen die beobachtete Zeit. Ein zusätzlicher Luftstrom kann eine Blase tragen oder sie zerstören. Behaupte deshalb nicht, dass „höher“ oder „mehr Wind“ immer automatisch besser ist.</p>`,fields('Nenne zwei mögliche Maßnahmen für eine längere Schwebezeit und begründe sie.','Welche Maßnahme testet ihr zuerst? Wie prüft ihr sie, ohne mehrere Bedingungen zugleich zu ändern?'),{
          solution:'<p>Mögliche Tests sind verschiedene zulässige Starthöhen, ein ruhigerer Testort oder eine andere Luftstromeinstellung. Vergleicht jeweils mehrere Versuche. Ein erhöhter Start benötigt eine stabile, kippsichere Konstruktion.</p>'
        })
      ]
    },
    {
      id:'projekt',number:'08',title:'Deine Seifenblasenmaschine',subtitle:'Planen, bauen und überprüfen',time:'Projektphase im Team',source:'Projektauftrag, Materialvorgaben und Projektmanagement-Checkliste',
      intro:'Jetzt verbindest du die Teilfunktionen. Du arbeitest mit einem Plan, testest systematisch und belegst am Ende, was deine Maschine kann.',
      steps:[
        step('planung','Eine überprüfbare Lösung planen',`<p>Nutzt eure Systemanalyse und legt einen konkreten Aufbau fest. Aus den Folien stehen euch <strong>2 Motoren, 1 Luftschraube, Getriebeteile, 1 Holzplatte im Format DIN A3, 1 Flüssigkeitsbehälter, Arduino und Dispenser beziehungsweise Seifenblasenringe oder Pfeifenreiniger</strong> als Materialvorgaben zur Verfügung. Klärt die genaue Ausstattung mit eurer Lehrkraft.</p><p>Erstellt eine beschriftete Konstruktionsskizze, eine Pin- und Anschlussliste sowie einen Ablaufplan. Beschreibt, wie ein Tastendruck genau einen geplanten Durchlauf startet.</p>`,fields('Unsere Konstruktionsidee: Wie entsteht die Blase, wie löst sie sich und wie bleibt der Aufbau stabil?','Unser Ablauf nach dem Tastendruck in einzelnen Schritten:','Unsere Anschlussliste und noch offene Materialfragen:'),{
          hints:['Denke an Benetzen, Positionieren, Luftstrom, Ablösen und Rückkehr zur Ausgangsstellung.','Für die Motoren brauchst du eine geeignete Ansteuerung. Die Signale des Arduino ersetzen nicht die Motorversorgung.'],
          solution:'<p>Ein möglicher Ablauf lautet: Warten auf Tastendruck, Ring benetzen, Ring vor den Luftstrom bringen, Luftstrom auslösen, Blase ablösen lassen, Ring zurückführen. Eure konkrete Konstruktion kann einen anderen Ablauf brauchen. Jeder Schritt sollte sich einzeln testen lassen.</p>'
        }),
        step('pakete','Arbeitspakete und Tests festlegen',`<p>Teilt das Projekt in Arbeitspakete, die ein sichtbares Ergebnis haben. „Dispenser bewegt sich wiederholt vom Behälter in die Blasposition“ ist genauer als „Mechanik“.</p>${table(['Arbeitspaket','Mögliches Abnahmekriterium'],[['Taster und Steuerung','Ein Tastendruck startet genau einen Durchlauf.'],['Dispenser','Der Ring wird zuverlässig benetzt und richtig positioniert.'],['Luftstrom','Erzeugt eine ablösbare Blase ohne den Film sofort zu zerstören.'],['Konstruktion','Bleibt während des Betriebs stabil und schützt die vorgesehenen Teile.'],['Gesamttest','Alle vier Projektkriterien werden am selben Versuch überprüft.']])}<a href="material/Checkliste_Projektmanagement.pdf" target="_blank" rel="noopener">Die Fünf-Minuten-Checkliste öffnen</a>`,fields('Unser Arbeitspaket 1: Person, Ergebnis und Test.','Unser Arbeitspaket 2: Person, Ergebnis und Test.','Unser Arbeitspaket 3: Person, Ergebnis und Test.','Welche Ergebnisse dokumentieren wir heute?'),{
          solution:'<p>Die Rollen können parallel arbeiten, müssen aber Schnittstellen vereinbaren. Beispiel: Die Person für Mechanik nennt den benötigten Stellbereich; die Person für Programmierung testet, ob die Bewegung diesen Bereich zuverlässig erreicht.</p>'
        }),
        step('integration','Teilfunktionen schrittweise verbinden',`<p>Ein Gesamtsystem lässt sich leichter prüfen, wenn du bekannte Teilfunktionen kombinierst. Beginne mit Taster und einem sichtbaren Testsignal. Ergänze anschließend Dispenser, Luftstrom und die gemeinsame Zeitsteuerung.</p><p>Lange delay-Aufrufe können andere Aufgaben blockieren. Wenn dein Ablauf während einer Wartezeit weitere Eingaben beobachten soll, nutze Zeitvergleiche mit millis. Für einen einfachen einmaligen Ablauf kann eine bewusste Pause zunächst nachvollziehbar sein.</p>${note('Fehler sinnvoll eingrenzen','Beschreibe zuerst das beobachtete Verhalten. Prüfe anschließend die betroffene Teilfunktion allein. Ändere eine Sache, teste erneut und notiere die Wirkung. Ein Neustart ohne Erklärung ist noch keine Lösung.')}`,fields('Welche Teilfunktionen funktionieren bereits sicher? Welche verbindest du als Nächstes?','Unser wichtigster Fehler: Beobachtung, vermutete Ursache, Änderung und erneuter Test.'),{
          hints:['Wenn der Motor sich nicht bewegt: Passt das Steuersignal? Ist die geeignete Versorgung verbunden? Ist die Mechanik frei?','Wenn die Blase fehlt: Ist ein Film am Ring? Stimmt seine Position? Passt der Luftstrom?'],
          solution:'<p>Ein guter Eintrag könnte lauten: „Der Ring bewegt sich, aber am Luftstrom ist kein Film mehr vorhanden. Wir verringern nur die Zeit zwischen Benetzen und Anblasen und vergleichen drei Versuche.“</p>'
        }),
        step('abnahme','Den Projektauftrag mit Messwerten prüfen',`<p>Überprüft alle Kriterien am selben Versuch. Startet die erste Zeitmessung beim Tastendruck. Messt den Durchmesser möglichst bei der fertigen Blase. Die Schwebezeit beginnt beim Ablösen.</p><p>Führt nach Möglichkeit drei Gesamttests durch. Ein einzelner gelungener Versuch zeigt eine Möglichkeit; mehrere erfolgreiche Versuche zeigen, dass euer Aufbau zuverlässiger arbeitet.</p>`,fields('Wie und mit welchen Hilfsmitteln habt ihr die drei Größen gemessen?','Welches Kriterium ist noch nicht zuverlässig erfüllt? Welche gezielte Verbesserung plant ihr?'),{
          widget:'project-test',
          hints:['Erzeugungszeit höchstens 15 s, Durchmesser mindestens 7 cm und Schwebezeit mindestens 8 s. Zusätzlich muss der Start durch einen Tastendruck erfolgen.'],
          solution:'<p>Der Auftrag ist für einen Versuch erfüllt, wenn alle Bedingungen zugleich stimmen. Dokumentiere auch fehlgeschlagene Versuche; sie zeigen, welche Teilfunktion du verbessern musst.</p>'
        }),
        step('abschluss','Deine Lösung verständlich vorstellen',`<p>Stelle nicht nur die fertige Maschine vor. Erkläre, warum ihr sie so gebaut habt und welche Messwerte eure Aussagen belegen.</p><ol><li>Projektziel und Systembild zeigen.</li><li>Wichtige Konstruktions- und Programmierentscheidungen begründen.</li><li>Einen vollständigen Durchlauf demonstrieren.</li><li>Messwerte und noch bestehende Grenzen nennen.</li><li>Beschreiben, was ihr durch Tests verbessert habt.</li></ol>${note('Lernheft sichern','Öffne „Mein Lernheft“ und lade deine Antworten herunter oder drucke sie als PDF. Die Website übermittelt sie nicht automatisch an deine Lehrkraft. Gib deine Ergebnisse so ab, wie ihr es im Unterricht vereinbart habt.')}`,fields('Unsere wichtigste technische Entscheidung und ihre Begründung:','Unser Ergebnis mit Messwerten:','Das habe ich gelernt. Das würde ich beim nächsten Projekt anders machen.'),{
          solution:'<p>Eine gute Begründung verbindet eine Entscheidung mit einer Funktion oder Beobachtung: „Wir nutzen eine Untersetzung, weil der Ring ohne Getriebe zu schnell durch die Lösung läuft.“ Ein gutes Ergebnis nennt Werte und erläutert, wie sie gemessen wurden.</p>'
        })
      ]
    }
  ];
  const MATERIALS = [
    {title:'Systemanalyse',file:'Systemanalyse.pdf',type:'Arbeitsblatt · PDF',description:'Technische Systeme, Waschmaschine und Seifenblasenmaschine. Schülerfassung ohne Lösungsteil.'},
    {title:'Arduino-Befehle',file:'Arduino_Befehle.pdf',type:'Arbeitsblatt · PDF',description:'Die Befehlsübersicht zum Ausfüllen. Schülerfassung ohne Musterlösung.'},
    {title:'Schreibtischlampe',file:'Schreibtischlampe.pdf',type:'Arbeitsblatt · PDF',description:'Auftrag für die dimmbare LED-Lampe und die benötigten Befehle.'},
    {title:'Servomotor',file:'Servomotor_Original.pdf',type:'Original-Arbeitsblatt · PDF',description:'Pinvergleich und Winkelprogramm. Beachte die präzisierten Anschluss- und Versorgungshinweise im Lernpfad.'},
    {title:'Statik',file:'Statik.pdf',type:'Arbeitsblatt · PDF',description:'Belastungen, Messreihen, Stützen und Profile. Ohne Erwartungshorizont. Auffällige Messwerte werden im Lernpfad besprochen.'},
    {title:'Projektmanagement',file:'Checkliste_Projektmanagement.pdf',type:'Checkliste · PDF',description:'Fünf Minuten für Rückblick, Ziel, Rollen, Hindernisse und Dokumentation.'},
    {title:'Kickoff und Egg-Race',file:'Folien_Kickoff.pdf',type:'Unterrichtsfolien · PDF',description:'Konstruktionsauftrag Ordnerklammer-Weitflug und Reflexion.'},
    {title:'Systemanalyse I',file:'Folien_Systemanalyse_I.pdf',type:'Unterrichtsfolien · PDF',description:'Projektauftrag, EVA-Prinzip, Teilsysteme und Materialvorgaben.'},
    {title:'Systemanalyse II',file:'Folien_Systemanalyse_II.pdf',type:'Unterrichtsfolien · PDF',description:'Wiederholung, Systemanalyse und Lernbedarf.'},
    {title:'Arduino, PWM und Servo',file:'Folien_Arduino.pdf',type:'Unterrichtsfolien · PDF',description:'Wiederholung, Schreibtischlampe, Pulsweitenmodulation und Zeigeranzeige.'}
  ];
  const COMMANDS = [
    ['//','Kommentar','explanation'],
    ['pinMode(9, OUTPUT);','Legt Pin 9 als Ausgang fest.','explanation'],
    ['pinMode(Pin, INPUT_PULLUP);','Legt einen Eingang mit internem Pullup-Widerstand fest.','command'],
    ['digitalWrite(9, HIGH);','Setzt den Ausgang auf HIGH, am Uno R3 ungefähr 5 V.','explanation'],
    ['digitalWrite(9, LOW);','Setzt den Ausgang auf LOW, am Uno R3 ungefähr 0 V.','command'],
    ['digitalRead(Pin);','Liest HIGH oder LOW an einem digitalen Eingang.','explanation'],
    ['delay(10);','Wartet 10 Millisekunden.','command'],
    ['void setup() { ... }','Wird einmal nach dem Start ausgeführt.','command'],
    ['void loop() { ... }','Wird nach setup immer wieder ausgeführt.','explanation'],
    ['int','Datentyp für ganze Zahlen.','explanation'],
    ['long','Datentyp für ganze Zahlen mit größerem Wertebereich.','command'],
    ['float','Datentyp für Zahlen mit Nachkommastellen.','command'],
    ['=','Weist einer Variablen einen Wert zu.','explanation'],
    ['+, -, *, /','Addition, Subtraktion, Multiplikation, Division.','explanation'],
    ['Serial.begin(9600);','Startet die serielle Kommunikation mit 9600 Baud.','command'],
    ['Serial.print(...);','Gibt Text oder Zahlen ohne anschließenden Zeilenumbruch aus.','explanation'],
    ['Serial.println(...);','Gibt Text oder Zahlen mit anschließendem Zeilenumbruch aus.','command'],
    ['for (Initialisierung; Bedingung; Änderung) { ... }','Zählschleife für eine festgelegte Wiederholung.','command'],
    ['while (Bedingung) { ... }','Wiederholt Anweisungen, solange die Bedingung wahr ist.','explanation'],
    ['analogWrite(9, 255);','Gibt den maximalen PWM-Wert aus; am Uno R3 entspricht dies dauerhaft HIGH.','explanation'],
    ['randomSeed(analogRead(A0));','Setzt einen Startwert für den Zufallsgenerator.','explanation'],
    ['random(10, 20);','Liefert eine ganze Zufallszahl zwischen 10 und 19.','command'],
    ['if (Bedingung) { ... }','Führt den Block aus, wenn die Bedingung wahr ist.','explanation'],
    ['else if (Bedingung) { ... }','Prüft eine weitere Bedingung, wenn die vorige nicht erfüllt war.','command'],
    ['else { ... }','Führt den Block aus, wenn die vorherigen Bedingungen nicht zutrafen.','explanation']
  ];
  window.COURSE = COURSE;
  window.MATERIALS = MATERIALS;
  window.COMMANDS = COMMANDS;
  window.CODES = CODES;
})();
