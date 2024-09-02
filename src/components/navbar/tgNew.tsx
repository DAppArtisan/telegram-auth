import Script from "next/script";
import { useEffect, useReducer, useRef, useState } from "react";
const TGLogin = () => {
  const botUsername = "communitysetupbot"; // Aapke bot ka username yahan likhein
  const authCallbackUrl = encodeURIComponent(
    "https://telegram-auth-five.vercel.app/"
  ); // Callback URL ko yahan likhein

  const scriptContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "communitysetupbot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    scriptContainerRef.current?.appendChild(script);
  }, []);

  return (
    <div
      id='my-special-div'
      ref={scriptContainerRef}
      onClick={() => {
        window.location.href = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${authCallbackUrl}&request_access=write`;
      }}
    >
      {" "}
      Login
    </div>
  );
};

export default TGLogin;
