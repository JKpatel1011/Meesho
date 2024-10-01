import { Link, useLocation, useNavigate } from "react-router-dom"
import Path from "../Commen/Path"

export default function Header({ setCartItems, CartTotalDetails, setAuth, userInfo }) {
    const location = useLocation()
    const navigate = useNavigate()
    return <>
        <div className="container">
            <header className="d-flex w-100 py-3 gap-4 align-items-center" >
                <div className="logo">
                    <Link to={Path.home} style={{ textDecoration: "none" }}>
                        <h2 className="fw-bold fs-1" style={{ color: "rgb(87, 13, 72)" }}>meesho</h2>
                    </Link>
                </div>
                <div className="search" style={{ position: "relative", top: 0 }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", top: "50%", transform: "translate(0px, -50%)", left: "1rem" }}></i>
                    <input type="text" style={{ paddingLeft: "2.5rem", outline: "none" }} placeholder="Try Saree, Kurti or Search by Product Code" />
                </div>
                <ul className="d-flex align-items-center gap-4  p-0 nav_items">
                    <li className="px-2 py-1">
                        <span>
                            <i className="fa-solid fa-mobile-screen-button"></i>
                            &nbsp; &nbsp;
                            <span>
                                Download App
                            </span>
                        </span>
                    </li>

                    <li className="px-2 py-1 border-0">
                        <div className="icons d-flex gap-3 align-items-center justify-content-center">
                            <div style={{ position: 'relative', zIndex: "2", top: 0 }} className="d-flex flex-column align-items-center icon_hover">
                                <i className="fa-solid fa-user" style={{ fontSize: "1.2rem" }}></i>
                                <span style={{ fontSize: "1.1rem", cursor: "pointer" }} >{!userInfo ? "Profile" : userInfo.firstName}</span>
                                <ul style={{ listStyle: "none", background: "white", position: "absolute", marginTop: "2.7rem", zIndex: 1, width: "250px", padding: "1rem" }} className="shadow-lg hover_box">
                                    <li className="border-0">
                                        <strong style={{ textDecoration: "underline", fontWeight: 900 }}>Hello {userInfo ? userInfo.firstName : "User"}</strong><br />
                                        <small className="text-muted">To access your Meesho Profile</small>
                                    </li>
                                    <li className="border-0">
                                        {
                                            userInfo ? <span className="btn w-100 mb-2 btn_profile">{"Profile"}</span> : ""
                                        }
                                        {
                                            userInfo ? <button onClick={() => {
                                                localStorage.removeItem("token")
                                                setAuth(localStorage.getItem("token"))
                                                setCartItems([])
                                                if (location.pathname === Path.home) {
                                                    navigate(Path.login)
                                                } else {
                                                    navigate(Path.home)
                                                }

                                            }} className="w-100 rounded-2" style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem", fontWeight: 700, color: "rgb(159, 32, 137)", background: "white", border: "1px solid rgb(159, 32, 137)" }}>Sign Out</button> : <button className="btn w-100" style={{ background: "rgb(159, 32, 137)", color: "white" }} onClick={() => navigate(Path.login)}>Sign In</button>
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div style={{ position: "relative", top: 0 }} className="d-flex flex-column icon_hover align-items-center cart_link">
                                <i className="fa-solid fa-basket-shopping" style={{ fontSize: "1.2rem" }}></i>
                                <span style={{ fontSize: "1.1rem" }}>Cart</span>
                                <span className="btn-primary" style={{ fontSize: "14px", padding: "0px 5px", borderRadius: "50%", position: "absolute", top: -10, right: -8 }}>{CartTotalDetails.totalItems}</span>
                                <ul style={{ listStyle: "none", background: "white", position: "absolute", marginTop: "2.7rem", zIndex: 1, width: "250px", padding: "1rem" }} className="shadow-lg hover_box">
                                    <li className="border-0">
                                        <strong style={{ textDecoration: "underline", fontWeight: 900 }}>Your Cart Details</strong>
                                    </li>
                                    <li className="border-0 text-dark">
                                        {userInfo && <>
                                            <div className="d-flex pt-2 align-items-center justify-content-between">
                                                <span>Total Products</span>
                                                <span>+ {CartTotalDetails.totalItems}</span>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span>Total Order</span>
                                                <span>+ {CartTotalDetails.priceSymbole + CartTotalDetails.totalPrice}</span>
                                            </div>
                                            <br />
                                        </>
                                        }
                                        <small className="text-muted">To access your Cart</small>
                                        {
                                            userInfo ? <button onClick={() => {
                                                navigate(Path.cart)
                                            }} className="w-100 btn-primary btn"><i className="fa-brands fa-opencart"> &nbsp;</i> Go To Cart</button> : <button className="btn btn-primary w-100" onClick={() => {
                                                navigate(Path.login)
                                            }}>Sign In</button>
                                        }
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </header>

        </div>
        <hr className="mt-1" />
    </>
}