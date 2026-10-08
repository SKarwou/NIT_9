#include <Servo.h>
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
}
