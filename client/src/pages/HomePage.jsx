import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full h-screen sm:px-[4%] sm:py-[3%]">
      <div className="backdrop-blur-md sm:border-2 border-gray-300 md:rounded-2xl overflow-hidden h-full grid grid-cols-1 md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] relative ">
        <Sidebar setShowDetails={setShowDetails} />
        <ChatContainer
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />
      </div>
    </div>
  );
};

export default HomePage;
