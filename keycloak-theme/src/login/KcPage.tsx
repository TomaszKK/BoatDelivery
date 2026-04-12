import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import UserProfileFormFields from "keycloakify/login/UserProfileFormFields";

import Template from "./Template"; 
import "@/index.css";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword")); // <-- DODANE

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { i18n } = useI18n({ kcContext });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Ładowanie...</div>}>
      {(() => {
        switch (kcContext.pageId) {
          case "login.ftl":
            return (
              <Login {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={false} />
            );
          case "register.ftl":
            return (
              <Register {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={false} />
            );
          case "login-reset-password.ftl":
            return (
              <LoginResetPassword {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={false} />
            );
          default:
            return (
              <DefaultPage 
                {...{ kcContext, i18n, classes }} 
                Template={Template} 
                doUseDefaultCss={true} 
                UserProfileFormFields={UserProfileFormFields} 
                doMakeUserConfirmPassword={true} 
              />
            );
        }
      })()}
    </Suspense>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };