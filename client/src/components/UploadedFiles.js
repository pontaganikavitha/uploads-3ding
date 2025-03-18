import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import OrderSummary from './OrderSummary';
import '../styles/UploadedFiles.css';

const UploadedFiles = () => {
  return (
    <div className='text-center my-5'>
      <h1>🚧 Site Under Maintenance 🚧</h1>
      <p>We are fixing some issues. Please check back soon!</p>
    </div>
  );
}

export default UploadedFiles;