from machine import Pin
from time import sleep
from peltier_h_bridge import PeltierHBridge, H_BRIDGE_NORMAL, H_BRIDGE_REVERSE


led = Pin("LED", Pin.OUT)
led.on()

peltiers_set_1 = PeltierHBridge(17,18,16,19,20,21)

def temperature_duty(percent:int): 
    return (percent/100)*65565 

while True:
    
    # Hot increase
    peltiers_set_1.set_operation_mode(H_BRIDGE_NORMAL, H_BRIDGE_NORMAL)

    for cock in range(0, 65565, 2000):
        peltiers_set_1.set_temperature(cock, cock)
        sleep(0.1)


    # Hold
    sleep(1)

    # Hot decrease
    for cock in range(65565, 0, -2000):
        peltiers_set_1.set_temperature(cock, cock)
        sleep(0.1)

    sleep(1)

    peltiers_set_1.set_operation_mode(H_BRIDGE_REVERSE, H_BRIDGE_REVERSE)

    # Cold decrease
    for cock in range(0, 65565, 2000):
        peltiers_set_1.set_temperature(cock, cock)
        sleep(0.1)

    # Hold
    sleep(1)

    # Cold decrease
    for cock in range(65565, 0, -2000):
        peltiers_set_1.set_temperature(cock, cock)
        sleep(0.1)

    # Hold
    sleep(1)
