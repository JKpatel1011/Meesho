import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import apiHelper from "../../Commen/ApiHelper";
import Path from "../../Commen/Path";

export default function PaymentScreen({ userInfo, CartItems, Auth, CartTotalDetails }) {
    const [loading, setloading] = useState(false);
    const location = useLocation()
    let addressId = location.search.split("?")[1]?.split("&")[0]?.split("=")[1]
  
    let ProductId = location.search.split("?")[1]?.split("&")[1]?.split("=")[1]
    const [Address, setAddress] = useState({});
    const [Product, setProduct] = useState({});
    const [PaymentMethod, setPaymentMethod] = useState("cod");
    const navigate = useNavigate()


    useEffect(() => {


        if (!addressId) {
            navigate(Path.addresss)
        }

        if (!ProductId && (CartItems)) {
            if (CartItems.length <= 0) {
                navigate(Path.home)
            }
        }
        // eslint-disable-next-line
    }, []);



    async function GetProduct() {
        try {
            setloading(true)
            const result = await apiHelper.GetProductById(ProductId)
            setloading(false)
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

    async function ClickonContinue() {
        if (Product._id) {
            navigate(`${Path.checkout}?address=${Address._id}&paymentMethod=${PaymentMethod}&product=${Product._id}`)
        } else {
            navigate(`${Path.checkout}?address=${Address._id}&paymentMethod=${PaymentMethod}`)

        }
    }



    return <>
        <Loader loading={loading} />
        <div className="container cart_container">
            <div className="row">
                <div className="col-12 col-md-7 p-0">
                    <div className="d-flex justify-content-between align-items-center px-2 px-md-0">
                        <h5 style={{ width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>Select Payment Method</h5>
                    </div>
                </div>
            </div>
            <div className="row">

                <div className="col-12 col-md-7 mb-2 ps-md-0">

                    <label className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: "#e7eeff", border: "1px solid #e7eeff" }}>
                        <div className="card_body">
                            <div className="d-flex align-items-start gap-3">
                                <div style={{ width: "20px" }}>
                                    <input defaultChecked={true} type="radio" className="form-check-input " />
                                </div>
                                <div style={{ width: "calc(100% - 20px)" }}>
                                    <h5 className="fw-bold mb-0">{Address.fullName}</h5>
                                    <p className="my-2 fw-normal text-muted">
                                        {Address.address + "," + Address.city} <br />
                                        {Address.state} - {Address.pincode} <br />
                                        {Address.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: PaymentMethod === "online" ? "#e7eeff" : "", border: PaymentMethod === "online" ? "1px solid #e7eeff" : undefined }}>
                        <div className="card_body">
                            <div className="d-flex align-items-start gap-3">
                                <div style={{ width: "20px" }}>
                                    <input checked={PaymentMethod === "online"} onChange={(e) => setPaymentMethod(e.target.value)} value={"online"} type="radio" className="form-check-input " />
                                </div>
                                <div style={{ width: "calc(100% - 20px" }}>
                                    Online
                                </div>

                            </div>
                        </div>
                    </label>
                    <label className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: PaymentMethod === "cod" ? "#e7eeff" : "white", border: PaymentMethod === "cod" ? "1px solid #e7eeff" : undefined }}>
                        <div className="card_body">
                            <div className="d-flex align-items-start gap-3">
                                <div style={{ width: "20px" }}>
                                    <input checked={PaymentMethod === "cod"} type="radio" className="form-check-input " value={"cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                </div>
                                <div style={{ width: "calc(100% - 20px" }}>
                                    Case On Delivery
                                </div>

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
                                <h6>+ {Product.price ? Product.price.currency.symbole : CartTotalDetails.priceSymbole}{Product.price ? Product.price.value : CartTotalDetails.totalPrice}</h6>
                            </div>
                            <hr />
                            <div className="d-flex w-100 justify-content-between">
                                <h5>Order Total</h5>
                                <h5>+ {Product.price ? Product.price.currency.symbole : CartTotalDetails.priceSymbole}{Product.price ? Product.price.value : CartTotalDetails.totalPrice}</h5>
                            </div>
                            <small style={{ fontSize: "12px", display: "block" }} className="my-2 text-muted text-center">Clicking on ‘Continue’ will not deduct any money</small>
                            <button onClick={ClickonContinue} className="btn btn-primary w-100 py-2" >Continue</button>
                            <img src="https://images.meesho.com/images/marketing/1588578650850.webp" alt="img" width={"100%"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}