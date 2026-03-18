package pl.dmcs.userservice.test;

import com.github.javafaker.Faker;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.model.TransportType;

public class TestDataGenerator {

    private static final Faker faker = new Faker();

    // Prawidłowe polskie prefiksy operatorów komórkowych
    private static final String[] VALID_POLISH_PREFIXES = {
            "50", "51", "53", "60", "66", "69", "72", "73", "78", "79", "88"
    };

    public static String generateValidPolishPhoneNumber() {
        String prefix = VALID_POLISH_PREFIXES[faker.random().nextInt(VALID_POLISH_PREFIXES.length)];
        long remainingDigits = faker.random().nextLong(10000000);
        String paddedDigits = String.format("%07d", remainingDigits);

        return "+48" + prefix + paddedDigits;
    }

    public static String generateUniqueEmail() {
        return faker.internet().emailAddress();
    }
    public static String generateFirstName() {
        return faker.name().firstName();
    }
    public static String generateLastName() {
        return faker.name().lastName();
    }

    public static String generateUniqueLicensePlate() {
        String letters = faker.letterify("??").toUpperCase();
        String numbers = faker.numerify("####");
        return letters + numbers;
    }

    public static UserRequest generateValidUserRequest(UserType userType) {
        UserRequest request = new UserRequest();
        request.setFirstName(generateFirstName());
        request.setLastName(generateLastName());
        request.setEmail(generateUniqueEmail());
        request.setPhoneNumber(generateValidPolishPhoneNumber());
        request.setUserType(userType);
        return request;
    }

    public static UserRequest generateValidCustomerRequest() {
        return generateValidUserRequest(UserType.CUSTOMER);
    }

    public static UserRequest generateValidCourierRequest() {
        return generateValidUserRequest(UserType.COURIER);
    }

    public static TransportRequest generateValidTransportRequest() {
        TransportRequest request = new TransportRequest();
        request.setTransportType(TransportType.TRUCK);
        request.setBrand(faker.company().name());
        request.setModel(faker.commerce().productName());
        request.setFuelType(faker.options().option("diesel", "petrol", "lpg", "electric"));
        request.setTrunkVolume(faker.random().nextDouble() * 30000 + 1000);
        request.setCargoCapacity(faker.random().nextDouble() * 10000 + 500);
        request.setConsumption(faker.random().nextDouble() * 15 + 5);
        request.setLicensePlate(generateUniqueLicensePlate());
        request.setColor(faker.color().name());
        return request;
    }
}
