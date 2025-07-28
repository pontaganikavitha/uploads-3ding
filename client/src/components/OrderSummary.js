import React, { useState } from 'react';

const OrderSummary = ({ orderId, files, subtotal, gst, shippingCharges, leadTime, onApplyCoupon }) => {
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0); // Discount percentage
    const [error, setError] = useState('');

    const handleApplyCoupon = async () => {
        try {
            console.log('Applying coupon:', couponCode); // Debug log

            const response = await fetch('https://test1.3ding.in/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: couponCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid coupon code');
            }

            const data = await response.json();
            setDiscount(data.discount); // Set the discount percentage
            setError('');
            onApplyCoupon(data.discount); // Pass the discount to the parent component
        } catch (err) {
            setError(err.message || 'Failed to apply coupon');
            setDiscount(0);
        }
    };

    const totalAfterDiscount = subtotal - (subtotal * discount) / 100 + gst + shippingCharges;

    return (
        <div className="container border-top mt-4">
            <table className="table">
                <tbody>
                    <tr>
                        <th className="fw-normal">Order ID</th>
                        <td>{orderId}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Total Files:</th>
                        <td>{files.length}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Lead Time:</th>
                        <td>{leadTime}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Sub Total:</th>
                        <td>₹ {subtotal}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">GST 18%:</th>
                        <td>₹ {gst}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Shipping</th>
                        <td>₹ {shippingCharges}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Coupon Discount:</th>
                        <td>₹ {(subtotal * discount) / 100}</td>
                    </tr>
                    <tr>
                        <th className="fw-normal">Total Including GST:</th>
                        <td>₹ {totalAfterDiscount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Coupon Field */}
            <div className="mt-3">
                <label htmlFor="couponCode" className="form-label fw-bold">Coupon Code</label>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        id="couponCode" // Unique id for the input field
                        name="couponCode" // Unique name for the input field
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="form-control me-2" // Add margin to separate the input and button
                        placeholder="Enter coupon code"
                        autoComplete="off" // Prevent browser autofill if not needed
                    />
                    <button className="btn btn-primary mx-1" onClick={handleApplyCoupon}>
                        Apply
                    </button>
                </div>
                {error && <p className="text-danger mt-2">{error}</p>}
                {discount > 0 && <p className="text-success mt-2">Coupon applied! Discount: {discount}%</p>}
            </div>
        </div>
    );
};

export default OrderSummary;