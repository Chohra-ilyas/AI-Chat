import ChatBox from "./components/ChatBox";
import SideBar from "./components/SideBar";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { assets } from "./assets/assets";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
    {!isMenuOpen &&  <img src={assets.menu_icon} alt="Close Menu"
    className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
    onClick={() => setIsMenuOpen(true)}
    />}
      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
