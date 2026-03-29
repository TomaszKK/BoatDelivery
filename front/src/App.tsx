import { ThemeProvider } from "@/context/ThemeProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesComponent } from "@/router";
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { OrderStateProvider } from "./context/OrderContext";
import { useNotifications } from "./hooks/useNotifications";

// Komponent startujacy nasluch wyciszenia powiadomien
const NotificationListener = () => {
  useNotifications();
  return null;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <OrderStateProvider>
        <Router>
          <NotificationListener />
          <LoadingSpinner />
          <RoutesComponent />
          <Toaster />
        </Router>
      </OrderStateProvider>
    </ThemeProvider>
  );
};

export default App;
