// Nur mit geprüfter Transistorstufe, Basiswiderstand, Freilaufdiode
// und passender Motorversorgung verwenden. Gemeinsamen GND verbinden.
// Ein DC-Motor darf nicht direkt an einem Arduino-Signalpin hängen.
const int motorPin = 3;

void setup() {
  pinMode(motorPin, OUTPUT);
  digitalWrite(motorPin, LOW);
}

void loop() {
  digitalWrite(motorPin, HIGH);
  delay(3000);
  digitalWrite(motorPin, LOW);
  delay(5000);
}
