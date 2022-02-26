import React, {useContext, useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {ContextUser} from "../contexts/UserContext";
import RelativeTime from '@yaireo/relative-time'
import InListBidComp from "./InListBidComp"
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_SOCKETS_SERVER)

const SingleAuctionComp = () => {
    const navigate = useNavigate()
    const bidPriceRef = useRef()

    const {auctionId} = useParams()

    const [getAuction, setAuction] = useState({})
    const [getResponse, setResponse] = useState("")
    const [getInRequest, setInRequest] = useState(false)
    const [getEndTimeString, setEndTimeString] = useState("")

    const {getUserData, setUserData} = useContext(ContextUser)

    useEffect(() => {
        socket.on("auction", (auction) => {
            if(auction._id === auctionId)
                setAuction(auction)
        })
    }, [socket])

    useEffect(() => {
        const interval = setInterval(getEndDate, 1000)

        return ()=>clearInterval(interval)
    })

    function getEndDate()
    {
        let endTimeString = ""

        const relativeTime = new RelativeTime()
        const end = relativeTime.from(new Date(getAuction.endTime))

        endTimeString = Math.floor(new Date().getTime()) >= getAuction.endTime ? `Ended` : `Ends ${end}`

        return setEndTimeString(endTimeString)
    }

    useEffect(() => {
        async function getAuctionData()
        {
            try{
                const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/get-single-auction', {_id: auctionId}, {withCredentials: true})

                if(res.data.error) {
                    if(res.data.data === "Not logged in")
                        navigate("/login")
                }

                else{
                    setAuction(res.data.data)
                    console.log(res.data.data)
                }
            }

            catch(error){
                console.log(error)
            }
        }

        getAuctionData()
    }, [])

    async function createBid() {
        setInRequest(true)
        setResponse("")

        try{
            const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/post-bid',
                {_id: auctionId, username: getUserData.username, price: Number(bidPriceRef.current.value),
                    startPrice: getAuction.startPrice, currentPrice: getAuction.bids[0] ? getAuction.bids[0].price : 0, bidTime: Date.now(), money: getUserData.money}, {withCredentials: true})

            console.log("asfasf")
            if(res.data.error) {
                setInRequest(false)

                if(res.data.data === "Not logged in")
                    navigate("/login")

                else {
                    setResponse(res.data.data)
                }

            }

            else{
                console.log(res.data.money)

                const userData = {...getUserData}
                userData.money = res.data.money

                setUserData(userData)

                bidPriceRef.current.value = ""
                console.log(res.data.data)
                setInRequest(false)
                setAuction(res.data.data)
            }
        }

        catch(error){
            setInRequest(false)
            console.log(error)
        }
    }

    return (
        <>
            {(getAuction && getUserData) &&
            <div>
                <div className="box d-flex flex-wrap justify-content-center gap-4">
                    <img src={getAuction.image} style={{maxWidth: "500px", height: "100%"}} alt=""/>
                    <div className="d-flex flex-column justify-content-between">
                        <div>
                            <h2>{getAuction.title}</h2>
                            <p><b>Owner:</b> {getAuction.username}</p>
                            {getAuction.bids && <p><b>Current price:</b> {getAuction.bids.length > 0 ? getAuction.bids[0].price : getAuction.startPrice}€</p>}

                            {
                                getEndTimeString.length > 0 && <div>
                                    <h4 className="auction-end-time mt-3">{getEndTimeString}</h4>
                                </div>
                            }
                        </div>

                        <div>
                            {(getUserData.username !== getAuction.username && !getAuction.ended && getEndTimeString && getEndTimeString !== "Ended") &&
                            <div className="d-flex mt-3 gap-2">
                                <input ref={bidPriceRef} type="number" className={`form-control ${getInRequest && "disabled"}`} placeholder="Bid price"/>
                                <button className="btn btn-success btn-sm" style={{minWidth: "60px"}} onClick={createBid}>BID</button>
                            </div>}
                            {getResponse.length > 0 &&
                            <div className="alert alert-light mt-3" role="alert">
                                {getResponse}
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="box mt-4">
                    <h2 className="text-center">Bid history</h2>
                    <InListBidComp getAuction={getAuction}/>
                </div>
            </div>
            }
        </>
    );
};

export default SingleAuctionComp;