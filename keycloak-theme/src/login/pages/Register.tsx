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

  return (
    <Template headerNode={undefined} {...props}>
      <Card className="w-full max-w-2xl shadow-xl bg-white border-border/50">
        <CardHeader className="bg-slate-50/50 border-b pb-8 pt-8">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight text-[#0F172A]">
            <PackageCheck className="h-8 w-8 pr-1" />
            {msgStr("registerTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 sm:p-10">
          
          {message !== undefined && (
            <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border ${
              message.type === "error" ? "bg-red-50 border-red-200 text-red-700" :
              message.type === "success" ? "bg-green-50 border-green-200 text-green-700" :
              message.type === "warning" ? "bg-orange-50 border-orange-200 text-orange-700" :
              "bg-blue-50 border-blue-200 text-blue-700"
            }`}>
              {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
              <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: msg(message.summary as any) || message.summary }} />
            </div>
          )}

          <form action={(url as any).registrationAction} method="post" className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("firstName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input name="firstName" defaultValue={formData.firstName ?? ""} className={`pl-10 h-12 ${messagesPerField.existsError('firstName') ? 'border-red-500' : ''}`} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("lastName")}</Label>
                <Input name="lastName" defaultValue={formData.lastName ?? ""} className={`h-12 ${messagesPerField.existsError('lastName') ? 'border-red-500' : ''}`} required />
              </div>

              {!realm.registrationEmailAsUsername && (
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-bold text-slate-700">{msg("username")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input name="username" defaultValue={formData.username ?? ""} className={`pl-10 h-12 ${messagesPerField.existsError('username') ? 'border-red-500' : ''}`} required />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input name="email" type="email" defaultValue={formData.email ?? ""} className={`pl-10 h-12 ${messagesPerField.existsError('email') ? 'border-red-500' : ''}`} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("phoneNumberLabel")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input 
                    name="user.attributes.phoneNumber" 
                    defaultValue={formData["user.attributes.phoneNumber"] ?? "+48"} 
                    placeholder="+48 123 456 789"
                    pattern="^\+48[0-9]{9}$" 
                    title={msgStr("error-phoneNumber-invalid-format")} 
                    className={`pl-10 h-12 ${messagesPerField.existsError('user.attributes.phoneNumber') ? 'border-red-500' : ''}`} 
                    required 
                  />
                </div>
                {messagesPerField.existsError('user.attributes.phoneNumber') && (
                  <p className="text-xs font-bold text-red-500">{messagesPerField.get('user.attributes.phoneNumber')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("password")}</Label>
                <div className="relative"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><Input name="password" type="password" className={`pl-10 h-12 ${messagesPerField.existsError('password') ? 'border-red-500' : ''}`} required /></div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">{msg("passwordConfirm")}</Label>
                <div className="relative"><Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><Input name="password-confirm" type="password" className={`pl-10 h-12 ${messagesPerField.existsError('password-confirm') ? 'border-red-500' : ''}`} required /></div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <Label className="font-extrabold text-slate-800">{msg("accountTypeTitle")}</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="cursor-pointer group">
                        <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="CUSTOMER" defaultChecked={formData["user.attributes.ACCOUNT_TYPE"] !== "COURIER"} className="peer sr-only" />
                        <div className="rounded-xl border-2 p-5 peer-checked:border-[#0F172A] peer-checked:bg-slate-50 transition-all text-center h-full flex flex-col justify-center">
                            <h3 className="font-bold text-lg">{msg("customerTitle")}</h3>
                            <p className="text-xs text-slate-500 mt-1">{msg("customerDesc")}</p>
                        </div>
                    </label>
                    <label className="cursor-pointer group">
                        <input type="radio" name="user.attributes.ACCOUNT_TYPE" value="COURIER" defaultChecked={formData["user.attributes.ACCOUNT_TYPE"] === "COURIER"} className="peer sr-only" />
                        <div className="rounded-xl border-2 p-5 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center">
                            <h3 className="font-bold text-lg">{msg("courierTitle")}</h3>
                            <p className="text-xs text-slate-500 mt-1">{msg("courierDesc")}</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full h-14 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xl rounded-lg shadow-md transition-transform active:scale-[0.98]">
                    {msgStr("doRegister")}
                </Button>
                <div className="text-center pt-6">
                    <a href={url.loginUrl} className="text-sm font-bold text-blue-600 hover:underline">← {msg("backToLogin")}</a>
                </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </Template>
  );
}