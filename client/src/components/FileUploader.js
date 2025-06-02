import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

const FileUploader = ({ session, orderId, onComplete }) => {
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0); // Track the number of uploaded files
  const [uploadingFilesCount, setUploadingFilesCount] = useState(0); // Track the number of files being uploaded

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
        allowedFileTypes: ['.stl', '.step', '.obj', '.stp'],
      },
    })
      .use(Dashboard, {
        inline: true,
        target: '#dashboard-container',
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        metaFields: [{ id: 'name', name: 'Name', placeholder: 'file name' }],
      })
      .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/', limit: 6 });

    // Track the number of files being uploaded
    uppy.on('upload', () => {
      setUploadingFilesCount((prevCount) => prevCount + 1);
    });

    // Update the uploaded files count dynamically as each file finishes uploading
    uppy.on('upload-success', (file) => {
      setUploadedFilesCount((prevCount) => prevCount + 1);
      setUploadingFilesCount((prevCount) => prevCount - 1); // Decrease the uploading count
    });

    uppy.on('complete', async (result) => {
      const successfulUploads = result.successful;

      for (const file of successfulUploads) {
        const formData = new FormData();
        formData.append('file', file.data);
        formData.append('originalName', file.meta.name);
        formData.append('session', session);
        formData.append('orderId', orderId);

        try {
          const response = await fetch('http://test1.3ding.in/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const uploadedFile = await response.json(); // Get the uploaded file data
            onComplete(uploadedFile); // Pass the uploaded file to the parent component

            // Update the file state in Uppy to keep it in the dashboard
            uppy.setFileState(file.id, {
              ...uppy.getFile(file.id),
              progress: { uploadComplete: true, percentage: 100 },
              isUploaded: true, // Mark the file as uploaded
            });
          } else {
            console.error('Failed to upload file:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    });

    return () => {
      uppy.close();
    };
  }, [session, orderId, onComplete]);

  return (
    <div>
      <div id="dashboard-container"></div>
      {uploadingFilesCount > 0 && (
        <button className="btn btn-warning mt-3">
          Uploading {uploadingFilesCount} File{uploadingFilesCount > 1 ? 's' : ''}
        </button>
      )}
      {uploadedFilesCount > 0 && (
        <button className="btn btn-success mt-3 mx-3">
          {uploadedFilesCount} File{uploadedFilesCount > 1 ? 's' : ''} Uploaded
        </button>
      )}
    </div>
  );
};

export default FileUploader;