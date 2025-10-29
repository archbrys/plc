/*
 * Example Arduino PLC Code for PLC-MC System
 * 
 * This example demonstrates how to communicate with the Node.js backend
 * using serial communication. It sends sensor data and responds to commands.
 */

// Pin definitions
const int LED_PIN = 13;
const int SENSOR_PIN = A0;

// State variables
bool systemRunning = false;
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 1000; // Send data every 1 second

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
  
  // Wait for serial port to connect
  while (!Serial) {
    ; // Wait for serial port to connect (needed for native USB)
  }
  
  Serial.println("{\"status\":\"ready\",\"message\":\"PLC initialized\"}");
}

void loop() {
  // Check for incoming commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    handleCommand(command);
  }
  
  // Send data at regular intervals
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;
    sendData();
  }
}

void handleCommand(String command) {
  command.toUpperCase();

  // Base motor control commands
  if (command == "START") {
    systemRunning = true;
    digitalWrite(LED_PIN, HIGH);
    Serial.println("{\"status\":\"success\",\"message\":\"Motor started\",\"command\":\"START\"}");

  } else if (command == "STOP") {
    systemRunning = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println("{\"status\":\"success\",\"message\":\"Motor stopped\",\"command\":\"STOP\"}");

  } else if (command == "ESTOP") {
    systemRunning = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println("{\"status\":\"success\",\"message\":\"Emergency stop activated\",\"command\":\"ESTOP\"}");

  } else if (command == "RESET") {
    systemRunning = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println("{\"status\":\"success\",\"message\":\"System reset\",\"command\":\"RESET\"}");

  } else if (command == "STATUS") {
    sendStatus();

  } else if (command == "READ_ALL") {
    sendData();

  // Direct-On-Line commands
  } else if (command == "DOL_START") {
    systemRunning = true;
    digitalWrite(LED_PIN, HIGH);
    Serial.println("{\"status\":\"success\",\"message\":\"DOL full voltage start\",\"circuit\":\"direct-on-line\"}");

  // Wye-Delta commands
  } else if (command == "WYE_START") {
    Serial.println("{\"status\":\"success\",\"message\":\"Wye configuration started\",\"circuit\":\"wye-delta\"}");

  } else if (command == "DELTA_RUN") {
    Serial.println("{\"status\":\"success\",\"message\":\"Switched to Delta run\",\"circuit\":\"wye-delta\"}");

  } else if (command == "AUTO_TRANSITION") {
    Serial.println("{\"status\":\"success\",\"message\":\"Auto transition enabled\",\"circuit\":\"wye-delta\"}");

  // Forward-Reverse commands
  } else if (command == "FORWARD") {
    Serial.println("{\"status\":\"success\",\"message\":\"Motor running forward\",\"circuit\":\"forward-reverse\"}");

  } else if (command == "REVERSE") {
    Serial.println("{\"status\":\"success\",\"message\":\"Motor running reverse\",\"circuit\":\"forward-reverse\"}");

  } else if (command == "INTERLOCK") {
    Serial.println("{\"status\":\"success\",\"message\":\"Interlock check passed\",\"circuit\":\"forward-reverse\"}");

  // Cyclic Forward-Reverse commands
  } else if (command == "CYCLE_START") {
    Serial.println("{\"status\":\"success\",\"message\":\"Cycle started\",\"circuit\":\"cyclic-forward-reverse\"}");

  } else if (command == "CYCLE_PAUSE") {
    Serial.println("{\"status\":\"success\",\"message\":\"Cycle paused\",\"circuit\":\"cyclic-forward-reverse\"}");

  } else if (command == "SET_INTERVAL") {
    Serial.println("{\"status\":\"success\",\"message\":\"Interval set\",\"circuit\":\"cyclic-forward-reverse\"}");

  // Circuit selection commands
  } else if (command.startsWith("CIRCUIT:")) {
    String circuit = command.substring(8);
    circuit.toLowerCase();
    Serial.print("{\"status\":\"success\",\"message\":\"Circuit selected: ");
    Serial.print(circuit);
    Serial.println("\"}");

  } else {
    Serial.print("{\"status\":\"error\",\"message\":\"Unknown command: ");
    Serial.print(command);
    Serial.println("\"}");
  }
}

void sendData() {
  // Read sensor value
  int sensorValue = analogRead(SENSOR_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  
  // Send data as JSON
  Serial.print("{");
  Serial.print("\"timestamp\":");
  Serial.print(millis());
  Serial.print(",\"running\":");
  Serial.print(systemRunning ? "true" : "false");
  Serial.print(",\"sensorRaw\":");
  Serial.print(sensorValue);
  Serial.print(",\"voltage\":");
  Serial.print(voltage, 2);
  Serial.print(",\"temperature\":");
  Serial.print(random(20, 30)); // Simulated temperature
  Serial.print(",\"pressure\":");
  Serial.print(random(100, 110)); // Simulated pressure
  Serial.println("}");
}

void sendStatus() {
  Serial.print("{");
  Serial.print("\"status\":\"ok\"");
  Serial.print(",\"running\":");
  Serial.print(systemRunning ? "true" : "false");
  Serial.print(",\"uptime\":");
  Serial.print(millis());
  Serial.print(",\"freeMemory\":");
  Serial.print(getFreeMemory());
  Serial.println("}");
}

// Get free memory (for Arduino boards)
int getFreeMemory() {
  extern int __heap_start, *__brkval;
  int v;
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval);
}

/*
 * PROTOCOL DOCUMENTATION
 *
 * Base Commands (sent from Node.js to Arduino):
 * - START      : Start the motor
 * - STOP       : Stop the motor
 * - ESTOP      : Emergency stop
 * - RESET      : Reset the system
 * - STATUS     : Request current status
 * - READ_ALL   : Request all sensor data
 *
 * Circuit-Specific Commands:
 *
 * Direct-On-Line:
 * - DOL_START  : Full voltage start
 *
 * Wye-Delta:
 * - WYE_START  : Start in Wye configuration
 * - DELTA_RUN  : Switch to Delta configuration
 * - AUTO_TRANSITION : Enable automatic transition
 *
 * Forward-Reverse:
 * - FORWARD    : Run motor forward
 * - REVERSE    : Run motor reverse
 * - INTERLOCK  : Check interlock status
 *
 * Cyclic Forward-Reverse:
 * - CYCLE_START : Start automatic cycling
 * - CYCLE_PAUSE : Pause the cycle
 * - SET_INTERVAL : Set cycle interval
 *
 * Circuit Selection:
 * - CIRCUIT:direct-on-line
 * - CIRCUIT:wye-delta
 * - CIRCUIT:forward-reverse
 * - CIRCUIT:cyclic-forward-reverse
 *
 * Data Format (sent from Arduino to Node.js):
 * All messages are JSON formatted with newline termination
 *
 * Example data message:
 * {
 *   "timestamp": 12345,
 *   "running": true,
 *   "sensorRaw": 512,
 *   "voltage": 2.50,
 *   "temperature": 25,
 *   "pressure": 105
 * }
 *
 * Example status message:
 * {
 *   "status": "ok",
 *   "running": true,
 *   "uptime": 12345,
 *   "freeMemory": 1234
 * }
 *
 * Example response message:
 * {
 *   "status": "success",
 *   "message": "Motor started",
 *   "command": "START",
 *   "circuit": "direct-on-line"
 * }
 */

