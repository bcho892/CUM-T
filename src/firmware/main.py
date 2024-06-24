from machine import Pin
from time import sleep 
from peltier_h_bridge import PeltierHBridge, H_BRIDGE_NORMAL, H_BRIDGE_REVERSE

import wifi

from ws_connection import ClientClosedError
from ws_server import WebSocketServer, WebSocketClient


led = Pin("LED", Pin.OUT)
led.on()

peltiers_set_1 = PeltierHBridge(17,18,16,19,20,21)

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
            peltiers_set_1.set_operation_mode(int(dirs[0]), int(dirs[1]))

            temps = parts[1].split(' ')
            peltiers_set_1.set_temperature(int(temps[0]), int(temps[1]))
                
            
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
