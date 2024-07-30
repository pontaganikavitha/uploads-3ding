import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class Home extends Component {
  render() {
    return <Navigate to="/upload" />;
  }
}

export default Home;
