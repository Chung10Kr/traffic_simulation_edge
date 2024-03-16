package com.example.demo;

public class MemoryUsageCalculator {
    private static long maxMemoryUsage = 0;
/*
    public static void main(String[] args) {
        // 코드 실행 전의 메모리 사용량
        calculateMaxMemoryUsage();

        // 여기에 코드 실행

        // 코드 실행 후의 메모리 사용량
        calculateMaxMemoryUsage();

        // 최대 메모리 사용량 출력
        System.out.println("Max Memory Usage: " + maxMemoryUsage);
    }
*/
    private static void calculateMaxMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        long memoryUsage = runtime.totalMemory() - runtime.freeMemory();
        if (memoryUsage > maxMemoryUsage) {
            maxMemoryUsage = memoryUsage;
        }
    }
}
