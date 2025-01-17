import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import '../styles/UploadedFiles.css';

const socket = io('http://54.79.1.200:3001');

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
  }, [orderId]);

  const debouncedUpdateOrder = useCallback(debounce(async (updatedOrder) => {
    try {
      const response = await fetch(`http://54.79.1.200:3001/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        console.log('Order updated successfully');
        setOrder(updatedOrder); // Update only if the server confirms
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }, 500), [orderId]);

  useEffect(() => {
    if (order) {
      const updatedFiles = order.files.map((file) => ({
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
          fileOptions[file._id]?.quantity || 1,
          customPrices[file._id] || 0
        ),
        customPrice: customPrices[file._id] || 0,
      }));

      // const updatedOrder = { ...order, files: updatedFiles };
      const updatedOrder = {
        ...order,
        files: updatedFiles,
        subtotal,          // Add subtotal
        shippingCharges,   // Add shipping charges
        gst,               // Add GST
        total,             // Add total
      };

      // Check if the new order is different from the current order
      if (JSON.stringify(updatedOrder) !== JSON.stringify(order)) {
        debouncedUpdateOrder(updatedOrder);
      }
    }
  }, [fileOptions, customPrices, debouncedUpdateOrder, order]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://54.79.1.200:3001/orders/${orderId}`);
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
      const response = await fetch('http://54.79.1.200:3001/options');
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
        itemTotal: calculateItemTotal(
          file.options?.material || 'PLA',
          file.options?.density || '20%',
          file.options?.quality || 'Draft',
          file.buildVolume,
          file.options?.quantity || 1,
          file.customPrice || 0
        ),
      };

      initialCustomPrices[file._id] = file.customPrice || 0;
    });

    setFileOptions(initialFileOptions);
    setCustomPrices(initialCustomPrices);
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


      const updatedItemTotal = calculateItemTotal(
        updatedOptions.material || 'PLA',
        updatedOptions.density || '20%',
        updatedOptions.quality || 'Draft',
        order.files.find((file) => file._id === fileId).buildVolume,
        updatedOptions.quantity || 1,
        customPrices[fileId]
      );

      updatedOptions.itemTotal = updatedItemTotal;

      return {
        ...prevState,
        [fileId]: updatedOptions,
      };
    });
  };

  const handleCustomPriceChange = (fileId, value) => {
    setCustomPrices((prevState) => ({
      ...prevState,
      [fileId]: parseFloat(value) || 0,
    }));

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
          parseFloat(value) || 0
        ),
      },
    }));
  };

  const calculatePrice = (material, density, quality, buildVolume) => {
    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;
    const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
    return Math.round(totalPrice);
  };


  // const calculateItemTotal = (
  //   material,
  //   density,
  //   quality,
  //   buildVolume,
  //   quantity,
  //   customPrice = 0
  // ) => {
  //   const materialCost = optionsData.materialCosts[material] || 0;
  //   const densityCost = optionsData.densityCosts[density] || 0;
  //   const qualityCost = optionsData.qualityCosts[quality] || 0;
  //   const price = customPrice || ((materialCost + densityCost + qualityCost) * buildVolume);
  //   return Math.round(price * quantity);
  // };

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


  // const calculateSubtotal = () => {
  //   return order.files.reduce((acc, file) => {
  //     const fileTotal = calculateItemTotal(
  //       fileOptions[file._id]?.material || 'PLA',
  //       fileOptions[file._id]?.density || '20%',
  //       fileOptions[file._id]?.quality || 'Draft',
  //       file.buildVolume,
  //       fileOptions[file._id]?.quantity || 1,
  //       customPrices[file._id] || 0
  //     );
  //     return acc + fileTotal;
  //   }, 0);
  // };

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

  const calculateTotal = (subtotal, gst, shippingCharges) => {
    return subtotal + gst + shippingCharges;
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

  return (
    <div className="container mt-5">
      <h1 className='text-center'>Order Summary</h1>
      <div className="">
        <div className='row my-5'>
          <div className='col-md-6 text-start'>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Lead Time:</strong></p>
          </div>
          <div className='col-md-6 text-start'>
            {/* <h5>Subtotal: ₹ {subtotal}</h5>
            <h5>GST (18%): ₹ {gst}</h5>
            <h5>Shipping Charges: ₹ {shippingCharges}</h5>
            <h5>Final Total: ₹ {total}</h5> */}
            <p>Total:₹{total}<br>
            </br><span className='fw-normal'> (incl.
              Tax:₹ {gst}  Shpping:₹ {shippingCharges})</span></p>
          </div>
        </div>
        <div className="">
          <table className="col-md-12">
            <thead className="justify-content-center border-top border-bottom">
              <tr className=''>
                <th className='col-md-1 py-2'>#</th>
                <th className='col-md-2 py-2'>File Name</th>
                <th className='col-md-1 py-2'>Technology</th>
                <th className='col-md-1 py-2'>Material</th>
                <th className='col-md-1 py-2'>Color</th>
                <th className='col-md-1 py-2'>Quality</th>
                <th className='col-md-1 py-2'>Density</th>
                <th className='col-md-1 py-2'>Quantity</th>
                {/* <th className='col-md-1 py-2'>Volume</th> */}
                <th className='col-md-1 py-2'>Price</th>
                {/* <th className='col-md-1 py-2'>Custom Price</th> */}
                <th className='col-md-1 py-2'>Item Total</th>
              </tr>
            </thead>
            <tbody>
              {order.files.map((file, index) => (
                <tr key={file._id}>
                  <td className="col-md-1 py-3">{index + 1}</td>
                  <td className="col-md-2 py-3">{file.originalName}
                    <br />
                    {file.dimensions
                      ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
                      : '-'}</td>
                  <td className="col-md-1 py-3">
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.technology || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'technology', e.target.value)
                      }
                      disabled={fileOptions[file._id]?.customPrice !== 0}
                    >
                      {Object.keys(optionsData.technologyOptions).map((technology) => (
                        <option key={technology} value={technology}>
                          {technology}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="col-md-1 py-3">
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.material || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'material', e.target.value)
                      }
                      disabled={fileOptions[file._id]?.customPrice !== 0}
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
                  <td className="col-md-1 py-3">
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.color || ''}
                      onChange={(e) =>
                        handleOptionChange(file._id, 'color', e.target.value)
                      }
                      disabled={fileOptions[file._id]?.customPrice !== 0}
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
                  <td className="col-md-1 py-3">
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.quality || ''}
                      onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
                      disabled={fileOptions[file._id]?.customPrice !== 0}
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
                  <td className="col-md-1 py-3">
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.density || ''}
                      onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
                      disabled={fileOptions[file._id]?.customPrice !== 0}
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
                  <td className="col-md-1 py-3">
                    {/* <input
                      type="number"
                      className="form-control"
                      value={fileOptions[file._id]?.quantity || 1}
                      onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
                      min="1"
                    /> */}
                    <input
                      type="number"
                      className="form-control"
                      value={fileOptions[file._id]?.quantity}
                      onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
                      min="0"
                    />
                  </td>
                  {/* <td className="col-md-1 py-3"> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td> */}
                  <td className="col-md-1 py-3">
                    {customPrices[file._id] !== 0
                      ? customPrices[file._id]
                      : calculatePrice(
                        fileOptions[file._id]?.material,
                        fileOptions[file._id]?.density,
                        fileOptions[file._id]?.quality,
                        file.buildVolume
                      )}
                  </td>
                  <td className="col-md-1 py-3">
                    {calculateItemTotal(
                      fileOptions[file._id]?.material,
                      fileOptions[file._id]?.density,
                      fileOptions[file._id]?.quality,
                      file.buildVolume,
                      fileOptions[file._id]?.quantity,
                      customPrices[file._id]
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

export default OrderDetails;


// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { debounce } from 'lodash';
// import '../styles/UploadedFiles.css';

// const socket = io('http://54.79.1.200:3001');

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [optionsData, setOptionsData] = useState({
//     technologyOptions: {},
//     materialCosts: {},
//     densityCosts: {},
//     qualityCosts: {},
//   });
//   const [fileOptions, setFileOptions] = useState({});
//   const [customPrices, setCustomPrices] = useState({});

//   useEffect(() => {
//     fetchOrderDetails();
//     fetchOptionsData();

//     socket.on('orderUpdated', ({ orderId: updatedOrderId, updatedOrder }) => {
//       if (updatedOrderId === orderId) {
//         setOrder(updatedOrder);
//         initializeFileOptions(updatedOrder);
//       }
//     });

//     return () => {
//       socket.off('orderUpdated');
//     };
//   }, [orderId]);

//   const debouncedUpdateOrder = useCallback(debounce(async (updatedOrder) => {
//     try {
//       const response = await fetch(`http://54.79.1.200:3001/orders/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedOrder),
//       });

//       if (response.ok) {
//         console.log('Order updated successfully');
//         setOrder(updatedOrder); // Update only if the server confirms
//       } else {
//         console.error('Error updating order');
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   }, 500), [orderId]);

//   useEffect(() => {
//     if (order) {
//       const updatedFiles = order.files.map((file) => ({
//         ...file,
//         options: fileOptions[file._id],
//         itemTotal: calculateItemTotal(
//           fileOptions[file._id]?.material || 'PLA',
//           fileOptions[file._id]?.density || '20%',
//           fileOptions[file._id]?.quality || 'Draft',
//           file.buildVolume,
//           fileOptions[file._id]?.quantity || 1,
//           customPrices[file._id] || 0
//         ),
//         customPrice: customPrices[file._id] || 0,
//       }));

//       // const updatedOrder = { ...order, files: updatedFiles };
//       const updatedOrder = {
//         ...order,
//         files: updatedFiles,
//         subtotal,          // Add subtotal
//         shippingCharges,   // Add shipping charges
//         gst,               // Add GST
//         total,             // Add total
//       };

//       // Check if the new order is different from the current order
//       if (JSON.stringify(updatedOrder) !== JSON.stringify(order)) {
//         debouncedUpdateOrder(updatedOrder);
//       }
//     }
//   }, [fileOptions, customPrices, debouncedUpdateOrder, order]);

//   const fetchOrderDetails = async () => {
//     try {
//       const response = await fetch(`http://54.79.1.200:3001/orders/${orderId}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setOrder(data);
//       initializeFileOptions(data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOptionsData = async () => {
//     try {
//       const response = await fetch('http://54.79.1.200:3001/options');
//       const data = await response.json();
//       setOptionsData(data);
//     } catch (error) {
//       console.error('Error fetching options data:', error);
//     }
//   };

//   const initializeFileOptions = (orderData) => {
//     const initialFileOptions = {};
//     const initialCustomPrices = {};

//     orderData.files.forEach((file) => {
//       initialFileOptions[file._id] = {
//         technology: file.options?.technology || 'FDM/FFF',
//         material: file.options?.material || 'PLA',
//         color: file.options?.color || '',
//         quality: file.options?.quality || 'Draft',
//         density: file.options?.density || '20%',
//         quantity: file.options?.quantity || 1,
//         customPrice: file.customPrice || 0,
//         itemTotal: calculateItemTotal(
//           file.options?.material || 'PLA',
//           file.options?.density || '20%',
//           file.options?.quality || 'Draft',
//           file.buildVolume,
//           file.options?.quantity || 1,
//           file.customPrice || 0
//         ),
//       };

//       initialCustomPrices[file._id] = file.customPrice || 0;
//     });

//     setFileOptions(initialFileOptions);
//     setCustomPrices(initialCustomPrices);
//   };

//   const handleOptionChange = (fileId, optionType, value) => {
//     setFileOptions((prevState) => {
//       const updatedOptions = { ...prevState[fileId], [optionType]: value };

//       if (optionType === 'technology') {
//         const newTechnologyOptions = optionsData.technologyOptions[value];
//         updatedOptions.material = newTechnologyOptions.material[0] || '';
//         updatedOptions.color = newTechnologyOptions.color[0] || '';
//         updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//         updatedOptions.density = newTechnologyOptions.density[0] || '';
//       }

//       if (optionType === 'quantity' && updatedOptions.quantity < 1) {
//         updatedOptions.quantity = 1;
//       }

//       const updatedItemTotal = calculateItemTotal(
//         updatedOptions.material || 'PLA',
//         updatedOptions.density || '20%',
//         updatedOptions.quality || 'Draft',
//         order.files.find((file) => file._id === fileId).buildVolume,
//         updatedOptions.quantity || 1,
//         customPrices[fileId]
//       );

//       updatedOptions.itemTotal = updatedItemTotal;

//       return {
//         ...prevState,
//         [fileId]: updatedOptions,
//       };
//     });
//   };

//   const handleCustomPriceChange = (fileId, value) => {
//     setCustomPrices((prevState) => ({
//       ...prevState,
//       [fileId]: parseFloat(value) || 0,
//     }));

//     setFileOptions((prevState) => ({
//       ...prevState,
//       [fileId]: {
//         ...prevState[fileId],
//         customPrice: parseFloat(value) || 0,
//         itemTotal: calculateItemTotal(
//           prevState[fileId]?.material || 'PLA',
//           prevState[fileId]?.density || '20%',
//           prevState[fileId]?.quality || 'Draft',
//           order.files.find((file) => file._id === fileId).buildVolume,
//           prevState[fileId]?.quantity || 1,
//           parseFloat(value) || 0
//         ),
//       },
//     }));
//   };

//   const calculatePrice = (material, density, quality, buildVolume) => {
//     const materialCost = optionsData.materialCosts[material] || 0;
//     const densityCost = optionsData.densityCosts[density] || 0;
//     const qualityCost = optionsData.qualityCosts[quality] || 0;
//     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//     return Math.round(totalPrice);
//   };

//   const calculateItemTotal = (
//     material,
//     density,
//     quality,
//     buildVolume,
//     quantity,
//     customPrice = 0
//   ) => {
//     const materialCost = optionsData.materialCosts[material] || 0;
//     const densityCost = optionsData.densityCosts[density] || 0;
//     const qualityCost = optionsData.qualityCosts[quality] || 0;
//     const price = customPrice || ((materialCost + densityCost + qualityCost) * buildVolume);
//     return Math.round(price * quantity);
//   };

//   const calculateSubtotal = () => {
//     return order.files.reduce((acc, file) => {
//       const fileTotal = calculateItemTotal(
//         fileOptions[file._id]?.material || 'PLA',
//         fileOptions[file._id]?.density || '20%',
//         fileOptions[file._id]?.quality || 'Draft',
//         file.buildVolume,
//         fileOptions[file._id]?.quantity || 1,
//         customPrices[file._id] || 0
//       );
//       return acc + fileTotal;
//     }, 0);
//   };

//   const calculateGST = (subtotal) => {
//     return Math.round(subtotal * 0.18);
//   };

//   const calculateTotal = (subtotal, gst, shippingCharges) => {
//     return subtotal + gst + shippingCharges;
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!order) {
//     return <div>No order found</div>;
//   }

//   const subtotal = calculateSubtotal();
//   const gst = calculateGST(subtotal);
//   const shippingCharges = order.shippingCharges || 0;
//   const total = calculateTotal(subtotal, gst, shippingCharges);

//   return (
//     <div className="container mt-5">
//       <h1 className='text-center'>Order Summary</h1>
//       <div className="">
//         <div className='row my-5'>
//           <div className='col-md-6 text-start'>
//             <p><strong>Order ID:</strong> {order.orderId}</p>
//             <p><strong>Lead Time:</strong></p>
//           </div>
//           <div className='col-md-6 text-start'>
//             {/* <h5>Subtotal: ₹ {subtotal}</h5>
//             <h5>GST (18%): ₹ {gst}</h5>
//             <h5>Shipping Charges: ₹ {shippingCharges}</h5>
//             <h5>Final Total: ₹ {total}</h5> */}
//             <p>Total:₹{total}<br>
//             </br><span className='fw-normal'> (incl.
//               Tax:₹ {gst}  Shpping:₹ {shippingCharges})</span></p>
//           </div>
//         </div>
//         <div className="">
//           <table className="col-md-12">
//             <thead className="justify-content-center border-top border-bottom">
//               <tr className=''>
//                 <th className='col-md-1 py-2'>#</th>
//                 <th className='col-md-2 py-2'>File Name</th>
//                 <th className='col-md-1 py-2'>Technology</th>
//                 <th className='col-md-1 py-2'>Material</th>
//                 <th className='col-md-1 py-2'>Color</th>
//                 <th className='col-md-1 py-2'>Quality</th>
//                 <th className='col-md-1 py-2'>Density</th>
//                 <th className='col-md-1 py-2'>Quantity</th>
//                 {/* <th className='col-md-1 py-2'>Volume</th> */}
//                 <th className='col-md-1 py-2'>Price</th>
//                 {/* <th className='col-md-1 py-2'>Custom Price</th> */}
//                 <th className='col-md-1 py-2'>Item Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.files.map((file, index) => (
//                 <tr key={file._id}>
//                   <td className="col-md-1 py-3">{index + 1}</td>
//                   <td className="col-md-2 py-3">{file.originalName}
//                     <br />
//                     {file.dimensions
//                       ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
//                       : '-'}</td>
//                   <td className="col-md-1 py-3">
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.technology || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'technology', e.target.value)
//                       }
//                       disabled={fileOptions[file._id]?.customPrice !== 0}
//                     >
//                       {Object.keys(optionsData.technologyOptions).map((technology) => (
//                         <option key={technology} value={technology}>
//                           {technology}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="col-md-1 py-3">
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.material || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'material', e.target.value)
//                       }
//                       disabled={fileOptions[file._id]?.customPrice !== 0}
//                     >
//                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(
//                         (material) => (
//                           <option key={material} value={material}>
//                             {material}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </td>
//                   <td className="col-md-1 py-3">
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.color || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'color', e.target.value)
//                       }
//                       disabled={fileOptions[file._id]?.customPrice !== 0}
//                     >
//                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(
//                         (color) => (
//                           <option key={color} value={color}>
//                             {color}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </td>
//                   <td className="col-md-1 py-3">
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.quality || ''}
//                       onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
//                       disabled={fileOptions[file._id]?.customPrice !== 0}
//                     >
//                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(
//                         (quality) => (
//                           <option key={quality} value={quality}>
//                             {quality}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </td>
//                   <td className="col-md-1 py-3">
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.density || ''}
//                       onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
//                       disabled={fileOptions[file._id]?.customPrice !== 0}
//                     >
//                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(
//                         (density) => (
//                           <option key={density} value={density}>
//                             {density}
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </td>
//                   <td className="col-md-1 py-3">
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={fileOptions[file._id]?.quantity || 1}
//                       onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
//                       min="1"
//                     />
//                   </td>
//                   {/* <td className="col-md-1 py-3"> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td> */}
//                   <td className="col-md-1 py-3">
//                     {customPrices[file._id] !== 0
//                       ? customPrices[file._id]
//                       : calculatePrice(
//                         fileOptions[file._id]?.material,
//                         fileOptions[file._id]?.density,
//                         fileOptions[file._id]?.quality,
//                         file.buildVolume
//                       )}
//                   </td>
//                   {/* <td className="col-md-1 py-3">
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={customPrices[file._id] || 0}
//                       onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
//                       min="0"
//                     />
//                   </td> */}
//                   <td className="col-md-1 py-3">
//                     {calculateItemTotal(
//                       fileOptions[file._id]?.material,
//                       fileOptions[file._id]?.density,
//                       fileOptions[file._id]?.quality,
//                       file.buildVolume,
//                       fileOptions[file._id]?.quantity,
//                       customPrices[file._id]
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div >
//   );
// };

// export default OrderDetails;