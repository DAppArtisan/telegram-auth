import React, { useEffect } from "react";

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
}) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?19";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-request-access", "write");

    // Attach the Telegram login callback to the global window object
    (window as any).TelegramLoginWidgetCallback = (user: any) => {
      onAuth(user);
    };

    document.getElementById("telegram-login")?.appendChild(script);

    // Clean up the script on component unmount
    return () => {
      const scriptElement = document.getElementById("telegram-login");
      if (scriptElement) {
        scriptElement.innerHTML = ""; // Remove script
      }
      delete (window as any).TelegramLoginWidgetCallback; // Clean up global callback
    };
  }, [botName, onAuth]);

  return <div id='telegram-login'></div>;
};

export default TelegramLoginButton;
