import {useState, useEffect, useContext, useLayoutEffect, useRef} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import RelativeTime from '@yaireo/relative-time'
import InListAuctionComp from "./InListAuctionComp";

const AllAuctionsComp = () => {
    const [getAuctions, setAuctions] = useState([])
    const [getEndTimeString, setEndTimeString] = useState([])

    const navigate = useNavigate()

    useEffect( () => {
        async function getAllAuctions()
        {
            try{
                const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/get-all-auctions/', {}, {withCredentials: true})

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

        getAllAuctions()

    }, [])

    useEffect(() => {
        const interval = setInterval(getEndDate, 1000)

        return ()=>clearInterval(interval)
    })

    function getEndDate() {

        const endTimeString = []

       if(getAuctions.length > 0)
       {
           getAuctions.map((auction) => {

               const relativeTime = new RelativeTime()
               const end = relativeTime.from(new Date(auction.endTime))

               endTimeString.push(Math.floor(new Date().getTime()) >= auction.endTime ? `Ended` : `Ends ${end}`)
           })

           return setEndTimeString(endTimeString)
       }
    }

    return (
        <>
            <InListAuctionComp getAuctions={getAuctions} setAuctions={setAuctions} getEndTimeString={getEndTimeString}/>
        </>
    );
};

export default AllAuctionsComp;