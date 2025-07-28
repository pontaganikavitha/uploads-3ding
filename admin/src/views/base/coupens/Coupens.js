import React, { useState, useEffect } from 'react';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('https://test1.3ding.in/api/coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiryDate) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('https://test1.3ding.in/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoupon),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add coupon');
      }

      const savedCoupon = await response.json();
      setCoupons((prev) => [...prev, savedCoupon]);
      setNewCoupon({ code: '', discount: '', expiryDate: '' });
      alert('Coupon added successfully!');
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert(error.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const response = await fetch(`https://test1.3ding.in/api/coupons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
      alert('Coupon deleted successfully!');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="h4 fw-bold">Manage Coupons and Discounts</h1>

      {/* Add Coupon Form */}
      <div className="card p-3 mb-4">
        <h2 className="h5">Add New Coupon</h2>
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              name="code"
              value={newCoupon.code}
              onChange={handleInputChange}
              placeholder="Coupon Code"
              className="form-control mb-2"
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              name="discount"
              value={newCoupon.discount}
              onChange={handleInputChange}
              placeholder="Discount (%)"
              className="form-control mb-2"
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              name="expiryDate"
              value={newCoupon.expiryDate}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAddCoupon}>
          Add Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="card p-3">
        <h2 className="h5">Existing Coupons</h2>
        {coupons.length === 0 ? (
          <p>No coupons added yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCoupon(coupon._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;