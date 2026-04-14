import { useState } from "react";
import { z } from "zod";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, realm, auth, message, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;
  
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const resetSchema = z.object({
    username: z.string().min(1, { message: msgStr("valRequired") })
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErrors({});
    
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const result = resetSchema.safeParse(data);
    
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        errs[String(issue.path[0])] = issue.message;
      });
      setLocalErrors(errs);
      return;
    }

    setLoading(true);
    form.submit();
  };

  const hasError = (field: string) => !!localErrors[field] || messagesPerField.existsError(field);
  const getError = (field: string) => localErrors[field] || messagesPerField.getFirstError(field);

  return (
    <Template headerNode={undefined} {...props}>
      <Card className="w-full max-w-md shadow-xl bg-card border-border/50">
        <CardHeader className="bg-muted/30 border-b pb-8 pt-8 text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-extrabold tracking-tight text-primary">
            <KeyRound className="h-6 w-6" />
            {msgStr("emailForgotTitle")}
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
              <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: message.summary }} />
            </div>
          )}

          <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
            {msg("emailInstruction")}
          </p>

          <form action={url.loginAction} method="post" className="space-y-6" noValidate onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold">
                {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="username" 
                  id="username" 
                  className={`pl-10 h-12 bg-background ${hasError("username") ? "border-destructive" : ""}`}
                  defaultValue={auth?.attemptedUsername ?? ""} 
                  autoFocus
                />
              </div>
              {hasError("username") && (
                 <p className="text-xs font-bold text-destructive">{getError("username")}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 font-bold text-lg" disabled={loading}>
              {msgStr("doSubmit")}
            </Button>

            <div className="text-center pt-6 border-t mt-6">
              <a href={url.loginUrl} className="text-sm font-bold text-primary hover:underline">
                ← {msg("backToLogin")}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </Template>
  );
}