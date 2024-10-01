const express = require("express")
const ConnectDb = require("./Connection")
const productController = require("./Product/ProductController")
const cors = require("cors")
const userController = require("./User/UserController")
const cartController = require("./Cart/CartController")
const addressController = require("./Address/AddressController")
const orderController = require("./Order/OrderController")

const app = express()
ConnectDb()

app.use(cors())
app.use(express.json())

app.get("/product", productController.ListProduct)
app.get("/product/:id", productController.GetProductById)
app.post("/cart", cartController.addToCart)
app.get("/cart/:user", cartController.listCart)
app.delete("/cart/:id", cartController.removeToCart)
app.delete("/cart/empty/:id", cartController.EmptyUserCart)
app.post("/user/address", addressController.addAddress)
app.get("/user/address/list/:userId", addressController.listAddress)
app.get("/user/address/:id", addressController.getAddressById)
app.post("/order", orderController.createOrder)
app.get("/order/:id", orderController.GetOrderbyId)
app.post("/order/payment/verify", orderController.PaymentVerify)

app.post("/user/register", userController.registerUser)
app.post("/user/login", userController.LoginUser)


app.listen(5000, () => {    
    console.log("Server Started")
})

