import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import OrderSummary from './OrderSummary';
import '../styles/UploadedFiles.css';

const UploadedFiles = () => {
  const [session, setSession] = useState("null");
  const [orderId, setOrderId] = useState("null");
  const [files, setFiles] = useState([]);
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const [fileOptions, setFileOptions] = useState({});
  const [optionsData, setOptionsData] = useState({
    technologyOptions: {},
    materialCosts: {},
    densityCosts: {},
    qualityCosts: {}
  });
  const [couponDiscount, setCouponDiscount] = useState(0); // Discount percentage
  const [dimensionErrors, setDimensionErrors] = useState([]); // Track dimension errors
  const [acceptedRejectedFiles, setAcceptedRejectedFiles] = useState([]); // Track accepted rejected files
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const response = await fetch('https://test1.3ding.in/api/options');
        const data = await response.json();
        setOptionsData(data); // Set the fetched options data
        console.log('Fetched options data:', data); // Debug log
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };

    fetchOptionsData();

    const sessionIdentifier = Math.random().toString(36).substring(7);
    setSession(sessionIdentifier);

    const generateOrderId = () => {
      const timestamp = Date.now();
      return `${timestamp}`;
    };
    const orderId = generateOrderId();
    setOrderId(orderId);
  }, []);

  const renderOptions = (options) => {
    return options
      .filter((option) => option.enabled) // Only include enabled options
      .map((option) => (
        <option key={option.name} value={option.name}>
          {option.name}
        </option>
      ));
  };

  const MAX_DIMENSION = 300; // Maximum allowed dimension in mm

  const fetchFiles = async () => {
    try {
      const response = await fetch(`https://test1.3ding.in/api/files/${session}`);
      const data = await response.json();

      // Filter out files exceeding the dimension limit
      const validFiles = data.filter(
        (file) =>
          file.dimensions.length <= MAX_DIMENSION &&
          file.dimensions.width <= MAX_DIMENSION &&
          file.dimensions.height <= MAX_DIMENSION
      );

      // Identify invalid files
      const invalidFiles = data.filter(
        (file) =>
          file.dimensions.length > MAX_DIMENSION ||
          file.dimensions.width > MAX_DIMENSION ||
          file.dimensions.height > MAX_DIMENSION
      );

      // Include accepted rejected files in the valid files list
      const allValidFiles = [...validFiles, ...acceptedRejectedFiles];

      setFiles(allValidFiles);

      // Update fileOptions for valid files only
      const updatedFileOptions = {};
      allValidFiles.forEach((file) => {
        if (!fileOptions[file._id]) {
          const defaultTechnology = 'FDM/FFF';
          const defaultOptions = optionsData.technologyOptions[defaultTechnology] || {};
          updatedFileOptions[file._id] = {
            technology: defaultTechnology,
            material: defaultOptions.material?.[0]?.name || '',
            color: defaultOptions.color?.[0]?.name || '',
            quality: defaultOptions.quality?.[0]?.name || '',
            density: defaultOptions.density?.[0]?.name || '',
            quantity: 1,
          };
        } else {
          updatedFileOptions[file._id] = fileOptions[file._id];
        }
      });
      setFileOptions(updatedFileOptions);

      // Set dimension errors for invalid files
      const errors = invalidFiles.map((file) => ({
        fileId: file._id,
        fileName: file.originalName,
        dimensions: file.dimensions,
      }));
      setDimensionErrors(errors);

      if (invalidFiles.length > 0) {
        console.warn("Some files were rejected due to exceeding dimension limits.");
      }
    } catch (error) {
      console.error("Error fetching session files:", error);
    }
  };

  const handleFileUploadComplete = () => {
    fetchFiles();
  };

  useEffect(() => {
    if (session && orderId) {
      setUploaderVisible(true);
    }
  }, [session, orderId]);


  const handleAcceptRejectedFile = (fileId) => {
    const fileToAccept = dimensionErrors.find((error) => error.fileId === fileId);
    if (fileToAccept) {
      // Calculate buildVolume based on dimensions
      const buildVolume = (fileToAccept.dimensions.length / 10) *
        (fileToAccept.dimensions.width / 10) *
        (fileToAccept.dimensions.height / 10); // Convert mm³ to cm³

      // Add the file to the files state
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          ...fileToAccept,
          originalName: fileToAccept.fileName || 'Unknown File', // Ensure file name is set
          buildVolume: buildVolume, // Set calculated buildVolume
          _id: fileToAccept.fileId, // Ensure the file has a unique ID
        },
      ]);

      // Initialize options for the accepted file
      setFileOptions((prevOptions) => {
        const updatedOptions = { ...prevOptions };
        const defaultTechnology = 'FDM/FFF';
        const defaultOptions = optionsData.technologyOptions[defaultTechnology] || {};

        updatedOptions[fileToAccept.fileId] = {
          technology: defaultTechnology,
          material: defaultOptions.material?.[0]?.name || 'PLA',
          color: defaultOptions.color?.[0]?.name || 'White',
          quality: defaultOptions.quality?.[0]?.name || 'Draft',
          density: defaultOptions.density?.[0]?.name || '20%',
          quantity: 1,
        };

        return updatedOptions;
      });

      // Remove the file from the dimensionErrors state
      setDimensionErrors((prevErrors) =>
        prevErrors.filter((error) => error.fileId !== fileId)
      );
    }
  };

  const handleCancelRejectedFile = (fileId) => {
    // Remove the file from the dimensionErrors state
    setDimensionErrors((prevErrors) =>
      prevErrors.filter((error) => error.fileId !== fileId)
    );
  };

  useEffect(() => {
    const updateFileOptions = () => {
      const defaultFileOptions = { ...fileOptions };
      files.forEach((file) => {
        if (!defaultFileOptions[file._id]) {
          const defaultTechnology = 'FDM/FFF';
          const defaultOptions = optionsData.technologyOptions[defaultTechnology] || {};
          defaultFileOptions[file._id] = {
            technology: defaultTechnology,
            material: defaultOptions.material?.[0]?.name || '',
            color: defaultOptions.color?.[0]?.name || '',
            quality: defaultOptions.quality?.[0]?.name || '',
            density: defaultOptions.density?.[0]?.name || '',
            quantity: 1,
          };
        }
      });
      setFileOptions(defaultFileOptions);
    };

    if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
      updateFileOptions();
    }
  }, [files, optionsData]);


  const handleOptionChange = (fileId, optionType, value) => {
    setFileOptions((prevState) => {
      const updatedOptions = { ...prevState[fileId], [optionType]: value };

      if (optionType === 'technology' && optionsData.technologyOptions[value]) {
        const newTechnologyOptions = optionsData.technologyOptions[value];
        updatedOptions.material = newTechnologyOptions.material?.[0]?.name || 'PLA'; // Default material
        updatedOptions.color = newTechnologyOptions.color?.[0]?.name || 'White'; // Default color
        updatedOptions.quality = newTechnologyOptions.quality?.[0]?.name || 'Draft'; // Default quality
        updatedOptions.density = newTechnologyOptions.density?.[0]?.name || '20%'; // Default density
      }

      console.log('Updated options for file:', fileId, updatedOptions); // Debug log

      return {
        ...prevState,
        [fileId]: updatedOptions,
      };
    });

    // Trigger a re-render by updating the files state
    setFiles((prevFiles) => [...prevFiles]);
  };


  const calculatePrice = (material, density, quality, buildVolume) => {
    console.log('Calculating price with:', { material, density, quality, buildVolume });

    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;

    const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
    return Math.round(totalPrice);
  };

  const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
    const price = calculatePrice(material, density, quality, buildVolume);
    return price * (quantity || 1);
  };

  const subtotal = files.reduce((acc, file) => {
    const orderTotal = calculateItemTotal(
      fileOptions[file._id]?.material || 'PLA',
      fileOptions[file._id]?.density || '20%',
      fileOptions[file._id]?.quality || 'Draft',
      file.buildVolume,
      fileOptions[file._id]?.quantity || 1
    );
    return acc + orderTotal;
  }, 0);

  const gst = Math.round(subtotal * 0.18);
  const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
  // const total = subtotal + gst + shippingCharges;
  const total = subtotal - (subtotal * couponDiscount) / 100 + gst + shippingCharges;

  const leadTime = (() => {
    if (total >= 10000) {
      return "10";
    } else if (total > 1000) {
      return "5";
    } else if (total > 500) {
      return "4";
    } else if (total > 200) {
      return "3";
    } else if (total > 100) {
      return "2";
    } else {
      return "1"; // Default case
    }
  })();

  const handleApplyCoupon = (discount) => {
    setCouponDiscount(discount); // Update the discount in the state

    // Trigger server update after state update
    setTimeout(() => {
      handleSubmitOrder();
    }, 0); // Ensure state is updated before calling handleSubmitOrder
  };

  const handleSubmitOrder = async () => {
    try {
      if (!orderId || !session || !files) {
        console.error("Missing orderId, session, or files data.");
        return null; // Prevent further execution until data is available
      }

      // Ensure each file has its necessary options
      const fileOptionsValid = files.every(file => fileOptions[file._id]);
      if (!fileOptionsValid) {
        console.error('Some files do not have corresponding options.');
        return;
      }

      const orderData = {
        orderId,
        session,
        files: files.map(file => ({
          ...file,
          options: fileOptions[file._id],
          price: calculatePrice(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume || 1
          ),
          itemTotal: calculateItemTotal(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume || 1,
            fileOptions[file._id]?.quantity || 1
          )
        })),
        subtotal,
        gst,
        shippingCharges,
        total,
        leadTime, // Include lead time in the order data
        couponDiscount, // Include the coupon discount
      };

      console.log('Submitting order:', JSON.stringify(orderData, null, 2));

      const response = await fetch('https://test1.3ding.in/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error submitting order:', response.status, errorDetails);
      } else {
        console.log('Order submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  useEffect(() => {
    handleSubmitOrder();
  }, [files, fileOptions, couponDiscount]); // Add couponDiscount as a dependency

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 mt-5'>
            {uploaderVisible && (
              <FileUploader
                session={session}
                orderId={orderId}
                onComplete={handleFileUploadComplete}
              />
            )}
          </div>
          <div className='col-md-4 mt-5'>
            <h1 className='h6 fw-bold text-center'>Order Summary</h1>
            <OrderSummary
              orderId={orderId}
              files={files}
              subtotal={subtotal}
              gst={gst}
              shippingCharges={shippingCharges}
              leadTime={`${leadTime} Days`}
              onApplyCoupon={handleApplyCoupon}
            />
          </div>
        </div>
      </div>
      <div className='container mb-5'>
        <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
        {dimensionErrors.length > 0 && (
          <div className="alert alert-danger">
            <h5>Dimension Errors:</h5>
            <ul>
              {dimensionErrors.map((error) => (
                <li key={error.fileId}>
                  File "{error.fileName}" exceeds the allowed dimensions:
                  {` ${Math.round(error.dimensions.length)} x ${Math.round(error.dimensions.width)} x ${Math.round(error.dimensions.height)} mm`}
                  <br />
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleAcceptRejectedFile(error.fileId)}
                  >
                    OK (Cut and Print)
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCancelRejectedFile(error.fileId)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="row">
          <table>
            <thead className="justify-content-center border-top border-bottom">
              <tr className='justify-content-center text-center'>
                <th className="col-md-1 py-2">S No.</th>
                <th className="col-md-2 py-2">File Name</th>
                <th className="col-md-1 py-2">Technology</th>
                <th className="col-md-1 py-2">Material</th>
                <th className="col-md-1 py-2">Color</th>
                <th className="col-md-1 py-2">Quality</th>
                <th className="col-md-1 py-2">Density</th>
                <th className="col-md-1 py-2">Price</th>
                <th className="col-md-1 py-2">Quantity</th>
                <th className="col-md-1 py-2">Item Total</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file._id || `${index}-${file.originalName}`} className="justify-content-center text-center">
                  <td className="py-2 text-center">{index + 1}</td>
                  <td className="py-2 text-start">
                    {file.originalName || 'Unknown File'}
                    <br />
                    {file.dimensions
                      ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
                      : '-'}
                  </td>
                  <td>
                    <select
                      className="technology-select"
                      value={fileOptions[file._id]?.technology || ''}
                      onChange={(e) => handleOptionChange(file._id, 'technology', e.target.value)}
                    >
                      {renderOptions(
                        Object.entries(optionsData.technologyOptions).map(([key, value]) => ({
                          name: key,
                          enabled: value.enabled,
                        }))
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="technology-select"
                      value={fileOptions[file._id]?.material || ''}
                      onChange={(e) => handleOptionChange(file._id, 'material', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material || []
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="technology-select"
                      value={fileOptions[file._id]?.color || ''}
                      onChange={(e) => handleOptionChange(file._id, 'color', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color || []
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="technology-select"
                      value={fileOptions[file._id]?.quality || ''}
                      onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality || []
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="technology-select"
                      value={fileOptions[file._id]?.density || ''}
                      onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density || []
                      )}
                    </select>
                  </td>
                  <td className="col-md-1 text-center">
                    ₹{calculatePrice(
                      fileOptions[file._id]?.material || 'PLA',
                      fileOptions[file._id]?.density || '20%',
                      fileOptions[file._id]?.quality || 'Draft',
                      file.buildVolume || 1
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="technology-select"
                      value={fileOptions[file._id]?.quantity || 1}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 1)
                      }
                      min="1"
                    />
                  </td>
                  <td className="py-2">
                    ₹{calculateItemTotal(
                      fileOptions[file._id]?.material || 'PLA',
                      fileOptions[file._id]?.density || '20%',
                      fileOptions[file._id]?.quality || 'Draft',
                      file.buildVolume || 1,
                      fileOptions[file._id]?.quantity || 1
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadedFiles;

