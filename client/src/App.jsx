import ChatBox from "./components/ChatBox";
import SideBar from "./components/SideBar";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import { Route, Routes, useLocation } from "react-router-dom";
import { use, useState } from "react";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAppContext();

  if (pathname === "/loading") return <Loading />;

  return (
    <>
      {user ? (
        <>
          {!isMenuOpen && (
            <img
              src={assets.menu_icon}
              alt="Close Menu"
              className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
              onClick={() => setIsMenuOpen(true)}
            />
          )}
          <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
            {!isMenuOpen && (
              <img
                src={assets.menu_icon}
                alt="Close Menu"
                className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
                onClick={() => setIsMenuOpen(true)}
              />
            )}
            <div className="flex h-screen w-screen">
              <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Routes>
                <Route path="/" element={<ChatBox />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </div>
          </div>{" "}
        </>
      ) : (
        <div
          className="bg-linear-to-b from-[#242124] to-[#000000] 
        flex items-center justify-center h-screen w-screen"
        >
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
