import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CAlert,
} from '@coreui/react';
import axios from 'axios';

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    allowed: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://test1.3ding.in/api/admin/add-user', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', role: 'user', allowed: false }); // Reset form
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Add New User</CCardHeader>
            <CCardBody>
              {message && <CAlert color="success">{message}</CAlert>}
              {error && <CAlert color="danger">{error}</CAlert>}
              <CForm onSubmit={handleSubmit}>
                <CFormInput
                  type="text"
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <CFormInput
                  type="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <CFormSelect
                  name="role"
                  label="Role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </CFormSelect>
                <CFormSelect
                  name="allowed"
                  label="Allowed"
                  value={formData.allowed}
                  onChange={(e) => handleChange({ target: { name: 'allowed', value: e.target.value === 'true' } })}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </CFormSelect>
                <CButton type="submit" color="primary" className="mt-3">
                  Add User
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AdminAddUser;