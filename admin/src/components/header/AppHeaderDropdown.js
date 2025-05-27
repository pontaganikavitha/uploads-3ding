// // // import React from "react";
// // // import {
// // //   CAvatar,
// // //   CBadge,
// // //   CDropdown,
// // //   CDropdownDivider,
// // //   CDropdownHeader,
// // //   CDropdownItem,
// // //   CDropdownMenu,
// // //   CDropdownToggle,
// // // } from "@coreui/react";
// // // import { cilBell, cilEnvelopeOpen, cilTask, cilCommentSquare, cilUser, cilSettings, cilCreditCard, cilFile, cilLockLocked, cilPowerStandby } from "@coreui/icons";
// // // import CIcon from "@coreui/icons-react";
// // // import { useNavigate } from "react-router-dom";

// // // // Function to generate avatar from email
// // // const getInitials = (email) => {
// // //   return email ? email.charAt(0).toUpperCase() : "?";
// // // };

// // // const AppHeaderDropdown = () => {
// // //   const navigate = useNavigate();
// // //   const userEmail = localStorage.getItem("userEmail") || "Admin"; // Get user email from storage
// // //   const userInitial = getInitials(userEmail);

// // //   // Logout function
// // //   const handleLogout = () => {
// // //     localStorage.removeItem("token");
// // //     localStorage.removeItem("userEmail");
// // //     localStorage.removeItem("role");
// // //     navigate("/login", { replace: true });
// // //   };

// // //   return (
// // //     <CDropdown variant="nav-item">
// // //       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
// // //         <div className="d-flex flex-column align-items-center">
// // //           <CAvatar size="md" color="primary" className="text-white fw-bold">
// // //             {userInitial}
// // //           </CAvatar>
// // //           <small className="mt-1 text-muted">{userEmail}</small> {/* ✅ Show email below avatar */}
// // //         </div>
// // //       </CDropdownToggle>
// // //       <CDropdownMenu className="pt-0" placement="bottom-end">
// // //         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
// // //         <CDropdownItem href="#">
// // //           <CIcon icon={cilEnvelopeOpen} className="me-2" />
// // //           Messages
// // //           <CBadge color="success" className="ms-2">42</CBadge>
// // //         </CDropdownItem>
// // //         <CDropdownItem href="#">
// // //           <CIcon icon={cilTask} className="me-2" />
// // //           Tasks
// // //           <CBadge color="danger" className="ms-2">42</CBadge>
// // //         </CDropdownItem>
// // //         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
// // //         <CDropdownItem href="#">
// // //           <CIcon icon={cilUser} className="me-2" />
// // //           Profile
// // //         </CDropdownItem>
// // //         <CDropdownItem href="#">
// // //           <CIcon icon={cilSettings} className="me-2" />
// // //           Settings
// // //         </CDropdownItem>
// // //         <CDropdownDivider />
// // //         <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
// // //           <CIcon icon={cilPowerStandby} className="me-2 text-danger" />
// // //           Logout
// // //         </CDropdownItem>
// // //       </CDropdownMenu>
// // //     </CDropdown>
// // //   );
// // // };

// // // export default AppHeaderDropdown;


// // import React, { useEffect, useState } from "react";
// // import {
// //   CAvatar,
// //   CBadge,
// //   CDropdown,
// //   CDropdownDivider,
// //   CDropdownHeader,
// //   CDropdownItem,
// //   CDropdownMenu,
// //   CDropdownToggle,
// // } from "@coreui/react";
// // import { cilEnvelopeOpen, cilTask, cilUser, cilSettings, cilPowerStandby } from "@coreui/icons";
// // import CIcon from "@coreui/icons-react";
// // import { useNavigate } from "react-router-dom";

// // // Function to generate avatar from email
// // const getInitials = (email) => {
// //   return email ? email.charAt(0).toUpperCase() : "?";
// // };

// // const AppHeaderDropdown = () => {
// //   const [userInfo, setUserInfo] = useState(null);
// //   const navigate = useNavigate();

// //   // Load user info from localStorage on component mount
// //   useEffect(() => {
// //     const data = localStorage.getItem("user-info");
// //     const userData = JSON.parse(data);
// //     setUserInfo(userData);
// //   }, []);

// //   // Logout function
// //   const handleLogout = () => {
// //     localStorage.removeItem("user-info"); // Remove user info from localStorage
// //     navigate("/login"); // Redirect to login page
// //   };

// //   const userInitial = getInitials(userInfo?.email || "Admin");

// //   return (
// //     <CDropdown variant="nav-item">
// //       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
// //         <div className="d-flex flex-column align-items-center">
// //           <CAvatar size="md" color="primary" className="text-white fw-bold">
// //             {userInitial}
// //           </CAvatar>
// //           <small className="mt-1 text-muted">{userInfo?.email || "Admin"}</small> {/* Show email below avatar */}
// //         </div>
// //       </CDropdownToggle>
// //       <CDropdownMenu className="pt-0" placement="bottom-end">
// //         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
// //         <CDropdownItem href="#">
// //           <CIcon icon={cilEnvelopeOpen} className="me-2" />
// //           Messages
// //           <CBadge color="success" className="ms-2">42</CBadge>
// //         </CDropdownItem>
// //         <CDropdownItem href="#">
// //           <CIcon icon={cilTask} className="me-2" />
// //           Tasks
// //           <CBadge color="danger" className="ms-2">42</CBadge>
// //         </CDropdownItem>
// //         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
// //         <CDropdownItem href="#">
// //           <CIcon icon={cilUser} className="me-2" />
// //           Profile
// //         </CDropdownItem>
// //         <CDropdownItem href="#">
// //           <CIcon icon={cilSettings} className="me-2" />
// //           Settings
// //         </CDropdownItem>
// //         <CDropdownDivider />
// //         <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
// //           <CIcon icon={cilPowerStandby} className="me-2 text-danger" />
// //           Logout
// //         </CDropdownItem>
// //       </CDropdownMenu>
// //     </CDropdown>
// //   );
// // };

// // export default AppHeaderDropdown;

// import React, { useEffect, useState } from "react";
// import {
//   CAvatar,
//   CBadge,
//   CDropdown,
//   CDropdownDivider,
//   CDropdownHeader,
//   CDropdownItem,
//   CDropdownMenu,
//   CDropdownToggle,
// } from "@coreui/react";
// import { cilEnvelopeOpen, cilTask, cilUser, cilSettings, cilPowerStandby } from "@coreui/icons";
// import CIcon from "@coreui/icons-react";
// import { useNavigate } from "react-router-dom";

// // Function to generate initials from email
// const getInitials = (email) => {
//   return email ? email.charAt(0).toUpperCase() : "?";
// };

// const AppHeaderDropdown = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();

//   // Load user info from localStorage on component mount
//   useEffect(() => {
//     const data = localStorage.getItem("user-info");
//     const userData = JSON.parse(data);
//     setUserInfo(userData);
//   }, []);

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("user-info"); // Remove user info from localStorage
//     navigate("/login"); // Redirect to login page
//   };

//   const userInitial = getInitials(userInfo?.email || "Admin");

//   return (
//     <CDropdown variant="nav-item">
//       <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
//         <div className="d-flex flex-column align-items-center">
//           {/* Use picture if available, otherwise fallback to initials */}
//           {userInfo?.picture ? (
//             <CAvatar size="md" src={userInfo.picture} />
//           ) : (
//             <CAvatar size="md" color="primary" className="text-white fw-bold">
//               {userInitial}
//             </CAvatar>
//           )}
//           <small className="mt-1 text-muted">{userInfo?.email || "Admin"}</small> {/* Show email below avatar */}
//         </div>
//       </CDropdownToggle>
//       <CDropdownMenu className="pt-0" placement="bottom-end">
//         <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilEnvelopeOpen} className="me-2" />
//           Messages
//           <CBadge color="success" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilTask} className="me-2" />
//           Tasks
//           <CBadge color="danger" className="ms-2">42</CBadge>
//         </CDropdownItem>
//         <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
//         <CDropdownItem href="#">
//           <CIcon icon={cilUser} className="me-2" />
//           Profile
//         </CDropdownItem>
//         <CDropdownItem href="#">
//           <CIcon icon={cilSettings} className="me-2" />
//           Settings
//         </CDropdownItem>
//         <CDropdownDivider />
//         <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
//           <CIcon icon={cilPowerStandby} className="me-2 text-danger" />
//           Logout
//         </CDropdownItem>
//       </CDropdownMenu>
//     </CDropdown>
//   );
// };

// export default AppHeaderDropdown;
import React, { useEffect, useState } from "react";
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilEnvelopeOpen, cilTask, cilUser, cilSettings, cilPowerStandby } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";

// Function to generate initials from email
const getInitials = (email) => {
  return email ? email.charAt(0).toUpperCase() : "?";
};

const AppHeaderDropdown = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Load user info from localStorage on component mount
  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    console.log("Loaded user info:", userData); // Debug log
    setUserInfo(userData);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user-info"); // Remove user info from localStorage
    navigate("/login"); // Redirect to login page
  };

  const userInitial = getInitials(userInfo?.email || "Admin");

  console.log("User picture:", userInfo?.picture); // Debug log

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <div className="d-flex flex-column align-items-center">
          {/* Use picture if available, otherwise fallback to initials */}
          {userInfo?.picture ? (
            <CAvatar size="md" src={userInfo.picture} />
          ) : (
            <CAvatar size="md" color="primary" className="text-white fw-bold">
              {userInitial}
            </CAvatar>
          )}
          <small className="mt-1 text-muted">{userInfo?.email || "Admin"}</small> {/* Show email below avatar */}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">42</CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">42</CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
          <CIcon icon={cilPowerStandby} className="me-2 text-danger" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;