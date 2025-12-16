import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import ImagePreviewModal from "./ImagePreviewModal";

const UserDetails = ({ setShowDetails }) => {
  const {
    selectedUser,
    media,
    getMedia,
    loadMoreMedia,
    hasMoreMedia,
    isLoadingMedia,
  } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Load initial media on open
  useEffect(() => {
    if (selectedUser?._id) {
      getMedia(selectedUser._id, { skip: 0, limit: 6, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?._id]);

  return (
    <section className="absolute top-0 left-0 h-full w-full bg-orange-500 text-white flex flex-col">
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
            className="w-20 aspect-square rounded-full object-cover border-2 border-gray-200"
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
      <div className="px-5 text-xs ">
        <p>Media</p>
        <div className="mt-2 max-h-[400px] overflow-y-scroll grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-90">
          {media.length > 0 ? (
            <>
              {media.map((msg) => (
                <button
                  key={msg._id}
                  className="rounded overflow-hidden relative group"
                  onClick={() => setPreviewUrl(msg.image)}
                >
                  <img
                    src={msg.image}
                    alt="image"
                    className="h-full w-full rounded-md object-cover transition duration-200 group-hover:scale-105"
                  />
                </button>
              ))}
              {hasMoreMedia && (
                <button
                  onClick={() => loadMoreMedia({ limit: 6 })}
                  className="col-span-full py-2 px-3 bg-white/10 text-white rounded-md hover:bg-white/20 transition text-xs cursor-pointer"
                  disabled={isLoadingMedia}
                >
                  {isLoadingMedia ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-200 text-center flex-1 flex items-center justify-center col-span-full">
              No media shared yet.
            </p>
          )}
        </div>
      </div>

      <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </section>
  );
};

export default UserDetails;
