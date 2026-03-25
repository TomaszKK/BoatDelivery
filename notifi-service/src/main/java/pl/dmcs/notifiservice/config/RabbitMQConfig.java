package pl.dmcs.notifiservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Definiowanie nazw kolejki i centrali
    public static final String QUEUE_NAME = "notification.email.queue";
    public static final String EXCHANGE_NAME = "boatdelivery.exchange";

    // Klucz routingu, obojetnie co bedzie po order.[costam]
    public static final String ROUTING_KEY = "order.#";

    @Bean
    public Queue emailQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange appExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding binding(Queue emailQueue, TopicExchange appExchange) {
        return BindingBuilder.bind(emailQueue).to(appExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}