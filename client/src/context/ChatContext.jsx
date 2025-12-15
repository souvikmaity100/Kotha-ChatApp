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
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
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
    users,
    selectedUser,
    unseenMessages,
    getMessages,
    getUsers,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
