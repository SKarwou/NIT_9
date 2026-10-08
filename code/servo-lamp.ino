#include <Servo.h>
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
}
