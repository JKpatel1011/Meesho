import { Link, useNavigate } from "react-router-dom"
import Path from "../../Commen/Path"
import { useEffect, useState } from "react";
import apiHelper from "../../Commen/ApiHelper";
import Loader from "../../Components/Loader";

export default function CartScreen({ CartTotalDetails, userInfo, CartItems, FetchUserCart }) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false);

    useEffect(() => {
        if (userInfo && userInfo._id) {
            setloading(true)
            FetchUserCart(userInfo._id)
            setloading(false)
        }
        // eslint-disable-next-line
    }, []);

    const RemoveHandeler = async (id) => {
        try {
            if (!userInfo) return navigate(Path.login)
            setloading(true)
            await apiHelper.removeToCart(id)
            FetchUserCart(userInfo._id)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    const QtyHandeler = async (product, qty) => {
        try {
            setloading(true)
            if (!userInfo) return navigate(Path.login)
            const cartItem = {
                user: userInfo._id,
                product: product,
                qty: qty
            }
            await apiHelper.addtoCart(cartItem)
            FetchUserCart(userInfo._id)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }


    async function ClickToContinue() {
        navigate(Path.addresss)
    }

    return <>
        <Loader loading={loading} />
        {
            CartItems && CartItems.length>  0 ? <div className="container cart_container">
                <div className="d-flex align-items-center">
                    <h4 style={{ padding: "0 0.5rem", borderRight: "1px solid gray" }}>Cart</h4>
                    <h5 className="text-muted" style={{ padding: "0 0.5rem" }}>2 Items</h5>
                </div>
                <div className="row">
                    <div className="col-12 col-md-7 mb-2 ps-md-0" >
                        {
                            CartItems && CartItems.map((x) => {
                                return <div key={x.product._id} className="card cart_card mb-2 w-100">
                                    <div className="card-body">
                                        <div className="d-flex flex wrap gap-2">
                                            <div>
                                                <Link to={Path.product.split(":")[0] + x.product._id}>
                                                    <img className="cart_item_img w-sm-100" src={x.product.image} alt={x.product.title} />
                                                </Link>
                                            </div>
                                            <div style={{ width: "calc(100% - 100px)" }}>
                                                <div className="d-flex gap-2 justify-content-between w-100 align-items-center">
                                                    <h6 className="title" style={{ fontWeight: "500", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "100%" }}>
                                                        <Link style={{ color: "inherit", textDecoration: "none" }} to={Path.product.split(":")[0] + x.product._id}>
                                                            {x.product.title}
                                                        </Link>
                                                    </h6>
                                                </div>
                                                <span className="fs-6" style={{ fontWeight: "300" }}>
                                                    {
                                                        x.product.price.currency.symbol
                                                        + " " +
                                                        x.product.price.value
                                                    }
                                                </span>
                                                <br />
                                                <span className="fs-6" style={{ fontWeight: "300" }}>
                                                    All issue easy returns allowed
                                                </span>
                                                <br />
                                                <span className="fs-6 mt-2" style={{ fontWeight: "300" }}>
                                                    Qty: &nbsp;
                                                </span>
                                                <span className="fs-6 d-inline-block mt-2" style={{ fontWeight: "300", border: "2px solid #f1f5fe" }}>
                                                    <button disabled={x.qty <= 1} onClick={() => QtyHandeler(x.product._id, - 1)} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-minus"></i></button>
                                                    &nbsp; &nbsp;{x.qty}&nbsp; &nbsp;
                                                    <button disabled={x.qty >= 20} onClick={() => QtyHandeler(x.product._id, 1)} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-plus"></i></button>
                                                </span>
                                                <br />
                                                <br />
                                                <span style={{ cursor: "pointer" }} onClick={() => RemoveHandeler(x._id)}>
                                                    X REMOVE
                                                </span>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }

                    </div>
                    <div className="col-12 col-md-5 mb-2 pe-md-0">
                        <div className="card w-100">
                            <div className="card-body">
                                <h5>Price Details</h5>
                                <div className="d-flex w-100 justify-content-between">
                                    <h6>Total Items</h6>
                                    <h6>+ {CartTotalDetails.totalItems}</h6>
                                </div>
                                <div className="d-flex w-100 justify-content-between">
                                    <h6>Total Product Price</h6>
                                    <h6>+ {CartTotalDetails.priceSymbole}{CartTotalDetails.totalPrice}</h6>
                                </div>
                                <hr />
                                <div className="d-flex w-100 justify-content-between">
                                    <h5>Order Total</h5>
                                    <h5>+ {CartTotalDetails.priceSymbole}{CartTotalDetails.totalPrice}</h5>
                                </div>
                                <small style={{ fontSize: "12px", display: "block" }} className="my-2 text-muted text-center">Clicking on ‘Continue’ will not deduct any money</small>
                                <button className="btn btn-primary w-100 py-2" onClick={ClickToContinue}>Continue</button>
                                <img src="https://images.meesho.com/images/marketing/1588578650850.webp" alt="img" width={"100%"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div > : <div className="d-flex flex-column gap-2 w-100 align-items-center justify-content-center" style={{ height: "calc(100vh - 150px)" }}>
                <img src="https://www.meesho.com/mcheckout/build/static/media/empty-cart.b87f87595dfaa8606bfe.png" alt="img" style={{ maxWidth: "100%" }} />
                <h4>
                    Your cart is empty
                </h4>
                <button onClick={() => navigate(Path.home)} className="btn btn-primary">View Products</button>
            </div>
        }
    </>
}