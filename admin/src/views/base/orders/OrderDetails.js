import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://test1.3ding.in/api');

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optionsData, setOptionsData] = useState({
    technologyOptions: {},
    materialCosts: {},
    densityCosts: {},
    qualityCosts: {},
  });
  const [fileOptions, setFileOptions] = useState({});
  const [customPrices, setCustomPrices] = useState({});
  const [customShippingPrice, setCustomShippingPrice] = useState(0);


  useEffect(() => {
    fetchOrderDetails();
    fetchOptionsData();

    socket.on('orderUpdated', ({ orderId: updatedOrderId, updatedOrder }) => {
      if (updatedOrderId === orderId) {
        setOrder(updatedOrder);
        initializeFileOptions(updatedOrder);
      }
    });

    return () => {
      socket.off('orderUpdated');
    };
  }, []);



  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://test1.3ding.in/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrder(data);
      initializeFileOptions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptionsData = async () => {
    try {
      const response = await fetch('http://test1.3ding.in/api/options');
      const data = await response.json();
      setOptionsData(data);
    } catch (error) {
      console.error('Error fetching options data:', error);
    }
  };

  const initializeFileOptions = (orderData) => {
    const initialFileOptions = {};
    const initialCustomPrices = {};

    orderData.files.forEach((file) => {
      initialFileOptions[file._id] = {
        technology: file.options?.technology || 'FDM/FFF',
        material: file.options?.material || 'PLA',
        color: file.options?.color || '',
        quality: file.options?.quality || 'Draft',
        density: file.options?.density || '20%',
        // quantity: file.options?.quantity || 1,
        quantity: file.options?.quantity !== undefined ? file.options.quantity : 1,
        customPrice: file.customPrice || 0,
      };

      initialCustomPrices[file._id] = file.customPrice || 0;
    });

    setFileOptions(initialFileOptions);
    setCustomPrices(initialCustomPrices);
  };

  const updateAllItemTotals = () => {
    setFileOptions((prevState) => {
      const updatedFileOptions = { ...prevState };
      order.files.forEach((file) => {
        updatedFileOptions[file._id] = {
          ...updatedFileOptions[file._id],
          itemTotal: calculateItemTotal(
            updatedFileOptions[file._id]?.material || 'PLA',
            updatedFileOptions[file._id]?.density || '20%',
            updatedFileOptions[file._id]?.quality || 'Draft',
            file.buildVolume,
            updatedFileOptions[file._id]?.quantity || 0,
            customPrices[file._id] || 0
          ),
        };
      });
      return updatedFileOptions;
    });
  };

  const handleOptionChange = (fileId, optionType, value) => {
    setFileOptions((prevState) => {
      const updatedOptions = { ...prevState[fileId], [optionType]: value };

      if (optionType === 'technology') {
        const newTechnologyOptions = optionsData.technologyOptions[value];
        updatedOptions.material = newTechnologyOptions.material[0] || '';
        updatedOptions.color = newTechnologyOptions.color[0] || '';
        updatedOptions.quality = newTechnologyOptions.quality[0] || '';
        updatedOptions.density = newTechnologyOptions.density[0] || '';
      }

      return { ...prevState, [fileId]: updatedOptions };
    });
    updateAllItemTotals(); // Recalculate all item totals
  };

  const handleCustomPriceChange = (fileId, value) => {
    setCustomPrices((prevState) => ({
      ...prevState,
      [fileId]: parseFloat(value) || 0, // Ensure custom price is parsed as float
    }));
    updateAllItemTotals(); // Recalculate all item totals

    // Update itemTotal when custom price changes
    setFileOptions((prevState) => ({
      ...prevState,
      [fileId]: {
        ...prevState[fileId],
        customPrice: parseFloat(value) || 0,
        itemTotal: calculateItemTotal(
          prevState[fileId]?.material || 'PLA',
          prevState[fileId]?.density || '20%',
          prevState[fileId]?.quality || 'Draft',
          order.files.find((file) => file._id === fileId).buildVolume,
          prevState[fileId]?.quantity || 1,
          parseFloat(value) || 0 // Pass new custom price to calculateItemTotal
        ),
      },
    }));
  };


  const handleSubmitOrder = async () => {
    try {
      const updatedFiles = order.files.map((file) => ({
        ...file,
        options: fileOptions[file._id],
        // itemTotal: fileOptions[file._id]?.itemTotal || 0,
        customPrice: customPrices[file._id], // Ensure custom price is sent to the server
        price: calculatePrice(
          fileOptions[file._id]?.material || 'PLA',
          fileOptions[file._id]?.density || '20%',
          fileOptions[file._id]?.quality || 'Draft',
          file.buildVolume
        ),
        itemTotal: calculateItemTotal(
          fileOptions[file._id]?.material,
          fileOptions[file._id]?.density,
          fileOptions[file._id]?.quality,
          file.buildVolume,
          fileOptions[file._id]?.quantity,
          fileOptions[file._id]?.customPrice
        )
      }));

      const updatedOrder = {
        ...order,
        files: updatedFiles,
        subtotal,
        gst,
        // shippingCharges,   // Add shipping charges
        shippingCharges: customShippingPrice || shippingCharges,
        total,
      };

      const response = await fetch(`http://test1.3ding.in/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order updated successfully');
        setOrder(data); // Update the order in the state with the response data
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };


  const calculatePrice = (material, density, quality, buildVolume) => {
    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;
    const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
    return Math.round(totalPrice);
  };

  const calculateItemTotal = (
    material,
    density,
    quality,
    buildVolume,
    quantity,
    customPrice = 0
  ) => {
    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;

    if (customPrice !== 0) {
      return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
    } else {
      const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
      return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
    }
  };


  const calculateSubtotal = () => {
    return order.files.reduce((acc, file) => {
      const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
      const fileTotal =
        quantity > 0
          ? calculateItemTotal(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume,
            quantity,
            customPrices[file._id] || 0
          )
          : 0; // Skip adding to subtotal if quantity is 0
      return acc + fileTotal;
    }, 0);
  };

  const calculateGST = (subtotal) => {
    return Math.round(subtotal * 0.18);
  };

  // const calculateTotal = (subtotal, gst, shippingCharges) => {
  //   return subtotal + gst + shippingCharges;
  // };

  const calculateTotal = (subtotal, gst, shippingCharges) => {
    const effectiveShippingCharges = customShippingPrice !== 0 ? customShippingPrice : shippingCharges;
    return subtotal + gst + effectiveShippingCharges;
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  const subtotal = calculateSubtotal();
  const gst = calculateGST(subtotal);
  const shippingCharges = order.shippingCharges || 0;
  const total = calculateTotal(subtotal, gst, shippingCharges);
  const price = calculatePrice();

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>
            Order Details <small className="text-muted">Order ID: {order.orderId}</small>
          </h3>
          <p> <span className='mx-5'>subtotal:{subtotal}</span><span className='mx-5'>Total:{total}</span>
            <span className='mx-5'>GST:{gst}</span> <span className='mx-5'>S.Chrg:{shippingCharges}</span></p>
        </div>
        <div className="mb-3 m-5 col-md-2">
          <label htmlFor="customShippingPrice" className="fw-bold form-label">Custom Shipping Price</label>
          <input
            type="number"
            id="customShippingPrice"
            className="form-control"
            value={customShippingPrice}
            onChange={(e) => setCustomShippingPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className='col-md-1'>Serial No.</th>
                <th className='col-md-1'>File Name</th>
                <th className='col-md-1'>Technology</th>
                <th className='col-md-1'>Material</th>
                <th className='col-md-1'>Color</th>
                <th className='col-md-1'>Quality</th>
                <th className='col-md-1'>Density</th>
                <th className='col-md-1'>Quantity</th>
                <th className='col-md-1'>Volume</th>
                <th className='col-md-1'>Price</th>
                <th className='col-md-1'>Custom Price</th>
                <th className='col-md-1'>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.files.map((file, index) => (
                <tr key={file._id}>
                  <td>{index + 1}</td>
                  <td>{file.originalName}
                    <br />
                    {file.dimensions
                      ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
                      : '-'}</td>
                  <td>
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.technology || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'technology', e.target.value)
                      }
                    >
                      {Object.keys(optionsData.technologyOptions).map((technology) => (
                        <option key={technology} value={technology}>
                          {technology}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.material || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'material', e.target.value)
                      }
                    >
                      {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(
                        (material) => (
                          <option key={material} value={material}>
                            {material}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.color || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'color', e.target.value)
                      }
                    >
                      {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(
                        (color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.quality || ''}
                      onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
                    >
                      {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(
                        (quality) => (
                          <option key={quality} value={quality}>
                            {quality}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.density || ''}
                      onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
                    >
                      {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(
                        (density) => (
                          <option key={density} value={density}>
                            {density}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={fileOptions[file._id]?.quantity || 0}
                      onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
                      min="0"
                    />
                  </td>
                  <td> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td>
                  <td>
                    {calculatePrice(
                      fileOptions[file._id]?.material,
                      fileOptions[file._id]?.density,
                      fileOptions[file._id]?.quality,
                      file.buildVolume
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={fileOptions[file._id]?.customPrice || 0}
                      onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    {calculateItemTotal(
                      fileOptions[file._id]?.material,
                      fileOptions[file._id]?.density,
                      fileOptions[file._id]?.quality,
                      file.buildVolume,
                      fileOptions[file._id]?.quantity,
                      fileOptions[file._id]?.customPrice
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleSubmitOrder}>
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
