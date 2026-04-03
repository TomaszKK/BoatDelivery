package p.lodz.pl.util;

import p.lodz.pl.model.Location;

import java.util.UUID;

public class Util {

    private static final int EARTH_RADIUS_METERS = 6371000;

    public static String generateTrackingNumber() {
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "BD-" + randomPart.substring(0, 4) + "-" + randomPart.substring(4, 8);
    }

// Tylko i wylacznie dlatego, ze chce ograniczyc calle do api google
// mapsow/hereapi to odlegloc przy liczeniu bedzie obliczana w linii prostej
// z lng i lat a dopiero na koncu droga bedzie generowana juz po mapach
    public static int calculateDistance(Location loc1, Location loc2) {
        if (loc1 == null || loc2 == null) return 0;

        double lat1 = loc1.latitude.doubleValue();
        double lon1 = loc1.longitude.doubleValue();
        double lat2 = loc2.latitude.doubleValue();
        double lon2 = loc2.longitude.doubleValue();

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (int) (EARTH_RADIUS_METERS * c);
    }

}
