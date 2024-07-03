from machine import Pin
from time import sleep 
from peltier_h_bridge import PeltierHBridge, H_BRIDGE_NORMAL, H_BRIDGE_REVERSE

import wifi

from ws_connection import ClientClosedError
from ws_server import WebSocketServer, WebSocketClient


led = Pin("LED", Pin.OUT)
led.on()

peltiers_set_1 = PeltierHBridge(18,19,16,18,19,17)
peltiers_set_2 = PeltierHBridge(10,11,20,10,11,21)
peltiers_set_3 = PeltierHBridge(22,28,26,22,28,27)
peltiers_set_4 = PeltierHBridge(0,1,2,0,1,3)
peltiers_set_5 = PeltierHBridge(6,7,8,6,7,9)

class TestClient(WebSocketClient):
    def __init__(self, conn):
        super().__init__(conn)

    def process(self):
        try:
            msg = self.connection.read()
            if not msg:
                return
            print(msg)
            msg = msg.decode('ascii')
            parts = msg.split('\n')

            dirs = parts[0].split(' ')
            peltiers_set_1.set_operation_mode(int(dirs[0]), int(dirs[0]))
            peltiers_set_2.set_operation_mode(int(dirs[1]), int(dirs[1]))
            peltiers_set_3.set_operation_mode(int(dirs[2]), int(dirs[2]))
            peltiers_set_4.set_operation_mode(int(dirs[3]), int(dirs[3]))
            peltiers_set_5.set_operation_mode(int(dirs[4]), int(dirs[4]))

            temps = parts[1].split(' ')
            peltiers_set_1.set_temperature(int(temps[0]), int(temps[0]))
            peltiers_set_2.set_temperature(int(temps[1]), int(temps[1]))
            peltiers_set_3.set_temperature(int(temps[2]), int(temps[2]))
            peltiers_set_4.set_temperature(int(temps[3]), int(temps[3]))
            peltiers_set_5.set_temperature(int(temps[4]), int(temps[4]))
                
            
        except ClientClosedError:
            print("Connection close error")
            self.connection.close()

class TestServer(WebSocketServer):
    def __init__(self):
        super().__init__("index.html", 100)

    def _make_client(self, conn):
        return TestClient(conn)

wifi.run()

server = TestServer()
server.start()

while True:
    server.process_all()
