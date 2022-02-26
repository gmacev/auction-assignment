import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import InListBidComp from "../components/InListBidComp";

const MyBidsPage = () => {
    const [getBids, setBids] = useState([])

    const navigate = useNavigate()

    useEffect( () => {
        async function getUserBids()
        {
            try{
                const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/get-user-bids/', {}, {withCredentials: true})

                if(res.data.error) {
                    if(res.data.data === "Not logged in")
                        navigate("/login")
                }

                else {
                    setBids(res.data.data.reverse())
                }
            }
            catch(error){
                console.log(error)
            }

        }

        getUserBids()

    }, [])

    return (
        <div>
            <InListBidComp getBids={getBids}/>
        </div>
    );
};

export default MyBidsPage;