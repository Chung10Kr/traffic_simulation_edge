package com.example.demo.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    @KafkaListener(topics = "edgeCar", groupId = "myGroup")
    public void listener(Object data) {
        System.out.println(data);
    }
}