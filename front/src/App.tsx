import { ThemeProvider } from "@/context/ThemeProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { RoutesComponent } from "@/router";
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from "@/components/ui/loaderComponent";
import { OrderStateProvider } from "./context/OrderContext";


const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <OrderStateProvider>
      <Router>
        <LoadingSpinner />
        <RoutesComponent />
        <Toaster />
      </Router>
      </OrderStateProvider>
    </ThemeProvider>
  );
};

export default App;
