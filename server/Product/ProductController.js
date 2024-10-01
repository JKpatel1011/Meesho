const products = require("../data")
const productModel = require("./ProductModel")

class ProductController {
    async InsertProducts() {
        try {
            const result = await productModel.model.insertMany(products)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }


    async ListProduct(req, res) {
        try {
            const result = await productModel.model.find()
            if (!result) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", data: result })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async GetProductById(req, res) {
        try {
            const { id } = req.params
            const result = await productModel.model.findOne({ _id: id })
            if (!result) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", data: result })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

}

const productController = new ProductController()

// productController.InsertProducts()

module.exports = productController