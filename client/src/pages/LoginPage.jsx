import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign In");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isdataSubmitted, setIsdataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currState === "Sign Up" && !isdataSubmitted) {
      setIsdataSubmitted(true);
      return;
    }

    login(currState === "Sign Up" ? "signup" : "signin", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center gap-6 sm:justify-evenly max-sm:flex-col">
      <div>
        <img
          src="/icons/logo_icon.png"
          alt="logo"
          className="w-[min(20vw,120px)]"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-300 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[min(90vw,420px)] backdrop-blur-xs"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}{" "}
          {currState === "Sign Up" && isdataSubmitted && (
            <img
              src="/icons/arrow_icon.png"
              alt="iarrow"
              className="w-5 cursor-pointer"
              onClick={() => setIsdataSubmitted(false)}
            />
          )}
        </h2>

        {currState === "Sign Up" && !isdataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            name="full_name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            placeholder="Full Name"
            required
          />
        )}

        {!isdataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              placeholder="Password"
              required
            />
          </>
        )}

        {currState === "Sign Up" && isdataSubmitted && (
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
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-orange-500 to-red-400 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign Up" ? "Create Account" : "Sign In"}
        </button>

        {currState === "Sign Up" && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" />
            <p>Agree the terms & policy of use</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                className="font-medium text-white cursor-pointer"
                onClick={() => {
                  setCurrState("Sign In");
                  setIsdataSubmitted(false);
                }}
              >
                Sign In
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account{" "}
              <span
                className="font-medium text-white cursor-pointer"
                onClick={() => {
                  setCurrState("Sign Up");
                  setIsdataSubmitted(false);
                }}
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
