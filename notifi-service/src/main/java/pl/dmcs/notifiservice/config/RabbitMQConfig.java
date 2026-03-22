package pl.dmcs.notifiservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // 1. Definicja stałych dla infrastruktury
    public static final String QUEUE_NAME = "notification.email.queue";
    public static final String EXCHANGE_NAME = "boatdelivery.exchange";

    // Klucz routingu. Znak '#' oznacza, że łapiemy wszystko po kropce (np. order.created, order.cancelled)
    public static final String ROUTING_KEY = "order.#";

    // 2. Tworzenie trwałej kolejki
    @Bean
    public Queue emailQueue() {
        // Parametr 'true' oznacza Durable. Kolejka przetrwa twardy reset kontenera RabbitMQ.
        return new Queue(QUEUE_NAME, true);
    }

    // 3. Tworzenie centrali (Exchange)
    @Bean
    public TopicExchange appExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // 4. Wiązanie (Binding) kolejki z centralą za pomocą klucza routingu
    @Bean
    public Binding binding(Queue emailQueue, TopicExchange appExchange) {
        return BindingBuilder.bind(emailQueue).to(appExchange).with(ROUTING_KEY);
    }

    // 5. Krytyczny konwerter wiadomości
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}