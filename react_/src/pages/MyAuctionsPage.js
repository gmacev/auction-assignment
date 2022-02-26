import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import InListAuctionComp from "../components/InListAuctionComp";

const MyAuctionsPage = () => {
    const [getAuctions, setAuctions] = useState([])

    const navigate = useNavigate()

    useEffect( () => {
        async function getUserAuctions()
        {
            try{
                const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/get-user-auctions/', {}, {withCredentials: true})

                if(res.data.error) {
                    if(res.data.data === "Not logged in")
                        navigate("/login")
                }

                else {
                    setAuctions(res.data.data.reverse())
                }
            }
            catch(error){
                console.log(error)
            }

        }

        getUserAuctions()

    }, [])

    return (
        <div>
            <InListAuctionComp getAuctions={getAuctions} setAuctions={setAuctions} myAuctions={true}/>
        </div>
    );
};

export default MyAuctionsPage;