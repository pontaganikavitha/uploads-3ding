// import React, { useState } from "react";
// import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CAlert } from "@coreui/react";
// import { useNavigate } from "react-router-dom";
// import { cilUser } from "@coreui/icons"; // Keep user icon

// const Login = ({ setIsAuthenticated }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // Toggle visibility
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch("http://test1.3ding.in/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("role", data.role);
//         setIsAuthenticated(true);
//         navigate("/base/tables", { replace: true });
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       setError("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={4}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <CForm onSubmit={handleLogin}>
//                     <h1 className="text-center my-4">Admin Login</h1>
//                     {error && <CAlert color="danger">{error}</CAlert>}
//                     {/* Email Input */}
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <i className="bi bi-person-fill"></i>
//                       </CInputGroupText>
//                       <CFormInput
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </CInputGroup>

//                     {/* Password Input with Eye Icon */}
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <i className="bi bi-lock-fill"></i>
//                       </CInputGroupText>
//                       <CFormInput
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                       <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
//                         <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
//                       </CInputGroupText>
//                     </CInputGroup>

//                     <CRow className="text-center">
//                       <CCol className="text-center">
//                         <CButton type="submit" color="primary" className="px-4">
//                           Login
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CAlert } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { cilUser } from "@coreui/icons"; // Keep user icon

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setIsAuthenticated(true);
        navigate("/base/tables", { replace: true });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1 className="text-center my-4">Admin Login</h1>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    {/* Email Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <i className="bi bi-person-fill"></i>
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Password Input with Eye Icon */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <i className="bi bi-lock-fill"></i>
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow className="text-center">
                      <CCol className="text-center">
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;