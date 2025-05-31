// // import React, { Suspense, useEffect, useState } from 'react'
// // import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
// // import { useSelector } from 'react-redux'
// // import { CSpinner, useColorModes } from '@coreui/react'
// // import './scss/style.scss'
// // import './scss/examples.scss'

// // // Containers
// // const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// // // Pages
// // const Login = React.lazy(() => import('./views/pages/login/Login'))
// // const Register = React.lazy(() => import('./views/pages/register/Register'))
// // const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// // const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// // const App = () => {
// //   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
// //   const storedTheme = useSelector((state) => state.theme)

// //   const [isAuthenticated, setIsAuthenticated] = useState(() => {
// //     return !!localStorage.getItem('token') // Read token from storage on initial load
// //   })

// //   useEffect(() => {
// //     const token = localStorage.getItem('token')
// //     setIsAuthenticated(!!token) // Convert token existence to boolean

// //     // Handle theme settings
// //     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
// //     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
// //     if (theme) setColorMode(theme)

// //     if (!isColorModeSet()) setColorMode(storedTheme)
// //   }, [])

// //   return (
// //     <HashRouter>
// //       <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
// //         <Routes>
// //           <Route exact path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
// //           <Route exact path="/register" element={<Register />} />
// //           <Route exact path="/404" element={<Page404 />} />
// //           <Route exact path="/500" element={<Page500 />} />

// //           {/* Protected Route */}
// //           <Route
// //             path="*"
// //             element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" replace />}
// //           />
// //         </Routes>
// //       </Suspense>
// //     </HashRouter>
// //   )
// // }

// // export default App


// import React, { Suspense, useEffect, useState } from 'react'
// import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { CSpinner, useColorModes } from '@coreui/react'
// import './scss/style.scss'
// import './scss/examples.scss'

// // Containers
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// const App = () => {
//   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const storedTheme = useSelector((state) => state.theme)

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return !!localStorage.getItem('token') // Read token from storage on initial load
//   })

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     setIsAuthenticated(!!token) // Convert token existence to boolean

//     // Handle theme settings
//     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
//     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
//     if (theme) setColorMode(theme)

//     if (!isColorModeSet()) setColorMode(storedTheme)
//   }, [])

//   return (
//     <HashRouter>
//       <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
//         <Routes>
//           <Route exact path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//           <Route exact path="/register" element={<Register />} />
//           <Route exact path="/404" element={<Page404 />} />
//           <Route exact path="/500" element={<Page500 />} />

//           {/* Protected Route */}
//           <Route
//             path="*"
//             element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" replace />}
//           />
//         </Routes>
//       </Suspense>
//     </HashRouter>
//   )
// }

// export default App


// // import React, { Suspense, useEffect, useState } from 'react'
// // import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
// // import { useSelector } from 'react-redux'
// // import { CSpinner, useColorModes } from '@coreui/react'
// // import './scss/style.scss'
// // import './scss/examples.scss'
// // import { GoogleOAuthProvider } from "@react-oauth/google"
// // // import GoogleLogin from './views/pages/login/GoogleLogin'
// // import RefrshHandler from './views/pages/login/RefreshHandler'
// // import NotFound from './views/pages/notfound/NotFound'

// // // Containers
// // const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// // // Pages
// // const Login = React.lazy(() => import('./views/pages/login/Login'))
// // const Register = React.lazy(() => import('./views/pages/register/Register'))
// // const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// // const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
// // // const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))

// // const App = () => {
// //   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
// //   const storedTheme = useSelector((state) => state.theme)

// //   const [isAuthenticated, setIsAuthenticated] = useState(() => {
// //     return !!localStorage.getItem('token') // Read token from storage on initial load
// //   })

// //   useEffect(() => {
// //     const token = localStorage.getItem('token')
// //     setIsAuthenticated(!!token) // Convert token existence to boolean

// //     // Handle theme settings
// //     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
// //     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
// //     if (theme) setColorMode(theme)

// //     if (!isColorModeSet()) setColorMode(storedTheme)
// //   }, [])

// //   const GoogleWrapper = () => (
// //     <GoogleOAuthProvider clientId="288567146744-frdfd6nq0p3uf6nsfo4hrndgutf6d88g.apps.googleusercontent.com">
// //       <Login setIsAuthenticated={setIsAuthenticated} />
// //     </GoogleOAuthProvider>
// //   )

// //   const PrivateRoute = ({ element }) => {
// //     return isAuthenticated ? element : <Navigate to="/login" />
// //   }

// //   return (
// //     <HashRouter>
// //       <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
// //       <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
// //         <Routes>
// //           <Route path="/login" element={<GoogleWrapper />} />
// //           <Route path="/register" element={<Register />} />
// //           <Route path="/404" element={<Page404 />} />
// //           <Route path="/500" element={<Page500 />} />
// //           <Route path="/" element={<Navigate to="/login" />} />
// //           <Route path="/dashboard" element={<PrivateRoute element={<DefaultLayout />} />} />
// //           <Route path="*" element={<NotFound />} />

// //           {/* Protected Route */}
// //           {/* <Route
// //             path="*"
// //             element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" replace />}
// //           /> */}
// //         </Routes>
// //       </Suspense>
// //     </HashRouter>
// //   )
// // }

// // export default App


import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { GoogleOAuthProvider } from "@react-oauth/google"
import Login from './views/pages/login/Login'
import RefrshHandler from './views/pages/login/RefreshHandler'
import NotFound from './views/pages/notfound/NotFound'
import AppHeaderDropdown from './components/header/AppHeaderDropdown';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token') // Read token from storage on initial load
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token) // Convert token existence to boolean

    // Handle theme settings
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) setColorMode(theme)

    if (!isColorModeSet()) setColorMode(storedTheme)
  }, [])

  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="288567146744-frdfd6nq0p3uf6nsfo4hrndgutf6d88g.apps.googleusercontent.com">
      <Login setIsAuthenticated={setIsAuthenticated} />
    </GoogleOAuthProvider>
  )

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <HashRouter>
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
        <Routes>
          <Route path="/login" element={<GoogleWrapper />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<PrivateRoute element={<DefaultLayout />} />} />
        </Routes>
      </Suspense>
      <AppHeaderDropdown setIsAuthenticated={setIsAuthenticated} /> {/* Pass setIsAuthenticated */}
    </HashRouter>
  );
}

export default App