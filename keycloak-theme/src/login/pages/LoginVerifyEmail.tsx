import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;
    const { msg, msgStr } = i18n;
    const { url, user, message } = kcContext;

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
             <Card className="w-full max-w-md shadow-xl bg-card border-border/50">
                <CardHeader className="bg-muted/30 border-b pb-8 pt-8 text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl font-extrabold tracking-tight text-primary">
                    <MailCheck className="h-8 w-8" />
                    {msgStr("emailVerifyTitle")}
                </CardTitle>
                </CardHeader>

                <CardContent className="p-8 text-center space-y-6">
                    
                    {message !== undefined && (
                        <div className={`mb-2 flex items-start gap-3 p-4 rounded-lg border text-left ${
                            message.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                            message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-600" :
                            message.type === "warning" ? "bg-orange-500/10 border-orange-500/20 text-orange-600" :
                            "bg-blue-500/10 border-blue-500/20 text-blue-600"
                        }`}>
                            {message.type === "error" ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                            <span className="text-sm font-medium leading-tight" dangerouslySetInnerHTML={{ __html: getSafeMessage(message.summary) }} />
                        </div>
                    )}

                    <p className="text-base text-foreground font-medium">
                        {msg("emailVerifyInstruction1", user?.email ?? "")}
                    </p>
                    
                    <div className="bg-muted/50 p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {msg("emailVerifyInstruction2")}
                            <br /><br />
                            <a href={url.loginAction} className="font-bold text-primary hover:underline">
                                {msg("doClickHere")}
                            </a>
                            &nbsp;
                            {msg("emailVerifyInstruction3")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Template>
    );
}