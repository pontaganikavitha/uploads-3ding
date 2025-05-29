// // // import React, { useEffect, useState } from 'react';
// // // import { useParams } from 'react-router-dom';
// // // import { io } from 'socket.io-client';

// // // const socket = io('https://test1.3ding.in/api');

// // // const OrderDetails = () => {
// // //   const { orderId } = useParams();
// // //   const [order, setOrder] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [optionsData, setOptionsData] = useState({
// // //     technologyOptions: {},
// // //     materialCosts: {},
// // //     densityCosts: {},
// // //     qualityCosts: {},
// // //   });
// // //   const [fileOptions, setFileOptions] = useState({});
// // //   const [customPrices, setCustomPrices] = useState({});

// // //   useEffect(() => {
// // //     fetchOrderDetails();
// // //     fetchOptionsData();

// // //     socket.on('orderUpdated', ({ orderId: updatedOrderId, updatedOrder }) => {
// // //       if (updatedOrderId === orderId) {
// // //         setOrder(updatedOrder);
// // //         initializeFileOptions(updatedOrder);
// // //       }
// // //     });

// // //     return () => {
// // //       socket.off('orderUpdated');
// // //     };
// // //   }, []);



// // //   const fetchOrderDetails = async () => {
// // //     try {
// // //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`);
// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }
// // //       const data = await response.json();
// // //       setOrder(data);
// // //       initializeFileOptions(data);
// // //     } catch (error) {
// // //       setError(error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchOptionsData = async () => {
// // //     try {
// // //       const response = await fetch('https://test1.3ding.in/api/options');
// // //       const data = await response.json();
// // //       setOptionsData(data);
// // //     } catch (error) {
// // //       console.error('Error fetching options data:', error);
// // //     }
// // //   };

// // //   const initializeFileOptions = (orderData) => {
// // //     const initialFileOptions = {};
// // //     const initialCustomPrices = {};

// // //     orderData.files.forEach((file) => {
// // //       initialFileOptions[file._id] = {
// // //         technology: file.options?.technology || 'FDM/FFF',
// // //         material: file.options?.material || 'PLA',
// // //         color: file.options?.color || '',
// // //         quality: file.options?.quality || 'Draft',
// // //         density: file.options?.density || '20%',
// // //         // quantity: file.options?.quantity || 1,
// // //         quantity: file.options?.quantity !== undefined ? file.options.quantity : 1,
// // //         customPrice: file.customPrice || 0,
// // //       };

// // //       initialCustomPrices[file._id] = file.customPrice || 0;
// // //     });

// // //     setFileOptions(initialFileOptions);
// // //     setCustomPrices(initialCustomPrices);
// // //   };

// // //   const updateAllItemTotals = () => {
// // //     setFileOptions((prevState) => {
// // //       const updatedFileOptions = { ...prevState };
// // //       order.files.forEach((file) => {
// // //         updatedFileOptions[file._id] = {
// // //           ...updatedFileOptions[file._id],
// // //           itemTotal: calculateItemTotal(
// // //             updatedFileOptions[file._id]?.material || 'PLA',
// // //             updatedFileOptions[file._id]?.density || '20%',
// // //             updatedFileOptions[file._id]?.quality || 'Draft',
// // //             file.buildVolume,
// // //             updatedFileOptions[file._id]?.quantity || 0,
// // //             customPrices[file._id] || 0
// // //           ),
// // //         };
// // //       });
// // //       return updatedFileOptions;
// // //     });
// // //   };

// // //   const handleOptionChange = (fileId, optionType, value) => {
// // //     setFileOptions((prevState) => {
// // //       const updatedOptions = { ...prevState[fileId], [optionType]: value };

// // //       if (optionType === 'technology') {
// // //         const newTechnologyOptions = optionsData.technologyOptions[value];
// // //         updatedOptions.material = newTechnologyOptions.material[0] || '';
// // //         updatedOptions.color = newTechnologyOptions.color[0] || '';
// // //         updatedOptions.quality = newTechnologyOptions.quality[0] || '';
// // //         updatedOptions.density = newTechnologyOptions.density[0] || '';
// // //       }

// // //       return { ...prevState, [fileId]: updatedOptions };
// // //     });
// // //     updateAllItemTotals(); // Recalculate all item totals
// // //   };

// // //   const handleCustomPriceChange = (fileId, value) => {
// // //     setCustomPrices((prevState) => ({
// // //       ...prevState,
// // //       [fileId]: parseFloat(value) || 0, // Ensure custom price is parsed as float
// // //     }));
// // //     updateAllItemTotals(); // Recalculate all item totals

// // //     // Update itemTotal when custom price changes
// // //     setFileOptions((prevState) => ({
// // //       ...prevState,
// // //       [fileId]: {
// // //         ...prevState[fileId],
// // //         customPrice: parseFloat(value) || 0,
// // //         itemTotal: calculateItemTotal(
// // //           prevState[fileId]?.material || 'PLA',
// // //           prevState[fileId]?.density || '20%',
// // //           prevState[fileId]?.quality || 'Draft',
// // //           order.files.find((file) => file._id === fileId).buildVolume,
// // //           prevState[fileId]?.quantity || 1,
// // //           parseFloat(value) || 0 // Pass new custom price to calculateItemTotal
// // //         ),
// // //       },
// // //     }));
// // //   };


// // //   const handleSubmitOrder = async () => {
// // //     try {
// // //       const updatedFiles = order.files.map((file) => ({
// // //         ...file,
// // //         options: fileOptions[file._id],
// // //         itemTotal: fileOptions[file._id]?.itemTotal || 0,
// // //         customPrice: customPrices[file._id], // Ensure custom price is sent to the server
// // //       }));

// // //       const updatedOrder = {
// // //         ...order,
// // //         files: updatedFiles,
// // //         subtotal,          // Add subtotal
// // //         shippingCharges,   // Add shipping charges
// // //         gst,               // Add GST
// // //         total,             // Add total
// // //       };

// // //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(updatedOrder),
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         console.log('Order updated successfully');
// // //         setOrder(data); // Update the order in the state with the response data
// // //       } else {
// // //         console.error('Error updating order');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating order:', error);
// // //     }
// // //   };


// // //   const calculatePrice = (material, density, quality, buildVolume) => {
// // //     const materialCost = optionsData.materialCosts[material] || 0;
// // //     const densityCost = optionsData.densityCosts[density] || 0;
// // //     const qualityCost = optionsData.qualityCosts[quality] || 0;
// // //     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// // //     return Math.round(totalPrice);
// // //   };

// // //   // const calculateItemTotal = (
// // //   //   material,
// // //   //   density,
// // //   //   quality,
// // //   //   buildVolume,
// // //   //   quantity,
// // //   //   customPrice = 0
// // //   // ) => {
// // //   //   if (quantity === 0) return 0;
// // //   //   const materialCost = optionsData.materialCosts[material] || 0;
// // //   //   const densityCost = optionsData.densityCosts[density] || 0;
// // //   //   const qualityCost = optionsData.qualityCosts[quality] || 0;

// // //   //   if (customPrice !== 0) {
// // //   //     // Use custom price if provided
// // //   //     return Math.round(customPrice * quantity);
// // //   //   } else {
// // //   //     // Otherwise, calculate using standard price calculation
// // //   //     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// // //   //     return Math.round(totalPrice * quantity);
// // //   //   }
// // //   // };

// // //   const calculateItemTotal = (
// // //     material,
// // //     density,
// // //     quality,
// // //     buildVolume,
// // //     quantity,
// // //     customPrice = 0
// // //   ) => {
// // //     const materialCost = optionsData.materialCosts[material] || 0;
// // //     const densityCost = optionsData.densityCosts[density] || 0;
// // //     const qualityCost = optionsData.qualityCosts[quality] || 0;

// // //     if (customPrice !== 0) {
// // //       return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
// // //     } else {
// // //       const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// // //       return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
// // //     }
// // //   };


// // //   // const calculateSubtotal = () => {
// // //   //   return order.files.reduce((acc, file) => {
// // //   //     const fileTotal = calculateItemTotal(
// // //   //       fileOptions[file._id]?.material || 'PLA',
// // //   //       fileOptions[file._id]?.density || '20%',
// // //   //       fileOptions[file._id]?.quality || 'Draft',
// // //   //       file.buildVolume,
// // //   //       fileOptions[file._id]?.quantity || 1,
// // //   //       customPrices[file._id] || 0
// // //   //     );
// // //   //     return acc + fileTotal;
// // //   //   }, 0);
// // //   // };


// // //   const calculateSubtotal = () => {
// // //     return order.files.reduce((acc, file) => {
// // //       const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
// // //       const fileTotal =
// // //         quantity > 0
// // //           ? calculateItemTotal(
// // //               fileOptions[file._id]?.material || 'PLA',
// // //               fileOptions[file._id]?.density || '20%',
// // //               fileOptions[file._id]?.quality || 'Draft',
// // //               file.buildVolume,
// // //               quantity,
// // //               customPrices[file._id] || 0
// // //             )
// // //           : 0; // Skip adding to subtotal if quantity is 0
// // //       return acc + fileTotal;
// // //     }, 0);
// // //   };

// // //   const calculateGST = (subtotal) => {
// // //     return Math.round(subtotal * 0.18);
// // //   };

// // //   const calculateTotal = (subtotal, gst, shippingCharges) => {
// // //     return subtotal + gst + shippingCharges;
// // //   };

// // //   if (loading) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   if (error) {
// // //     return <div>Error: {error}</div>;
// // //   }

// // //   if (!order) {
// // //     return <div>No order found</div>;
// // //   }

// // //   const subtotal = calculateSubtotal();
// // //   const gst = calculateGST(subtotal);
// // //   const shippingCharges = order.shippingCharges || 0;
// // //   const total = calculateTotal(subtotal, gst, shippingCharges);

// // //   return (
// // //     <div className="container mt-5">
// // //       <div className="card">
// // //         <div className="card-header">
// // //           <h3>
// // //             Order Details <small className="text-muted">Order ID: {order.orderId}</small>
// // //             <spna>subtotal:{subtotal}</spna><span>Total:{total}</span>
// // //           </h3>
// // //         </div>
// // //         <div className="card-body">
// // //           <table className="table table-striped">
// // //             <thead>
// // //               <tr>
// // //                 <th className='col-md-1'>Serial No.</th>
// // //                 <th className='col-md-1'>File Name</th>
// // //                 <th className='col-md-1'>Technology</th>
// // //                 <th className='col-md-1'>Material</th>
// // //                 <th className='col-md-1'>Color</th>
// // //                 <th className='col-md-1'>Quality</th>
// // //                 <th className='col-md-1'>Density</th>
// // //                 <th className='col-md-1'>Quantity</th>
// // //                 <th className='col-md-1'>Volume</th>
// // //                 <th className='col-md-1'>Price</th>
// // //                 <th className='col-md-1'>Custom Price</th>
// // //                 <th className='col-md-1'>Total</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {order.files.map((file, index) => (
// // //                 <tr key={file._id}>
// // //                   <td>{index + 1}</td>
// // //                   <td>{file.originalName}
// // //                     <br />
// // //                     {file.dimensions
// // //                       ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
// // //                       : '-'}</td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.technology || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'technology', e.target.value)
// // //                       }
// // //                     >
// // //                       {Object.keys(optionsData.technologyOptions).map((technology) => (
// // //                         <option key={technology} value={technology}>
// // //                           {technology}
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.material || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'material', e.target.value)
// // //                       }
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(
// // //                         (material) => (
// // //                           <option key={material} value={material}>
// // //                             {material}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.color || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'color', e.target.value)
// // //                       }
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(
// // //                         (color) => (
// // //                           <option key={color} value={color}>
// // //                             {color}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.quality || ''}
// // //                       onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(
// // //                         (quality) => (
// // //                           <option key={quality} value={quality}>
// // //                             {quality}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.density || ''}
// // //                       onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(
// // //                         (density) => (
// // //                           <option key={density} value={density}>
// // //                             {density}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <input
// // //                       type="number"
// // //                       className="form-control"
// // //                       value={fileOptions[file._id]?.quantity || 0}
// // //                       onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
// // //                       min="0"
// // //                     />
// // //                   </td>
// // //                   <td> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td>
// // //                   <td>
// // //                     {calculatePrice(
// // //                       fileOptions[file._id]?.material,
// // //                       fileOptions[file._id]?.density,
// // //                       fileOptions[file._id]?.quality,
// // //                       file.buildVolume
// // //                     )}
// // //                   </td>
// // //                   <td>
// // //                     <input
// // //                       type="number"
// // //                       className="form-control"
// // //                       value={fileOptions[file._id]?.customPrice || 0}
// // //                       onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
// // //                       min="0"
// // //                     />
// // //                   </td>
// // //                   <td>
// // //                     {calculateItemTotal(
// // //                       fileOptions[file._id]?.material,
// // //                       fileOptions[file._id]?.density,
// // //                       fileOptions[file._id]?.quality,
// // //                       file.buildVolume,
// // //                       fileOptions[file._id]?.quantity,
// // //                       fileOptions[file._id]?.customPrice
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //           <button className="btn btn-primary" onClick={handleSubmitOrder}>
// // //             Save Order
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default OrderDetails;


// // // import React, { useEffect, useState } from 'react';
// // // import { useParams } from 'react-router-dom';
// // // import { io } from 'socket.io-client';

// // // const socket = io('https://test1.3ding.in/api');

// // // const OrderDetails = () => {
// // //   const { orderId } = useParams();
// // //   const [order, setOrder] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [optionsData, setOptionsData] = useState({
// // //     technologyOptions: {},
// // //     materialCosts: {},
// // //     densityCosts: {},
// // //     qualityCosts: {},
// // //   });
// // //   const [fileOptions, setFileOptions] = useState({});
// // //   const [customPrices, setCustomPrices] = useState({});
// // //   const [customShippingPrice, setCustomShippingPrice] = useState(0);


// // //   useEffect(() => {
// // //     fetchOrderDetails();
// // //     fetchOptionsData();

// // //     socket.on('orderUpdated', ({ orderId: updatedOrderId, updatedOrder }) => {
// // //       if (updatedOrderId === orderId) {
// // //         setOrder(updatedOrder);
// // //         initializeFileOptions(updatedOrder);
// // //       }
// // //     });

// // //     return () => {
// // //       socket.off('orderUpdated');
// // //     };
// // //   }, []);



// // //   const fetchOrderDetails = async () => {
// // //     try {
// // //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`);
// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }
// // //       const data = await response.json();
// // //       setOrder(data);
// // //       initializeFileOptions(data);
// // //     } catch (error) {
// // //       setError(error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchOptionsData = async () => {
// // //     try {
// // //       const response = await fetch('https://test1.3ding.in/api/options');
// // //       const data = await response.json();
// // //       setOptionsData(data);
// // //     } catch (error) {
// // //       console.error('Error fetching options data:', error);
// // //     }
// // //   };

// // //   const initializeFileOptions = (orderData) => {
// // //     const initialFileOptions = {};
// // //     const initialCustomPrices = {};

// // //     orderData.files.forEach((file) => {
// // //       initialFileOptions[file._id] = {
// // //         technology: file.options?.technology || 'FDM/FFF',
// // //         material: file.options?.material || 'PLA',
// // //         color: file.options?.color || '',
// // //         quality: file.options?.quality || 'Draft',
// // //         density: file.options?.density || '20%',
// // //         // quantity: file.options?.quantity || 1,
// // //         quantity: file.options?.quantity !== undefined ? file.options.quantity : 1,
// // //         customPrice: file.customPrice || 0,
// // //       };

// // //       initialCustomPrices[file._id] = file.customPrice || 0;
// // //     });

// // //     setFileOptions(initialFileOptions);
// // //     setCustomPrices(initialCustomPrices);
// // //   };

// // //   const updateAllItemTotals = () => {
// // //     setFileOptions((prevState) => {
// // //       const updatedFileOptions = { ...prevState };
// // //       order.files.forEach((file) => {
// // //         updatedFileOptions[file._id] = {
// // //           ...updatedFileOptions[file._id],
// // //           itemTotal: calculateItemTotal(
// // //             updatedFileOptions[file._id]?.material || 'PLA',
// // //             updatedFileOptions[file._id]?.density || '20%',
// // //             updatedFileOptions[file._id]?.quality || 'Draft',
// // //             file.buildVolume,
// // //             updatedFileOptions[file._id]?.quantity || 0,
// // //             customPrices[file._id] || 0
// // //           ),
// // //         };
// // //       });
// // //       return updatedFileOptions;
// // //     });
// // //   };

// // //   const handleOptionChange = (fileId, optionType, value) => {
// // //     setFileOptions((prevState) => {
// // //       const updatedOptions = { ...prevState[fileId], [optionType]: value };

// // //       if (optionType === 'technology') {
// // //         const newTechnologyOptions = optionsData.technologyOptions[value];
// // //         updatedOptions.material = newTechnologyOptions.material[0] || '';
// // //         updatedOptions.color = newTechnologyOptions.color[0] || '';
// // //         updatedOptions.quality = newTechnologyOptions.quality[0] || '';
// // //         updatedOptions.density = newTechnologyOptions.density[0] || '';
// // //       }

// // //       return { ...prevState, [fileId]: updatedOptions };
// // //     });
// // //     updateAllItemTotals(); // Recalculate all item totals
// // //   };

// // //   const handleCustomPriceChange = (fileId, value) => {
// // //     setCustomPrices((prevState) => ({
// // //       ...prevState,
// // //       [fileId]: parseFloat(value) || 0, // Ensure custom price is parsed as float
// // //     }));
// // //     updateAllItemTotals(); // Recalculate all item totals

// // //     // Update itemTotal when custom price changes
// // //     setFileOptions((prevState) => ({
// // //       ...prevState,
// // //       [fileId]: {
// // //         ...prevState[fileId],
// // //         customPrice: parseFloat(value) || 0,
// // //         itemTotal: calculateItemTotal(
// // //           prevState[fileId]?.material || 'PLA',
// // //           prevState[fileId]?.density || '20%',
// // //           prevState[fileId]?.quality || 'Draft',
// // //           order.files.find((file) => file._id === fileId).buildVolume,
// // //           prevState[fileId]?.quantity || 1,
// // //           parseFloat(value) || 0 // Pass new custom price to calculateItemTotal
// // //         ),
// // //       },
// // //     }));
// // //   };


// // //   const handleSubmitOrder = async () => {
// // //     try {
// // //       const updatedFiles = order.files.map((file) => ({
// // //         ...file,
// // //         options: fileOptions[file._id],
// // //         // itemTotal: fileOptions[file._id]?.itemTotal || 0,
// // //         customPrice: customPrices[file._id], // Ensure custom price is sent to the server
// // //         price: calculatePrice(
// // //           fileOptions[file._id]?.material || 'PLA',
// // //           fileOptions[file._id]?.density || '20%',
// // //           fileOptions[file._id]?.quality || 'Draft',
// // //           file.buildVolume
// // //         ),
// // //         itemTotal: calculateItemTotal(
// // //           fileOptions[file._id]?.material,
// // //           fileOptions[file._id]?.density,
// // //           fileOptions[file._id]?.quality,
// // //           file.buildVolume,
// // //           fileOptions[file._id]?.quantity,
// // //           fileOptions[file._id]?.customPrice
// // //         )
// // //       }));

// // //       const updatedOrder = {
// // //         ...order,
// // //         files: updatedFiles,
// // //         subtotal,      
// // //         gst,    
// // //         // shippingCharges,   // Add shipping charges
// // //         shippingCharges: customShippingPrice || shippingCharges, 
// // //         total,           
// // //       };

// // //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(updatedOrder),
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         console.log('Order updated successfully');
// // //         setOrder(data); // Update the order in the state with the response data
// // //       } else {
// // //         console.error('Error updating order');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error updating order:', error);
// // //     }
// // //   };


// // //   const calculatePrice = (material, density, quality, buildVolume) => {
// // //     const materialCost = optionsData.materialCosts[material] || 0;
// // //     const densityCost = optionsData.densityCosts[density] || 0;
// // //     const qualityCost = optionsData.qualityCosts[quality] || 0;
// // //     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// // //     return Math.round(totalPrice);
// // //   };

// // //   const calculateItemTotal = (
// // //     material,
// // //     density,
// // //     quality,
// // //     buildVolume,
// // //     quantity,
// // //     customPrice = 0
// // //   ) => {
// // //     const materialCost = optionsData.materialCosts[material] || 0;
// // //     const densityCost = optionsData.densityCosts[density] || 0;
// // //     const qualityCost = optionsData.qualityCosts[quality] || 0;

// // //     if (customPrice !== 0) {
// // //       return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
// // //     } else {
// // //       const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// // //       return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
// // //     }
// // //   };


// // //   const calculateSubtotal = () => {
// // //     return order.files.reduce((acc, file) => {
// // //       const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
// // //       const fileTotal =
// // //         quantity > 0
// // //           ? calculateItemTotal(
// // //             fileOptions[file._id]?.material || 'PLA',
// // //             fileOptions[file._id]?.density || '20%',
// // //             fileOptions[file._id]?.quality || 'Draft',
// // //             file.buildVolume,
// // //             quantity,
// // //             customPrices[file._id] || 0
// // //           )
// // //           : 0; // Skip adding to subtotal if quantity is 0
// // //       return acc + fileTotal;
// // //     }, 0);
// // //   };

// // //   const calculateGST = (subtotal) => {
// // //     return Math.round(subtotal * 0.18);
// // //   };

// // //   // const calculateTotal = (subtotal, gst, shippingCharges) => {
// // //   //   return subtotal + gst + shippingCharges;
// // //   // };

// // //   const calculateTotal = (subtotal, gst, shippingCharges) => {
// // //     const effectiveShippingCharges = customShippingPrice !== 0 ? customShippingPrice : shippingCharges;
// // //     return subtotal + gst + effectiveShippingCharges;
// // //   };


// // //   if (loading) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   if (error) {
// // //     return <div>Error: {error}</div>;
// // //   }

// // //   if (!order) {
// // //     return <div>No order found</div>;
// // //   }

// // //   const subtotal = calculateSubtotal();
// // //   const gst = calculateGST(subtotal);
// // //   const shippingCharges = order.shippingCharges || 0;
// // //   const total = calculateTotal(subtotal, gst, shippingCharges);
// // //   const price = calculatePrice();

// // //   return (
// // //     <div className="container mt-5">
// // //       <div className="card">
// // //         <div className="card-header">
// // //           <h3>
// // //             Order Details <small className="text-muted">Order ID: {order.orderId}</small>
// // //           </h3>
// // //           <p> <span className='mx-5'>subtotal:{subtotal}</span><span className='mx-5'>Total:{total}</span>
// // //             <span className='mx-5'>GST:{gst}</span> <span className='mx-5'>S.Chrg:{shippingCharges}</span></p>
// // //         </div>
// // //         <div className="mb-3 m-5 col-md-2">
// // //           <label htmlFor="customShippingPrice" className="fw-bold form-label">Custom Shipping Price</label>
// // //           <input
// // //             type="number"
// // //             id="customShippingPrice"
// // //             className="form-control"
// // //             value={customShippingPrice}
// // //             onChange={(e) => setCustomShippingPrice(parseFloat(e.target.value) || 0)}
// // //           />
// // //         </div>
// // //         <div className="card-body">
// // //           <table className="table table-striped">
// // //             <thead>
// // //               <tr>
// // //                 <th className='col-md-1'>Serial No.</th>
// // //                 <th className='col-md-1'>File Name</th>
// // //                 <th className='col-md-1'>Technology</th>
// // //                 <th className='col-md-1'>Material</th>
// // //                 <th className='col-md-1'>Color</th>
// // //                 <th className='col-md-1'>Quality</th>
// // //                 <th className='col-md-1'>Density</th>
// // //                 <th className='col-md-1'>Quantity</th>
// // //                 <th className='col-md-1'>Volume</th>
// // //                 <th className='col-md-1'>Price</th>
// // //                 <th className='col-md-1'>Custom Price</th>
// // //                 <th className='col-md-1'>Total</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {order.files.map((file, index) => (
// // //                 <tr key={file._id}>
// // //                   <td>{index + 1}</td>
// // //                   <td>{file.originalName}
// // //                     <br />
// // //                     {file.dimensions
// // //                       ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
// // //                       : '-'}</td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.technology || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'technology', e.target.value)
// // //                       }
// // //                     >
// // //                       {Object.keys(optionsData.technologyOptions).map((technology) => (
// // //                         <option key={technology} value={technology}>
// // //                           {technology}
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.material || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'material', e.target.value)
// // //                       }
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(
// // //                         (material) => (
// // //                           <option key={material} value={material}>
// // //                             {material}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.color || ''}
// // //                       onChange={(e) =>
// // //                         handleOptionChange(file._id, 'color', e.target.value)
// // //                       }
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(
// // //                         (color) => (
// // //                           <option key={color} value={color}>
// // //                             {color}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.quality || ''}
// // //                       onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(
// // //                         (quality) => (
// // //                           <option key={quality} value={quality}>
// // //                             {quality}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <select
// // //                       className="form-select"
// // //                       value={fileOptions[file._id]?.density || ''}
// // //                       onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
// // //                     >
// // //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(
// // //                         (density) => (
// // //                           <option key={density} value={density}>
// // //                             {density}
// // //                           </option>
// // //                         )
// // //                       )}
// // //                     </select>
// // //                   </td>
// // //                   <td>
// // //                     <input
// // //                       type="number"
// // //                       className="form-control"
// // //                       value={fileOptions[file._id]?.quantity || 0}
// // //                       onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
// // //                       min="0"
// // //                     />
// // //                   </td>
// // //                   <td> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td>
// // //                   <td>
// // //                     {calculatePrice(
// // //                       fileOptions[file._id]?.material,
// // //                       fileOptions[file._id]?.density,
// // //                       fileOptions[file._id]?.quality,
// // //                       file.buildVolume
// // //                     )}
// // //                   </td>
// // //                   <td>
// // //                     <input
// // //                       type="number"
// // //                       className="form-control"
// // //                       value={fileOptions[file._id]?.customPrice || 0}
// // //                       onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
// // //                       min="0"
// // //                     />
// // //                   </td>
// // //                   <td>
// // //                     {calculateItemTotal(
// // //                       fileOptions[file._id]?.material,
// // //                       fileOptions[file._id]?.density,
// // //                       fileOptions[file._id]?.quality,
// // //                       file.buildVolume,
// // //                       fileOptions[file._id]?.quantity,
// // //                       fileOptions[file._id]?.customPrice
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //           <button className="btn btn-primary" onClick={handleSubmitOrder}>
// // //             Save Order
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default OrderDetails;


// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { io } from 'socket.io-client';

// // const socket = io('https://test1.3ding.in/api');

// // const OrderDetails = () => {
// //   const { orderId } = useParams();
// //   const [order, setOrder] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [optionsData, setOptionsData] = useState({
// //     technologyOptions: {},
// //     materialCosts: {},
// //     densityCosts: {},
// //     qualityCosts: {},
// //   });
// //   const [fileOptions, setFileOptions] = useState({});
// //   const [customPrices, setCustomPrices] = useState({});
// //   const [customShippingPrice, setCustomShippingPrice] = useState(0);


// //   useEffect(() => {
// //     fetchOrderDetails();
// //     fetchOptionsData();

// //     socket.on('orderUpdated', ({ orderId: updatedOrderId, updatedOrder }) => {
// //       if (updatedOrderId === orderId) {
// //         setOrder(updatedOrder);
// //         initializeFileOptions(updatedOrder);
// //       }
// //     });

// //     return () => {
// //       socket.off('orderUpdated');
// //     };
// //   }, []);



// //   const fetchOrderDetails = async () => {
// //     try {
// //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`);
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const data = await response.json();
// //       setOrder(data);
// //       initializeFileOptions(data);
// //     } catch (error) {
// //       setError(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchOptionsData = async () => {
// //     try {
// //       const response = await fetch('https://test1.3ding.in/api/options');
// //       const data = await response.json();
// //       setOptionsData(data);
// //     } catch (error) {
// //       console.error('Error fetching options data:', error);
// //     }
// //   };

// //   const initializeFileOptions = (orderData) => {
// //     const initialFileOptions = {};
// //     const initialCustomPrices = {};

// //     orderData.files.forEach((file) => {
// //       initialFileOptions[file._id] = {
// //         technology: file.options?.technology || 'FDM/FFF',
// //         material: file.options?.material || 'PLA',
// //         color: file.options?.color || '',
// //         quality: file.options?.quality || 'Draft',
// //         density: file.options?.density || '20%',
// //         // quantity: file.options?.quantity || 1,
// //         quantity: file.options?.quantity !== undefined ? file.options.quantity : 1,
// //         customPrice: file.customPrice || 0,
// //       };

// //       initialCustomPrices[file._id] = file.customPrice || 0;
// //     });

// //     setFileOptions(initialFileOptions);
// //     setCustomPrices(initialCustomPrices);
// //   };

// //   const updateAllItemTotals = () => {
// //     setFileOptions((prevState) => {
// //       const updatedFileOptions = { ...prevState };
// //       order.files.forEach((file) => {
// //         updatedFileOptions[file._id] = {
// //           ...updatedFileOptions[file._id],
// //           itemTotal: calculateItemTotal(
// //             updatedFileOptions[file._id]?.material || 'PLA',
// //             updatedFileOptions[file._id]?.density || '20%',
// //             updatedFileOptions[file._id]?.quality || 'Draft',
// //             file.buildVolume,
// //             updatedFileOptions[file._id]?.quantity || 0,
// //             customPrices[file._id] || 0
// //           ),
// //         };
// //       });
// //       return updatedFileOptions;
// //     });
// //   };

// //   const handleOptionChange = (fileId, optionType, value) => {
// //     setFileOptions((prevState) => {
// //       const updatedOptions = { ...prevState[fileId], [optionType]: value };

// //       if (optionType === 'technology') {
// //         const newTechnologyOptions = optionsData.technologyOptions[value];
// //         updatedOptions.material = newTechnologyOptions.material[0] || '';
// //         updatedOptions.color = newTechnologyOptions.color[0] || '';
// //         updatedOptions.quality = newTechnologyOptions.quality[0] || '';
// //         updatedOptions.density = newTechnologyOptions.density[0] || '';
// //       }

// //       return { ...prevState, [fileId]: updatedOptions };
// //     });
// //     updateAllItemTotals(); // Recalculate all item totals
// //   };

// //   const handleCustomPriceChange = (fileId, value) => {
// //     setCustomPrices((prevState) => ({
// //       ...prevState,
// //       [fileId]: parseFloat(value) || 0, // Ensure custom price is parsed as float
// //     }));
// //     updateAllItemTotals(); // Recalculate all item totals

// //     // Update itemTotal when custom price changes
// //     setFileOptions((prevState) => ({
// //       ...prevState,
// //       [fileId]: {
// //         ...prevState[fileId],
// //         customPrice: parseFloat(value) || 0,
// //         itemTotal: calculateItemTotal(
// //           prevState[fileId]?.material || 'PLA',
// //           prevState[fileId]?.density || '20%',
// //           prevState[fileId]?.quality || 'Draft',
// //           order.files.find((file) => file._id === fileId).buildVolume,
// //           prevState[fileId]?.quantity || 1,
// //           parseFloat(value) || 0 // Pass new custom price to calculateItemTotal
// //         ),
// //       },
// //     }));
// //   };


// //   const handleSubmitOrder = async () => {
// //     try {
// //       const updatedFiles = order.files.map((file) => ({
// //         ...file,
// //         options: fileOptions[file._id],
// //         // itemTotal: fileOptions[file._id]?.itemTotal || 0,
// //         customPrice: customPrices[file._id], // Ensure custom price is sent to the server
// //         price: calculatePrice(
// //           fileOptions[file._id]?.material || 'PLA',
// //           fileOptions[file._id]?.density || '20%',
// //           fileOptions[file._id]?.quality || 'Draft',
// //           file.buildVolume
// //         ),
// //         itemTotal: calculateItemTotal(
// //           fileOptions[file._id]?.material,
// //           fileOptions[file._id]?.density,
// //           fileOptions[file._id]?.quality,
// //           file.buildVolume,
// //           fileOptions[file._id]?.quantity,
// //           fileOptions[file._id]?.customPrice
// //         )
// //       }));

// //       const updatedOrder = {
// //         ...order,
// //         files: updatedFiles,
// //         subtotal,
// //         gst,
// //         // shippingCharges,   // Add shipping charges
// //         shippingCharges: customShippingPrice || shippingCharges,
// //         total,
// //       };

// //       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(updatedOrder),
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         console.log('Order updated successfully');
// //         setOrder(data); // Update the order in the state with the response data
// //       } else {
// //         console.error('Error updating order');
// //       }
// //     } catch (error) {
// //       console.error('Error updating order:', error);
// //     }
// //   };


// //   const calculatePrice = (material, density, quality, buildVolume) => {
// //     const materialCost = optionsData.materialCosts[material] || 0;
// //     const densityCost = optionsData.densityCosts[density] || 0;
// //     const qualityCost = optionsData.qualityCosts[quality] || 0;
// //     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// //     return Math.round(totalPrice);
// //   };

// //   const calculateItemTotal = (
// //     material,
// //     density,
// //     quality,
// //     buildVolume,
// //     quantity,
// //     customPrice = 0
// //   ) => {
// //     const materialCost = optionsData.materialCosts[material] || 0;
// //     const densityCost = optionsData.densityCosts[density] || 0;
// //     const qualityCost = optionsData.qualityCosts[quality] || 0;

// //     if (customPrice !== 0) {
// //       return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
// //     } else {
// //       const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// //       return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
// //     }
// //   };


// //   const calculateSubtotal = () => {
// //     return order.files.reduce((acc, file) => {
// //       const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
// //       const fileTotal =
// //         quantity > 0
// //           ? calculateItemTotal(
// //             fileOptions[file._id]?.material || 'PLA',
// //             fileOptions[file._id]?.density || '20%',
// //             fileOptions[file._id]?.quality || 'Draft',
// //             file.buildVolume,
// //             quantity,
// //             customPrices[file._id] || 0
// //           )
// //           : 0; // Skip adding to subtotal if quantity is 0
// //       return acc + fileTotal;
// //     }, 0);
// //   };

// //   const calculateGST = (subtotal) => {
// //     return Math.round(subtotal * 0.18);
// //   };

// //   // const calculateTotal = (subtotal, gst, shippingCharges) => {
// //   //   return subtotal + gst + shippingCharges;
// //   // };

// //   const calculateTotal = (subtotal, gst, shippingCharges) => {
// //     const effectiveShippingCharges = customShippingPrice !== 0 ? customShippingPrice : shippingCharges;
// //     return subtotal + gst + effectiveShippingCharges;
// //   };


// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (error) {
// //     return <div>Error: {error}</div>;
// //   }

// //   if (!order) {
// //     return <div>No order found</div>;
// //   }

// //   const subtotal = calculateSubtotal();
// //   const gst = calculateGST(subtotal);
// //   const shippingCharges = order.shippingCharges || 0;
// //   const total = calculateTotal(subtotal, gst, shippingCharges);
// //   const price = calculatePrice();

// //   // const handleDownload = async (id, originalName) => {
// //   //   try {
// //   //     const response = await fetch(`https://test1.3ding.in/api/download/${id}`);
// //   //     const blob = await response.blob();

// //   //     const filenameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
// //   //     const extension = originalName.split('.').pop(); // Extract file extension
// //   //     const filename = `${filenameWithoutExtension}.${extension}`;

// //   //     const url = window.URL.createObjectURL(new Blob([blob]));
// //   //     const link = document.createElement('a');
// //   //     link.href = url;
// //   //     link.setAttribute('download', filename); // Set download filename
// //   //     document.body.appendChild(link);
// //   //     link.click();
// //   //     document.body.removeChild(link);
// //   //   } catch (error) {
// //   //     console.error('Error downloading file:', error);
// //   //   }
// //   // };

// //   const handleDownload = async (id) => {
// //     try {
// //       // Fetch the download URL from the backend
// //       const response = await fetch(`https://test1.3ding.in/api/download/${id}`);
// //       if (!response.ok) {
// //         throw new Error("Failed to fetch download link");
// //       }

// //       // Redirect user to S3 file URL
// //       window.location.href = response.url;
// //     } catch (error) {
// //       console.error('Error downloading file:', error);
// //     }
// //   };

// //   const handleDownloadAll = async (orderId) => {
// //     try {
// //       console.log("Downloading ZIP for order:", orderId);
// //       const response = await fetch(`https://test1.3ding.in/api/download/order/${orderId}`);

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch ZIP file");
// //       }

// //       // Convert response to a downloadable file
// //       const blob = await response.blob();
// //       const link = document.createElement("a");
// //       link.href = window.URL.createObjectURL(blob);
// //       link.download = `${orderId}.zip`;
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //     } catch (error) {
// //       console.error("Error downloading ZIP:", error);
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <div className="card">
// //         <div className="card-header">
// //           <h3>
// //             Order Details <small className="text-muted">Order ID: {order.orderId}</small>
// //           </h3>
// //           <p> <span className='mx-5'>subtotal:{subtotal}</span><span className='mx-5'>Total:{total}</span>
// //             <span className='mx-5'>GST:{gst}</span> <span className='mx-5'>S.Chrg:{shippingCharges}</span>
// //             <button className="btn btn-primary mx-5" onClick={() => handleDownloadAll(orderId)}>Download All Files</button>
// //           </p>
// //         </div>
// //         <div className="mb-3 m-5 col-md-2">
// //           <label htmlFor="customShippingPrice" className="fw-bold form-label">Custom Shipping Price</label>
// //           <input
// //             type="number"
// //             id="customShippingPrice"
// //             className="form-control"
// //             value={customShippingPrice}
// //             onChange={(e) => setCustomShippingPrice(parseFloat(e.target.value) || 0)}
// //           />
// //         </div>
// //         <div className="card-body">
// //           <table className="table table-striped">
// //             <thead>
// //               <tr>
// //                 <th className='col-md-1'>Serial No.</th>
// //                 <th className='col-md-1'>File Name</th>
// //                 <th className='col-md-1'>Technology</th>
// //                 <th className='col-md-1'>Material</th>
// //                 <th className='col-md-1'>Color</th>
// //                 <th className='col-md-1'>Quality</th>
// //                 <th className='col-md-1'>Density</th>
// //                 <th className='col-md-1'>Quantity</th>
// //                 <th className='col-md-1'>Volume</th>
// //                 <th className='col-md-1'>Price</th>
// //                 <th className='col-md-1'>Custom Price</th>
// //                 <th className='col-md-1'>Total</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {order.files.map((file, index) => (
// //                 <tr key={file._id}>
// //                   <td>{index + 1}</td>
// //                   {/* <td>{file.originalName}
// //                     <br />
// //                     {file.dimensions
// //                       ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
// //                       : '-'}<br />
// //                     <button onClick={() => handleDownload(file._id)}>Download</button>
// //                   </td> */}
// //                   <td>
// //                     <a className='border border-bottom pointer' onClick={() => handleDownload(file._id)}>
// //                       {file.originalName}
// //                       <br />
// //                       {file.dimensions
// //                         ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
// //                         : '-'}<br />
// //                       {/* <button onClick={() => handleDownload(file._id)}>Download</button> */}
// //                       {/* <button onClick={() => handleDownload(file._id, file.originalName)}>Download</button> */}
// //                     </a>
// //                   </td>
// //                   <td>
// //                     <select
// //                       className="form-select"
// //                       value={fileOptions[file._id]?.technology || ''}
// //                       onChange={(e) =>
// //                         handleOptionChange(file._id, 'technology', e.target.value)
// //                       }
// //                     >
// //                       {Object.keys(optionsData.technologyOptions).map((technology) => (
// //                         <option key={technology} value={technology}>
// //                           {technology}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <select
// //                       className="form-select"
// //                       value={fileOptions[file._id]?.material || ''}
// //                       onChange={(e) =>
// //                         handleOptionChange(file._id, 'material', e.target.value)
// //                       }
// //                     >
// //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(
// //                         (material) => (
// //                           <option key={material} value={material}>
// //                             {material}
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <select
// //                       className="form-select"
// //                       value={fileOptions[file._id]?.color || ''}
// //                       onChange={(e) =>
// //                         handleOptionChange(file._id, 'color', e.target.value)
// //                       }
// //                     >
// //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(
// //                         (color) => (
// //                           <option key={color} value={color}>
// //                             {color}
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <select
// //                       className="form-select"
// //                       value={fileOptions[file._id]?.quality || ''}
// //                       onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
// //                     >
// //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(
// //                         (quality) => (
// //                           <option key={quality} value={quality}>
// //                             {quality}
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <select
// //                       className="form-select"
// //                       value={fileOptions[file._id]?.density || ''}
// //                       onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
// //                     >
// //                       {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(
// //                         (density) => (
// //                           <option key={density} value={density}>
// //                             {density}
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                   </td>
// //                   <td>
// //                     <input
// //                       type="number"
// //                       className="form-control"
// //                       value={fileOptions[file._id]?.quantity || 0}
// //                       onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
// //                       min="0"
// //                     />
// //                   </td>
// //                   <td> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td>
// //                   <td>
// //                     {calculatePrice(
// //                       fileOptions[file._id]?.material,
// //                       fileOptions[file._id]?.density,
// //                       fileOptions[file._id]?.quality,
// //                       file.buildVolume
// //                     )}
// //                   </td>
// //                   <td>
// //                     <input
// //                       type="number"
// //                       className="form-control"
// //                       value={fileOptions[file._id]?.customPrice || 0}
// //                       onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
// //                       min="0"
// //                     />
// //                   </td>
// //                   <td>
// //                     {calculateItemTotal(
// //                       fileOptions[file._id]?.material,
// //                       fileOptions[file._id]?.density,
// //                       fileOptions[file._id]?.quality,
// //                       file.buildVolume,
// //                       fileOptions[file._id]?.quantity,
// //                       fileOptions[file._id]?.customPrice
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //           <div className='row'>
// //             <div className='col-md-2 text-start'>
// //               <button className="btn btn-primary" onClick={handleSubmitOrder}>
// //                 Save Order
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderDetails;
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('https://test1.3ding.in/api');

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
//   const [customShippingPrice, setCustomShippingPrice] = useState(0);

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
//   }, []);

//   const fetchOrderDetails = async () => {
//     try {
//       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`);
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
//       const response = await fetch('https://test1.3ding.in/api/options');
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
//         quantity: file.options?.quantity !== undefined ? file.options.quantity : 1,
//         customPrice: file.customPrice || 0,
//       };

//       initialCustomPrices[file._id] = file.customPrice || 0;
//     });

//     setFileOptions(initialFileOptions);
//     setCustomPrices(initialCustomPrices);
//   };

//   const updateAllItemTotals = () => {
//     setFileOptions((prevState) => {
//       const updatedFileOptions = { ...prevState };
//       order.files.forEach((file) => {
//         updatedFileOptions[file._id] = {
//           ...updatedFileOptions[file._id],
//           itemTotal: calculateItemTotal(
//             updatedFileOptions[file._id]?.material || 'PLA',
//             updatedFileOptions[file._id]?.density || '20%',
//             updatedFileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             updatedFileOptions[file._id]?.quantity || 0,
//             customPrices[file._id] || 0
//           ),
//         };
//       });
//       return updatedFileOptions;
//     });
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

//       return { ...prevState, [fileId]: updatedOptions };
//     });
//     updateAllItemTotals(); // Recalculate all item totals
//   };

//   const handleCustomPriceChange = (fileId, value) => {
//     setCustomPrices((prevState) => ({
//       ...prevState,
//       [fileId]: parseFloat(value) || 0, // Ensure custom price is parsed as float
//     }));
//     updateAllItemTotals(); // Recalculate all item totals

//     // Update itemTotal when custom price changes
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
//           parseFloat(value) || 0 // Pass new custom price to calculateItemTotal
//         ),
//       },
//     }));
//   };

//   const handleSubmitOrder = async () => {
//     try {
//       const updatedFiles = order.files.map((file) => ({
//         ...file,
//         options: fileOptions[file._id],
//         customPrice: customPrices[file._id], // Ensure custom price is sent to the server
//         price: calculatePrice(
//           fileOptions[file._id]?.material || 'PLA',
//           fileOptions[file._id]?.density || '20%',
//           fileOptions[file._id]?.quality || 'Draft',
//           file.buildVolume
//         ),
//         itemTotal: calculateItemTotal(
//           fileOptions[file._id]?.material,
//           fileOptions[file._id]?.density,
//           fileOptions[file._id]?.quality,
//           file.buildVolume,
//           fileOptions[file._id]?.quantity,
//           fileOptions[file._id]?.customPrice
//         )
//       }));

//       const updatedOrder = {
//         ...order,
//         files: updatedFiles,
//         subtotal,
//         gst,
//         shippingCharges: customShippingPrice || shippingCharges,
//         total,
//       };

//       const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedOrder),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Order updated successfully');
//         setOrder(data); // Update the order in the state with the response data
//       } else {
//         console.error('Error updating order');
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
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

//     if (customPrice !== 0) {
//       return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
//     } else {
//       const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//       return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
//     }
//   };

//   const calculateSubtotal = () => {
//     return order.files.reduce((acc, file) => {
//       const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
//       const fileTotal =
//         quantity > 0
//           ? calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             quantity,
//             customPrices[file._id] || 0
//           )
//           : 0; // Skip adding to subtotal if quantity is 0
//       return acc + fileTotal;
//     }, 0);
//   };

//   const calculateGST = (subtotal) => {
//     return Math.round(subtotal * 0.18);
//   };

//   const calculateTotal = (subtotal, gst, shippingCharges) => {
//     const effectiveShippingCharges = customShippingPrice !== 0 ? customShippingPrice : shippingCharges;
//     return subtotal + gst + effectiveShippingCharges;
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

//   const handleDownloadAll = async (orderId) => {
//     try {
//       const url = `https://test1.3ding.in/api/download/order/${orderId}`;
//       window.location.href = url;
//     } catch (error) {
//       console.error('Error downloading ZIP file:', error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card">
//         <div className="card-header">
//           <h3>
//             Order Details <small className="text-muted">Order ID: {order.orderId}</small>
//           </h3>
//           <p> <span className='mx-5'>subtotal:{subtotal}</span><span className='mx-5'>Total:{total}</span>
//             <span className='mx-5'>GST:{gst}</span> <span className='mx-5'>S.Chrg:{shippingCharges}</span>
//             <button className="btn btn-primary mx-5" onClick={() => handleDownloadAll(orderId)}>Download All Files</button>
//           </p>
//         </div>
//         <div className="mb-3 m-5 col-md-2">
//           <label htmlFor="customShippingPrice" className="fw-bold form-label">Custom Shipping Price</label>
//           <input
//             type="number"
//             id="customShippingPrice"
//             className="form-control"
//             value={customShippingPrice}
//             onChange={(e) => setCustomShippingPrice(parseFloat(e.target.value) || 0)}
//           />
//         </div>
//         <div className="card-body">
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th className='col-md-1'>Serial No.</th>
//                 <th className='col-md-1'>File Name</th>
//                 <th className='col-md-1'>Technology</th>
//                 <th className='col-md-1'>Material</th>
//                 <th className='col-md-1'>Color</th>
//                 <th className='col-md-1'>Quality</th>
//                 <th className='col-md-1'>Density</th>
//                 <th className='col-md-1'>Quantity</th>
//                 <th className='col-md-1'>Volume</th>
//                 <th className='col-md-1'>Price</th>
//                 <th className='col-md-1'>Custom Price</th>
//                 <th className='col-md-1'>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.files.map((file, index) => (
//                 <tr key={file._id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <a className='border border-bottom pointer' onClick={() => handleDownload(file._id)}>
//                       {file.originalName}
//                       <br />
//                       {file.dimensions
//                         ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
//                         : '-'}<br />
//                     </a>
//                   </td>
//                   <td>
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.technology || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'technology', e.target.value)
//                       }
//                     >
//                       {Object.keys(optionsData.technologyOptions).map((technology) => (
//                         <option key={technology} value={technology}>
//                           {technology}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.material || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'material', e.target.value)
//                       }
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
//                   <td>
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.color || ''}
//                       onChange={(e) =>
//                         handleOptionChange(file._id, 'color', e.target.value)
//                       }
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
//                   <td>
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.quality || ''}
//                       onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
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
//                   <td>
//                     <select
//                       className="form-select"
//                       value={fileOptions[file._id]?.density || ''}
//                       onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
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
//                   <td>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={fileOptions[file._id]?.quantity || 0}
//                       onChange={(e) => handleOptionChange(file._id, 'quantity', parseInt(e.target.value, 10) || 0)}
//                       min="0"
//                     />
//                   </td>
//                   <td> {file.buildVolume ? `${Math.round(file.buildVolume)} cm³` : '-'}</td>
//                   <td>
//                     {calculatePrice(
//                       fileOptions[file._id]?.material,
//                       fileOptions[file._id]?.density,
//                       fileOptions[file._id]?.quality,
//                       file.buildVolume
//                     )}
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={fileOptions[file._id]?.customPrice || 0}
//                       onChange={(e) => handleCustomPriceChange(file._id, e.target.value)}
//                       min="0"
//                     />
//                   </td>
//                   <td>
//                     {calculateItemTotal(
//                       fileOptions[file._id]?.material,
//                       fileOptions[file._id]?.density,
//                       fileOptions[file._id]?.quality,
//                       file.buildVolume,
//                       fileOptions[file._id]?.quantity,
//                       fileOptions[file._id]?.customPrice
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className='row'>
//             <div className='col-md-2 text-start'>
//               <button className="btn btn-primary" onClick={handleSubmitOrder}>
//                 Save Order
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://test1.3ding.in/api');

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
  const [customLeadTime, setCustomLeadTime] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert

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
      const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`);
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

  // const fetchOptionsData = async () => {
  //   try {
  //     const response = await fetch('https://test1.3ding.in/api/options');
  //     const data = await response.json();
  //     setOptionsData(data);
  //   } catch (error) {
  //     console.error('Error fetching options data:', error);
  //   }
  // };

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

  // const handleOptionChange = (fileId, optionType, value) => {
  //   setFileOptions((prevState) => {
  //     const updatedOptions = { ...prevState[fileId], [optionType]: value };

  //     if (optionType === 'technology') {
  //       const newTechnologyOptions = optionsData.technologyOptions[value];
  //       updatedOptions.material = newTechnologyOptions.material[0] || '';
  //       updatedOptions.color = newTechnologyOptions.color[0] || '';
  //       updatedOptions.quality = newTechnologyOptions.quality[0] || '';
  //       updatedOptions.density = newTechnologyOptions.density[0] || '';
  //     }

  //     return { ...prevState, [fileId]: updatedOptions };
  //   });
  //   updateAllItemTotals(); // Recalculate all item totals
  // };

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

      return { ...prevState, [fileId]: updatedOptions };
    });
    updateAllItemTotals(); // Recalculate all item totals
  };

  const renderOptions = (options) => {
    return options
      .filter((option) => option.enabled) // Only include enabled options
      .map((option) => (
        <option key={option.name} value={option.name}>
          {option.name}
        </option>
      ));
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
        shippingCharges: customShippingPrice || shippingCharges,
        total,
        leadTime: customLeadTime || leadTime, // Use customLeadTime if not 0
      };

      const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}`, {
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
        setShowSuccessAlert(true); // Show success alert
        setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // const calculatePrice = (material, density, quality, buildVolume) => {
  //   const materialCost = optionsData.materialCosts[material] || 0;
  //   const densityCost = optionsData.densityCosts[density] || 0;
  //   const qualityCost = optionsData.qualityCosts[quality] || 0;
  //   const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
  //   return Math.round(totalPrice);
  // };

  const calculatePrice = (material, density, quality, buildVolume) => {
    console.log('Calculating price with:', { material, density, quality, buildVolume });

    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;

    const totalPrice = (materialCost + densityCost + qualityCost) * (buildVolume || 0);
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

  //   if (customPrice !== 0) {
  //     return Math.round(customPrice * (quantity || 0)); // Use 0 if quantity is 0
  //   } else {
  //     const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
  //     return Math.round(totalPrice * (quantity || 0)); // Use 0 if quantity is 0
  //   }
  // };

  const calculateItemTotal = (material, density, quality, buildVolume, quantity, customPrice = 0) => {
    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;

    if (customPrice !== 0) {
      return Math.round(customPrice * (quantity || 0)); // Use custom price if provided
    } else {
      const totalPrice = (materialCost + densityCost + qualityCost) * (buildVolume || 0);
      return Math.round(totalPrice * (quantity || 0)); // Use calculated price otherwise
    }
  };

  // const calculateSubtotal = () => {
  //   return order.files.reduce((acc, file) => {
  //     const quantity = fileOptions[file._id]?.quantity ?? 1; // Use 0 if explicitly set
  //     const fileTotal =
  //       quantity > 0
  //         ? calculateItemTotal(
  //           fileOptions[file._id]?.material || 'PLA',
  //           fileOptions[file._id]?.density || '20%',
  //           fileOptions[file._id]?.quality || 'Draft',
  //           file.buildVolume,
  //           quantity,
  //           customPrices[file._id] || 0
  //         )
  //         : 0; // Skip adding to subtotal if quantity is 0
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
  const leadTime = order.leadTime || 0;


  // const handleDeleteFile = async (orderId, fileId, fileName) => {
  //   try {
  //     const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}/files/${fileId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ fileName }), // Send the file name to delete from S3
  //     });

  //     if (response.ok) {
  //       console.log('File deleted successfully');
  //       // Refresh the order details after deletion
  //       fetchOrderDetails();
  //     } else {
  //       console.error('Error deleting file');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting file:', error);
  //   }
  // };

  const handleDeleteFile = async (orderId, fileId, fileName) => {
    try {
      const response = await fetch(`https://test1.3ding.in/api/orders/${orderId}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }), // Send the file name to delete from S3
      });

      if (response.ok) {
        console.log('File deleted successfully');
        fetchOrderDetails(); // Refresh the order details
      } else {
        console.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = async (orderId, fileName) => {
    try {
      console.log(`Downloading file: ${fileName} from order: ${orderId}`); // Log the fileName and orderId
      const response = await fetch(`https://test1.3ding.in/api/download/order/${orderId}/${fileName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch download link");
      }
      window.location.href = response.url;
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadAll = async (orderId) => {
    try {
      console.log("Downloading ZIP for order:", orderId);
      const response = await fetch(`https://test1.3ding.in/api/download/order/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch ZIP file");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${orderId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading ZIP:", error);
    }
  };



  return (
    <div className="container">
      <h2 className="text-center">Order Details</h2>
      {showSuccessAlert && (
        <div className="alert alert-success text-center" role="alert">
          Order updated successfully!
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <h3>
            <small className="text-muted">Order ID: {order.orderId}</small>
          </h3>
          <p>
            <span className=''><strong>Subtotal:</strong> {subtotal}</span>
            <span className='mx-4'><strong>Total:</strong> {total}</span>
            <span className='mx-4'><strong>GST:</strong> {gst}</span>
            <span className='mx-4'><strong>Lead Time:</strong> {`${leadTime} Days`}</span>
            <span className='mx-4'><strong>Shipping Charges:</strong> {shippingCharges}</span>
            <button className="btn btn-primary mx-4" onClick={() => handleDownloadAll(orderId)}>Download All Files</button>
          </p>
        </div>
        <div className='row'>
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
          {/* <div className="mb-3 m-5 col-md-2">
          <label htmlFor="customLeadTime" className="fw-bold form-label">Custom Lead Time (Days)</label>
          <input
            type="number"
            id="customLeadTime"
            className="form-control"
            value={customLeadTime}
            onChange={(e) => setCustomLeadTime(parseInt(e.target.value) || 0)}
          />
        </div> */}
          <div className="mb-3 m-5 col-md-2">
            <label htmlFor="customLeadTime" className="fw-bold form-label">Custom Lead Time</label>
            <div className="input-group">
              <input
                type="number"
                id="customLeadTime"
                className="form-control"
                value={customLeadTime}
                onChange={(e) => setCustomLeadTime(parseInt(e.target.value, 10) || 0)}
                min="0"
              />
              <span className="input-group-text">Days</span>
            </div>
          </div>
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
                  <td>
                    <a className='border border-bottom pointer' onClick={() => handleDownload(orderId, file.name)}>
                      {file.originalName}
                      <br />
                      {file.dimensions
                        ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm`
                        : '-'}<br />
                    </a>
                  </td>
                  <td>
                    {/* <select
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
                    </select> */}
                    <select
                      className="form-select"
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
                    {/* <select
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
                    </select> */}
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.material || ''}
                      onChange={(e) => handleOptionChange(file._id, 'material', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material || []
                      )}
                    </select>
                  </td>
                  <td>
                    {/* <select
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
                    </select> */}
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.color || ''}
                      onChange={(e) => handleOptionChange(file._id, 'color', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color || []
                      )}
                    </select>
                  </td>
                  <td>
                    {/* <select
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
                    </select> */}
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.quality || ''}
                      onChange={(e) => handleOptionChange(file._id, 'quality', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality || []
                      )}
                    </select>
                  </td>
                  <td>
                    {/* <select
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
                    </select> */}
                    <select
                      className="form-select"
                      value={fileOptions[file._id]?.density || ''}
                      onChange={(e) => handleOptionChange(file._id, 'density', e.target.value)}
                    >
                      {renderOptions(
                        optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density || []
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
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteFile(orderId, file._id, file.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='row'>
            <div className='col-md-2 text-start'>
              <button className="btn btn-primary" onClick={handleSubmitOrder}>
                Save Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;