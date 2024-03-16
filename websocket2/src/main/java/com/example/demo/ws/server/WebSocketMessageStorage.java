package com.example.demo.ws.server;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class WebSocketMessageStorage {
    private class Node {
        JSONObject message;
        Node next;

        public Node(JSONObject message) {
            this.message = message;
            this.next = null;
        }
    }

    private Node head;

    public WebSocketMessageStorage() {
        head = null;
    }

    // 새로운 메시지를 LinkedList에 추가
    public void addMessage(JSONObject message) {
        Node newNode = new Node(message);
        if (head == null) {
            head = newNode;
        } else {
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    // n번째 데이터 가져오기
    public JSONObject getMessage(int n) {
        int count = 0;
        Node currentNode = head;
        while (currentNode != null) {
            if (count == n) {
                return currentNode.message;
            }
            count++;
            currentNode = currentNode.next;
        }
        return new JSONObject();
    }

    // 모든 데이터 가져오기
    public List<JSONObject> getAllMessages() {
        List<JSONObject> messageList = new ArrayList<>();
        Node currentNode = head;
        while (currentNode != null) {
            messageList.add(currentNode.message);
            currentNode = currentNode.next;
        }
        return messageList;
    }
}
