from machine import Pin
from vibrator import Vibrator
from time import sleep

vibrator1 = Vibrator(6)
vibrator2 = Vibrator(7)

led = Pin("LED", Pin.OUT)
led.on()

while True:
    vibrator1.turn_on(50)
    vibrator2.turn_on(50)

    sleep(1)
    
    vibrator1.turn_off()
    vibrator2.turn_off()

    sleep(1)