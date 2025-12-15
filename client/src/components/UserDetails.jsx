import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const UserDetails = ({ setShowDetails }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // get all images from chat
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    <section className="absolute top-0 left-0 h-full w-full bg-orange-500 text-white">
      <img
        src="/icons/arrow_icon.png"
        alt="arrow"
        className="max-w-7 cursor-pointer absolute top-3 right-3.5"
        onClick={() => setShowDetails(false)}
      />
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/icons/avatar_icon.png"}
            alt="profile"
            className="w-20 aspect-square rounded-full object-cover"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <p className="w-3 h-3 rounded-full bg-green-300 absolute top-1 right-1 border border-white"></p>
          )}
        </div>
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>
      <hr className="border-[#ffffff50] my-4" />
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[400px] overflow-y-scroll grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-90">
          {msgImages.map((url, ind) => (
            <div key={ind} className="rounded">
              <img src={url} alt="image" className="h-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserDetails;
