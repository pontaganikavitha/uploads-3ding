// import React from 'react';

// const OrderSummary = ({ orderId, files, subtotal, gst, shippingCharges }) => {
//     return (
//         <div className="container border-top mt-4">
//             <table className="table">
//                 <tbody>
//                     <tr>
//                         <th className='fw-normal'>Order ID</th>
//                         <td>{orderId}</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>Total Files:</th>
//                         <td>{files.length}</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>Lead Time:</th>
//                         <td>2 Days</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>Sub Total:</th>
//                         <td>₹ {subtotal}</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>GST 18%:</th>
//                         <td>₹ {gst}</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>Shipping</th>
//                         <td>₹ {shippingCharges}</td>
//                     </tr>
//                     <tr>
//                         <th className='fw-normal'>Total Including GST:</th>
//                         <td>₹ {subtotal + gst + shippingCharges}</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default OrderSummary;


import React from 'react';

const OrderSummary = ({ orderId, files, subtotal, gst, shippingCharges, leadTime }) => {
    const total = subtotal + gst + shippingCharges;
    
    // let leadTime;
    // if (total >= 10000) {
    //     leadTime = "10 Days";
    // } else if (total > 1000) {
    //     leadTime = "5 Days";
    // } else if (total > 500) {
    //     leadTime = "4 Days";
    // } else if (total > 200) {
    //     leadTime = "3 Days";
    // } else if (total > 100) {
    //     leadTime = "2 Day"; 
    // } else {
    //     leadTime = "1 Day"; // Default case
    // }

    return (
        <div className="container border-top mt-4">
            <table className="table">
                <tbody>
                    <tr>
                        <th className='fw-normal'>Order ID</th>
                        <td>{orderId}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>Total Files:</th>
                        <td>{files.length}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>Lead Time:</th>
                        <td>{leadTime}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>Sub Total:</th>
                        <td>₹ {subtotal}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>GST 18%:</th>
                        <td>₹ {gst}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>Shipping</th>
                        <td>₹ {shippingCharges}</td>
                    </tr>
                    <tr>
                        <th className='fw-normal'>Total Including GST:</th>
                        <td>₹ {total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default OrderSummary;
