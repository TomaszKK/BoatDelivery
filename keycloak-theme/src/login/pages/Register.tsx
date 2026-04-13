import { useState } from "react";
import { z } from "zod";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Phone, PackageCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, realm, message, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;

  const formData = (kcContext as any).register?.formData || {};
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const registerSchema = z.object({
    firstName: z.string().min(1, { message: msgStr("valRequired") }),
    lastName: z.string().min(1, { message: msgStr("valRequired") }),
    username: !realm.registrationEmailAsUsername 
      ? z.string().min(1, { message: msgStr("valRequired") }) 
      : z.string().optional(),
    email: z.string().min(1, { message: msgStr("valRequired") }).email({ message: msgStr("valEmail") }),
    "user.attributes.phoneNumber": z.string().regex(/^\+48[0-9]{9}$/, { message: msgStr("valPhone") }),
    password: z.string()
        .min(8, { message: msgStr("valMinLength", "8") })
        .regex(/[A-Z]/, { message: msgStr("valUpperCase") })
        .regex(/[a-z]/, { message: msgStr("valLowerCase") })
        .regex(/[0-9]/, { message: msgStr("valDigit") }),
    "password-confirm": z.string().min(1, { message: msgStr("valRequired") })
  }).refine((data) => data.password === data["password-confirm"], {
    message: msgStr("valMatch"),
    path: ["password-confirm"]
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErrors({});
    
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const result = registerSchema.safeParse(data);
    
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

  const getSafeMessage = (summary: string | undefined) => {
    if (!summary) return "";
    try {
        return msgStr(summary as any) || summary;
    } catch {
        return summary;
    }
  };

  return (
    <Template headerNode={undefined} {...props}>
      <Card className="w-full max-w-2xl shadow-xl bg-card border-border/50">
        <CardHeader className="bg-muted/30 border-b pb-8 pt-8">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight text-primary">
            <PackageCheck className="h-8 w-8 pr-1" />
            {msgStr("registerTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 sm:p-10">
          
          {message !== undefined && (
            <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
              message.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
              message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-600" :
              message.type === "warning" ? "bg-orange-500/10 border-orange-500/20 text-orange-600" :
              "bg-blue-500/10 border-blue-500/20 text-blue-600"
            }`}>
              {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
              <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: getSafeMessage(message.summary) }} />
            </div>
          )}

          <form action={(url as any).registrationAction} method="post" className="space-y-8" noValidate onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <div className="space-y-2">
                <Label className="font-bold">{msg("firstName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input name="firstName" defaultValue={formData.firstName ?? ""} className={`pl-10 h-12 bg-background ${hasError('firstName') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                </div>
                {hasError('firstName') && <p className="text-xs font-bold text-destructive">{getError('firstName')}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold">{msg("lastName")}</Label>
                <Input name="lastName" defaultValue={formData.lastName ?? ""} className={`h-12 bg-background ${hasError('lastName') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                {hasError('lastName') && <p className="text-xs font-bold text-destructive">{getError('lastName')}</p>}
              </div>

              {!realm.registrationEmailAsUsername && (
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-bold">{msg("username")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input name="username" defaultValue={formData.username ?? ""} className={`pl-10 h-12 bg-background ${hasError('username') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                  </div>
                  {hasError('username') && <p className="text-xs font-bold text-destructive">{getError('username')}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold">{msg("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input name="email" type="email" defaultValue={formData.email ?? ""} className={`pl-10 h-12 bg-background ${hasError('email') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                </div>
                {hasError('email') && <p className="text-xs font-bold text-destructive">{getError('email')}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-bold">{msg("phoneNumberLabel")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="user.attributes.phoneNumber" 
                    defaultValue={formData["user.attributes.phoneNumber"] ?? "+48"} 
                    placeholder="+48 123 456 789"
                    className={`pl-10 h-12 bg-background ${hasError('phone') || hasError('user.attributes.phoneNumber') ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                  />
                </div>
                {(hasError('phone') || hasError('user.attributes.phoneNumber')) && (
                  <p className="text-xs font-bold text-destructive">{getError('phone') || getError('user.attributes.phoneNumber')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold">{msg("password")}</Label>
                <div className="relative"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input name="password" type="password" className={`pl-10 h-12 bg-background ${hasError('password') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                </div>
                {hasError('password') && <p className="text-xs font-bold text-destructive">{getError('password')}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-bold">{msg("passwordConfirm")}</Label>
                <div className="relative"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input name="password-confirm" type="password" className={`pl-10 h-12 bg-background ${hasError('password-confirm') || hasError('passwordConfirm') ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                </div>
                {(hasError('password-confirm') || hasError('passwordConfirm')) && <p className="text-xs font-bold text-destructive">{getError('password-confirm') || getError('passwordConfirm')}</p>}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <Label className="font-extrabold">{msg("accountTypeTitle")}</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="cursor-pointer group">
                        <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="CUSTOMER" defaultChecked={formData["user.attributes.ACCOUNT_TYPE"] !== "COURIER"} className="peer sr-only" />
                        <div className="rounded-xl border-2 p-5 bg-background peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center h-full flex flex-col justify-center">
                            <h3 className="font-bold text-lg text-foreground peer-checked:text-primary">{msg("customerTitle")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{msg("customerDesc")}</p>
                        </div>
                    </label>
                    <label className="cursor-pointer group">
                        <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="COURIER" defaultChecked={formData["user.attributes.ACCOUNT_TYPE"] === "COURIER"} className="peer sr-only" />
                        <div className="rounded-xl border-2 p-5 bg-background peer-checked:border-blue-600 peer-checked:bg-blue-500/10 transition-all text-center h-full flex flex-col justify-center">
                            <h3 className="font-bold text-lg text-foreground peer-checked:text-blue-500">{msg("courierTitle")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{msg("courierDesc")}</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full h-14 font-bold text-xl rounded-lg shadow-md transition-transform active:scale-[0.98]">
                    {msgStr("doRegister")}
                </Button>
                <div className="text-center pt-6">
                    <a href={url.loginUrl} className="text-sm font-bold text-primary hover:underline">← {msg("backToLogin")}</a>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </Template>
  );
}