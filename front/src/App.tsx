import { ThemeProvider } from "@/context/ThemeProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesComponent } from "@/router";
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { OrderStateProvider } from "./context/OrderContext";
import { useNotifications } from "./hooks/useNotifications";
import { useJsApiLoader } from "@react-google-maps/api";
import { KeycloakProvider } from "./hooks/useKeycloak";

const NotificationListener = () => {
  useNotifications();
  return null;
};

const App = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    console.error("Google Maps load error:", loadError);
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <OrderStateProvider>
        <Router>
          <KeycloakProvider>
            <NotificationListener />
            <LoadingSpinner />
            <RoutesComponent />
            <Toaster />
          </KeycloakProvider>
        </Router>
      </OrderStateProvider>
    </ThemeProvider>
  );
};

export default App;
