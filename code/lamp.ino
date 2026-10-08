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
}
