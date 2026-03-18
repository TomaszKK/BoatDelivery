package p.lodz.pl.config;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@ApplicationScoped
public class EurekaRegistrar {

    private final HttpClient client = HttpClient.newHttpClient();
    private final String appName = "ORDER-SERVICE";
    private final String instanceId = "localhost:order-service:8082";
    private final String eurekaUrl = "http://localhost:8761/eureka/apps/" + appName;

    void onStart(@Observes StartupEvent ev) {
        String json = """
                {
                  "instance": {
                    "instanceId": "%s",
                    "hostName": "localhost",
                    "app": "%s",
                    "vipAddress": "order-service",
                    "secureVipAddress": "order-service",
                    "ipAddr": "127.0.0.1",
                    "status": "UP",
                    "port": {"$": 8082, "@enabled": "true"},
                    "dataCenterInfo": {
                      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                      "name": "MyOwn"
                    }
                  }
                }
                """.formatted(instanceId, appName);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(eurekaUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Registered to Eureka");
        } catch (Exception e) {
            System.err.println("There was an error with registering: " + e.getMessage());
        }
    }

    @Scheduled(every = "30s")
    void sendHeartbeat() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(eurekaUrl + "/" + instanceId))
                    .PUT(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                System.out.println("Instance not found in Eureka, re-registering...");
                onStart(null);
            }
        } catch (Exception e) {
            System.err.println("There was an error: " + e.getMessage());
        }
    }
}