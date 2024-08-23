"use client";
import { useEffect } from "react";
import { LoginButtonProps } from "@/utils/types/types";

const Login = ({
  authCallbackUrl,
  botUsername,
  buttonSize = "large",
  cornerRadius,
  lang = "en",
  onAuthCallback,
  requestAccess = "write",
  showAvatar = true,
  widgetVersion = 22,
}: LoginButtonProps) => {
  useEffect(() => {
    // Assign the callback to the global window object if provided
    if (onAuthCallback) {
      window.TelegramAuthLogin = {
        onAuthCallback,
      };
    }
    console.log("bot user name", botUsername);
    const script = document.createElement("script");
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", buttonSize);

    if (authCallbackUrl) {
      script.setAttribute("data-auth-url", authCallbackUrl);
    } else if (onAuthCallback) {
      script.setAttribute(
        "data-onauth",
        "TelegramAuthLogin.onAuthCallback(user)"
      );
    }

    if (cornerRadius) {
      script.setAttribute("data-radius", `${cornerRadius}`);
    }
    script.setAttribute("data-userpic", JSON.stringify(Boolean(showAvatar)));
    script.setAttribute("data-lang", lang);
    script.setAttribute("data-request-access", requestAccess);

    document.getElementById("telegram-login")?.appendChild(script);

    return () => {
      document.getElementById("telegram-login")?.removeChild(script);
    };
  }, [
    authCallbackUrl,
    botUsername,
    buttonSize,
    cornerRadius,
    lang,
    onAuthCallback,
    requestAccess,
    showAvatar,
    widgetVersion,
  ]);

  return (
    <div>
      <h1>Login with Telegram</h1>
      <div id='telegram-login'></div>
    </div>
  );
};

export default Login;
