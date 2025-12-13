import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center">
      <div className="flex justify-center flex-col items-center">
        <img
          src="/icons/logo_icon.png"
          alt="logo"
          className="w-[min(20vw,120px)]"
        />
        <h2 className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-4xl text-center mt-3 font-bold">
          Page Not Found
        </h2>
        <Link
          to="/"
          className="text-gray-200 hover:underline cursor-pointer mt-3"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
