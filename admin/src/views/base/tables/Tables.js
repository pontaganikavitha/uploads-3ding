// src/views/base/tables/Tables.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
} from '@coreui/react';

const Tables = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/server/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data.reverse()); // Reverse the array to show the last order first
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Order List</strong> <small>Click on Order ID for details</small>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Session</CTableHeaderCell>
                  <CTableHeaderCell>Subtotal</CTableHeaderCell>
                  <CTableHeaderCell>GST</CTableHeaderCell>
                  <CTableHeaderCell>Shipping Charges</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((order) => (
                  <CTableRow key={order._id}>
                    <CTableDataCell>
                      {/* <Link to={`/base/orders/${order._id}`}>{order.orderId}</Link> */}
                      <Link to={`/base/orders/${order.orderId}`}>{order.orderId}</Link>
                    </CTableDataCell>
                    <CTableDataCell>{order.session}</CTableDataCell>
                    <CTableDataCell>{order.subtotal}</CTableDataCell>
                    <CTableDataCell>{order.gst}</CTableDataCell>
                    <CTableDataCell>{order.shippingCharges}</CTableDataCell>
                    <CTableDataCell>{order.total}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Tables;

