import axios from "axios"

class ApiHelper {
    constructor(){
        this.baseUrl = "http://localhost:5000"
        // this.baseUrl = "http://192.168.29.32:5000"
        // this.baseUrl = "http://192.168.1.32:5000"
    }

    listProduct(){
        return axios.get(this.baseUrl + "/product")
    }

    GetProductById(id){
        return axios.get(this.baseUrl + "/product/" + id)
    }
    loginUser(data){
        return axios.post(this.baseUrl + "/user/login", data)
    }
    registerUser(data){
        return axios.post(this.baseUrl + "/user/register", data)
    }
    addtoCart(data){
        return axios.post(this.baseUrl + "/cart", data)
    }
    listCart(user){
        return axios.get(this.baseUrl + "/cart/" + user)
    }
    removeToCart(id){
        return axios.delete(this.baseUrl + "/cart/"+ id)
    }
    addAddress(data){
        return axios.post(this.baseUrl + '/user/address' ,data)
    }
    listAddress(userId){
        return axios.get(this.baseUrl + "/user/address/list/" + userId)
    }
    getAddressById(id){
        return axios.get(this.baseUrl + "/user/address/"+ id)
    }
    createOrder(data){
        return axios.post(this.baseUrl + "/order", data)
    }
    FetchOrderById(id){
        return axios.get(this.baseUrl + "/order/" + id)
    }
    verifyPeyment(data){
        return axios.post(this.baseUrl + "/order/payment/verify" , data)
    }
    EmptyUserCart(id){
        return axios.delete(this.baseUrl + "/cart/empty/"+ id)
    }
}

const apiHelper = new ApiHelper()
export default apiHelper