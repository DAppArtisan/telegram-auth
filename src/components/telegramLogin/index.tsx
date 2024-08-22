"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useRedux from "@/hooks/useRedux";
const userNameSelector = (state: RootState) => state?.user;
import { RootState } from "@/contexts/store";

export interface User {
  username: string;
  name: string;
  uid: number;
  token?: string;
  img: string;
}

const TelegramAuthComponent = () => {
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  useEffect(() => {
    // Function to handle the Telegram login callback
    const handleTelegramAuth = (User: any) => {
      const userData = {
        username: user.username || "",
        name: user.first_name || "",
        uid: user.id || 0,
        token: "", // Assuming no token is provided via Telegram login
        img: user.photo_url || "",
      };
      dispatch(actions.setUserData(userData));
    };

    // Create and load the Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "communitysetupbot");
    script.setAttribute("data-size", "large");
    script.setAttribute(
      "data-auth-url",
      `${window.location.origin}/telegram-auth`
    );
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true"); // To include user's profile picture
    document.getElementById("telegram-login")?.appendChild(script);

    // Event listener for Telegram login (This will depend on how Telegram returns the data)
    window.addEventListener("message", (event) => {
      if (event.origin === "https://telegram.org") {
        const user = event.data;
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
