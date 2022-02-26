import React, {useRef, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"

const RegisterUserComp = () => {
    const usernameRef = useRef()
    const password1Ref = useRef()
    const password2Ref = useRef()
    const navigate = useNavigate()

    const [getResponse, setResponse] = useState("")
    const [getInRequest, setInRequest] = useState(false)

    async function registerUser()
    {
        setInRequest(true)
        setResponse("")

        try{
            const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/register-user/',
                {username: usernameRef.current.value, password1: password1Ref.current.value, password2: password1Ref.current.value})

            if(res.data.error)
            {
                setInRequest(false)
                setResponse(res.data.data)
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
        <div className="w-100 d-flex flex-column align-items-center">
            <div className="d-flex flex-column justify-content-center" style={{maxWidth: "200px"}}>
                <h4 className="text-center">Register user</h4>
                <input ref={usernameRef} type="email" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Username"/>
                <input ref={password1Ref} type="password" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Password"/>
                <input ref={password2Ref} type="password" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Repeat password"/>

                <button onClick={registerUser} className={`btn btn-primary mt-3 ${getInRequest && "disabled"}`}>Register</button>
            </div>
            <div>
                {getResponse.length > 0 &&
                <div className="alert alert-light mt-3" role="alert">
                    {getResponse}
                </div>
                }

                <p className="mt-3 small text-black-50 text-center" onClick={() => navigate("/login")} style={{cursor: "pointer"}}>Login</p>
            </div>
        </div>
    );
};

export default RegisterUserComp;