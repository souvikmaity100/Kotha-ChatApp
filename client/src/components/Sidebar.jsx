import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = ({ setShowDetails }) => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchInp, setSearchInp] = useState("");

  const filteredUsers = searchInp
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchInp.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <section
      className={`bg-[#ff6e00]/10 h-full p-4 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* ------------------ Sidebar Header Section ------------------ */}
      <div className="pb-4">
        <div className="flex justify-between items-center">
          <img src="/logo.png" alt="logo" className="max-w-30" />
          <div className="relative py-2 group">
            <img
              src="/icons/menu_icon.png"
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-30 w-32 p-2.5 rounded-md border border-gray-300 bg-white backdrop-blur-xl hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="text-sm cursor-pointer text-gray-900"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-300" />
              <p
                className="text-sm cursor-pointer text-red-600"
                onClick={logout}
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#ff6e00] rounded-full flex items-center gap-2 py-2.5 px-3.5 mt-4">
          <img src="/icons/search_icon.png" alt="search" className="w-3" />
          <input
            type="text"
            name="search"
            value={searchInp}
            onChange={(e) => setSearchInp(e.target.value)}
            className="border-none bg-transparent outline-none text-white text-xs placeholder-[#f3f3f3] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* --------------------- User List Section --------------------- */}
      <div className="flex flex-col">
        {filteredUsers.map((user, ind) => (
          <div
            key={ind}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              setShowDetails(false);
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded-4xl cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-orange-500/75"
            }`}
          >
            <img
              src={user?.profilePic || "/icons/avatar_icon.png"}
              alt="user"
              className="w-[35px] aspect-square rounded-full object-cover"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-300 text-xs">Online</span>
              ) : (
                <span className="text-neutral-300 text-xs">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-orange-700/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sidebar;
