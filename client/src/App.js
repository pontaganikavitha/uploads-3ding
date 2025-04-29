// import React from 'react';
// import UploadedFiles from './components/UploadedFiles'; // Ensure correct path
// import 'bootstrap/dist/css/bootstrap.min.css';


// const App = () => {
//   return (
//     <div>
//       <UploadedFiles />
//     </div>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadedFiles from './components/UploadedFiles';
import Summary from './components/Summary';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderDetails from './components/OrderDetails';
// import UploadToExistingOrder from './components/UploadToExistingOrder';
// import AddingNewFiles from './components/AddingNewFiles';
import AddingNewFileToOrderId from './components/AddingNewFileToOrderId';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default route */}
          <Route path="/upload" element={<UploadedFiles />} />
          {/* <Route path="/upload-with-same-oreder-id" element={<UploadToExistingOrder />} /> */}
          {/* <Route path="/upload-with-same-oreder-id" element={<AddingNewFiles />} /> */}
          <Route path="/upload-with-same-oreder-id" element={<AddingNewFileToOrderId />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/summary/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
