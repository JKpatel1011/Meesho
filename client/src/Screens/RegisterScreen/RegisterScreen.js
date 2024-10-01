import { useEffect, useState } from "react";
import apiHelper from "../../Commen/ApiHelper";
import { useNavigate } from "react-router-dom";
import Path from "../../Commen/Path";
import Loader from "../../Components/Loader";

export default function RegisterScreen({ Auth, setAuth }) {
    const navigate = useNavigate()
    const [Message, setMessage] = useState("");
    const [loading, setloading] = useState(false);
    const [userDetails, setuserDetails] = useState({
        firstName: "",
        lastName: '',
        email: '',
        password: ""
    });


    useEffect(() => {
        if (Auth && Auth.length > 0) {
            navigate(Path.home)
        }
        // eslint-disable-next-line
    }, [Auth])



    const RegisterHandeler = async () => {
        try {
            if (!userDetails.firstName) return setMessage("Required field firstname is empty.")
            if (!userDetails.lastName) return setMessage("Required field lastname is empty.")
            setloading(true)
            const result = await apiHelper.registerUser(userDetails)
            localStorage.setItem("token", result.data.token)
            setAuth(localStorage.getItem("token"))
            setloading(false)
        } catch (error) {
            setloading(false)
            setMessage(error.message)
        }
    }


    return <>
        <Loader loading={loading} />
        <center className="py-3">
            <div className="card login_card" style={{ width: "25rem" }}>
                <img src="https://images.meesho.com/images/marketing/1661417516766.webp" className="card-img-top" alt="..." />
                <div className="card-body p-4">
                    <h6 className="fw-bold">Sign Up to view your profile</h6>
                    {
                        Message && <div className="d-flex gap-2 align-items-center alert alert-danger" style={{ padding: "0.4rem 0.5rem" }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <small style={{ fontWeight: 500 }}>{Message}</small>
                        </div>
                    }
                    <div className="py-1" >
                        <input onChange={(e) => setuserDetails({ ...userDetails, firstName: e.target.value })} type="text" placeholder="Firstname" />
                        <br />
                        <br />
                        <input onChange={(e) => setuserDetails({ ...userDetails, lastName: e.target.value })} type="text" placeholder="Lastname" />
                        <br />
                        <br />
                        <input onChange={(e) => setuserDetails({ ...userDetails, email: e.target.value })} type="text" placeholder="Email" />
                        <br />
                        <br />
                        <input onChange={(e) => setuserDetails({ ...userDetails, password: e.target.value })} type="password" placeholder="Password" />
                        <br />
                        <br />
                        <button onClick={RegisterHandeler} className="btn text-light w-100 fw-bold py-2" style={{ background: "rgb(159, 32, 137)" }}>Sign Up</button>
                        <center><small className="text-muted my-2 d-inline-block fw-bold">Allredy have an account</small></center>
                        <button onClick={() => navigate(Path.login)} className="btn w-100 fw-bold" style={{ color: "rgb(159, 32, 137)", textDecoration: "underline" }}>Sign In</button>
                    </div>
                </div>
            </div>
        </center>


    </>
}