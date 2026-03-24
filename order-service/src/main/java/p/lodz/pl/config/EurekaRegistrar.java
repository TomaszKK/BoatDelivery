package p.lodz.pl.config;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@ApplicationScoped
public class EurekaRegistrar {

    @ConfigProperty(name = "eureka.client.serviceUrl.defaultZone", defaultValue = "http://localhost:8761/eureka")
    String eurekaBaseUrl;

    @ConfigProperty(name = "app.host.name", defaultValue = "localhost")
    String hostName;

    @ConfigProperty(name = "quarkus.http.port", defaultValue = "8082")
    int port;

    private final String appName = "ORDER-SERVICE";
    private final HttpClient client = HttpClient.newHttpClient();

    private String getInstanceId() {
        return hostName + ":" + appName.toLowerCase() + ":" + port;
    }

    private String getEurekaAppsUrl() {
        return eurekaBaseUrl + "/apps/" + appName;
    }

    void onStart(@Observes StartupEvent ev) {
        String json = """
                {
                  "instance": {
                    "instanceId": "%s",
                    "hostName": "%s",
                    "app": "%s",
                    "vipAddress": "order-service",
                    "secureVipAddress": "order-service",
                    "ipAddr": "%s",
                    "status": "UP",
                    "port": {"$": %d, "@enabled": "true"},
                    "dataCenterInfo": {
                      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                      "name": "MyOwn"
                    }
                  }
                }
                """.formatted(getInstanceId(), hostName, appName, hostName, port);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(getEurekaAppsUrl()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 204) {
                System.out.println("Registered to Eureka at " + eurekaBaseUrl + " as " + hostName);
            } else {
                System.err.println("Failed to register. HTTP Status: " + response.statusCode());
            }
        } catch (Exception e) {
            System.err.println("There was an error with registering: " + e.getMessage());
        }
    }

    @Scheduled(every = "30s")
    void sendHeartbeat() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(getEurekaAppsUrl() + "/" + getInstanceId()))
                    .PUT(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                System.out.println("Instance not found in Eureka, re-registering...");
                onStart(null);
            }
        } catch (Exception e) {
            System.err.println("There was an error sending heartbeat: " + e.getMessage());
        }
    }
}