export default function ProductCard({product}) {
    return <>

        <div className="card" style={{ width: "100%" }}>
            <img  src={product.image} className="card-img-top product_Detail_img" alt="product" />
            <div className="card-body">
                <span className="text-secondary mb-1 title d-block" style={{ maxWidth: "100%" }}>
                  {product.title}
                </span>
                <h4 className="fw-bold">{product.price.currency.symbol}{product.price.value} <small className="fw-500 text-secondary" style={{ fontSize: "14px" }}>onwards</small> </h4>
                <small className="fw-bold text-secondary mb-2 d-block" style={{ fontSize: "14px" }}>Free Delivery</small>
                <div className="d-flex gap-2 align-items-center">
                    <span style={{ fontSize: "1rem" }} className="badge d-flex align-items-center gap-1 rounded-pill bg-success">
                        <span>{product.rating}</span>
                        <i className="fa-solid fa-star mt-1" style={{ fontSize: "10px" }}></i>
                    </span>
                    <small className="fw-bold text-secondary  d-block" style={{ fontSize: "13px" }}>{product.numReviews} Reviews</small>
                </div>
            </div>
        </div>
    </>
}