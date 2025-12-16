import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [media, setMedia] = useState([]);
  const [hasMoreMedia, setHasMoreMedia] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const { socket, axios } = useContext(AuthContext);

  //  Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //  Get selected user messages
  const getMessages = async (
    userId,
    { skip = 0, limit = 30, replace = true } = {}
  ) => {
    if (!userId) return;
    if (replace) {
      setMessages([]);
      setHasMoreMessages(true);
    }

    try {
      const { data } = await axios.get(`/api/messages/${userId}`, {
        params: { skip, limit },
      });
      if (data.success) {
        setHasMoreMessages(Boolean(data.hasMore));

        setMessages((prev) => {
          if (replace) return data.messages;

          // Prepend older messages, avoiding duplicates
          const existingIds = new Set(prev.map((m) => m._id));
          const incoming = data.messages.filter((m) => !existingIds.has(m._id));
          return [...incoming, ...prev];
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getMedia = async (
    userId,
    { skip = 0, limit = 6, replace = true } = {}
  ) => {
    if (!userId) return;
    if (replace) {
      setMedia([]);
      setHasMoreMedia(true);
    }

    try {
      const { data } = await axios.get(`/api/messages/${userId}/media`, {
        params: { skip, limit },
      });
      if (data.success) {
        setHasMoreMedia(Boolean(data.hasMore));
        setMedia((prev) => {
          if (replace) return data.media || [];
          const existing = new Set(prev.map((m) => m._id));
          const incoming = (data.media || []).filter((m) => !existing.has(m._id));
          return [...prev, ...incoming];
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadMoreMedia = async ({ limit = 6 } = {}) => {
    if (!selectedUser || isLoadingMedia || !hasMoreMedia) return;
    setIsLoadingMedia(true);
    await getMedia(selectedUser._id, {
      skip: media.length,
      limit,
      replace: false,
    });
    setIsLoadingMedia(false);
  };

  const loadMoreMessages = async ({ limit = 15 } = {}) => {
    if (!selectedUser || isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    await getMessages(selectedUser._id, {
      skip: messages.length,
      limit,
      replace: false,
    });
    setIsLoadingMore(false);
  };

  //  Send a message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMsg]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    //  Get real time messages
    const currMessages = async () => {
      if (!socket) return;

      socket.on("newMsg", (newMsg) => {
        if (selectedUser && newMsg.senderId === selectedUser._id) {
          newMsg.seen = true;
          setMessages((prev) => [...prev, newMsg]);
          axios.put(`/api/messages/mark/${newMsg._id}`);
        } else {
          setUnseenMessages((prev) => ({
            ...prev,
            [newMsg.senderId]: prev[newMsg.senderId]
              ? prev[newMsg.senderId] + 1
              : 1,
          }));
        }
      });
    };

    currMessages();

    //  Off to get real time messages
    return () => {
      if (socket) socket.off("newMsg");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUser]);

  const value = {
    messages,
    media,
    users,
    selectedUser,
    unseenMessages,
    hasMoreMessages,
    isLoadingMore,
    hasMoreMedia,
    isLoadingMedia,
    getMessages,
    getMedia,
    getUsers,
    sendMessage,
    loadMoreMessages,
    loadMoreMedia,
    setSelectedUser,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
