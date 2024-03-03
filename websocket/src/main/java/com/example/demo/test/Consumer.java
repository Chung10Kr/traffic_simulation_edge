package com.example.demo.test;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.util.Arrays;
import java.util.Properties;
public class Consumer {

    public static void main(String[] args) {

        Properties configs = new Properties();
        configs.put("bootstrap.servers", "localhost:9092"); // kafka server host 및 port
        configs.put("session.timeout.ms", "10000"); // session 설정
        configs.put("group.id", "edgeCar");   // topic 설정
        configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");    // key deserializer
        configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");  // value deserializer

        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(configs);    // consumer 생성
        consumer.subscribe(Arrays.asList("edgeCar")); // topic 설정

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(500);
            for (ConsumerRecord<String, String> record : records) {
                String input = record.topic();
                if ("edgeCar".equals(input)) {
                    System.out.println(record.value());
                } else {
                    throw new IllegalStateException("get message on topic " + record.topic());
                }
            }
        }
    }
}