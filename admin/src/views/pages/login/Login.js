// import React, { useState } from "react";
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CRow,
//   CAlert,
// } from "@coreui/react";
// import { useGoogleLogin } from "@react-oauth/google";
// import { googleAuth } from "./api";
// import { useNavigate } from "react-router-dom";
// import { FaGoogle } from "react-icons/fa"; // Import Google icon

// const Login = ({ setIsAuthenticated }) => {
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const responseGoogle = async (authResult) => {
//     try {
//       if (authResult.code) {
//         const result = await googleAuth(authResult.code);
//         const { email, name, image } = result.data.user;
//         const token = result.data.token;

//         const obj = { email, name, token, image };
//         localStorage.setItem("user-info", JSON.stringify(obj));

//         setIsAuthenticated(true);
//         navigate("/");
//       } else {
//         throw new Error("Google login failed. No auth code received.");
//       }
//     } catch (e) {
//       console.error("Error during Google Login:", e);
//       alert("Access denied. You are not allowed to log in."); // Show a generic error alert
//     }
//   };

//   const handleError = (error) => {
//     console.error("Google Login Error:", error);
//     setError("Google login failed. Please try again.");
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: handleError,
//     flow: "auth-code",
//   });

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center align-items-center">
//           <CCol md={4}>
//             <CCardGroup>
//               <CCard className="p-4 text-center">
//                 <CCardBody>
//                   <div>
//                     {/* <h1 className="text-center my-4">Login</h1> */}
//                     <FaGoogle className="" size={50} /> {/* Google Icon */}
//                     {error && <CAlert color="danger">{error}</CAlert>}
//                     <hr />
//                   </div>
//                   <div className="text-center" align="center">
//                     <CButton
//                       color="primary"
//                       onClick={googleLogin}

//                     >
//                       Sign in with Google
//                     </CButton>
//                   </div>
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
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CAlert,
} from "@coreui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api"; // Function to call your backend
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = ({ setIsAuthenticated }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code); // Call your backend
        const { email, name, image } = result.data.user;
        const token = result.data.token;

        localStorage.setItem("user-info", JSON.stringify({ email, name, image, token }));

        setIsAuthenticated(true);
        navigate("/");
      } else {
        throw new Error("Google login failed. No auth code received.");
      }
    } catch (e) {
      console.error("Error during Google Login:", e);

      // Display custom error if access is denied
      if (e.response && e.response.status === 403) {
        setError("Access denied. Your email is not authorized.");
      } else {
        setError("Google login failed. Please try again.");
      }
    }
  };

  const handleError = (error) => {
    console.error("Google Login Error:", error);
    setError("Google login failed. Please try again.");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: handleError,
    flow: "auth-code", // Required for server-side code exchange
  });

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center align-items-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4 text-center shadow-lg">
                <CCardBody>
                  <div className="mb-4">
                    <FaGoogle size={50} className="mb-3 text-primary" />
                    <h4 className="mb-3">Admin Login</h4>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <hr />
                  </div>
                  <CButton
                    color="primary"
                    className="px-4"
                    onClick={googleLogin}
                  >
                    Sign in with Google
                  </CButton>
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
