const { default: mongoose } = require("mongoose");

class AddressModel {
    constructor() {
        this.schema = new mongoose.Schema({
            user: { type: mongoose.Types.ObjectId, required: true, ref: 'tbl_users' },
            fullName: { type: String, required: true },
            phone: { type: String, required: true, length: 10 },
            city: { type: String, required: true },
            state: { type: String, required: true },
            address: { type: String, required: true },
            pincode: { type: String, required: true, length: 6 }
        }, { timestamps: true })
        this.model = mongoose.model("tbl_addresses", this.schema)
    }


}

const addressModel = new AddressModel()

module.exports = addressModel