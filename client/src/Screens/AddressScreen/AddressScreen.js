import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Path from "../../Commen/Path"
import Drawer from "./Drawer"
import Loader from "../../Components/Loader"
import apiHelper from "../../Commen/ApiHelper"

export default function AddressScreen({ userInfo, Auth, CartItems, CartTotalDetails }) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false);
    const location = useLocation()
    const [open, setopen] = useState(false);
    let ProductId = location.search
    ProductId = ProductId ? ProductId.split("?product=")[1] : undefined
    const [AddressList, setAddressList] = useState([]);
    const [SelectedAddress, setSelectedAddress] = useState("")
    const [Product, setProduct] = useState({});


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


    useEffect(() => {
        if (userInfo && userInfo._id) {
            FetchAddress()
            if (ProductId) GetProduct()
        } else {
            navigate(Path.login)
        }
        // eslint-disable-next-line
    }, [userInfo]);



    async function FetchAddress() {
        try {
            setloading(true)
            const result = await apiHelper.listAddress(userInfo._id)
            setAddressList(result.data.data)
            setSelectedAddress(result.data.data[0]._id)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    function getoPaymentMethod(addressId) {
        if (ProductId) {
            return navigate(Path.payment + "?address=" + addressId + "&product=" + ProductId)
        }
        return navigate(Path.payment + "?address=" + addressId)
    }



    return <>
        <Loader loading={loading} />
        <Drawer setloading={setloading} userInfo={userInfo} open={open} setOpen={setopen} />
        <div className="container cart_container">
            <div className="row">
                <div className="col-12 col-md-7 p-0">
                    <div className="d-flex justify-content-between align-items-center px-2 px-md-0">
                        <h5 style={{ width: "50%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>Select Delivery Address</h5>
                        <button onClick={() => setopen(true)} className="fw-bold btn" style={{ cursor: "pointer", color: "rgb(159, 32, 137)", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>+ ADD NEW ADDRESS</button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-7 mb-2 ps-md-0">
                    {
                        AddressList.map((x) => {
                            return <label key={x._id} className="card p-3 d-block mb-2 w-100" style={{ cursor: "pointer", background: x._id === SelectedAddress ? "#e7eeff" : "white", border: SelectedAddress === x._id ? "1px solid #e7eeff" : undefined }}>
                                <div className="card_body">
                                    <div className="d-flex align-items-start gap-3">
                                        <div style={{ width: "20px" }}>
                                            <input onChange={(e) => setSelectedAddress(e.target.value)} checked={SelectedAddress === x._id} value={x._id} type="radio" className="form-check-input " />
                                        </div>
                                        <div style={{ width: "calc(100% - 20px)" }}>
                                            <h5 className="fw-bold mb-0">{x.fullName}</h5>
                                            <p className="my-2 fw-normal text-muted">
                                                {x.address + "," + x.city} <br />
                                                {x.state} - {x.pincode} <br />
                                                {x.phone}
                                            </p>
                                            {
                                                SelectedAddress === x._id && (
                                                    <button onClick={() => getoPaymentMethod(x._id)} className="btn btn-primary w-100 py-2">Deliver to this Address</button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </label>

                        })
                    }
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
                            {/* <button className="btn btn-primary w-100 py-2" >Continue</button> */}
                            <img src="https://images.meesho.com/images/marketing/1588578650850.webp" alt="img" width={"100%"} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
}