"use client";
// @ts-nocheck
import { getSignMessage } from "@/config/ethers";
import { useAccount } from "wagmi";
// import { useSigner } from 'wagmi';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Modal, Divider, Popover } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";
import { AiOutlinePlus } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import "./navbar.scss";
import CButton from "../common/Button";
import { FaRegBell } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
//
import TelegramLogin from "./telegramAuth";
import { TelegramAuthData } from "@/utils/types/types";

import TGNew from "./tgNew";

import useRedux from "@/hooks/useRedux";
import {
  fetchUserById,
  fetchUserByUserName,
  handleLogIn,
  handleLogOut,
  handleSignup,
} from "@/services/api/api";

import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";
import {
  debounce,
  deleteClientSideCookie,
  getClientSideCookie,
  getImageSource,
  setClientSideCookie,
} from "@/utils/helpers";
import Link from "next/link";

import { sigMsg } from "@/utils/constants";
import { IoSettingsOutline } from "react-icons/io5";

import CInput from "../common/Input";
import Image from "next/image";
import NotificationMessage from "../common/Notification";
import { useRouter } from "next/navigation";

export interface ISignupData {
  username: string;
  name: string;
}

const msg = sigMsg;

const commonSelector = (state: RootState) => state?.common;
const userNameSelector = (state: RootState) => state?.user;
const tgBotName = process.env.TG_BOT_NAME;

export default function Navbar() {
  const userAccount = useAccount();
  console.log("bot name ", tgBotName);
  const [{ dispatch, actions }, [user, common]] = useRedux([
    userNameSelector,
    commonSelector,
  ]);

  const userData: any = getClientSideCookie("authToken");
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [signupData, setSignupData] = useState<ISignupData>({
    username: "",
    name: "",
  });
  const router = useRouter();
  const [userSession, setUserSession] = useState<any>(user || userData);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const hasCalledRef = useRef(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showCreatePost = () => {
    setIsPostModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  useEffect(() => {
    console.log("userSession", userSession);
  }, [userSession]);

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();
      deleteClientSideCookie("authToken");
      setUserSession(null);
      const initialState: any = {
        username: "",
        name: "",
        uid: 0,
        token: "",
        img: "",
      };
      router.push("/");
      dispatch(actions.setUserData(initialState));
    } catch (error) {}
  };

  const handleAuth = async () => {
    try {
      const sign = await getSignMessage(msg);
      console.log("handleAuth1");
      setMessageHash(sign);
      let response;
      if (isSignup) {
        response = await handleSignup(
          signupData.username,
          signupData.name,
          sign,
          msg
        );
      } else {
        response = await handleLogIn({ sig: sign, msg });
      }
      const userdata = await fetchUserById(response?.uid);
      const user = {
        username: userdata.username,
        name: userdata?.name || "",
        uid: response?.uid || 0,
        token: response?.token || "",
        img: userdata?.img,
      };
      console.log("auth", user);

      setClientSideCookie("authToken", JSON.stringify(user));
      // setToLocalStorage("userSession", user);
      dispatch(actions.setUserData(user));
      if (user?.token == "" || user.token == null || user.token == undefined) {
        setUserSession(null);
      } else {
        setUserSession(user);
      }
      handleCancel();
      setSignupData({ username: "", name: "" });
      setTimeout(() => {
        disconnect();
        console.log("disconnect");
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    } catch (error: any) {
      console.log({ error });

      NotificationMessage(
        "error",
        error.response.data.message || "User Not Registered !"
      );
      setTimeout(() => {
        disconnect();
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    }
  };

  useEffect(() => {
    if (user?.token == "" || user.token == null || user.token == undefined) {
      setUserSession(null);
    } else {
      setUserSession(user);
    }
  }, [user]);

  useEffect(() => {
    if (
      userAccount.isConnected &&
      !messageHash &&
      !hasCalledRef.current &&
      common.walletRoute == "auth"
    ) {
      handleAuth();
      console.log("handleAuth");

      hasCalledRef.current = true;
    }
  }, [userAccount.isConnected]);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('telegramUser');
  //   if (storedUser) {
  //     setTgUser(JSON.parse(storedUser) as TelegramUser);
  //   }
  // }, []);
  // fetch user details after refresh
  const fetchUser = async () => {
    const userData1: any = getClientSideCookie("authToken");
    console.log("userFetc", userData1);

    if (userData?.uid) {
      const response = await fetchUserById(userData?.uid);
      const user = {
        username: response?.username,
        name: response?.name,
        uid: response?.id,
        token: userData1?.token,
        img: response?.img,
      };
      setUserSession(user);
      // setClientSideCookie("authToken", JSON.stringify(user));
      dispatch(actions.setUserData(user));
    }
  };
  useEffect(() => {
    fetchUser();
    console.log("fetchUser", common?.refetch?.user);

    if (common?.refetch?.user) {
      dispatch(actions.setRefetchUser(false));
    }
  }, [common]);

  const content = (
    <div className='user_popover'>
      <Link
        href={`/u/${userSession?.username}`}
        as={`/u/${userSession?.username}`}
      >
        <div className='row'>
          <PiUserCircleDuotone size={28} />
          <span className='text'>
            <span className='text_main'>Profile</span>
            <span className='text_sub'>@{userSession?.username}</span>
          </span>
        </div>
      </Link>

      <Link href={"/settings"} as={"/settings"}>
        <div className='row'>
          <IoSettingsOutline size={25} />
          <span className='text'>
            <span className='text_main'>Settings</span>
          </span>
        </div>
      </Link>
      <div onClick={userLogout} className='row'>
        <IoLogOutOutline size={25} />
        <span className='text'>
          <span className='text_main'>Log Out</span>
        </span>
      </div>
    </div>
  );

  // return <></>;

  return (
    <>
      <nav className='nav_container'>
        <div>
          <h2>Numity</h2>
        </div>
        <div className='search_container'>
          <CInput
            prefix={<IoSearch />}
            placeholder='Search Numity'
            className='search'
          />
        </div>
        <div className='signin'>
          {userSession?.token ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CButton className='create_post' onClick={showCreatePost}>
                <AiOutlinePlus />
                Create
              </CButton>
              <FaRegBell size={25} />
              <div className='user_icon'>
                <Popover
                  placement='bottomRight'
                  content={content}
                  trigger='click'
                >
                  {userSession?.img ? (
                    <Image
                      width={40}
                      height={40}
                      loading='lazy'
                      className='avatar'
                      src={userSession?.img}
                      alt='avatar'
                    />
                  ) : (
                    <PiUserCircleDuotone
                      color='var(--primary-text)'
                      size={40}
                    />
                  )}
                </Popover>
              </div>
            </div>
          ) : (
            <CButton auth={true} onClick={showModal}>
              LogIn
            </CButton>
          )}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal
          openModal={openConnectModal}
          signupData={signupData}
          setSignupData={setSignupData}
          setIsSignup={setIsSignup}
        />
      </Modal>
      <Modal
        className='create_post_modal'
        open={isPostModalOpen}
        onCancel={handleClosePostModal}
        footer={<></>}
        centered
      >
        <CreatePost setIsPostModalOpen={setIsPostModalOpen} />
      </Modal>
    </>
  );
}

interface ISignUpModal {
  openModal: (() => void) | undefined;
  signupData: ISignupData;
  setSignupData: React.Dispatch<React.SetStateAction<ISignupData>>;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpModal = ({
  openModal,
  signupData,
  setSignupData,
  setIsSignup,
}: ISignUpModal) => {
  const [usernameError, setUsernameError] = useState<string>("");
  const CommonSelector = (state: RootState) => state?.common;
  const [{ dispatch, actions }, [common]] = useRedux([CommonSelector]);
  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      if (username === "") {
        setUsernameError("");
        return;
      }
      const user = await fetchUserByUserName(username);
      const isAvailable = user?.username === username;
      if (isAvailable) {
        setUsernameError("Username already exists");
      } else {
        setUsernameError("Username is available");
      }
    } catch (error) {
      setUsernameError("Error checking username availability");
    }
  }, 500);
  const handleAuth = (isSignup: boolean = true) => {
    console.log("IF_CALL");
    dispatch(actions.setWalletRoute("auth"));
    openModal && openModal();
    setIsSignup(isSignup);
  };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupData({ ...signupData, username: value.trim() });
    debouncedCheckUsername(value);
  };
  const handleTelegramAuth = (user: TelegramAuthData) => {
    console.log("User authenticated:", user);
  };

  const handleAddTelegramClick = () => {
    const botUsername = "7280759352"; // Aapke bot ka username yahan likhein
    const authCallbackUrl = encodeURIComponent(
      "https://telegram-auth-five.vercel.app/"
    ); // Callback URL ko yahan likhein

    // Telegram authentication URL generate karein
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${authCallbackUrl}&request_access=write`;

    window.location.href = telegramAuthUrl;
  };

  return (
    <div className='signUpModal'>
      <div className='login'>
        <h4>Log In</h4>
        <CButton onClick={() => handleAuth(false)}>Connect Wallet</CButton>
        <button>
          <TelegramLogin
            botUsername={tgBotName ?? ""}
            onAuthCallback={handleTelegramAuth}
          />
        </button>
        <button onClick={handleAddTelegramClick}>Add Telegram 2</button>

        <TGNew />
      </div>
      <Divider className='divider'>Or</Divider>
      <div className='signup'>
        <h4>SignUp</h4>
        <CInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          type='text'
          placeholder='UserName'
          value={signupData.username}
        />
        <p
          className={`${
            usernameError == "Username is available" ? "success" : "error"
          }`}
        >
          {usernameError}
        </p>
        <CInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSignupData({ ...signupData, name: e.target.value.trim() })
          }
          type='text'
          placeholder='Name (Optional)'
          value={signupData.name}
        />
        <CButton
          disabled={
            usernameError === "Username already exists" ||
            !signupData?.username ||
            !signupData?.name
          }
          onClick={() => handleAuth()}
          size={18}
        >
          Sign Up
        </CButton>
      </div>
    </div>
  );
};
