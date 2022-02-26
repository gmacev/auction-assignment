import {useRef, useState, useContext} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ContextUser} from "../contexts/UserContext";

const LoginUser = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()

    const {setUserData} = useContext(ContextUser)

    const [getResponse, setResponse] = useState("")
    const [getInRequest, setInRequest] = useState(false)

    const navigate = useNavigate()

    async function loginUser()
    {
        setInRequest(true)
        setResponse("")

        try{
            const res = await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/login/',
                {username: usernameRef.current.value, password: passwordRef.current.value}, {withCredentials: true})

            if(res.data.error) {
                setInRequest(false)
                setResponse(res.data.data)
            }

            else {
                setInRequest(false)
                localStorage.setItem('username', usernameRef.current.value)

                const user = {
                    id: res.data._id,
                    username: res.data.username,
                    money: res.data.money
                }

                console.log(user)

                setUserData(user)
                navigate("/", {state: user})
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
                <h4 className="text-center">Login</h4>
                <input ref={usernameRef} type="text" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Username"/>
                <input ref={passwordRef} type="password" className={`form-control mt-3 ${getInRequest && "disabled"}`} placeholder="Password"/>

                <button onClick={() => loginUser()} className={`btn btn-primary mt-3 ${getInRequest && "disabled"}`}>Login</button>
            </div>
            <div>
                {getResponse.length > 0 &&
                <div className="alert alert-light mt-3" role="alert">
                    {getResponse}
                </div>
                }

                <p className="mt-3 small text-black-50 text-center" onClick={() => navigate("/register")} style={{cursor: "pointer"}}>Register</p>
            </div>
        </div>
    );
};

export default LoginUser;