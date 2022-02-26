import React, {useContext} from 'react';
import {ContextUser} from "../contexts/UserContext";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

const InListAuctionComp = ({getAuctions, setAuctions, getEndTimeString, myAuctions}) => {
    const {getUserData} = useContext(ContextUser)

    const navigate = useNavigate()

    async function deletePost(_id)
    {
        try{
            const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/delete-auction/', {_id: _id, myAuctions: myAuctions}, {withCredentials: true})

            if(res.data.error) {
                if(res.data.data === "Not logged in")
                    navigate("/login")
            }

            else{
                setAuctions(res.data.data.reverse())
            }
        }

        catch(error){
            console.log(error)
        }
    }

    function bidPage(_id){
        navigate(`/auction/${_id}`)
    }

    return (
        <div className="d-flex flex-column align-items-center gap-3 mt-4">
            <h2 className="text-center mb-4">{myAuctions ? "My auctions" : "All auctions"}</h2>
            <div className="auction-list-wrapper">
                {getAuctions.length > 0 ?
                getAuctions.map((auction, index) => {
                    return <div className="d-flex justify-content-between gap-5 m-4" key={index}>
                        <div className={`auction-in-list box d-flex flex-wrap gap-4 w-100 flex5 ${auction.ended && "auction-ended"}`}>
                            <div className="auction-photo flex5 align-self-center" style={{backgroundImage: `url(${auction.image})`}}/>
                            <div className="auction-info">
                                <h3>{auction.title}</h3>
                                <div className="mt-3">
                                    <p style={{fontSize: "15px"}}><b>Owner:</b> {auction.username}</p>
                                    <p style={{fontSize: "15px"}}><b>Starting price:</b> {auction.startPrice}€</p>
                                    {!auction.ended ?
                                        auction.bids[0] && <p className="text-danger mt-3" style={{fontSize: "18px"}}><b>Current bid:</b> {auction.bids[0].price}€</p>
                                        :
                                        auction.bids[0] && <p className="text-success mt-3" style={{fontSize: "18px"}}><b>Bid winner:</b> {auction.bids[0].username}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="auction-end-time-container box d-flex flex-wrap  flex1">
                            <div className={`d-flex flex-column w-100 ${myAuctions ? "justify-content-center" : "justify-content-between"}`}>
                                {
                                    getEndTimeString && getEndTimeString[index] && <div>
                                        <h4 className="auction-end-time">{getEndTimeString[index]}</h4>
                                    </div>
                                }
                                {(getUserData && getUserData.username !== auction.username) ?
                                    (getEndTimeString && getEndTimeString[index] && !getEndTimeString[index].includes("Ended")) && <button className="btn btn-success btn-lg" onClick={() => bidPage(auction._id)}>BID</button>
                                    :
                                    <div className="d-flex flex-column gap-4">
                                        <Link to={`/auction/${auction._id}`} className="align-self-center" style={{textDecoration: "none", fontSize: '20px'}}>Go to auction</Link>
                                        <button onClick={() => deletePost(auction._id)} className="btn btn-danger btn-lg ">DELETE</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                })
                :
                    <p className="text-center">No auctions yet. <Link to="/new-auction">Create one now.</Link></p>
                }
            </div>
        </div>
    );
};

export default InListAuctionComp;