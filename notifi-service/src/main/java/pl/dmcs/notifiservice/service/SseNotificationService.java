package pl.dmcs.notifiservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseNotificationService {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    public void pushNotificationToFrontend(String eventType, String data) {
        Map<String, String> payload = new HashMap<>();
        payload.put("type", eventType);
        payload.put("data", data);

        try {
            String jsonMessage = objectMapper.writeValueAsString(payload);
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().name("order-update").data(jsonMessage));
                } catch (Exception e) {
                    emitters.remove(emitter);
                }
            }
        } catch (Exception e) {
            System.err.println("Błąd parsowania JSON dla SSE: " + e.getMessage());
        }
    }
}