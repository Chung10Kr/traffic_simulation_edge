package com.example.demo.ws.server;

import org.java_websocket.client.WebSocketClient;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

}
