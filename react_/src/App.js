import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import io from "socket.io-client";

import TopNavBar from "./components/TopNavBar";
import LogOutComp from "./components/LogOutComp";
import Home from "./pages/Home";
import RegisterUserPage from "./pages/RegisterUserPage";
import LoginUserPage from "./pages/LoginUserPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import {ContextUser} from "./contexts/UserContext";
import {useState, useEffect} from "react";
import AuctionPage from "./pages/AuctionPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import MyBidsPage from "./pages/MyBidsPage";

const socket = io.connect(process.env.REACT_APP_SOCKETS_SERVER)

function App() {
    const [getUserData, setUserData] = useState(null)

    useEffect(() => {
        if(localStorage.getItem("username") && localStorage.getItem("money"))
        {
            const user = {
                username: localStorage.getItem("username"),
                money: localStorage.getItem("money")
            }

            setUserData(user)

            localStorage.removeItem("money")
        }

    }, [])

    window.onbeforeunload = () => localStorage.setItem("money", getUserData.money)

  return (
      <div className="wrapper d-flex justify-content-center align-items-center flex-column">
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ContextUser.Provider value={{getUserData, setUserData}}>
              <TopNavBar/>
              <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/logout"} element={<LogOutComp/>}/>
                <Route path={"/register"} element={<RegisterUserPage/>}/>
                <Route path={"/login"} element={<LoginUserPage/>}/>
                <Route path={"/new-auction"} element={<CreateAuctionPage/>}/>
                <Route path={"/auction/:auctionId"} element={<AuctionPage/>}/>
                <Route path={"/my-auctions"} element={<MyAuctionsPage/>}/>
                <Route path={"/my-bids"} element={<MyBidsPage/>}/>
              </Routes>
            </ContextUser.Provider>
        </BrowserRouter>
      </div>
  );
}

export default App;
