// // // import React from 'react'
// // // import {
// // //   CButton,
// // //   CCard,
// // //   CCardBody,
// // //   CCol,
// // //   CContainer,
// // //   CForm,
// // //   CFormInput,
// // //   CInputGroup,
// // //   CInputGroupText,
// // //   CRow,
// // // } from '@coreui/react'
// // // import CIcon from '@coreui/icons-react'
// // // import { cilLockLocked, cilUser } from '@coreui/icons'

// // // const Register = () => {
// // //   return (
// // //     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
// // //       <CContainer>
// // //         <CRow className="justify-content-center">
// // //           <CCol md={9} lg={7} xl={6}>
// // //             <CCard className="mx-4">
// // //               <CCardBody className="p-4">
// // //                 <CForm>
// // //                   <h1>Register</h1>
// // //                   <p className="text-body-secondary">Create your account</p>
// // //                   <CInputGroup className="mb-3">
// // //                     <CInputGroupText>
// // //                       <CIcon icon={cilUser} />
// // //                     </CInputGroupText>
// // //                     <CFormInput placeholder="Username" autoComplete="username" />
// // //                   </CInputGroup>
// // //                   <CInputGroup className="mb-3">
// // //                     <CInputGroupText>@</CInputGroupText>
// // //                     <CFormInput placeholder="Email" autoComplete="email" />
// // //                   </CInputGroup>
// // //                   <CInputGroup className="mb-3">
// // //                     <CInputGroupText>
// // //                       <CIcon icon={cilLockLocked} />
// // //                     </CInputGroupText>
// // //                     <CFormInput
// // //                       type="password"
// // //                       placeholder="Password"
// // //                       autoComplete="new-password"
// // //                     />
// // //                   </CInputGroup>
// // //                   <CInputGroup className="mb-4">
// // //                     <CInputGroupText>
// // //                       <CIcon icon={cilLockLocked} />
// // //                     </CInputGroupText>
// // //                     <CFormInput
// // //                       type="password"
// // //                       placeholder="Repeat password"
// // //                       autoComplete="new-password"
// // //                     />
// // //                   </CInputGroup>
// // //                   <div className="d-grid">
// // //                     <CButton color="success">Create Account</CButton>
// // //                   </div>
// // //                 </CForm>
// // //               </CCardBody>
// // //             </CCard>
// // //           </CCol>
// // //         </CRow>
// // //       </CContainer>
// // //     </div>
// // //   )
// // // }

// // // export default Register

// // // import React, { useEffect, useState } from 'react';
// // // import { CButton, CCard, CCardBody, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CFormInput, CForm, CAlert } from '@coreui/react';

// // // const AdminPanel = () => {
// // //   const [users, setUsers] = useState([]);
// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [message, setMessage] = useState('');
// // //   const token = localStorage.getItem('token');

// // //   useEffect(() => {
// // //     fetchUsers();
// // //   }, []);

// // //   const fetchUsers = async () => {
// // //     try {
// // //       const response = await fetch('https://test1.3ding.in/api/users', {
// // //         headers: { Authorization: token }
// // //       });
// // //       const data = await response.json();
// // //       setUsers(data);
// // //     } catch (err) {
// // //       console.error('Error fetching users:', err);
// // //     }
// // //   };

// // //   const handleAddUser = async (e) => {
// // //     e.preventDefault();
// // //     setMessage('');

// // //     try {
// // //       const response = await fetch('https://test1.3ding.in/api/users', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //           Authorization: token,
// // //         },
// // //         body: JSON.stringify({ email, password, role: 'user' }),
// // //       });

// // //       const data = await response.json();
// // //       if (!response.ok) throw new Error(data.message);
// // //       setMessage('User added successfully');
// // //       fetchUsers();
// // //     } catch (err) {
// // //       setMessage(err.message);
// // //     }
// // //   };

// // //   const handleDeleteUser = async (id) => {
// // //     try {
// // //       await fetch(`https://test1.3ding.in/api/users/${id}`, {
// // //         method: 'DELETE',
// // //         headers: { Authorization: token }
// // //       });
// // //       fetchUsers();
// // //     } catch (err) {
// // //       console.error('Error deleting user:', err);
// // //     }
// // //   };

// // //   return (
// // //     <CContainer>
// // //       <CRow className="justify-content-center">
// // //         <CCol md={8}>
// // //           <CCard>
// // //             <CCardBody>
// // //               <h2>Admin Panel</h2>
// // //               {message && <CAlert color="success">{message}</CAlert>}

// // //               <CForm onSubmit={handleAddUser}>
// // //                 <CFormInput className="mb-2" type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// // //                 <CFormInput className="mb-2" type="password" placeholder="User Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
// // //                 <CButton type="submit" color="success">Add User</CButton>
// // //               </CForm>

// // //               <CTable striped hover className="mt-4">
// // //                 <CTableHead>
// // //                   <CTableRow>
// // //                     <CTableHeaderCell>Email</CTableHeaderCell>
// // //                     <CTableHeaderCell>Role</CTableHeaderCell>
// // //                     <CTableHeaderCell>Actions</CTableHeaderCell>
// // //                   </CTableRow>
// // //                 </CTableHead>
// // //                 <CTableBody>
// // //                   {users.map(user => (
// // //                     <CTableRow key={user._id}>
// // //                       <CTableDataCell>{user.email}</CTableDataCell>
// // //                       <CTableDataCell>{user.role}</CTableDataCell>
// // //                       <CTableDataCell>
// // //                         {user.role !== 'admin' && (
// // //                           <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>Delete</CButton>
// // //                         )}
// // //                       </CTableDataCell>
// // //                     </CTableRow>
// // //                   ))}
// // //                 </CTableBody>
// // //               </CTable>

// // //             </CCardBody>
// // //           </CCard>
// // //         </CCol>
// // //       </CRow>
// // //     </CContainer>
// // //   );
// // // };

// // // export default AdminPanel;

// // import React, { useEffect, useState } from 'react';
// // import { CButton, CCard, CCardBody, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CFormInput, CForm, CAlert } from '@coreui/react';

// // const AdminPanel = () => {
// //   const [users, setUsers] = useState([]);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [message, setMessage] = useState('');
// //   const [passwordError, setPasswordError] = useState('');
// //   const token = localStorage.getItem('token');

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);

// //   const fetchUsers = async () => {
// //     try {
// //       const response = await fetch('https://test1.3ding.in/api/users', {
// //         headers: { Authorization: token }
// //       });
// //       const data = await response.json();
// //       setUsers(data);
// //     } catch (err) {
// //       console.error('Error fetching users:', err);
// //     }
// //   };

// //   // Password validation function
// //   const validatePassword = (password) => {
// //     const minLength = password.length >= 8;
// //     const hasUppercase = /[A-Z]/.test(password);
// //     const hasLowercase = /[a-z]/.test(password);
// //     const hasNumber = /[0-9]/.test(password);
// //     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

// //     if (!minLength) return "Password must be at least 8 characters long.";
// //     if (!hasUppercase) return "Password must contain at least one uppercase letter (A-Z).";
// //     if (!hasLowercase) return "Password must contain at least one lowercase letter (a-z).";
// //     if (!hasNumber) return "Password must contain at least one number (0-9).";
// //     if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&* etc.).";

// //     return ""; // No error, password is valid
// //   };

// //   const handleAddUser = async (e) => {
// //     e.preventDefault();
// //     setMessage("");
// //     setPasswordError("");

// //     // Validate password
// //     const passwordValidationMessage = validatePassword(password);
// //     if (passwordValidationMessage) {
// //       setPasswordError(passwordValidationMessage);
// //       return;
// //     }

// //     try {
// //       const response = await fetch('https://test1.3ding.in/api/users', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: token,
// //         },
// //         body: JSON.stringify({ email, password, role: 'user' }),
// //       });

// //       const data = await response.json();
// //       if (!response.ok) throw new Error(data.message);

// //       setMessage('User added successfully');
// //       setEmail('');
// //       setPassword('');
// //       fetchUsers();
// //     } catch (err) {
// //       setMessage(err.message);
// //     }
// //   };

// //   const handleDeleteUser = async (id) => {
// //     try {
// //       await fetch(`https://test1.3ding.in/api/users/${id}`, {
// //         method: 'DELETE',
// //         headers: { Authorization: token }
// //       });
// //       fetchUsers();
// //     } catch (err) {
// //       console.error('Error deleting user:', err);
// //     }
// //   };

// //   return (
// //     <CContainer>
// //       <CRow className="justify-content-center">
// //         <CCol md={8}>
// //           <CCard>
// //             <CCardBody>
// //               <h2>Admin Panel</h2>
// //               {message && <CAlert color="success">{message}</CAlert>}

// //               <CForm onSubmit={handleAddUser}>
// //                 <CFormInput className="mb-2" type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //                 <CFormInput className="mb-2" type="password" placeholder="User Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

// //                 {/* Password Validation Error Message */}
// //                 {passwordError && <CAlert color="danger">{passwordError}</CAlert>}

// //                 <CButton type="submit" color="success">Add User</CButton>
// //               </CForm>

// //               <CTable striped hover className="mt-4">
// //                 <CTableHead>
// //                   <CTableRow>
// //                     <CTableHeaderCell>Email</CTableHeaderCell>
// //                     <CTableHeaderCell>Role</CTableHeaderCell>
// //                     <CTableHeaderCell>Actions</CTableHeaderCell>
// //                   </CTableRow>
// //                 </CTableHead>
// //                 <CTableBody>
// //                   {users.map(user => (
// //                     <CTableRow key={user._id}>
// //                       <CTableDataCell>{user.email}</CTableDataCell>
// //                       <CTableDataCell>{user.role}</CTableDataCell>
// //                       <CTableDataCell>
// //                         {user.role !== 'admin' && (
// //                           <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>Delete</CButton>
// //                         )}
// //                       </CTableDataCell>
// //                     </CTableRow>
// //                   ))}
// //                 </CTableBody>
// //               </CTable>

// //             </CCardBody>
// //           </CCard>
// //         </CCol>
// //       </CRow>
// //     </CContainer>
// //   );
// // };

// // export default AdminPanel;


// import React, { useEffect, useState } from 'react';
// import { 
//   CButton, CCard, CCardBody, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableRow, 
//   CTableHeaderCell, CTableDataCell, CFormInput, CForm, CAlert, CInputGroup, CInputGroupText 
// } from '@coreui/react';

// const AdminPanel = () => {
//   const [users, setUsers] = useState([]);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // const fetchUsers = async () => {
//   //   try {
//   //     const response = await fetch('https://test1.3ding.in/api/users', {
//   //       headers: { Authorization: token }
//   //     });
//   //     const data = await response.json();
//   //     setUsers(data);
//   //   } catch (err) {
//   //     console.error('Error fetching users:', err);
//   //   }
//   // };

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('https://test1.3ding.in/api/users', {
//         headers: { Authorization: token },
//       });

//       if (!response.ok) {
//         console.error("Unauthorized access:", response.statusText);
//         setUsers([]); // Clear users list if unauthorized
//         return;
//       }

//       const data = await response.json();
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setUsers([]);
//     }
//   };


//   // Password validation function
//   const validatePassword = (password) => {
//     const minLength = password.length >= 8;
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     if (!minLength) return "Password must be at least 8 characters long.";
//     if (!hasUppercase) return "Password must contain at least one uppercase letter (A-Z).";
//     if (!hasLowercase) return "Password must contain at least one lowercase letter (a-z).";
//     if (!hasNumber) return "Password must contain at least one number (0-9).";
//     if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&* etc.).";

//     return ""; // No error, password is valid
//   };

//   const handleRoleChange = async (id, newRole) => {
//     try {
//       const response = await fetch(`https://test1.3ding.in/api/users/${id}/role`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//         body: JSON.stringify({ role: newRole }),
//       });

//       if (!response.ok) throw new Error('Failed to update role');

//       fetchUsers(); // Refresh user list
//     } catch (err) {
//       console.error('Error updating role:', err);
//     }
//   };


//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setPasswordError("");

//     // Validate password
//     const passwordValidationMessage = validatePassword(password);
//     if (passwordValidationMessage) {
//       setPasswordError(passwordValidationMessage);
//       return;
//     }

//     try {
//       const response = await fetch('https://test1.3ding.in/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//         body: JSON.stringify({ email, password, role: 'user' }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message);

//       setMessage('User added successfully');
//       setEmail('');
//       setPassword('');
//       fetchUsers();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       await fetch(`https://test1.3ding.in/api/users/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: token }
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error('Error deleting user:', err);
//     }
//   };

//   return (
//     <CContainer className='my-5'>
//       <CRow className="justify-content-center">
//         <CCol md={6}>
//           <CCard>
//             <CCardBody>
//               <h2>Admin Panel</h2>
//               {message && <CAlert color="success">{message}</CAlert>}

//               <CForm onSubmit={handleAddUser}>
//                 <CFormInput className="mb-2" type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//                 {/* Password Input with Eye Toggle */}
//                 <CInputGroup className="mb-2">
//                   <CInputGroupText>
//                     <i className="bi bi-lock-fill"></i>
//                   </CInputGroupText>
//                   <CFormInput
//                     type={showPassword ? "text" : "password"}
//                     placeholder="User Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
//                     <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
//                   </CInputGroupText>
//                 </CInputGroup>

//                 {/* Password Validation Error Message */}
//                 {passwordError && <CAlert color="danger">{passwordError}</CAlert>}

//                 <CButton type="submit" color="success">Add User</CButton>
//               </CForm>

//               <CTable striped hover className="mt-4">
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Email</CTableHeaderCell>
//                     <CTableHeaderCell>Role</CTableHeaderCell>
//                     <CTableHeaderCell>Actions</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {users.map(user => (
//                     <CTableRow key={user._id}>
//                       <CTableDataCell>{user.email}</CTableDataCell>
//                       <CTableDataCell>{user.role}</CTableDataCell>
//                       <CTableDataCell>
//                         {user.role !== 'admin' && (
//                           <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>Delete</CButton>
//                         )}
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>

//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   );
// };

// export default AdminPanel;

import React, { useEffect, useState } from 'react';
import {
  CButton, CCard, CCardBody, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableRow,
  CTableHeaderCell, CTableDataCell, CFormInput, CForm, CAlert, CInputGroup, CInputGroupText, CFormSelect
} from '@coreui/react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const token = localStorage.getItem('token');
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://test1.3ding.in/api/users', {
        headers: { Authorization: token },
      });

      if (!response.ok) {
        console.error("Unauthorized access:", response.statusText);
        setUsers([]);
        return;
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordError("");

    const validatePassword = (password) => {
      const minLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!minLength) return "Password must be at least 8 characters long.";
      if (!hasUppercase) return "Password must contain at least one uppercase letter (A-Z).";
      if (!hasLowercase) return "Password must contain at least one lowercase letter (a-z).";
      if (!hasNumber) return "Password must contain at least one number (0-9).";
      if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&* etc.).";

      return "";
    };

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      return;
    }

    try {
      const response = await fetch('https://test1.3ding.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ email, password, role: 'user' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage('User added successfully');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };


  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`https://test1.3ding.in/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        console.error("Failed to update role:", response.statusText);
        return;
      }

      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`https://test1.3ding.in/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <CContainer className='my-5'>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h2>Admin Panel</h2>
              {message && <CAlert color="success">{message}</CAlert>}
              <CForm onSubmit={handleAddUser}>
                <CFormInput className="mb-2" type="email" placeholder="User Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <CInputGroup className="mb-2">
                  <CInputGroupText>
                    <i className="bi bi-lock-fill"></i>
                  </CInputGroupText>
                  <CFormInput
                    type={showPassword ? "text" : "password"}
                    placeholder="User Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </CInputGroupText>
                </CInputGroup>

                {passwordError && <CAlert color="danger">{passwordError}</CAlert>}

                <CButton type="submit" color="success">Add User</CButton>
              </CForm>
              <CTable striped hover className="mt-4">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                {/* <CTableBody>
                  {users.map(user => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell>
                        {user.role !== 'admin' && (
                          <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>Delete</CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody> */}
                <CTableBody>
                  {users.map(user => (
                    <CTableRow key={user._id}>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        {user.email === "admin2@example.com" ? (
                          <span>{user.role}</span> // Display role as plain text for admin2@example.com
                        ) : (
                          <CFormSelect
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </CFormSelect>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {user.role !== 'admin' && (
                          <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>Delete</CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AdminPanel;
