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
}
