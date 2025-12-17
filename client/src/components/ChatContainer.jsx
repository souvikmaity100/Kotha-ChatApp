import { useContext, useRef, useEffect, useState } from "react";
import { formatMsgTime } from "../lib/utils";
import UserDetails from "./UserDetails";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ImagePreviewModal from "./ImagePreviewModal";
import toast from "react-hot-toast";

const ChatContainer = ({ showDetails, setShowDetails }) => {
  const scrollEnd = useRef(null);
  const chatBoxRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const lastMessageIdRef = useRef(null);
  const [showBackToBottom, setShowBackToBottom] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingImageText, setPendingImageText] = useState("");

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
    reader.onloadend = () => {
      // Store locally for preview; actual upload happens when user clicks Send
      setPendingImage(reader.result);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Send the currently selected image with optional text (caption)
  const handleSendImagePreview = async () => {
    if (!pendingImage) return;

    const imageToSend = pendingImage;
    const textToSend = pendingImageText.trim();

    // Immediately clear preview and caption from UI
    setPendingImage(null);
    setPendingImageText("");

    try {
      setImageLoading(true);
      await sendMessage({
        image: imageToSend,
        ...(textToSend ? { text: textToSend } : {}),
      });
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser) return;
      // Reset last message tracker when switching users
      lastMessageIdRef.current = null;
      setMessagesLoading(true);
      await getMessages(selectedUser._id, { limit: 30, skip: 0, replace: true });
      setMessagesLoading(false);
      isAtBottomRef.current = true;
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    if (!scrollEnd.current || !messages?.length) return;

    const last = messages[messages.length - 1];
    const lastId = last?._id;

    // If there's no new last message (e.g. we just prepended older messages), don't auto-scroll
    if (!lastId || lastId === lastMessageIdRef.current) return;

    const fromSelf = last.senderId === authUser?._id;
    const nearBottom = isAtBottomRef.current;

    if (nearBottom || fromSelf) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }

    // Update tracker after handling scroll
    lastMessageIdRef.current = lastId;
  }, [messages, selectedUser, authUser]);

  return selectedUser ? (
    <section className="h-screen overflow-scroll relative backdrop-blur-lg">
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

      {imageLoading && (
        <p className="flex-1 flex items-center justify-center absolute top-0 left-0 w-full h-full">
          <div className="text-white bg-orange-600/75 text-center py-5 px-10 rounded-lg animate-pulse mr-3">
            <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mx-auto"></div>
            Uploading image...
          </div>
        </p>
      )}
      {/* ---------------------- Chat Area Section ---------------------- */}
      <div
        ref={chatBoxRef}
        onScroll={async () => {
          const el = chatBoxRef.current;
          if (!el) return;

          // Track whether user is near the bottom to decide auto-scroll on new messages
          const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;
          isAtBottomRef.current = distanceFromBottom < 120;
          setShowBackToBottom(
            !isAtBottomRef.current && distanceFromBottom > 200
          );

          if (isLoadingMore || !hasMoreMessages) return;
          if (el.scrollTop <= 40) {
            const prevHeight = el.scrollHeight;
            const prevTop = el.scrollTop;
            await loadMoreMessages({ limit: 15 });
            // Maintain scroll position after prepending messages
            setTimeout(() => {
              const newHeight = el.scrollHeight;
              const delta = newHeight - prevHeight;
              el.scrollTop = prevTop + delta;
            }, 0);
          }
        }}
        className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6"
      >
        {messagesLoading ? (
          <p className="text-gray-200 text-center flex-1 flex items-center justify-center">
            Loading messages...
          </p>
        ) : messages.length > 0 ? (
          messages.map((msg, ind) => (
            <div
              key={ind}
              className={`mt-1 flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && "flex-row-reverse"
                }`}
            >
              {msg.image ? (
                <div className="max-w-[230px] mb-4">
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(msg.image)}
                    className="w-full border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                  >
                    <img
                      src={msg.image}
                      alt="img"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {msg.text && msg.text.trim() !== "" && (
                    <p className={`text-xs md:text-sm text-white bg-black/40 px-2 py-1 rounded-md break-all ${msg.senderId === authUser._id
                      ? "rounded-br-none bg-gray-600/75"
                      : "rounded-bl-none bg-orange-600/75"
                      }`}>
                      {msg.text}
                    </p>
                  )}
                </div>
              ) : (
                <p
                  className={`p-2 max-w-[200px] text-xs md:text-sm font-light rounded-lg mb-4 break-all text-white ${msg.senderId === authUser._id
                    ? "rounded-br-none bg-gray-600/75"
                    : "rounded-bl-none bg-orange-600/75"
                    }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="flex flex-col text-xs">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.profilePic || "/icons/avatar_icon.png"
                      : selectedUser?.profilePic || "/icons/avatar_icon.png"
                  }
                  alt="user"
                  className={`w-7 h-7 object-cover rounded-full ${msg.senderId !== authUser._id && "ms-auto"
                    }`}
                />
                <p className="text-gray-200">{formatMsgTime(msg.createdAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-200 text-center flex-1 flex items-center justify-center">
            No messages yet. Say hello!
          </p>
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* --------------------- Chat Bottom Section --------------------- */}
      <div className="absolute bottom-0 right-0 flex flex-col gap-2 p-1 sm:p-3 w-full">
        {pendingImage && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gray-900/70 px-2 sm:px-3 py-2 rounded-xl border border-white/10">
            <div className="w-24 h-24 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-white/20 mx-auto sm:mx-0">
              <img
                src={pendingImage}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Add a caption..."
                className="w-full text-xs bg-transparent border border-white/20 rounded-full px-3 py-1 text-white placeholder:text-gray-300 outline-none"
                value={pendingImageText}
                onChange={(e) => setPendingImageText(e.target.value)}
              />
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingImage(null);
                    setPendingImageText("");
                  }}
                  className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendImagePreview}
                  className="text-xs text-white bg-orange-500 hover:bg-orange-400 rounded-full px-4 py-1 cursor-pointer transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 w-full">
          <div className="flex-1 shrink flex items-center bg-gray-100/20 px-3 rounded-full">
            <input
              type="text"
              name="msg"
              placeholder="Send a message. . ."
              className="flex-1 shrink text-sm py-3 px-1.5 sm:p-3 border-none rounded-lg outline-none text-white placeholder-gray-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" ? handleSendMessage(e) : null
              }
            />
            <input
              type="file"
              name="image"
              id="image"
              accept="image/png, image/jpeg"
              hidden
              onChange={handleSendImage}
            />
            <label htmlFor="image" className="cursor-pointer shrink-0">
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
      </div>

      {showBackToBottom && (
        <button
          onClick={() => {
            if (scrollEnd.current) {
              scrollEnd.current.scrollIntoView({ behavior: "smooth" });
              isAtBottomRef.current = true;
              setShowBackToBottom(false);
            }
          }}
          className="absolute right-4 bottom-20 p-2 rounded-full bg-orange-600 text-white text-xs shadow-lg hover:bg-orange-500 transition cursor-pointer shadow-black/20"
        >
          <img
            src="/icons/arrow_icon.png"
            alt="bottom"
            className="-rotate-90 h-8 w-8 aspect-square object-contain"
          />
        </button>
      )}

      <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />

      {/* ------------------- User Details Section ------------------- */}
      {showDetails && <UserDetails setShowDetails={setShowDetails} />}
    </section>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src="/icons/logo_chat_icon.png" alt="logo" className="max-w-36" />
    </div>
  );
};

export default ChatContainer;
