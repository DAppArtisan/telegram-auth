// import { useEffect } from "react";
// interface TelegramLoginData {
//   auth_date: number;
//   first_name: string;
//   hash: string;
//   id: number;
//   last_name?: string;
//   username?: string;
// }

// interface Telegram {
//   Login: {
//     auth: (
//       options: { bot_id: string; request_access?: boolean; lang?: string },
//       callback: (data: TelegramLoginData | false) => void
//     ) => void;
//   };
// }

// // Extend the global Window interface to include Telegram
// declare global {
//   interface Window {
//     Telegram: Telegram;
//   }
// }

// const TelegramAuth = () => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://telegram.org/js/telegram-widget.js?27";
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       if (window.Telegram) {
//         window.Telegram.Login.auth(
//           { bot_id: "7280759352", request_access: true },
//           (data) => {
//             if (!data) {
//               console.error("Authorization failed");
//               return;
//             }
//             console.log("Telegram data:", data);
//             // Handle the received data here, e.g., send it to your backend for validation
//           }
//         );
//       }
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <button
//       onClick={() =>
//         window.Telegram.Login.auth(
//           { bot_id: "7280759352", request_access: true },
//           (data) => {
//             if (!data) {
//               console.error("Authorization failed");
//               return;
//             }
//             console.log("Telegram data:", data);
//             // Handle the received data here
//           }
//         )
//       }
//     >
//       Add
//     </button>
//   );
// };

// export default TelegramAuth;

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
  const handleAuth = () => {
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
  };

  return <button onClick={handleAuth}>Log in with Telegram</button>;
};

export default TelegramAuth;
