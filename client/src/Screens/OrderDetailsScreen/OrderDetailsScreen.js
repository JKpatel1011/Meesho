import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiHelper from "../../Commen/ApiHelper";
import Loader from "../../Components/Loader";
import Path from "../../Commen/Path";

export default function OrderDetailsScreen() {
    const { id } = useParams()
    const [OrderDetails, setOrderDetails] = useState({});
    const [loading, setloading] = useState(false);
    const [OrderTotal, setOrderTotal] = useState({
        totalItems:0,
        totalPrice:0,
        discount:0,
        subTotal:0,
        priceSymbole:""
    });



    async function FetchOrderDetails() {
        try {
            setloading(true)
            const reuslt = await apiHelper.FetchOrderById(id)
            let products = reuslt.data.data.products
            let totalItems = 0
            let totalPrice = 0
            let priceSymbole = ""
            let discount =0 
            for (let i = 0; i < products.length; i++) {
               let product = products[i]
               totalItems += product.qty
               totalPrice += (product.qty * product.price.value)
               priceSymbole = product.price.currency.symbol
               discount+= (product.discount.value*product.qty)
            }


            setOrderTotal({
                totalItems:totalItems,
                totalPrice:totalPrice,
                priceSymbole:priceSymbole,
                discount:discount,
                subTotal:reuslt?.data?.data?.totalPrice
            })
            setOrderDetails(reuslt.data.data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        FetchOrderDetails()
        // eslint-disable-next-line
    }, []);


    return <>
        <Loader loading={loading} />
        <div className="cart_container container">
            <div className="row">
                <div className="col-12 col-md-7 p-0">
                    <div className="d-flex justify-content-between align-items-center px-2 px-md-0">
                        <h5 style={{ width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>Traking Id : {OrderDetails._id}</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-7 mb-2 ps-md-0" >
                    {
                        OrderDetails && OrderDetails.products && OrderDetails.products.map((x) => {
                            return <div key={x._id} className="card cart_card mb-2 w-100" style={{ background: "#e7eeff", border: "1px solid #e7eeff" }}>
                                <div className="card-body">
                                    <div className="d-flex flex wrap gap-2">
                                        <div>
                                            <Link to={Path.product.split(":")[0] + x._id}>
                                                <img className="cart_item_img w-sm-100" src={x.image} alt={x.title} />
                                            </Link>
                                        </div>
                                        <div style={{ width: "calc(100% - 100px)" }}>
                                            <div className="d-flex gap-2 justify-content-between w-100 align-items-center">
                                                <h6 className="title" style={{ fontWeight: "500", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "100%" }}>
                                                    <Link style={{ color: "inherit", textDecoration: "none" }} to={Path.product.split(":")[0] + x._id}>
                                                        {x.title}
                                                    </Link>
                                                </h6>
                                            </div>
                                            <span className="fs-6" style={{ fontWeight: "300" }}>
                                                {
                                                    x.price.currency.symbol
                                                    + " " +
                                                    x.price.value
                                                }
                                            </span>
                                            <br />
                                            <span className="fs-6" style={{ fontWeight: "300" }}>
                                                All issue easy returns allowed
                                            </span>
                                            <br />
                                            <span className="fs-6 mt-2" style={{ fontWeight: "300" }}>
                                                Qty: &nbsp; {x.qty}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>
                <div className="col-12 col-md-5 mb-2 pe-md-0">
                    <div className="card cart_card mb-2 w-100" style={{ background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-0">{OrderDetails?.address?.fullName}</h5>
                            <p className="my-2 fw-normal text-muted">
                                {OrderDetails?.address?.address + "," + OrderDetails?.address?.city} <br />
                                {OrderDetails?.address?.state} - {OrderDetails?.address?.pincode} <br />
                                {OrderDetails?.address?.phone}
                            </p>
                        </div>
                    </div>
                    <div className="card cart_card mb-2 w-100" style={{ background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card-body">
                            <div className="d-flex align-items-start gap-3">
                                <div style={{ width: "100%" }}>
                                    {OrderDetails?.paymentMethod?.toUpperCase()}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="card mb-2 w-100" style={{background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card-body">
                            <h5>Price Details</h5>
                            <div className="d-flex w-100 justify-content-between">
                                <h6>Total Items</h6>
                                <h6>{OrderTotal.totalItems}</h6>
                            </div>
                            <hr />
                            <div className="d-flex w-100 justify-content-between">
                                <h6>Total Product Price</h6>
                                <h6>+ {OrderTotal.priceSymbole + OrderTotal.totalPrice}</h6>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <h6>Discount</h6>
                                <h6>- {OrderTotal.priceSymbole + OrderTotal.discount}</h6>
                            </div>
                            <hr />
                            <div className="d-flex w-100 justify-content-between">
                                <h5>Order Total</h5>
                                <h5>+ {OrderTotal.priceSymbole + OrderTotal.subTotal}</h5>
                            </div>
                            {/* <small style={{ fontSize: "12px", display: "block" }} className="my-2 text-muted text-center">Clicking on ‘Continue’ will not deduct any money</small> */}
                            <button  className="btn btn-primary w-100 py-2 mt-2" >Download Invoice</button>
                            {/* <img src="https://images.meesho.com/images/marketing/1588578650850.webp" alt="img" width={"100%"} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}