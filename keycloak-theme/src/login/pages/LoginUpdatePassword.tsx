import { useState } from "react";
import { z } from "zod";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, messagesPerField, message, isAppInitiatedAction } = kcContext;
  const { msg, msgStr } = i18n;

  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const updatePasswordSchema = z.object({
    "password-new": z.string().min(6, { message: msgStr("valMinLength", "6") }),
    "password-confirm": z.string().min(1, { message: msgStr("valRequired") })
  }).refine((data) => data["password-new"] === data["password-confirm"], {
    message: msgStr("valMatch"),
    path: ["password-confirm"]
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErrors({});
    
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const result = updatePasswordSchema.safeParse(data);
    
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const key = String(issue.path[0]);
        errs[key] = issue.message;
      });
      setLocalErrors(errs);
      return;
    }

    setLoading(true);
    form.submit();
  };

  const hasError = (field: string) => !!localErrors[field] || messagesPerField.existsError(field);
  const getError = (field: string) => localErrors[field] || messagesPerField.getFirstError(field);

  const summary = message?.summary;
  const displayMessage = summary === "error-phoneNumber-invalid-format" 
    ? msgStr("error-phoneNumber-invalid-format") 
    : summary === "error-invalid-password"
    ? msgStr("error-invalid-password")
    : summary;

  return (
    <Template headerNode={undefined} {...props}>
      <Card className="w-full max-w-md shadow-xl bg-card border-border/50">
        <CardHeader className="bg-muted/30 border-b pb-8 pt-8 text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-extrabold tracking-tight text-primary">
            <KeyRound className="h-6 w-6" />
            {msgStr("updatePasswordTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          
          {message !== undefined && (
            <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
              message.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
              message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-600" :
              message.type === "warning" ? "bg-orange-500/10 border-orange-500/20 text-orange-600" :
              "bg-blue-500/10 border-blue-500/20 text-blue-600"
            }`}>
              {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
              {/* Ominięto funkcję msg(), ładujemy string bezpośrednio */}
              <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: displayMessage || "" }} />
            </div>
          )}

          <form action={url.loginAction} method="post" className="space-y-6" noValidate onSubmit={onSubmit}>
            
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={(kcContext as any).username ?? ""} 
              readOnly 
              autoComplete="username" 
              style={{ display: "none" }} 
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-new" className="text-sm font-bold">{msg("passwordNew")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="password-new" 
                    id="password-new" 
                    type="password" 
                    autoFocus 
                    autoComplete="new-password"
                    className={`pl-10 h-12 bg-background ${hasError("password") || hasError("password-new") ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {(hasError("password") || hasError("password-new")) && (
                   <p className="text-xs font-bold text-destructive">{getError("password") || getError("password-new")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-confirm" className="text-sm font-bold">{msg("passwordConfirm")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="password-confirm" 
                    id="password-confirm" 
                    type="password" 
                    autoComplete="new-password"
                    className={`pl-10 h-12 bg-background ${hasError("password-confirm") ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {hasError("password-confirm") && (
                   <p className="text-xs font-bold text-destructive">{getError("password-confirm")}</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" className="w-full h-12 font-bold text-lg" disabled={loading}>
                  {msgStr("doChange")}
                </Button>

                {isAppInitiatedAction && (
                    <Button type="submit" name="cancel-aia" value="true" variant="outline" className="w-full h-12 font-bold" disabled={loading}>
                        {msgStr("doCancel")}
                    </Button>
                )}
            </div>

          </form>
        </CardContent>
      </Card>
    </Template>
  );
}