import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dummyChats, dummyUserData } from "../assets/assets";
import toast from "react-hot-toast";

axios.defaults.baseURL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error("Failed to fetch user data. Please login again.");
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching user data. Please login again.",
      );
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) {
        toast.error("You need to be logged in to create a chat.");
        return;
      }
      navigate("/");
      await axios.post(
        "/api/chats",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchUsersChat();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating a new chat.",
      );
    }
  };

  const fetchUsersChat = async () => {
    try {
      if (!user) {
        setChats([]);
        return;
      }
      const { data } = await axios.get("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setChats(data.chats);
        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChat();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error("Failed to fetch chats. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching chats.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersChat();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    fetchUsers,
    createNewChat,
    loadingUser,
    fetchUsersChat,
    token,
    setToken,
    axios,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
