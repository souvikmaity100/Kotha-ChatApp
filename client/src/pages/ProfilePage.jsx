import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName, bio });
      navigate("/");
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(selectedImg);
    render.onload = async () => {
      const b64Img = render.result;
      await updateProfile({ profilePic: b64Img, fullName, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-xs text-gray-200 border-2 border-gray-300 flex items-center justify-between rounded-lg">
        <img
          src="/icons/arrow_icon.png"
          alt="arrow"
          className="max-w-7 cursor-pointer absolute top-3 right-3.5"
          onClick={() => navigate("/")}
        />
        <form
          className="flex flex-col gap-5 p-10 flex-1"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="avatar"
            className="flex items-center cursor-pointer gap-3"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              name="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic
                  ? authUser.profilePic
                  : "/icons/avatar_icon.png"
              }
              alt="avatar"
              className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-gray-300"
              title="Change Pic"
            />
          </label>
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            type="text"
            name="bio"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none"
            placeholder="Enter Your Bio..."
            required
          ></textarea>
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-orange-500 to-red-400 text-white rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src="/icons/logo_profile_icon.png"
          alt="logo"
          className="max-w-44 mx-10 max-sm:mt-10 max-sm:hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
