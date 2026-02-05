import React, { use, useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (prompt.trim() === "") return;
      if (!user) return toast.error("Please login to send a message.");
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        { role: "user", content: promptCopy, isImage: false },
      ]);
      const { data } = await axios.post(
        `/api/messages/${inputType}`,
        {
          chatId: selectedChat._id,
          prompt: promptCopy,
          isPublished,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        if (inputType === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
        setLoading(false);
      } else {
        toast.error(
          data.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="flex flex-1 flex-col justify-between m-5 md:m-10 xl:mx-30
    max-md:mt-14 2xl:pr-40"
    >
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div
            className="h-full flex flex-col items-center justify-center
          gap-2 text-praimary"
          >
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-68 "
            />
            <p
              className="mt-5 text-4xl sm:text-6xl text-center text-gray-400
            dark:text-white"
            >
              Ask me anything...
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 mt-4">
            <div className="w-1.5 h-1.5 bg-praimary rounded-full animate-bounce delay-0 dark:bg-white"></div>
            <div className="w-1.5 h-1.5 bg-praimary rounded-full animate-bounce delay-200 dark:bg-white"></div>
            <div className="w-1.5 h-1.5 bg-praimary rounded-full animate-bounce delay-400 dark:bg-white"></div>
          </div>
        )}
      </div>

      {inputType === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="cursor-pointer"
          />
        </label>
      )}

      {/*Prompt Input Box */}
      <form
        onSubmit={onSubmit}
        className="bg-praimary/20 dark:bg-[#583C79]/30 border border-praimary
       dark:border-[#80609F]/30 rounded-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-3"
      >
        <select
          onChange={(e) => setInputType(e.target.value)}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select>
        <input
          placeholder="Type your prompt...."
          className="flex-1 w-full text-sm outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-8 cursor-pointer"
        >
          <img src={loading ? assets.stop_icon : assets.send_icon} alt="" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
