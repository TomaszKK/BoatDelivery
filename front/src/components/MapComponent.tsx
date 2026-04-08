import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useCallback } from "react";
import type { LocationResponseDTO } from "@/types/OrderType";

type Props = {
  pickupLocation?: LocationResponseDTO | null;
  deliveryLocation?: LocationResponseDTO | null;
};

const MapComponent: React.FC<Props> = ({
  pickupLocation,
  deliveryLocation,
}) => {
  const { t } = useTranslation();
  const mapRef = useRef<google.maps.Map | null>(null);

  const pickupCoords = pickupLocation
    ? { lat: pickupLocation.latitude, lng: pickupLocation.longitude }
    : null;

  const deliveryCoords = deliveryLocation
    ? { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude }
    : null;

  const updateBounds = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds();
      let hasPoints = false;

      if (pickupCoords) {
        bounds.extend(pickupCoords);
        hasPoints = true;
      }

      if (deliveryCoords) {
        bounds.extend(deliveryCoords);
        hasPoints = true;
      }

      if (hasPoints) {
        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    },
    [
      pickupCoords?.lat,
      pickupCoords?.lng,
      deliveryCoords?.lat,
      deliveryCoords?.lng,
    ],
  );

  useEffect(() => {
    if (mapRef.current) {
      updateBounds(mapRef.current);
    }
  }, [updateBounds]);

  if (!pickupCoords && !deliveryCoords) {
    return <p>{t("loadingMap")}</p>;
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border dark:border-slate-700">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        onLoad={(map) => {
          mapRef.current = map;
          updateBounds(map);
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
      >
        {pickupCoords && (
          <MarkerF position={pickupCoords} label="P" title="Pickup" />
        )}

        {deliveryCoords && (
          <MarkerF position={deliveryCoords} label="D" title="Delivery" />
        )}
      </GoogleMap>

      <div className="flex gap-4 p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-600">P</span>
          <span>{t("orders.pickup")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">D</span>
          <span>{t("orders.delivery")}</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
