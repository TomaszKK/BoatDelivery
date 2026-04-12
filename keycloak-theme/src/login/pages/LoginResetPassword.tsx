import { useState } from "react";
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
  const { url, realm, auth, messagesPerField, message } = kcContext;
  const { msg, msgStr } = i18n;
  const [loading, setLoading] = useState(false);

  return (
    <Template headerNode={undefined} {...props}>
      <Card className="w-full max-w-md shadow-xl bg-white border-border/50">
        <CardHeader className="bg-slate-50/50 border-b pb-8 pt-8 text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-extrabold tracking-tight text-[#0F172A]">
            <KeyRound className="h-6 w-6" />
            {msgStr("emailForgotTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          
          {message !== undefined && (
            <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
              message.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
              message.type === "success" ? "bg-green-50 border-green-200 text-green-700" :
              message.type === "warning" ? "bg-orange-50 border-orange-200 text-orange-700" :
              "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
              <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: message.summary }} />
            </div>
          )}

          <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
            {msg("emailInstruction")}
          </p>

          <form action={url.loginAction} method="post" className="space-y-6" onSubmit={() => setLoading(true)}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold text-slate-700">
                {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  name="username" 
                  id="username" 
                  className={`pl-10 h-12 ${messagesPerField.existsError("username") ? "border-destructive" : ""}`}
                  defaultValue={auth?.attemptedUsername ?? ""} 
                  required autoFocus
                />
              </div>
              {messagesPerField.existsError("username") && (
                 <p className="text-xs font-bold text-destructive">{messagesPerField.get("username")}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-lg" disabled={loading}>
              {msgStr("doSubmit")}
            </Button>

            <div className="text-center pt-6 border-t mt-6">
              <a href={url.loginUrl} className="text-sm font-bold text-blue-600 hover:underline">
                ← {msg("backToLogin")}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </Template>
  );
}