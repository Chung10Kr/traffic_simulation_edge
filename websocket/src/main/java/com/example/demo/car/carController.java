package com.example.demo.car;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class carController {

    String carId = null;
    String time = null;
    @GetMapping("/init")
    public String init(){
        this.carId = null ;
        this.time = null;
        return "OK";
    }
    @GetMapping("/accident")
    public String accident(@RequestParam("id") String id,
                           @RequestParam("time") String time
                           ){
        this.carId = id ;
        this.time = time;
        return "OK";
    }
    @GetMapping("/isAccident")
    public Map<String,Object> isAccident(){

        Map<String,Object> result = new HashMap<>();
        result.put("target" , this.carId);
        result.put("time", time);
        return result;
    }

}
