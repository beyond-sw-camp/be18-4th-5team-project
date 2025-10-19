package com.beyond.sportsmatch.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/actuator/health/liveness")
    public String liveness() {
        log.info("[HealthCheck] Liveness checked at {}", LocalDateTime.now());
        return "ALIVE";
    }

    @GetMapping("/actuator/health/readiness")
    public String readiness() {
        log.info("[HealthCheck] Readiness checked at {}", LocalDateTime.now());
        return "READY";
    }
}
