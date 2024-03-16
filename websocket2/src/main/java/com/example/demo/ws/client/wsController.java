package com.example.demo.ws.client;

import com.example.demo.ws.server.WebSocketHandler;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.java_websocket.client.WebSocketClient;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

@RestController
public class wsController {

    private final WebSocketHandler webSocketHandler;
    public wsController(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }
    private List<WebSocketClient> webSocketClients = new ArrayList<>();


    @GetMapping("/kafka/start")
    public String startConsumer(){

//        Thread thread = new Thread(() -> {

            String topic = (webSocketHandler.getTopic()).equals("edgeCar11") ? "edgeCar22" : "edgeCar11";
            Properties configs = new Properties();
            configs.put("bootstrap.servers", webSocketHandler.getIP());
            configs.put("session.timeout.ms", "10000");
            configs.put("group.id",topic);
            configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
            configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

            KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
            consumer.subscribe(Arrays.asList(topic));

            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(500);
                for (ConsumerRecord<String, String> record : records) {
                    String input = record.topic();
                    if (topic.equals(input)) {
                        System.out.println("input" + input);
                        TextMessage textMessage = new TextMessage(record.value());
                        webSocketHandler.sendMsg(textMessage);
                    } else {
                        throw new IllegalStateException("get message on topic " + record.topic());
                    }
                }
            }
//        });

//        thread.start(); // 스레드 시작

        //return "시작";
    };

    @GetMapping("/ws/status")
    public String status(){
        String str =  "Now Connect : " + webSocketClients.size() + System.lineSeparator();
        for (WebSocketClient client: webSocketClients) {
            str+="URL " + client.getURI() + System.lineSeparator();
        }
        return str;
    }

    public WebSocketClient createWebSocketClient(String serverIp){
        try {
            String url = "ws://"+serverIp+"/ws/message";
            WebSocketClient client = new EmptyClient(new URI(url),webSocketHandler);
            client.connect();
            return client;
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
    @GetMapping("/ws/server")
    public String connectSvr(String svr){
        WebSocketClient webSocketClient = createWebSocketClient(svr);
        webSocketClients.add(webSocketClient);
        webSocketHandler.setWebSocketClient(webSocketClient);
        return "연결 완료";
    }

    @GetMapping("/ws/send/server")
    public String sendMsgToSvr(){
        CompletableFuture.runAsync(() -> {
            for( WebSocketClient client : webSocketClients){
                client.send("HI! FROM WS111");
            }
        });
        return "성공";
    }


}
