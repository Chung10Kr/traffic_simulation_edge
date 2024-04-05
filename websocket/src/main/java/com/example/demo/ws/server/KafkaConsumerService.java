package com.example.demo.ws.server;

import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

import java.util.Arrays;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@Component
public class KafkaConsumerService {

    private final WebSocketHandler webSocketHandler;
    public KafkaConsumerService(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    // ApplicationReadyEvent를 사용하여 모든 스프링 빈 초기화 후에 실행
    @EventListener(ApplicationReadyEvent.class)
    public void startConsumer() {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        executorService.execute(this::consumer);
        executorService.shutdown(); // ExecutorService를 적절히 종료
    }

    public void consumer(){
        Properties configs = new Properties();
        configs.put("bootstrap.servers", webSocketHandler.getIP());
        configs.put("session.timeout.ms", "10000");
        configs.put("group.id",webSocketHandler.getTopic());
        configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configs);
        consumer.subscribe(Arrays.asList(webSocketHandler.getTopic()));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(500);
            for (ConsumerRecord<String, String> record : records) {
                String input = record.topic();
                if (webSocketHandler.getTopic().equals(input)) {

                    String message = record.value();

                    // 메시지를 '-' 기준으로 분리
                    String[] parts = message.split("Chung10", 2);
                    String id = parts[0];
                    String msg = parts.length > 1 ? parts[1] : "";
                    System.out.println("From " + id);
                    System.out.println("msg : " + msg);
                    TextMessage textMessage = new TextMessage(msg);
                    webSocketHandler.sendToConnectedCar(id,textMessage);
                } else {
                    throw new IllegalStateException("get message on topic " + record.topic());
                }
            }
        }
    }
}
