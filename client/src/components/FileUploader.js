import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

const FileUploader = ({ session, orderId, onComplete }) => {
  useEffect(() => {
    const uppy = new Uppy({
      allowMultipleUploads: true,
      autoProceed: true,
      restrictions: {
        maxFileSize: null,
        minFileSize: null,
        maxTotalFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: ['.stl', '.step']
      }
    })
      .use(Dashboard, {
        inline: true,
        target: '#dashboard-container',
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        metaFields: [{ id: 'name', name: 'Name', placeholder: 'file name' }],
      })
      .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/', limit: 6 });

    uppy.on('complete', async (result) => {
      const successfulUploads = result.successful;

      for (const file of successfulUploads) {
        const formData = new FormData();
        formData.append('file', file.data);
        formData.append('originalName', file.meta.name);
        formData.append('session', session);
        formData.append('orderId', orderId);

        try {
          await fetch('http://54.79.1.200:3001/upload', {
            method: 'POST',
            body: formData,
          });
          onComplete();
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    });

    return () => {
      uppy.close();
    };
  }, [session, orderId, onComplete]);

  return <div id="dashboard-container"></div>;
};

export default FileUploader;
