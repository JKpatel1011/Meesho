const { default: mongoose } = require("mongoose");

class UserModel {
    constructor() {
        this.schema = new mongoose.Schema({
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true }
        }, { timestamps: true })
        this.model = mongoose.model("tbl_users", this.schema)
    }
}

const userModel = new UserModel()
module.exports = userModel