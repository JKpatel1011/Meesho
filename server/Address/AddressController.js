const addressModel = require("./AddressModel")

class AddressController {

    async addAddress(req,res){
        try {
            const {fullName, city, state, phone, pincode, address, user} = req.body
            if(!fullName || !city || !state || !phone || !address || !user || !pincode) return res.status(400).send({message:"Missing Dependency."})
            const result  = await addressModel.model.create({...req.body})
            if(!result) return res.status(500).send({message:"Somthing went wrong"})
            return res.status(200).send({message:"Success"})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message:"Internal server error"})
        }
    }

    async listAddress(req,res){
        try {
            const {userId} = req.params
            const result = await addressModel.model.find({user:userId})
            if(!result) return res.status(500).send({message:"Somthing went wrong"})
            return res.status(200).send({message:"Success", data:result})
        } catch (error) {
            return res.status(500).send({message:"Internal server error"})
        }
    }

    async getAddressById(req,res){
        try {
            const {id} = req.params
            const result = await addressModel.model.findById(id)
            if(!result) return res.state(500).send({message:"Somthing went wrong"})
            return res.status(200).send({message:"Success", data:result})
        } catch (error) {
            return res.status(500).send({message:"Internal server error"})
        }
    }
     
}


const addressController = new AddressController()

module.exports = addressController