import ChatBox from "./components/ChatBox";
import SideBar from "./components/SideBar";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <SideBar />
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
