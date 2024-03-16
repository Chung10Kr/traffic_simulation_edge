# traffic_simulation_edge

# build
gradle build

# WebSocket Connect
localhost:1000/ws/server?svr=localhost:2000

# get status
http://localhost:1000/ws/status

# 참고
https://webfirewood.tistory.com/153#google_vignette

# 주키퍼 실행
bin/zookeeper-server-start.sh config/zookeeper.properties

# 카프카 실행
bin/kafka-server-start.sh config/server.properties

# 토픽 생성

bin/kafka-topics.sh --create --topic test --bootstrap-server localhost:9092

bin/kafka-topics.sh --create --topic edgeCar11 --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic edgeCar22 --bootstrap-server localhost:9092

# 토픽 확인
bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092
bin/kafka-topics.sh --describe --topic edgeCar --bootstrap-server localhost:9092

# 프로듀서 메세지 발행
bin/kafka-console-producer.sh --topic edgeCar --bootstrap-server localhost:9092

# 컨슈머 메세지 읽기
bin/kafka-console-consumer.sh --topic edgeCar --from-beginning --bootstrap-server localhost:9092

# 토픽 확인
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
# 토픽 삭제
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic edgeCar_1
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic edgeCar_2

# 토픽 전체 삭제
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list | while read line; do /bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic "$line"; done



# 도커
CPU 코어 : 4
메모리 : 1G
docker run -i -t -p 1000:1000 -m 1g  --net="host" --cpus=0.5 --name first-ubuntu ubuntu /bin/bash
docker run -i -t -p 2000:2000 -m 1g  --net="host" --cpus=0.5 --name second-ubuntu ubuntu /bin/bash

docker start first-ubuntu
docker start second-ubuntu

docker exec -it first-ubuntu /bin/bash
docker exec -it second-ubuntu /bin/bash

# 셋팅
apt-get update -y &&\
apt-get install vim -y &&\
apt-get install sudo -y &&\
sudo apt-get install openjdk-17-jdk -y

# jar 옮기기
docker cp /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT.jar first-ubuntu:/root
docker cp /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT.jar second-ubuntu:/root

java -Dserver.port=1000 -jar /root/websocket-0.0.1-SNAPSHOT.jar
java -Dserver.port=2000 -jar /root/websocket-0.0.1-SNAPSHOT.jar

gradle build
/bin/cp -a /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT.jar /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT-1.jar

gradle build
/bin/cp -a /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT.jar /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT-2.jar

docker cp /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT-1.jar first-ubuntu:/root
docker cp /Users/crlee/dev/project/websocket2/websocket/build/libs/websocket-0.0.1-SNAPSHOT-2.jar second-ubuntu:/root

docker exec -it first-ubuntu /bin/bash
docker exec -it second-ubuntu /bin/bash

java -Dserver.port=1000 -jar /root/websocket-0.0.1-SNAPSHOT-1.jar
java -Dserver.port=2000 -jar /root/websocket-0.0.1-SNAPSHOT-2.jar

localhost:1000/kafka/start
localhost:2000/kafka/start

docker stats first-ubuntu
docker stats second-ubuntu
