package p.lodz.pl.util;

import java.util.UUID;

public class Util {

    public static String generateTrackingNumber() {
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "BD-" + randomPart.substring(0, 4) + "-" + randomPart.substring(4, 8);
    }

}
