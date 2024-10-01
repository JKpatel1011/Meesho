import { useEffect, useState } from "react"

export default function DetailsFooter({ CartHandeler, CartItems, BuyNowHandeler, id }) {
    const [width, setwidth] = useState(window.innerWidth);


    useEffect(() => {
        window.addEventListener("resize", () => {
            setwidth(window.innerWidth)
        })
    }, [])


    return <div style={width < 768 ? { position: "fixed", bottom: 0, width: "100%", left: 0, background: "white", padding: "0.5rem 1rem", boxShadow: "0px 8px 20px gray" } : {}} className="button mt-4 d-flex justify-content-center gap-3">
        <button onClick={CartHandeler} className="rounded-3 fw-bold text-light p-2" style={{ background: "rgb(87, 13, 72)", width: "50%" }}><i className="fa-solid fa-cart-shopping"></i> {CartItems.find((x) => x.product._id === id) ? "Go To Cart" : "Add To Cart"}</button>
        <button onClick={BuyNowHandeler} className=" p-2 rounded-3 fs-bold fw-bold" style={{ border: "2px solid rgb(87, 13, 72)", width: "50%" }}><i className="fa-solid fa-angles-right"></i> Buy Now</button>
    </div>
}