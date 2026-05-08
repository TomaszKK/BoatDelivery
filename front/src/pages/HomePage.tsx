import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ship,
  Map,
  LayoutDashboard,
  Search,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  BotMessageSquare,
  Send,
  UserCircle2
} from "lucide-react";
import type { TrackedOrder } from "@/types/OrderType";
import { useOrder } from "@/hooks/useOrder";

const getProgressIndex = (status: string) => {
  if (status === "ORDER_CANCELED") return -1;
  if (
    [
      "ORDER_CREATED",
      "CALCULATING_ROUTE_RECEIVE",
      "ROUTE_ASSIGNED_RECEIVE",
    ].includes(status)
  )
    return 0;
  if (
    ["IN_TRANSIT_FOR_PACKAGE", "ORDER_RECEIVED_FROM_CUSTOMER"].includes(status)
  )
    return 1;
  if (
    [
      "IN_SORTING_CENTER",
      "CALCULATING_ROUTE_DELIVERY",
      "ROUTE_ASSIGNED_DELIVERY",
    ].includes(status)
  )
    return 2;
  if (["IN_TRANSIT_TO_CUSTOMER"].includes(status)) return 3;
  if (["DELIVERY_COMPLETED"].includes(status)) return 4;
  return 0;
};

export const HomePage = () => {
  const { t } = useTranslation();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  
  const [aiMessage, setAiMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { getMininalizedOrderByTrackingNumber, chatAboutOrder } = useOrder();

  const handleTrackPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setTrackedOrder(null);
    setAiResponse("");
    setLastQuestion("");

    try {
      const data = (await getMininalizedOrderByTrackingNumber(
        trackingNumber.trim(),
      )) as TrackedOrder;

      if (data && data.trackingNumber) {
        setTrackedOrder(data);
      }
    } catch (error: any) {
      setTrackedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim() || !trackedOrder?.trackingNumber) return;

    const questionToAsk = aiMessage.trim();
    setLastQuestion(questionToAsk);
    setAiMessage("");
    setAiResponse("");
    setIsAiLoading(true);

    try {
      const res = await chatAboutOrder(trackedOrder.trackingNumber, questionToAsk);
      if (res && res.response) {
        setAiResponse(res.response);
      }
    } catch (error) {
      setAiResponse(t("ai.error", "Przepraszam, wystąpił problem z pobraniem odpowiedzi. Spróbuj ponownie."));
    } finally {
      setIsAiLoading(false);
    }
  };

  const steps = [
    t("home.stepCreated"),
    t("home.stepPickedUp"),
    t("home.stepSorting"),
    t("home.stepInTransit"),
    t("home.stepDelivered"),
  ];

  const currentIndex = trackedOrder ? getProgressIndex(trackedOrder.status) : 0;
  const isCanceled = trackedOrder?.status === "ORDER_CANCELED";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center space-y-12 p-6 text-center">
      <div className="mt-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {t("home.welcomeTo")}{" "}
          <span className="text-primary">BoatDelivery</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          {t("home.heroDescription")}
        </p>
      </div>

      <div className="bg-card border-border/50 mx-auto w-full max-w-xl rounded-2xl border p-2 shadow-lg">
        <form onSubmit={handleTrackPackage} className="flex gap-2">
          <div className="relative flex-1">
            <Package className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t("home.enterTracking")}
              className="h-14 border-none bg-transparent pl-10 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !trackingNumber.trim()}
            className="h-14 rounded-xl bg-blue-600 px-8 text-lg text-white transition-all hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            {t("home.trackButton")}
          </Button>
        </form>
      </div>

      {trackedOrder && (
        <div className="animate-in slide-in-from-bottom-4 fade-in w-full max-w-3xl space-y-6 duration-300">
          <Card
            className={`${isCanceled ? "border-red-500/30 bg-red-500/5" : "border-blue-500/30 bg-blue-500/5"} shadow-md`}
          >
            <CardContent className="p-6">
              <div className="mb-8 text-left">
                <p className="text-muted-foreground mb-1 text-sm font-medium">
                  {t("home.packageStatus")}:{" "}
                  <span className="text-foreground font-mono font-bold">
                    {trackedOrder.trackingNumber}
                  </span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    ({trackedOrder.weight} kg)
                  </span>
                </p>
                <h3
                  className={`text-2xl font-bold ${isCanceled ? "text-red-500" : "text-blue-600"}`}
                >
                  {t(`orders.${trackedOrder.status}`, trackedOrder.status)}
                </h3>
              </div>

              {isCanceled ? (
                <div className="flex flex-col items-center justify-center py-6 text-red-500">
                  <XCircle className="mb-2 h-12 w-12 opacity-80" />
                  <p className="text-lg font-medium">
                    {t("home.orderCanceledMsg")}
                  </p>
                </div>
              ) : (
                <div className="relative mx-auto mt-4 flex w-full max-w-2xl justify-between">
                  <div className="bg-muted absolute top-4 left-0 h-1 w-full -translate-y-1/2 rounded-full"></div>
                  <div
                    className="absolute top-4 left-0 h-1 -translate-y-1/2 rounded-full bg-blue-500 transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                    }}
                  ></div>

                  {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isActive = index === currentIndex;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                            isCompleted
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-muted bg-card text-muted-foreground"
                          } ${isActive ? "ring-4 ring-blue-500/20" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current opacity-50" />
                          )}
                        </div>
                        <span
                          className={`max-w-[80px] text-center text-xs leading-tight font-medium ${
                            isActive ? "text-foreground font-bold" : "text-muted-foreground"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm text-left">
            <CardHeader className="pb-2 border-b border-indigo-100/50 bg-indigo-50/50">
              <CardTitle className="text-indigo-800 text-lg flex items-center gap-2">
                <BotMessageSquare className="h-5 w-5" />
                {t("ai.chatTitle", "Asystent BoatDelivery")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              
              {lastQuestion && (
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%] text-left">
                      {lastQuestion}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <UserCircle2 className="h-3 w-3" /> Ty
                    </span>
                  </div>

                  <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-4 duration-300">
                    {isAiLoading ? (
                      <div className="bg-white border border-indigo-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-indigo-500 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> {t("ai.typing", "AI pisze...")}
                      </div>
                    ) : (
                      <div className="bg-white border border-indigo-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-indigo-950 whitespace-pre-wrap max-w-[95%]">
                        {aiResponse}
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <BotMessageSquare className="h-3 w-3" /> BoatDelivery AI
                    </span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleAiChat} className="flex gap-2">
                <Input 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder={t("ai.chatPlaceholder", "Napisz wiadomość... Np. Kiedy paczka do mnie dotrze?")}
                  className="bg-white border-indigo-200 focus-visible:ring-indigo-500"
                />
                <Button 
                  type="submit" 
                  disabled={isAiLoading || !aiMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid w-full gap-6 pt-8 pb-12 md:grid-cols-3">
        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <Ship className="mx-auto mb-2 h-12 w-12 text-blue-500" />
            <CardTitle className="text-lg">
              {t("home.cardCreateOrders")}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <Map className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <CardTitle className="text-lg">
              {t("home.cardTrackRealtime")}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
          <CardHeader className="pb-2 text-center">
            <LayoutDashboard className="mx-auto mb-2 h-12 w-12 text-indigo-500" />
            <CardTitle className="text-lg">
              {t("home.cardManageRoutes")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};