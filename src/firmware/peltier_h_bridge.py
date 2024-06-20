from machine import Pin, PWM

H_BRIDGE_OFF = 1
H_BRIDGE_NORMAL = 2
H_BRIDGE_REVERSE = 3

class PeltierHBridge():
    def __init__(self, p1_in1:int, p1_in2:int, p1_en:int, p2_in1:int, p2_in2:int, p2_en:int):
        self.peltier_1 = { 
                           "in1": Pin(p1_in1, Pin.OUT), 
                           "in2": Pin(p1_in2, Pin.OUT),
                           "en": PWM(Pin(p1_en, Pin.OUT))
                         }

        self.peltier_2 = { 
                           "in1":Pin(p2_in1, Pin.OUT), 
                           "in2": Pin(p2_in2, Pin.OUT),
                           "en": PWM(Pin(p2_en, Pin.OUT))
                         }

        self.set_operation_mode(H_BRIDGE_OFF,H_BRIDGE_OFF)
        self.set_temperature(0,0)
        self.peltier_1["en"].freq(500)
        self.peltier_2["en"].freq(500)

    def set_temperature(self, p1_temperature, p2_temperature):
        self.peltier_1["en"].duty_u16(p1_temperature)
        self.peltier_2["en"].duty_u16(p2_temperature)

    def set_operation_mode(self, p1_mode:int, p2_mode:int):
        # Peltier 1 control
        if(p1_mode == H_BRIDGE_OFF):
            self.peltier_1["in1"].off()
            self.peltier_1["in2"].off()
        elif(p1_mode == H_BRIDGE_NORMAL):
            self.peltier_1["in1"].on()
            self.peltier_1["in2"].off()
        elif(p1_mode == H_BRIDGE_REVERSE):
            self.peltier_1["in1"].off()
            self.peltier_1["in2"].on()

        # Peltier 2 control
        if(p2_mode == H_BRIDGE_OFF):
            self.peltier_2["in1"].off()
            self.peltier_2["in2"].off()
        elif(p2_mode == H_BRIDGE_NORMAL):
            self.peltier_2["in1"].on()
            self.peltier_2["in2"].off()
        elif(p2_mode == H_BRIDGE_REVERSE):
            self.peltier_2["in1"].off()
            self.peltier_2["in2"].on()
            
        
