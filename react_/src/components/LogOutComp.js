import {useContext, useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ContextUser} from "../contexts/UserContext";

const LogOutComp = () => {
    const navigate = useNavigate()

    const {getUserData, setUserData} = useContext(ContextUser)

    useEffect(() => {
        async function logOut()
        {
            await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/update-user/', {username: getUserData.username, money: getUserData.money}, {withCredentials: true})
            await axios.post(process.env.REACT_APP_REQUEST_SERVER+'/logout/', {}, {withCredentials: true})

            localStorage.removeItem("username")

            setUserData({})
            navigate("/login")
        }

        logOut()
    }, [])

    return (
        <></>
    );
};

export default LogOutComp;