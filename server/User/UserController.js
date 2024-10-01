const userModel = require("./UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { jwt_secrate } = require("../Constents")

class UserController {
    async registerUser(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body
            if (!firstName || !lastName || !email || !password) return res.status(400).send({ message: "Missing Dependency" })
            const encryptedPass = bcrypt.hashSync(password, 8)
            if (!encryptedPass) return res.status(500).send({ message: "Somthing went wrong" })
            req.body.password = encryptedPass
            let result = await userModel.model.create({ ...req.body })
            if (!result) return res.status(500).send({ message: "Somthing went wrong" })
            result = result._doc
            delete result.password
            const token = jwt.sign(result, jwt_secrate, { expiresIn: "1d" })
            if (!token) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", token })
        } catch (error) {
            if (error.code === 11000) return res.status(400).send({ message: "Email Allready Exist" })
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    async LoginUser(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) return res.status(400).send({ message: "Missing Dependency" })
            let result = await userModel.model.findOne({ email: email })
            if (!result) return res.status(400).send({ message: "Email Not Exist" })
            result = result._doc
            if (!bcrypt.compareSync(password, result.password)) return res.status(401).send({ message: "password Not Matched" })
            delete result.password
            const token = jwt.sign(result, jwt_secrate, { expiresIn: "1d" })
            if (!token) return res.status(500).send({ message: "Somthing went wrong" })
            return res.status(200).send({ message: "Success", token })
        } catch (error) {
            return res.status(500).send({ message: "Internal server error" })
        }
    }
}

const userController = new UserController()
module.exports = userController
