"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import { User } from "@/contexts/reducers/user";

const userNameSelector = (state: RootState) => state?.user;

const TelegramAuthComponent = () => {
  const [{ dispatch, actions }, [user]] = useRedux<User>([userNameSelector]);
  const router = useRouter();
  console.log("user", user);
  useEffect(() => {
    // Function to parse the query parameters from the URL
    const getQueryParams = (url: string) => {
      const params = new URLSearchParams(new URL(url).search);
      return {
        id: params.get("id"),
        first_name: params.get("first_name"),
        last_name: params.get("last_name"),
        username: params.get("username"),
        photo_url: params.get("photo_url"),
        auth_date: params.get("auth_date"),
        hash: params.get("hash"),
      };
    };

    // Function to handle the Telegram login callback
    const handleTelegramAuth = (userParams: any) => {
      const userData: User = {
        username: userParams.username || "",
        name: `${userParams.first_name || ""} ${userParams.last_name || ""}`,
        uid: parseInt(userParams.id || "0", 10),
        token: "", // Assuming no token is provided via Telegram login
        img: userParams.photo_url || "",
      };

      // Store user data in Redux
      dispatch(actions.setUserData(userData));

      // Remove query parameters from the URL and refresh the page
      router.replace(router.pathname, undefined, { shallow: true });
    };

    // Get user parameters from the URL and process them
    const userParams = getQueryParams(window.location.href);
    if (userParams.id && userParams.username) {
      handleTelegramAuth(userParams);
    }

    // Add event listener for potential message handling from Telegram (for additional scenarios)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://telegram.org") {
        const user = event.data;
        handleTelegramAuth(user);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, router]);

  return (
    <div>
      <div id='telegram-login'></div>
    </div>
  );
};

export default TelegramAuthComponent;
