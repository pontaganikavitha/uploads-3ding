import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadedFiles from './components/UploadedFiles';
import Summary from './components/Summary';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderDetails from './components/OrderDetails';
import AddingNewFileToOrderId from './components/AddingNewFileToOrderId';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default route */}
          <Route path="/upload" element={<UploadedFiles />} />
          <Route path="/upload-with-same-oreder-id" element={<AddingNewFileToOrderId />} />
          <Route path="/summary-test" element={<Summary />} />
          <Route path="/summary-test/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
