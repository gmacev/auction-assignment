import React, {useContext, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {ContextUser} from "../contexts/UserContext";

const CreateAuctionComp = () => {
    const pictureRef = useRef()
    const titleRef = useRef()
    const startPriceRef = useRef()

    const {getUserData} = useContext(ContextUser)

    const [getResponse, setResponse] = useState("")
    const [getInRequest, setInRequest] = useState(false)
    const [getEndTimeValue, setEndTimeValue] = useState(604800000)

    const navigate = useNavigate()

    function getEndTime(e) {
        setEndTimeValue(Number(e.target.selectedOptions[0].value))
    }

    async function createAuction()
    {
        setInRequest(true)
        setResponse("")

        try{
            const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/post-auction/',
                {image: pictureRef.current.value, title: titleRef.current.value, startPrice: Number(startPriceRef.current.value),
                    endTime: getEndTimeValue, username: getUserData.username}, {withCredentials: true})

            if(res.data.error) {
                setInRequest(false)
                setResponse(res.data.data)

                if(res.data.data === "Not logged in")
                    navigate("/login")
            }

            else {
                setInRequest(false)
                setResponse(res.data.data)
            }
        }
        catch(error){
            setInRequest(false)
            setResponse(error)
        }
    }

    return (
        <div>
            <div className="w-100 d-flex flex-column align-items-center mt-4">
                <div className="d-flex flex-column justify-content-center" style={{minWidth: "300px"}}>
                    <h2 className="text-center mb-4">Create a new auction</h2>
                    <label htmlFor="auction-length" style={{fontSize: "14px", marginLeft: "2px", marginBottom: "2px"}} className="mt-3">Choose auction length:</label>
                    <select id="auction-length" defaultValue="604800000" onChange={(e) => getEndTime(e)} className={`form-select ${getInRequest && "disabled"}`}>
                        <option value="60000">1 minute</option>
                        <option value="1800000">30 minutes</option>
                        <option value="3600000">1 hour</option>
                        <option value="43200000">12 hours</option>
                        <option value="86400000">24 hours</option>
                        <option value="604800000">1 week</option>
                        <option value="2592000000">30 days</option>
                    </select>
                    <input ref={pictureRef} type="url" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Picture URL"/>
                    <input ref={titleRef} type="text" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Title"/>
                    <input ref={startPriceRef} type="number" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Start price"/>
                    <button onClick={createAuction} className={`btn btn-primary mt-3 ${getInRequest && "disabled"}`}>Create auction</button>
                </div>
                <div>
                    {getResponse.length > 0 &&
                    <div className="alert alert-light mt-3" role="alert">
                        {getResponse}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CreateAuctionComp;