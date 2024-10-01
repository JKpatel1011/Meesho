const { default: mongoose } = require("mongoose");

class ProductModel {
    constructor(){
        this.schema = new mongoose.Schema({
            title:{type:String, required:true},
            price:{type:Object,required:true},
            rating:{type:Number, required:true},
            image:{type:String, required:true},
            numReviews:{type:Number, required:true},
            brand:{type:String, required:true},
            category:{type:String, required:true},
            discount:{type:Object, required:true},
            size:{type:Array, required:true},
            content:{type:String,required:true}
        }, {timestamps:true})
        this.model = mongoose.model("tbl_products", this.schema)
    }
}

const productModel = new ProductModel()
module.exports = productModel