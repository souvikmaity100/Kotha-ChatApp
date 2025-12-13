import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { authUser } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <div className="bg-[url('/images/bg-image.svg')] bg-cover">
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
