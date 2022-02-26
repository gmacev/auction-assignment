import {useLocation, useNavigate} from "react-router-dom";
import {ContextUser} from "../contexts/UserContext";
import {useContext} from "react";

const TopNavBar = () => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const {getUserData} = useContext(ContextUser)

    return (
        <>
            {
                ((pathname !== "/login" && pathname !== "/register") && localStorage.getItem("username") !== null) &&
                <div className="topBar d-flex flex-wrap align-items-center flex1">
                    <div onClick={() => navigate("/")} className="d-flex">
                        <img src="https://firebounty.com/image/939-chainlink" style={{width: "50px", cursor: "pointer"}} alt="Chainlink logo"/>
                        <h2 className="logo text-primary m-0 p-0 ps-2 me-5" title="Home page">Cubic auctions</h2>
                    </div>
                    <h2 onClick={() => navigate("/new-auction")}>New auction</h2>
                    <h2 onClick={() => navigate("/my-auctions")}>My auctions</h2>
                    <h2 onClick={() => navigate("/my-bids")}>My bids</h2>
                    <h2 onClick={() => navigate("/logout")}>Log out</h2>

                    {getUserData && <div className="d-flex flex-column align-items-end justify-content-center flex1 w-100">
                        <h5 className="text-black m-0">{getUserData.username}</h5>
                        <span className="text-success">Money: {getUserData.money}€</span>
                    </div>}
                </div>
            }
        </>
    );
};

export default TopNavBar;