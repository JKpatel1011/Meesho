const Razorpay = require("razorpay")
const productModel = require("../Product/ProductModel")
const orderModel = require("./OrderModel")
const { key_id, key_secrate } = require("../Constents")
const crypto = require("crypto")

const razorpay = new Razorpay({ key_id: key_id, key_secret: key_secrate })

class OrderController {
    async createOrder(req, res) {
        try {
            const { products, user, paymentMethod, address } = req.body
            if (!products || !user || !paymentMethod || !address) return res.status(400).send({ message: "Missing Dependency" })
            let Products = await productModel.model.find({ _id: [...products.map((x) => x.id)] }).sort({ _id: 1 })
            console.log(Products)
            if (!Products) return res.status(500).send({ message: "Internal server error" })
            let tmp = products.sort((x, y) => x.id)
            let totalPrice = 0
            let totalDisCount = 0
            let currency = ""
            for (let i = 0; i < tmp.length; i++) {
                const x = { ...Products[i]._doc, qty: tmp[i].qty }
                Products[i] = x
                totalPrice += ((x.price.value - x.discount.value) * x.qty)
                totalDisCount += (x.discount.value * x.qty)
                currency = x.price.currency.value
            }
            let create = await orderModel.model.create({ products: Products, user: user, paymentMethod: paymentMethod, address: address, totalPrice: totalPrice, totalDisCount: totalDisCount })
            if (!create) return res.status(500).send({ message: "Somthing went wrong" })
            create = create._doc
            if (create.paymentMethod === "cod") return res.status(200).send({ message: "Success", data: create })
            const options = {
                amount: totalPrice * 100,
                currency: currency,
                receipt: create._id,
                payment_capture: 1
            };
            const response = await razorpay.orders.create(options);
            if (!response) return res.status(500).send({ message: "Somthing went wrong" })
            const data = {
                ...create,
                razorpayDetails: { ...response, api_key: key_id }
            }
            return res.status(200).send({ message: "Success", data: data })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async GetOrderbyId(req, res) {
        try {
            const { id } = req.params
            const result = await orderModel.model.findOne({ _id: id }).populate([{ path: "address" }])
            if (!result) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", data: result })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async PaymentVerify(req, res) {
        try {
            const { razorpay_signature, orderId, razorpay_order_id, razorpay_payment_id } = req.body;
            const payment = await razorpay.payments.fetch(razorpay_payment_id);
          
            if (!payment) return res.status(500).send({ message: "Somthing went wrong" })
            if ((payment.status === "captured" || payment.status === "created") && razorpay_order_id === payment.order_id) {
                await orderModel.model.updateOne({ _id: orderId }, { paymentStatus: "success" })
                return res.status(200).send({ message: "Success" })
            }
            await orderModel.model.updateOne({ _id: orderId }, { paymentStatus: "reject" })
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Internal server error' });

        }
    }
}

const orderController = new OrderController()
module.exports = orderController 