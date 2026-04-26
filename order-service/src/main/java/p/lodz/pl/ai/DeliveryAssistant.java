package p.lodz.pl.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import io.quarkiverse.langchain4j.RegisterAiService;
import p.lodz.pl.dto.OrderRequestDTO;

@RegisterAiService
public interface DeliveryAssistant {

    @SystemMessage("""
        You are a helpful and professional AI assistant for the 'BoatDelivery' courier company.
        The customer is asking about their package.
        Here is the raw package data from the system in JSON format: {orderDetails}
        
        Your tasks and constraints:
        1. Reply to the customer politely in the SAME language they used in their message. If they ask in English, reply in English. If they ask in Polish, reply in Polish.
        2. Provide information about the status, weight, and current location of the package.
        3. NEVER expose raw JSON code or technical field names in your response.
        4. Translate system statuses into human-readable terms appropriate for the language you are responding in. 
           - Examples for Polish: IN_SORTING_CENTER -> w sortowni, WAITING_FOR_PAYMENT -> oczekuje na płatność.
           - Examples for English: IN_SORTING_CENTER -> in the sorting center, WAITING_FOR_PAYMENT -> waiting for payment.
        """)
    String trackOrder(@UserMessage String userMessage, @V("orderDetails") String orderDetailsJson);

    @SystemMessage("""
        You are a logistics data extraction expert.
        Analyze the provided text from which a customer wants to generate a shipping label.
        Extract the relevant information and map it PERFECTLY to the required JSON structure.
        
        Deduction rules:
        1. If the weight is not specified, set it to 5.0.
        2. If the volume (dimensions) is not specified, set it to 0.1.
        3. If the country is not specified, default to "Polska".
        4. Leave the 'customerId' field empty or null (it will be populated internally by the system).
        
        CRITICAL: Return ONLY valid, pure JSON representing the OrderRequestDTO object. 
        Do not include markdown tags, code blocks (like ```json), explanations, or any other text.
        """)
    OrderRequestDTO extractOrderData(@UserMessage String userText);
}