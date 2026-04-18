import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/api/api";
import type { EmailLog, SmsLog } from "@/types/NotificationType";

import { Loader2Icon, AlertCircleIcon, MailIcon, MessageSquareIcon, SearchIcon } from "lucide-react";

export const AdminLogsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);


  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const [emailRes, smsRes] = await Promise.all([
          api.getEmailLogs(),
          api.getSmsLogs()
        ]);
        setEmailLogs(emailRes.data || []);
        setSmsLogs(smsRes.data || []);
      } catch (err) {
        console.error("Błąd pobierania logów:", err);
        setError(t("admin.logs.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, [t]);

  const filteredEmailLogs = emailLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return log.recipientEmail.toLowerCase().includes(query) ||
      log.trackingNumber.toLowerCase().includes(query);
  });

  const filteredSmsLogs = smsLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return log.recipientNumber.toLowerCase().includes(query) ||
      log.trackingNumber.toLowerCase().includes(query);
  });

  const renderStatusBadge = (status: string) => {
    const isSuccess = status === 'SUCCESS' || status === 'SENT';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        isSuccess
          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      }`}>
        {status}
      </span>
    );
  };

  const renderMessageContent = (content: string | null, errorMsg: string | null) => {
    if (errorMsg) return <span className="text-red-500 font-medium">{t("admin.logs.errorPrefix")} {errorMsg}</span>;
    if (!content) return <span className="text-muted-foreground italic">{t("admin.logs.noContent")}</span>;
    return <span className="truncate max-w-xs block">{content.substring(0, 60)}...</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive bg-destructive/10 border border-destructive flex items-center gap-3 p-4 rounded-md">
        <AlertCircleIcon className="h-6 w-6" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin.logs.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.logs.description")}
          </p>
        </div>


        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder={activeTab === 'email' ? t("admin.logs.searchEmail", "Szukaj e-maila lub paczki...") : t("admin.logs.searchPhone", "Szukaj numeru lub paczki...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Nawigacja Zakładek */}
      <div className="flex space-x-6 border-b border-border">
        <button
          onClick={() => { setActiveTab('email'); setSearchQuery(""); }}
          className={`pb-3 flex items-center gap-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'email'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MailIcon className="h-4 w-4" />
          {t("admin.logs.emailTab")} ({filteredEmailLogs.length})
        </button>
        <button
          onClick={() => { setActiveTab('sms'); setSearchQuery(""); }}
          className={`pb-3 flex items-center gap-2 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'sms'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquareIcon className="h-4 w-4" />
          {t("admin.logs.smsTab")} ({filteredSmsLogs.length})
        </button>
      </div>

      {/* Tabela Danych */}
      <div className="rounded-md border border-border overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground whitespace-nowrap">
          <tr>
            <th className="p-4 font-semibold">{t("admin.logs.table.date")}</th>
            <th className="p-4 font-semibold">{t("admin.logs.table.orderNumber")}</th>
            <th className="p-4 font-semibold">
              {activeTab === 'email' ? t("admin.logs.table.recipientEmail") : t("admin.logs.table.recipientPhone")}
            </th>
            <th className="p-4 font-semibold">{t("admin.logs.table.content")}</th>
            <th className="p-4 font-semibold">{t("admin.logs.table.status")}</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-border">


          {activeTab === 'email' && (
            filteredEmailLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  {searchQuery ? t("admin.logs.noResults", "Brak wyników wyszukiwania") : t("admin.logs.emptyEmail")}
                </td>
              </tr>
            ) : (
              filteredEmailLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-xs">{log.trackingNumber}</td>
                  <td className="p-4 font-medium">{log.recipientEmail}</td>
                  <td className="p-4 text-muted-foreground">
                    {renderMessageContent(log.messageContent, log.errorMessage)}
                  </td>
                  <td className="p-4">
                    {renderStatusBadge(log.status)}
                  </td>
                </tr>
              ))
            )
          )}


          {activeTab === 'sms' && (

            filteredSmsLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  {searchQuery ? t("admin.logs.noResults", "Brak wyników wyszukiwania") : t("admin.logs.emptySms")}
                </td>
              </tr>
            ) : (
              filteredSmsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-xs">{log.trackingNumber}</td>
                  <td className="p-4 font-medium">{log.recipientNumber}</td>
                  <td className="p-4 text-muted-foreground">
                    {renderMessageContent(log.messageContent, log.errorMessage)}
                  </td>
                  <td className="p-4">
                    {renderStatusBadge(log.status)}
                  </td>
                </tr>
              ))
            )
          )}

          </tbody>
        </table>
      </div>
    </div>
  );
};