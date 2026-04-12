import React, { useRef, useMemo, useState, useEffect } from "react";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, ExternalLink } from "lucide-react";
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
  const [showQR, setShowQR] = useState(false);

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

  const navigationUrl = useMemo(() => {
    const pendingStops = stopsData.filter(s => !s.isCompleted).slice(0, 9);
    
    if (pendingStops.length === 0) return "";

    const origin = `${DEPOT_LOCATION.lat},${DEPOT_LOCATION.lng}`;
    const destination = `${DEPOT_LOCATION.lat},${DEPOT_LOCATION.lng}`;
    const waypoints = pendingStops.map(s => `${s.lat},${s.lng}`).join("|");

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
  }, [stopsData]);

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
        <DialogHeader className="p-4 md:p-6 pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <span>{t("courier.routeMapTitle", "Mapa Trasy")}</span>
              <span className="text-muted-foreground text-sm font-normal">
                ({stopsData.length} {t("courier.stopsCount", "przystanków")} + {t("courier.depot", "baza")})
              </span>
            </DialogTitle>

            {navigationUrl && (
              <div className="flex items-center gap-2 self-start md:self-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQR(true)}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {t("courier.showQR", "Skanuj QR")}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => window.open(navigationUrl, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t("courier.showMap", "Nawiguj")} <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="relative flex-1 border-t border-b">
          
          {showQR && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4">
              <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("courier.qrTitle", "Zeskanuj, aby nawigować")}</h3>
                <div className="bg-white p-2 rounded-lg border">
                  {/* ZERO ZALEŻNOŚCI - czysty tag IMG + otwarte API */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(navigationUrl)}`} 
                    alt="QR Code" 
                    className="w-[200px] h-[200px]"
                  />
                </div>
                <p className="mt-4 text-xs text-center text-gray-500 max-w-[250px]">
                  {t("courier.qrInstructions", "Ze względu na limity Google Maps, kod zawiera do 9 najbliższych, nieukończonych punktów.")}
                </p>
                <Button 
                  className="mt-6 w-full" 
                  onClick={() => setShowQR(false)}
                >
                  {t("courier.hideQR", "Ukryj kod QR")}
                </Button>
              </div>
            </div>
          )}

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
              label={{ text: "🏠", fontSize: "18px" }}
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
            <span className="font-semibold text-foreground">{t("courier.depot", "Baza")} (Lodowa 97)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span>{t("courier.drivingPath", "Trasa")}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>{t("courier.pending", "Do zrobienia")}</span>
          </div>
           <div className="flex items-center gap-2">
             <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>{t("courier.completed", "Ukończone")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};