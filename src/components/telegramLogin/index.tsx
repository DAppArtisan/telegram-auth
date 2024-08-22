"use client";
import { useEffect } from "react";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import { User } from "@/contexts/reducers/user";
const userNameSelector = (state: RootState) => state?.user;

const TelegramAuthComponent = () => {
  const [{ dispatch, actions }, [user]] = useRedux<User>([userNameSelector]);

  useEffect(() => {
    // Function to handle the Telegram login callback
    const handleTelegramAuth = (telegramUser: any) => {
      const userData: User = {
        username: telegramUser.username || "",
        name: telegramUser.first_name || "",
        uid: telegramUser.id || 0,
        token: "", // Assuming no token is provided via Telegram login
        img: telegramUser.photo_url || "",
      };

      console.log("User Data", userData);
      dispatch(actions.setUserData(userData));
    };

    // Create and load the Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "communitysetupbot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", `${window.location.origin}/`);
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true"); // To include user's profile picture
    document.getElementById("telegram-login")?.appendChild(script);

    window.addEventListener("message", (event) => {
      if (event.origin === "https://telegram.org") {
        const user = event.data;
        console.log("User Data 2", user);
        handleTelegramAuth(user);
      }
    });

    return () => {
      window.removeEventListener("message", () => {});
    };
  }, [dispatch]);

  return (
    <div>
      <div id='telegram-login'></div>
    </div>
  );
};

export default TelegramAuthComponent;
