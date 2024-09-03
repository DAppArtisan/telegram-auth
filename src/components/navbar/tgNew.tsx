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
//     script.setAttribute("data-telegram-login", "communitysetupbot");
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

// import { useEffect } from "react";

// const TelegramLogin = () => {
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const script = document.createElement("script");
//       script.src = "//telegram.org/js/widget-frame.js?27";
//       script.async = true;
//       script.onload = () => {
//         (window as any).TWidgetLogin.init(
//           "widget_login",
//           7280759352,
//           { origin: "https://core.telegram.org" },
//           false,
//           "en"
//         );
//       };
//       document.body.appendChild(script);
//     }
//   }, []);

//   return (
//     <div
//       className='tgme_widget_login medium nouserpic'
//       id='widget_login'
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//       }}
//     >
//       <button
//         className='btn tgme_widget_login_button'
//         onClick={() => (window as any).TWidgetLogin.auth()}
//         style={{
//           padding: "10px 20px",
//           fontSize: "18px",
//           color: "#fff",
//           backgroundColor: "#0088cc",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         <i
//           className='tgme_widget_login_button_icon'
//           style={{
//             marginRight: "10px",
//             background:
//               'url("//telegram.org/img/t_logo.png") no-repeat center center',
//             backgroundSize: "contain",
//             width: "24px",
//             height: "24px",
//           }}
//         ></i>
//         Log in with Telegram
//       </button>
//     </div>
//   );
// };

// export default TelegramLogin;

import { useEffect } from "react";

// Define the types for the Telegram API
interface TelegramLoginData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name?: string;
  username?: string;
}

interface Telegram {
  Login: {
    auth: (
      options: { bot_id: string; request_access?: boolean; lang?: string },
      callback: (data: TelegramLoginData | false) => void
    ) => void;
  };
}

// Extend the global Window interface to include Telegram
declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const TelegramAuth = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?27";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Telegram) {
        window.Telegram.Login.auth(
          { bot_id: "7280759352", request_access: true },
          (data) => {
            if (!data) {
              console.error("Authorization failed");
              return;
            }
            console.log("Telegram data:", data);
            // Handle the received data here, e.g., send it to your backend for validation
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button
      onClick={() =>
        window.Telegram.Login.auth(
          { bot_id: "7280759352", request_access: true },
          (data) => {
            if (!data) {
              console.error("Authorization failed");
              return;
            }
            console.log("Telegram data:", data);
            // Handle the received data here
          }
        )
      }
    >
      Add
    </button>
  );
};

export default TelegramAuth;
