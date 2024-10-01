import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Path from "../../Commen/Path"
import apiHelper from "../../Commen/ApiHelper";
import Loader from "../../Components/Loader";

export default function CheckoutScreen({ userInfo, Auth, FetchUserCart, CartItems, setCartItems, CartTotalDetails }) {
    const location = useLocation()
    const [loading, setloading] = useState(false);
    let addressId = location.search?.split("?")[1]?.split("&")[0]?.split("=")[1]

    let PaymentMethod = location.search?.split("?")[1]?.split("&")[1]?.split("=")[1]
    let ProductId = location.search?.split("?")[1]?.split("&")[2]?.split("=")[1]
    const [Address, setAddress] = useState({});
    const [Product, setProduct] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        if (!Auth) {
            navigate(Path.login)
        }
        // eslint-disable-next-line
    }, [Auth]);

    useEffect(() => {
        if (!PaymentMethod || !addressId) {
            navigate(Path.payment)
        }
        // eslint-disable-next-line
    }, [])




  


    async function GetProduct() {
        try {
            setloading(true)
            const result = await apiHelper.GetProductById(ProductId)
            setloading(false)
            result.data.data.qty = 1
            setProduct(result.data.data)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    async function GetAddress() {
        try {
            setloading(true)
            const result = await apiHelper.getAddressById(addressId)
            setAddress(result.data.data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }



    useEffect(() => {
        if (ProductId) {
            GetProduct()
        }
        if (addressId) {
            GetAddress()
        }
        // eslint-disable-next-line
    }, []);


    const handlePayment = async (orderDetails) => {
        const options = {
            key: orderDetails.razorpayDetails.key_id,
            amount: orderDetails.razorpayDetails.amount, // amount in paisa
            currency: orderDetails.razorpayDetails.currency,
            name: 'Meesho',
            description: 'This is a payment proccess',
            order_id: orderDetails.razorpayDetails.id, // replace with actual order id
            handler: async (response) => {
                try {
                    setloading(false)
                    await apiHelper.verifyPeyment({ ...response, orderId: orderDetails._id })
                    navigate(Path.orderDetails.split(":")[0] + orderDetails._id)
                    setloading(true)
                } catch (error) {
                    setloading(false)
                    console.log(error)
                }
            },
            prefill: {
                name: userInfo.fullName + " " + userInfo.lastName,
                email: userInfo.email,
                contact: "7201000140"
            },
            // notes: {
            //     address: 'Razorpay Corporate Office'
            // },
            theme: {
                color: 'red'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    }


    async function PlaceOrder() {
        try {
            if (!userInfo || !userInfo._id) {
                navigate(Path.login)
                return
            }
            const data = {
                user: userInfo._id,
                products: Product._id ? [{ id: Product._id, qty: Product.qty }] : CartItems.map((x) => {
                    return { id: x.product._id, qty: x.qty }
                }),
                paymentMethod: PaymentMethod,
                address: Address._id,
            }
            setloading(true)
            const result = await apiHelper.createOrder(data)
            if (!Product._id && !ProductId) {
                await apiHelper.EmptyUserCart(userInfo._id)
                FetchUserCart(userInfo._id)
            }
            setloading(false)
            if (PaymentMethod === "cod") return navigate(Path.orderDetails.split(":")[0] + result.data.data._id)
            handlePayment(result.data.data)
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    const qtyHendeler = (qty, index) => {
        if (Product._id) {
            setProduct({ ...Product, qty: qty })
            return
        }
        const tmp = [...CartItems]
        tmp[index].qty = qty
        setCartItems([...tmp])
    }


    return <>
        <Loader loading={loading} />
        <Loader loading={loading} />
        <div className="container cart_container">
            <div className="row">
                <div className="col-12 col-md-7 p-0">
                    <div className="d-flex justify-content-between align-items-center px-2 px-md-0">
                        <h5 style={{ width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>Check Confirm Your Order</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-7 mb-2 ps-md-0" >
                    {
                        Product._id ? (<>
                            <div key={Product._id} className="card cart_card mb-2 w-100">
                                <div className="card-body">
                                    <div className="d-flex flex wrap gap-2">
                                        <div>
                                            <Link to={Path.product.split(":")[0] + Product._id}>
                                                <img className="cart_item_img w-sm-100" src={Product.image} alt={Product.title} />
                                            </Link>
                                        </div>
                                        <div style={{ width: "calc(100% - 100px)" }}>
                                            <div className="d-flex gap-2 justify-content-between w-100 align-items-center">
                                                <h6 className="title" style={{ fontWeight: "500", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "100%" }}>
                                                    <Link style={{ color: "inherit", textDecoration: "none" }} to={Path.product.split(":")[0] + Product._id}>
                                                        {Product.title}
                                                    </Link>
                                                </h6>
                                            </div>
                                            <span className="fs-6" style={{ fontWeight: "300" }}>
                                                {
                                                    Product.price.currency.symbol
                                                    + " " +
                                                    Product.price.value
                                                }
                                            </span>
                                            <br />
                                            <span className="fs-6" style={{ fontWeight: "300" }}>
                                                All issue easy returns allowed
                                            </span>
                                            <br />
                                            <span className="fs-6 d-inline-block mt-2" style={{ fontWeight: "300", border: "2px solid #f1f5fe" }}>
                                                <button onClick={() => qtyHendeler(Product.qty - 1)} disabled={Product.qty <= 1} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-minus"></i></button>
                                                &nbsp; &nbsp;{Product.qty}&nbsp; &nbsp;
                                                <button onClick={() => qtyHendeler(Product.qty + 1)} disabled={Product.qty >= 20} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-plus"></i></button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>) : <>
                            {
                                CartItems && CartItems.map((x, key) => {
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
                                                    <span className="fs-6 d-inline-block mt-2" style={{ fontWeight: "300", border: "2px solid #f1f5fe" }}>
                                                        <button onClick={() => qtyHendeler(x.qty - 1, key)} disabled={x.qty <= 1} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-minus"></i></button>
                                                        &nbsp; &nbsp;{x.qty}&nbsp; &nbsp;
                                                        <button onClick={() => qtyHendeler(x.qty + 1, key)} disabled={x.qty >= 20} className="btn" style={{ background: "#f1f5fe", fontSize: "14px", border: "none", padding: "2px 1rem" }}><i className="fa-solid fa-plus"></i></button>
                                                    </span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </>
                    }

                    <label className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card_body">
                            <div className="d-flex align-items-start gap-3">

                                <div style={{ width: " 100%" }}>
                                    <h5 className="fw-bold mb-0">{Address.fullName}</h5>
                                    <p className="my-2 fw-normal w-100 text-muted">
                                        {Address.address + "," + Address.city} <br />
                                        {Address.state} - {Address.pincode} <br />
                                        {Address.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </label>
                    <label className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card_body">
                            <div className="d-flex align-items-start gap-3">
                                Payment Method: {PaymentMethod?.toUpperCase()}
                            </div>
                        </div>
                    </label>

                </div>

                <div className="col-12 col-md-5 mb-2 pe-md-0">
                    <div className="card w-100">
                        <div className="card-body">
                            <h5>Price Details</h5>
                            <div className="d-flex w-100 justify-content-between">
                                <h6>Total Items</h6>
                                <h6>+ {Product._id ? 1 : CartTotalDetails.totalItems}</h6>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <h6>Total Product Price</h6>
                                <h6>+ {Product.price ? Product.price.currency.symbole : CartTotalDetails.priceSymbole}{Product.price ? Product.price.value * Product.qty : CartTotalDetails.totalPrice}</h6>
                            </div>
                            <hr />
                            <div className="d-flex w-100 justify-content-between">
                                <h5>Order Total</h5>
                                <h5>+ {Product.price ? Product.price.currency.symbole : CartTotalDetails.priceSymbole}{Product.price ? Product.price.value * Product.qty : CartTotalDetails.totalPrice}</h5>
                            </div>
                            <small style={{ fontSize: "12px", display: "block" }} className="my-2 text-muted text-center">Clicking on ‘Continue’ will not deduct any money</small>
                            <button onClick={() => PlaceOrder()} className="btn btn-primary w-100 py-2" >Place Order</button>
                            <img src="https://images.meesho.com/images/marketing/1588578650850.webp" alt="img" width={"100%"} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
}