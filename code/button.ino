const int tasterPin = 2;

void setup() {
  pinMode(tasterPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int zustand = digitalRead(tasterPin);
  Serial.println(zustand);
  delay(50);
}
