import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import ProductDetailsScreen from './Screens/ProductDetailsScreen/ProductDetailsScreen';
import Path from './Commen/Path';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import CartScreen from './Screens/CartScreen/CartScreen';
import apiHelper from './Commen/ApiHelper';
import AddressScreen from './Screens/AddressScreen/AddressScreen';
import PaymentScreen from './Screens/PaymentScreen/PaymentScreen';
import CheckoutScreen from './Screens/CheckoutScreen/CheckoutScreen';
import OrderDetailsScreen from './Screens/OrderDetailsScreen/OrderDetailsScreen';
import Footer from './Components/Footer';

function App() {

  const JWTDECODE = (arg) => {
    try {
      return jwtDecode(arg)
    } catch (error) {
      return null
    }
  }

  const [Auth, setAuth] = useState(localStorage.getItem("token"));
  const [userInfo, setuserInfo] = useState(JWTDECODE(localStorage.getItem("token")));
  const [CartItems, setCartItems] = useState([]);
  const [CartTotalDetails, setCartTotalDetails] = useState({
    totalPrice: 0,
    totalItems: 0,
    priceSymbole: ""
  });

  async function FetchUserCart(id) {
    try {
      if (!id) return
      const result = await apiHelper.listCart(id)
      setCartItems(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (CartItems) {
      let totalPrice = 0
      let totalItems = 0
      for (let i = 0; i < CartItems.length; i++) {
        let totalProductPrice = CartItems[i].product.price.value * CartItems[i].qty
        totalPrice += totalProductPrice
        totalItems += CartItems[i].qty
      }

      setCartTotalDetails({
        totalPrice: totalPrice,
        totalItems: totalItems,
        priceSymbole: CartItems[0] && CartItems[0].product && CartItems[0].product.price ? CartItems[0].product.price.currency.symbol : ""
      })
    }

  }, [CartItems]);



  useEffect(() => {
    if (Auth) {
      FetchUserCart(JWTDECODE(Auth)?._id)
      setuserInfo(JWTDECODE(Auth))
    } else {
      if (localStorage.getItem("token")) {
        setuserInfo(JWTDECODE(localStorage.getItem("token")))
        setAuth(localStorage.getItem("token"))
      }
      setuserInfo(null)
    }
  }, [Auth])



  return (
    <BrowserRouter>
      <Header CartItems={CartItems} setCartItems={setCartItems} CartTotalDetails={CartTotalDetails} userInfo={userInfo} setuserInfo={setuserInfo} Auth={Auth} setAuth={setAuth} />
      <Routes>
        <Route path={Path.home} element={<HomeScreen />} />
        <Route path={Path.product} element={<ProductDetailsScreen FetchUserCart={FetchUserCart} userInfo={userInfo} CartItems={CartItems} />} />
        <Route path={Path.cart} element={<CartScreen CartTotalDetails={CartTotalDetails} userInfo={userInfo} FetchUserCart={FetchUserCart} CartItems={CartItems} />} />
        <Route path={Path.login} element={<LoginScreen Auth={Auth} setAuth={setAuth} />} />
        <Route path={Path.register} element={<RegisterScreen Auth={Auth} setAuth={setAuth} />} />
        <Route path={Path.addresss} element={<AddressScreen CartTotalDetails={CartTotalDetails} CartItems={CartItems} userInfo={userInfo} setuserInfo={setuserInfo} Auth={Auth} setAuth={setAuth} />} />
        <Route path={Path.payment} element={<PaymentScreen CartTotalDetails={CartTotalDetails} CartItems={CartItems} userInfo={userInfo} setuserInfo={setuserInfo} Auth={Auth} setAuth={setAuth} />} />
        <Route path={Path.checkout} element={<CheckoutScreen FetchUserCart={FetchUserCart} setCartItems={setCartItems} CartTotalDetails={CartTotalDetails} CartItems={CartItems} userInfo={userInfo} setuserInfo={setuserInfo} Auth={Auth} setAuth={setAuth} />} />
        <Route path={Path.orderDetails} element={<OrderDetailsScreen setCartItems={setCartItems} CartTotalDetails={CartTotalDetails} CartItems={CartItems} userInfo={userInfo} setuserInfo={setuserInfo} Auth={Auth} setAuth={setAuth} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
