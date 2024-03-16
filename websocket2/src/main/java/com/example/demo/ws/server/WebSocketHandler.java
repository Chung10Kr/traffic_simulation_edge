package com.example.demo.ws.server;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.java_websocket.client.WebSocketClient;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        CLIENTS.put(session.getId(), session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        CLIENTS.remove(session.getId());
    }

    public void sendMsg(TextMessage textMessage ){
        System.out.println(textMessage.getPayload());
        CLIENTS.entrySet().forEach( arg->{
            sendMessageToClient(arg.getValue(),textMessage);
        });
    }

    private List<WebSocketClient> webSocketClients = new ArrayList<>();
    public void setWebSocketClient(WebSocketClient client){
        this.webSocketClients.add( client );
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String id = session.getId();  //메시지를 보낸 아이디

        if( this.webSocketClients.size() != 0){
            CompletableFuture.runAsync(() -> {
                for(WebSocketClient webSocketClient : webSocketClients){
                    webSocketClient.send(message.getPayload());
                }
            });
        }
        producer(message.getPayload());
        CLIENTS.entrySet().forEach( arg->{
            if(!arg.getKey().equals(id)){
                sendMessageToClient(arg.getValue(),message);
            }
        });

    }

    public void sendMessageToClient(WebSocketSession session,TextMessage message){
        try {
            synchronized (session) {
                session.sendMessage(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String getIP(){
        //return "host.docker.internal:9092";
        return "localhost:9092";
    }
    public String getTopic(){
        boolean isOne = false;
        return isOne ? "edgeCar11" : "edgeCar22";
    }
    boolean start = true;
    public void producer(String msg){
        Properties configs = new Properties();
        configs.put("bootstrap.servers", getIP()); // kafka host 및 server 설정
        configs.put("acks", "all");                         // 자신이 보낸 메시지에 대해 카프카로부터 확인을 기다리지 않습니다.
        configs.put("block.on.buffer.full", "true");        // 서버로 보낼 레코드를 버퍼링 할 때 사용할 수 있는 전체 메모리의 바이트수
        configs.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");   // serialize 설정
        configs.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer"); // serialize 설정

        // producer 생성
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(configs);

        // message 전달
        producer.send(new ProducerRecord<String, String>(getTopic(), msg));

        // 종료
        producer.flush();
        producer.close();
    }
}
