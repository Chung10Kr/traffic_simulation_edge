# traffic_simulation
# traffic_simulation_edge

# build
gradle bild

# Run Jar
java -Dserver.port=1000 -jar websocket-0.0.1-SNAPSHOT.jar
java -Dserver.port=2000 -jar websocket-0.0.1-SNAPSHOT.jar

# WebSocket Connect
localhost:1000/ws/server?svr=localhost:2000

# get status
http://localhost:1000/ws/status