const { default: mongoose } = require("mongoose")
const cartModel = require("./CartModel")

class CartController {
    async addToCart(req, res) {
        try {
            let { product, qty, user } = req.body
            if (!product || !qty || !user) return res.status(400).send({ message: "Missing Dependency" })
             let result = await cartModel.model.findOne({ product: product, user: user })
            if (result) {
                result = result._doc
                qty = result.qty + qty
                const update = await cartModel.model.updateOne({ product: product, user: user }, { qty: qty })
                if (!update || update.modifiedCount <= 0) return res.status(500).send({ message: "Somthing went wrong" })
                return res.status(200).send({ message: "Success" })
            }
            const create = await cartModel.model.create({ product: product, user: user, qty: qty })
            if (!create) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success" })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async listCart(req, res) {
        try {
            const { user } = req.params
            let result = await cartModel.model.find({ user: user }).populate({ path: 'product' })
            if (!result) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", data: result })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async removeToCart(req, res) {
        try {
            const { id } = req.params
            const result = await cartModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success" })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async EmptyUserCart(req, res) {
        try {
            const { id } = req.params
            const result = await cartModel.model.deleteMany({ user: id })
            if (!result || result.deletedCount <= 0) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success" })
        } catch (error) {
            // console.log(error)
            return res.status(500).send({ message: "Internal server error" })
        }
    }
}

const cartController = new CartController()

module.exports = cartController