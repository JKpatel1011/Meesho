import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Path from "../../Commen/Path";
import apiHelper from "../../Commen/ApiHelper";

export default function Drawer({ setloading, userInfo, open, setOpen }) {
    const [AddressDetails, setAddressDetails] = useState({
        fullName: "",
        phone: "",
        house: "",
        area: "",
        city: "",
        state: '',
        pincode: "",
    });
    const [Error, setError] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo) {
            setAddressDetails((A) => {

                return { ...A, fullName: userInfo.firstName + " " + userInfo.lastName, phone: userInfo.phone || "" }
            })
        }
    }, [userInfo]);

    const AddressHandler = async () => {
        try {
            if (!userInfo) return navigate(Path.login)
            if (!AddressDetails.fullName) return setError("Required field firstname is empty.")
            if (!AddressDetails.phone) return setError("Required field phone is empty.")
            if (!AddressDetails.city) return setError("Required field city is empty.")
            if (!AddressDetails.state) return setError("Required field state is empty.")
            if (!AddressDetails.area) return setError("Required field area is empty.")
            // eslint-disable-next-line 
            if (Number(AddressDetails.phone) === NaN) return setError("Your phone number is invalid")
            // eslint-disable-next-line 
            if (Number(AddressDetails.pincode) === NaN) return setError("Your pincode number is invalid")

            const data = {
                fullName: AddressDetails.fullName,
                user: userInfo._id,
                phone: AddressDetails.phone,
                city: AddressDetails.city,
                state: AddressDetails.state,
                pincode: AddressDetails.pincode,
                address: AddressDetails.house + "," + AddressDetails.area
            }
            setloading(true)
            await apiHelper.addAddress(data)
            setloading(false)
            setOpen(false)
        } catch (error) {
            setloading(false)
            setError(error.message)
        }
    }



    return open ? <>
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 500, height: "100vh", width: "100%" }}>
            <div onClick={() => setOpen(false)} style={{ background: "#0000006b", position: "absolute", left: 0, top: 0, width: "100%", zIndex: -1, height: "100vh" }}>
            </div>
            <div className="drawer_right px-3 py-4" style={{ position: "absolute", right: 0, top: 0, width: "325px", background: "white", height: "100vh", zIndex: 1 }}>
                <div className="d-flex  justify-content-between align-items-center">
                    <h5 className="fw-bold m-0">ADD ADDRESS</h5>
                    <h5 type="button" onClick={() => {
                        setOpen(false)
                    }} className="text-muted m-0"><i className="fa-solid fa-xmark"></i></h5>
                </div>
                <hr />
                 
                <div>
                    <h5 className="fw-bold">
                        <i className="fa-solid fa-phone" style={{ color: "rgb(159, 32, 137)" }}></i> &nbsp;Contact Details
                    </h5>
                    <br />
                    <input type="text" placeholder="Fullname" onChange={(e) => setAddressDetails({ ...AddressDetails, fullName: e.target.value })} value={AddressDetails.fullName} style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                    <br />
                    <br />
                    <input type="text" onChange={(e) => setAddressDetails({ ...AddressDetails, phone: e.target.value })} maxLength={10} placeholder="Contact Number" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} value={AddressDetails.phone} />
                    <br />
                    <br />
                    <h5 className="fw-bold">
                        <i className="fa-solid fa-map-location-dot" style={{ color: "rgb(159, 32, 137)" }}></i> &nbsp; Address
                    </h5>
                    <br />
                    <input type="text" onChange={(e) => setAddressDetails({ ...AddressDetails, house: e.target.value })} placeholder="House no./Building Name" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                    <br />
                    <br />
                    <input type="text" onChange={(e) => setAddressDetails({ ...AddressDetails, area: e.target.value })} placeholder="Road Name/ Area / Colony" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                    <br />
                    <br />
                    <input type="text" maxLength={6} onChange={(e) => setAddressDetails({ ...AddressDetails, pincode: e.target.value })} placeholder="Pincode" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                    <br />
                    <br />
                    <div className="row">
                        <div className="col-6">
                            <input onChange={(e) => setAddressDetails({ ...AddressDetails, city: e.target.value })} type="text" placeholder="City" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                        </div>
                        <div className="col-6">
                            <input onChange={(e) => setAddressDetails({ ...AddressDetails, state: e.target.value })} type="text" placeholder="State" style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} />
                        </div>
                        <br />
                        <br />
                    </div>
                    <button onClick={AddressHandler} className="btn btn-primary fw-bold pt-2 w-100">Save Address and Continue</button>

                </div>
            </div>
        </div>

    </> : <>
    </>
}