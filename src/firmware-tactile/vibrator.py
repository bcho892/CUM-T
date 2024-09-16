from machine import Pin, PWM

class Vibrator():
    def __init__(self, pin: int):
        self.bjt = PWM(Pin(pin, Pin.OUT))
        self.bjt.freq(500)

    def turn_on(self, percent:int):
        self.bjt.duty_u16(int((2**16-1)*(percent/100))) 

    def turn_off(self):
        self.bjt.duty_u16(0) 
        
