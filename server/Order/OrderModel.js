const { default: mongoose } = require("mongoose")
class OrderModel  {
    constructor(){
        let deliveryDate=  new Date()
        deliveryDate.setDate(deliveryDate.getDate() + 5)
        this.schema = new mongoose.Schema({
            user:{type:mongoose.Types.ObjectId, required:true, ref:"tbl_users"},
            address:{type:mongoose.Types.ObjectId,required:true, ref:"tbl_addresses"},
            products:{type:Array,required:true},
            totalPrice:{type:Number,required:true},
            totalDiscount:{type:Number, default:0},
            paymentMethod:{type:String, default:null },
            paymentStatus:{type:String ,default:"pending"},
            deliveryStatus:{type:String, default:"pending"},
            deliveryDate:{type:Date, default:deliveryDate}
        })
        this.model = mongoose.model("tbl_orders", this.schema)
    }
}

const orderModel = new  OrderModel()
module.exports = orderModel