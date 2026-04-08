import React, { useRef, useMemo, useState, useEffect } from "react";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RouteResponseDTO } from "@/types/RoutingTypes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  route: RouteResponseDTO | null;
};

export const RouteMapModal: React.FC<Props> = ({ isOpen, onClose, route }) => {
  const { t } = useTranslation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Przetwarzanie punktów trasy
  const stopsData = useMemo(() => {
    if (!route || !route.stops) return [];
    return route.stops
      .sort((a, b) => a.stopSequence - b.stopSequence)
      .map((stop, index) => {
        const order = stop.order;
        const isPickup = ["CALCULATING_ROUTE_RECEIVE", "ROUTE_ASSIGNED_RECEIVE", "IN_TRANSIT_FOR_PACKAGE"].includes(order.status);
        const location = isPickup ? order.pickupLocation : order.deliveryLocation;
        return {
          id: stop.id,
          sequence: index + 1,
          lat: location.latitude,
          lng: location.longitude,
          address: location.streetAddress,
        };
      });
  }, [route]);

  // Pobieranie trasy drogowej z Google Directions API
  useEffect(() => {
    if (isOpen && stopsData.length >= 2) {
      const directionsService = new google.maps.DirectionsService();

      const origin = { lat: stopsData[0].lat, lng: stopsData[0].lng };
      const destination = { lat: stopsData[stopsData.length - 1].lat, lng: stopsData[stopsData.length - 1].lng };
      const waypoints = stopsData.slice(1, -1).map(stop => ({
        location: { lat: stop.lat, lng: stop.lng },
        stopover: true
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isOpen, stopsData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-11/12 h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{t("courier.routeMapTitle")}</span>
            <span className="text-muted-foreground text-sm font-normal">
              {stopsData.length} {t("courier.stopsCount")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative border-t border-b">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={(map) => { mapRef.current = map; }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}
          >
            {directions && (
              <DirectionsRenderer 
                directions={directions} 
                options={{
                  suppressMarkers: true, // Sami rysujemy markery z numerkami
                  polylineOptions: {
                    strokeColor: "#2563eb",
                    strokeWeight: 5,
                    strokeOpacity: 0.7
                  }
                }} 
              />
            )}

            {stopsData.map((stop) => (
              <MarkerF
                key={stop.id}
                position={{ lat: stop.lat, lng: stop.lng }}
                label={{
                  text: stop.sequence.toString(),
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            ))}
          </GoogleMap>
        </div>

        <div className="p-4 flex gap-6 text-sm text-muted-foreground justify-center bg-card">
           <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span>{t("courier.drivingPath")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
            <span>{t("courier.stops")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};