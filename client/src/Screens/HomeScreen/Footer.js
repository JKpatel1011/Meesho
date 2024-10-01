import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Path from "../../Commen/Path";

export default function Footer() {
    const location = useLocation()
    const [Width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth)
        })
    }, [])

    return Width < 768 ? <>
        <div style={{position:"fixed", bottom:0,background:"white",boxShadow:"0px 8px 20px gray"}} className="d-flex w-100 py-2 px-3 justify-content-between">
            <span className="text-center" style={{ color: location.pathname===Path.home ? "rgb(159, 32, 137)":"" }}>
                <i className="fa-solid fa-house fs-5"></i><br />
                <span>Home</span>
            </span>
            <span className="text-center" style={{ color: location.pathname===Path.order ? "rgb(159, 32, 137)":"" }}>
                <i className="fa-solid fa-truck fs-5"></i><br />
                <span>My Orders</span>
            </span>
            <span className="text-center" style={{ color: location.pathname===Path.contect ? "rgb(159, 32, 137)":"" }}>
                <i className="fa-solid fa-headset fs-5"></i><br />
                <span>Contect Us.</span>
            </span>
            <span className="text-center" style={{ color: location.pathname===Path.profile ? "rgb(159, 32, 137)":"" }}>
                <i className="fa-solid fa-user fs-5"></i><br />
                <span>Profile</span>
            </span>
        </div>
    </> : <></>
}