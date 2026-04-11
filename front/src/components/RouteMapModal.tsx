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

const DEPOT_LOCATION = {
  lat: 51.745000,
  lng: 19.495000,
  address: "Urząd Celno-Skarbowy (Baza)",
};

export const RouteMapModal: React.FC<Props> = ({ isOpen, onClose, route }) => {
  const { t } = useTranslation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const stopsData = useMemo(() => {
    if (!route || !route.stops) return [];
    return route.stops
      .sort((a, b) => a.stopSequence - b.stopSequence)
      .map((stop, index) => {
        const order = stop.order;
        
        const isPickup = [
          "ORDER_CREATED",
          "CALCULATING_ROUTE_RECEIVE",
          "ROUTE_ASSIGNED_RECEIVE",
          "IN_TRANSIT_FOR_PACKAGE",
          "ORDER_RECEIVED_FROM_CUSTOMER",
          "IN_SORTING_CENTER"
        ].includes(order.status);
        
        const location = isPickup
          ? order.pickupLocation
          : order.deliveryLocation;
          
        return {
          id: stop.id,
          sequence: index + 1,
          lat: location.latitude,
          lng: location.longitude,
          address: location.streetAddress,
          isCompleted: [
            "ORDER_RECEIVED_FROM_CUSTOMER",
            "DELIVERY_COMPLETED",
            "IN_SORTING_CENTER",
          ].includes(order.status),
        };
      });
  }, [route]);

  useEffect(() => {
    if (isOpen && stopsData.length >= 1) {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = { lat: DEPOT_LOCATION.lat, lng: DEPOT_LOCATION.lng };
      const destination = { lat: DEPOT_LOCATION.lat, lng: DEPOT_LOCATION.lng };
      
      const waypoints = stopsData.map((stop) => ({
        location: { lat: stop.lat, lng: stop.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        },
      );
    }
  }, [isOpen, stopsData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[85vh] w-11/12 max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center justify-between text-2xl">
            <span>{t("courier.routeMapTitle", "Mapa Trasy")}</span>
            <span className="text-muted-foreground text-sm font-normal">
              {stopsData.length} {t("courier.stopsCount", "przystanków")} + 1 {t("courier.depot", "baza")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 border-t border-b">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {directions && window.google && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#2563eb",
                    strokeWeight: 5,
                    strokeOpacity: 0.7,
                    icons: [
                      {
                        icon: {
                          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                          scale: 3,
                          fillColor: "#2563eb",
                          fillOpacity: 1,
                          strokeWeight: 1,
                          strokeColor: "#ffffff",
                        },
                        offset: "50px",
                        repeat: "100px",
                      },
                    ],
                  },
                }}
              />
            )}

            <MarkerF
              position={{ lat: DEPOT_LOCATION.lat, lng: DEPOT_LOCATION.lng }}
              label={{
                text: "🏠",
                fontSize: "18px",
              }}
              title={DEPOT_LOCATION.address}
              zIndex={100}
            />

            {stopsData.map((stop) => (
              <MarkerF
                key={stop.id}
                position={{ lat: stop.lat, lng: stop.lng }}
                label={{
                  text: stop.sequence.toString(),
                  color: stop.isCompleted ? "#cbd5e1" : "white",
                  fontWeight: "bold",
                }}
                title={stop.address}
                icon={
                  stop.isCompleted
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }
              />
            ))}
          </GoogleMap>
        </div>

        <div className="text-muted-foreground bg-card flex flex-wrap justify-center gap-6 p-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-semibold text-foreground">{t("courier.depot")} (Lodowa 97)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span>{t("courier.drivingPath", "Trasa")}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>{t("courier.pending")}</span>
          </div>
           <div className="flex items-center gap-2">
             <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>{t("courier.completed")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};