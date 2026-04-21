package pl.dmcs.notifiservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "notification.email.queue";
    public static final String EXCHANGE_NAME = "boatdelivery.exchange";
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

    public static final String PAYMENT_QUEUE = "notification.payment.queue";
    public static final String PAYMENT_EXCHANGE = "payment_exchange";

    @Bean
    public Queue paymentQueue() { return new Queue(PAYMENT_QUEUE, true); }

    @Bean
    public TopicExchange paymentExchange() { return new TopicExchange(PAYMENT_EXCHANGE); }

    @Bean
    public Binding paymentBinding(Queue paymentQueue, TopicExchange paymentExchange) {
        return BindingBuilder.bind(paymentQueue).to(paymentExchange).with("payment.completed");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
