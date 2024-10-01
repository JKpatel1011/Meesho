import { useEffect, useState } from "react";
import ProductCard from "../../Components/ProductCard";
import apiHelper from "../../Commen/ApiHelper";
import { Link } from "react-router-dom";
import Path from "../../Commen/Path";
import Loader from "../../Components/Loader";
import Footer from "./Footer";

export default function HomeScreen() {
    const [loading, setloading] = useState(false);
    const [Products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            setloading(true)
            const result = await apiHelper.listProduct()
            setloading(false)
            setProducts(result.data.data)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    return <>
        <Loader loading={loading} />
        <div className="container">
            <h4 className="fw-bold">
                Feture Products.
            </h4>
            <div className="row">
                {
                    Products && Products.map((x) => {
                        return <Link to={Path.product.split(":")[0] + x._id} key={x._id} className="col-6 col-md-4 col-lg-3 mb-3 text-decoration-none text-dark">
                            <ProductCard product={x} />
                        </Link>
                    })
                }
            </div>
        </div>
        <Footer />

    </>
}