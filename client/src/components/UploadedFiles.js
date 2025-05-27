import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import OrderSummary from './OrderSummary';
import '../styles/UploadedFiles.css';

const UploadedFiles = () => {
  const [session, setSession] = useState("");
  const [orderId, setOrderId] = useState("");
  const [files, setFiles] = useState([]);
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const [fileOptions, setFileOptions] = useState({});
  const [optionsData, setOptionsData] = useState({
    technologyOptions: {},
    materialCosts: {},
    densityCosts: {},
    qualityCosts: {}
  });


  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const response = await fetch('http://test1.3ding.in/api/options');
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

  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://test1.3ding.in/api/files/${session}`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching session files:', error);
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
        updatedOptions.material = newTechnologyOptions.material?.[0]?.name || '';
        updatedOptions.color = newTechnologyOptions.color?.[0]?.name || '';
        updatedOptions.quality = newTechnologyOptions.quality?.[0]?.name || '';
        updatedOptions.density = newTechnologyOptions.density?.[0]?.name || '';
      }

      return {
        ...prevState,
        [fileId]: updatedOptions,
      };
    });
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
  const total = subtotal + gst + shippingCharges;


  const leadTime = (() => {
    if (total >= 10000) {
      return "10 Days";
    } else if (total > 1000) {
      return "5 Days";
    } else if (total > 500) {
      return "4 Days";
    } else if (total > 200) {
      return "3 Days";
    } else if (total > 100) {
      return "2 Days";
    } else {
      return "1 Day"; // Default case
    }
  })();



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
            file.buildVolume
          ),
          itemTotal: calculateItemTotal(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume,
            fileOptions[file._id]?.quantity || 1
          )
        })),
        subtotal,
        gst,
        shippingCharges,
        total,
        leadTime // Include lead time in the order data
      };

      console.log('Submitting order:', JSON.stringify(orderData, null, 2));

      const response = await fetch('http://test1.3ding.in/api/submit-order', {
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
  }, [files, fileOptions]);

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='col-md-7 mt-5'>
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
              leadTime={leadTime}
            />
          </div>
        </div>
      </div>
      <div className='container mb-5'>
        <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
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
                <tr key={file._id} className='justify-content-center text-center'>
                  <td className='py-2 text-center'>{index + 1}</td>
                  <td className="py-2 text-start">{file.originalName}<br />{file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}</td>
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
                  <td className='col-md-1 text-center'>
                    ₹{calculatePrice(fileOptions[file._id]?.material || 'PLA', fileOptions[file._id]?.density || '20%', fileOptions[file._id]?.quality || 'Draft', file.buildVolume)}
                  </td>
                  <td><input
                    type="number"
                    className="technology-select"
                    value={fileOptions[file._id]?.quantity}
                    onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
                    min="0"
                  />
                  </td>
                  <td className='py-2'>
                    ₹{calculateItemTotal(
                      fileOptions[file._id]?.material || 'PLA',
                      fileOptions[file._id]?.density || '20%',
                      fileOptions[file._id]?.quality || 'Draft',
                      file.buildVolume,
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

