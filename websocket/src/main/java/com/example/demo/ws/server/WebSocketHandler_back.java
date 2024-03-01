package com.example.demo.ws.server;

import org.java_websocket.client.WebSocketClient;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

//@Component
public class WebSocketHandler_back extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();
    private WebSocketMessageStorage webSocketMessageStorage = new WebSocketMessageStorage();

    int sequence=0;
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        CLIENTS.put(session.getId(), session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        CLIENTS.remove(session.getId());
    }


    public void sendMsg(String msg){
        TextMessage textMessage = new TextMessage(msg);
        CLIENTS.entrySet().forEach( arg->{
            sendMessageToClient(arg.getValue(),textMessage);
        });
    }
    private WebSocketClient client;
    public void setWebSocketClient(WebSocketClient client){
        this.client = client;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String id = session.getId();  //메시지를 보낸 아이디
//        if(client!=null){
//            CompletableFuture.runAsync(() -> {
//                client.send(message.getPayload());
//            });
//        }
        String msg = message.getPayload();
        JSONObject parse = new JSONObject(msg);
        String type = parse.getString("type");

        if( type.equals("ping") ){
            pingPing(id,parse);
        }else if( type.equals("frame") ){
            sendFrame(id,parse);
        }else if( type.equals("requestReSend") ){
            reSendFrame(id,parse);
        }
    }
    public void reSendFrame(String id, JSONObject parse){
        int sequence = parse.getInt("sequence");

        //퐁 송신
        Map<String, Object> map = new HashMap<>();
        map.put("type", "pong");
        map.put("sequence", sequence);

        JSONObject stringify = new JSONObject(map);
        TextMessage textMessage = new TextMessage(stringify.toString());

        CLIENTS.entrySet().forEach( arg->{
            if(arg.getKey().equals(id)) {
                sendMessageToClient(arg.getValue(),textMessage);
            }
        });
    }
    public void pingPing(String id, JSONObject parse){

        if( parse.getInt("sequence") < sequence ){
            //과거 데이터 송신
            sendToFrame(id,sequence,webSocketMessageStorage.getMessage(sequence));
        }

        //퐁 송신
        Map<String, Object> map = new HashMap<>();
        map.put("type", "pong");
        map.put("sequence", sequence);

        JSONObject stringify = new JSONObject(map);
        String message = stringify.toString();
        TextMessage textMessage = new TextMessage(message);

        CLIENTS.entrySet().forEach( arg->{
            if(arg.getKey().equals(id)) {
                sendMessageToClient(arg.getValue(),textMessage);
            }
        });
    }

    public void sendToFrame(String id, int seq, JSONObject parse ){
        Map<String, Object> map = new HashMap<>();
        map.put("type", "frame");
        map.put("sequence", seq);
        if( parse.getJSONObject("frame") == null ){
            return;
        }
        map.put("frame", parse.getJSONObject("frame").toMap() );

        JSONObject stringify = new JSONObject(map);
        String message = stringify.toString();
        TextMessage textMessage = new TextMessage(message);

        CLIENTS.entrySet().forEach( arg->{
            if(arg.getKey().equals(id) ) {
                sendMessageToClient(arg.getValue(),textMessage);
            }
        });
    }

    // ExecutorService 생성
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    public void sendFrame(String id, JSONObject parse ){
        Map<String, Object> map = new HashMap<>();
        sequence++;
        map.put("type", "frame");
        map.put("sequence", sequence);
        map.put("frame", parse.getJSONObject("frame").toMap() );

        JSONObject stringify = new JSONObject(map);
        String message = stringify.toString();
        TextMessage textMessage = new TextMessage(message);

        // 비동기로 처리할 작업 생성 및 실행
        executorService.submit(() -> {
            webSocketMessageStorage.addMessage(parse);
        });

        Random random = new Random();

        CLIENTS.entrySet().forEach( arg->{
            Boolean isTrue = random.nextDouble() < 0.2;
            //if(!arg.getKey().equals(id)) sendMessageToClient(arg.getValue(),textMessage);
            if(!arg.getKey().equals(id) && isTrue ) sendMessageToClient(arg.getValue(),textMessage);
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

}
