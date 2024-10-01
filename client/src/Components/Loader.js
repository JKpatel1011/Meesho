export default function Loader({ loading }) {
    if (loading) return <>
        <div className='loader flex-column'>
            <i className="fa-brands fa-meetup fa-flip fa-5x" style={{ color: "#570d48" }}></i>
        </div>
    </>

    return <>
        <div className='loader flex-column' style={{height:0}}>
        </div>
    </>
}