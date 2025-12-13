import { useContext, useRef, useEffect, useState } from "react";
import { formatMsgTime } from "../lib/utils";
import UserDetails from "./UserDetails";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import toast from "react-hot-toast";

const ChatContainer = ({ showDetails, setShowDetails }) => {
  const scrollEnd = useRef(null);

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  // sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, messages]);

  return selectedUser ? (
    <section className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ----------------- Chat Header Section ----------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-gray-300">
        <img
          src={selectedUser.profilePic || "/icons/avatar_icon.png"}
          alt="profile"
          className="w-8 h-8 object-cover rounded-full"
        />
        <p className="text-white flex-1 text-lg flex itemsc gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-300"></span>
          )}
        </p>
        <img
          src="/icons/arrow_icon.png"
          alt="arrow"
          className="md:hidden max-w-7 cursor-pointer"
          onClick={() => {
            setSelectedUser(null);
            setShowDetails(false);
          }}
        />
        <img
          src="/icons/help_icon.png"
          alt="help"
          className="max-w-5 cursor-pointer"
          onClick={() => setShowDetails(true)}
        />
      </div>

      {/* ---------------------- Chat Area Section ---------------------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, ind) => (
          <div
            key={ind}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="img"
                className="max-w-[230px] border border-gray-300 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-4 break-all text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none bg-gray-600/75"
                    : "rounded-bl-none bg-orange-600/75"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || "/icons/avatar_icon.png"
                    : selectedUser?.profilePic || "/icons/avatar_icon.png"
                }
                alt="user"
                className="w-7 h-7 object-cover rounded-full"
              />
              <p className="text-gray-200">{formatMsgTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* --------------------- Chat Bottom Section --------------------- */}
      <div className="absolute bottom-0 right-0 flex items-center gap-3 p-3 w-full">
        <div className="flex-1 flex items-center bg-gray-100/20 px-3 rounded-full">
          <input
            type="text"
            name="msg"
            placeholder="Send a message. . ."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          />
          <input
            type="file"
            name="image"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />
          <label htmlFor="image" className="cursor-pointer">
            <img
              src="/icons/gallery_icon.svg"
              alt="gallery_icon"
              className="w-5 mr-2"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src="/icons/send_button.svg"
          alt="send_button"
          className="w-10 cursor-pointer"
        />
      </div>

      {/* ------------------- User Details Section ------------------- */}
      {showDetails && <UserDetails setShowDetails={setShowDetails} />}
    </section>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src="/icons/logo_icon.png" alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Let's Chat</p>
    </div>
  );
};

export default ChatContainer;
