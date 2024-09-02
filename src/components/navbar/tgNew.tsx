// import Script from "next/script";
// import { useEffect, useReducer, useRef, useState } from "react";
// const TGLogin = () => {
//   const botUsername = "7280759352"; // Aapke bot ka username yahan likhein
//   const authCallbackUrl = encodeURIComponent(
//     "https://telegram-auth-five.vercel.app/"
//   ); // Callback URL ko yahan likhein

//   const scriptContainerRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://telegram.org/js/telegram-widget.js?22";
//     script.async = true;
//     script.setAttribute("data-telegram-login", "7280759352");
//     script.setAttribute("data-size", "large");
//     script.setAttribute("data-onauth", "onTelegramAuth(user)");
//     script.setAttribute("data-request-access", "write");
//     scriptContainerRef.current?.appendChild(script);
//   }, []);

//   return (
//     <div
//       id='my-special-div'
//       ref={scriptContainerRef}
//       onClick={() => {
//         window.location.href = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${authCallbackUrl}&request_access=write`;
//       }}
//     >
//       Login
//     </div>
//   );
// };

// export default TGLogin;
import { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//telegram.org/js/widget-frame.js?27";
      script.async = true;
      script.onload = () => {
        (window as any).TWidgetLogin.init(
          "widget_login",
          7280759352,
          { origin: "https://core.telegram.org" },
          false,
          "en"
        );
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className='tgme_widget_login medium nouserpic'
      id='widget_login'
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        className='btn tgme_widget_login_button'
        onClick={() => (window as any).TWidgetLogin.auth()}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          color: "#fff",
          backgroundColor: "#0088cc",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <i
          className='tgme_widget_login_button_icon'
          style={{
            marginRight: "10px",
            background:
              'url("//telegram.org/img/t_logo.png") no-repeat center center',
            backgroundSize: "contain",
            width: "24px",
            height: "24px",
          }}
        ></i>
        Log in with Telegram
      </button>
    </div>
  );
};

export default TelegramLogin;
