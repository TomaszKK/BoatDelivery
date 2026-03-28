package pl.dmcs.springgateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Przekierowanie do User Service
                .route("user-service", r -> r.path("/api/user/**", "/api/transport/**")
                        .uri("lb://user-service"))

                // Przekierowanie do Order Service
                .route("order-service", r -> r.path("/api/orders", "/api/orders/**")
                        .uri("lb://order-service"))

                // Przekierowanie do Notification Service
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("lb://notification-service"))

                // Przekierowanie do Payment Service
                .route("payment-service", r -> r.path("/api/payments/**")
                        .uri("lb://payment-service"))
                .build();
    }
}