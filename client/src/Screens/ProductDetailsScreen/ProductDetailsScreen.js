import { useNavigate, useParams } from "react-router-dom";
import apiHelper from "../../Commen/ApiHelper";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import Path from "../../Commen/Path";
import DetailsFooter from "./DetailFooter";

export default function ProductDetailsScreen({ userInfo, CartItems, FetchUserCart }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setloading] = useState(false);
    const [Product, setProduct] = useState({});

    async function GetProduct() {
        try {
            setloading(true)
            const result = await apiHelper.GetProductById(id)
            setloading(false)
            setProduct(result.data.data)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        GetProduct()
        // eslint-disable-next-line
    }, []);



    async function CartHandeler() {
        try {
            setloading(true)
            if (!userInfo) return navigate(Path.login)
            const cartItem = {
                product: id,
                qty: 1,
                user: userInfo._id
            }
            if (CartItems && CartItems.find((x) => x.product._id === cartItem.product)) {
                navigate(Path.cart)
                return
            }
            await apiHelper.addtoCart(cartItem)
            FetchUserCart(userInfo._id)
            setloading(false)

        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    function BuyNowHandeler() {
        return navigate(Path.addresss + "?product=" + id)
    }

    return <>
        <Loader loading={loading} />
        <div className="container pb-3 mb-5">
            <div className="row">
                <div className="col-12 col-md-5 text-end mt-1">
                    <img className="border border-1 rounded-3" width={"100%"} style={{ maxHeight: "80vh" }} src={Product.image} alt={Product.title} />
                    <DetailsFooter BuyNowHandeler={BuyNowHandeler} CartHandeler={CartHandeler} CartItems={CartItems} id={id} />
                </div>
                <div className="col-12 col-md-7 text-start">
                    <div className="head border border-1 p-3 my-2 rounded-3">
                        <div className="h5 text-secondary fw-bold">{Product.title}</div>
                        <div className="h2">{Product.price && Product.price.currency.symbol} {Product.price && Product.price.value}</div>
                        <div className="d-flex gap-2 align-items-center">
                            <span style={{ fontSize: "1rem" }} className="badge d-flex align-items-center gap-1 rounded-pill bg-success">
                                <span>{Product.rating}</span>
                                <i className="fa-solid fa-star mt-1" style={{ fontSize: "10px" }}></i>
                            </span>
                            <small className="fw-bold text-secondary  d-block" style={{ fontSize: "13px" }}>{Product.numReviews} Reviews</small>
                        </div>
                        <small className="fw-bold text-secondary my-2 d-block" style={{ fontSize: "14px" }}>Free Delivery</small>
                    </div>
                    <div className="size border border-1 my-2 p-3 rounded-3">
                        <div className="h4">Select Size</div>
                        <div className="d-flex gap-2">
                            {
                                Product.size && Product.size.map((x) => {
                                    return <span key={x} style={{ fontSize: "1rem", backgroundColor: "rgb(87, 13, 72)", width: "fit-content" }} className="badge d-flex align-items-center gap-1 rounded-pill p-2">{x}
                                    </span>
                                })
                            }
                        </div>
                    </div>
                    <div className="details border border-1 my-2 p-3 rounded-3">
                        <div dangerouslySetInnerHTML={{ __html: Product.content }}></div>
                    </div>
                </div>
            </div>
        </div>
    </>
}