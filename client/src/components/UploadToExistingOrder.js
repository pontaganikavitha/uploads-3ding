// // import React, { useState, useEffect } from 'react';
// // import FileUploader from './FileUploader';
// // import OrderSummary from './OrderSummary';
// // import '../styles/UploadedFiles.css';

// // const UploadToExistingOrder = () => {
// //     const [orderId, setOrderId] = useState("");
// //     const [files, setFiles] = useState([]);
// //     const [uploaderVisible, setUploaderVisible] = useState(false);
// //     const [fileOptions, setFileOptions] = useState({});
// //     const [optionsData, setOptionsData] = useState({
// //         technologyOptions: {},
// //         materialCosts: {},
// //         densityCosts: {},
// //         qualityCosts: {}
// //     });

// //     useEffect(() => {
// //         const fetchOptionsData = async () => {
// //             try {
// //                 const response = await fetch('http://172.31.18.216:3001/options');
// //                 const data = await response.json();
// //                 setOptionsData(data);
// //             } catch (error) {
// //                 console.error('Error fetching options data:', error);
// //             }
// //         };

// //         fetchOptionsData();
// //     }, []);

// //     const fetchFiles = async (orderId) => {
// //         try {
// //             const response = await fetch(`http://172.31.18.216:3001/files/${orderId}`);
// //             const data = await response.json();
// //             setFiles(data);
// //         } catch (error) {
// //             console.error('Error fetching order files:', error);
// //         }
// //     };

// //     const handleOrderIdChange = (event) => {
// //         setOrderId(event.target.value);
// //     };

// //     const handleFetchFiles = () => {
// //         if (orderId) {
// //             fetchFiles(orderId);
// //             setUploaderVisible(true);
// //         }
// //     };

// //     const handleFileUploadComplete = () => {
// //         fetchFiles(orderId);
// //     };

// //     useEffect(() => {
// //         const updateFileOptions = () => {
// //             const defaultFileOptions = { ...fileOptions };
// //             files.forEach(file => {
// //                 if (!defaultFileOptions[file._id]) {
// //                     defaultFileOptions[file._id] = {
// //                         technology: 'FDM/FFF',
// //                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
// //                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
// //                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
// //                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
// //                         quantity: 1
// //                     };
// //                 }
// //             });
// //             setFileOptions(defaultFileOptions);
// //         };

// //         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
// //             updateFileOptions();
// //         }
// //     }, [files, optionsData]);

// //     const handleOptionChange = (fileId, optionType, value) => {
// //         setFileOptions(prevState => {
// //             const updatedOptions = { ...prevState[fileId], [optionType]: value };

// //             if (optionType === 'technology') {
// //                 const newTechnologyOptions = optionsData.technologyOptions[value];
// //                 updatedOptions.material = newTechnologyOptions.material[0] || '';
// //                 updatedOptions.color = newTechnologyOptions.color[0] || '';
// //                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
// //                 updatedOptions.density = newTechnologyOptions.density[0] || '';
// //             }

// //             return {
// //                 ...prevState,
// //                 [fileId]: updatedOptions
// //             };
// //         });

// //         handleSubmitOrder();
// //     };

// //     const calculatePrice = (material, density, quality, buildVolume) => {
// //         const materialCost = optionsData.materialCosts[material] || 0;
// //         const densityCost = optionsData.densityCosts[density] || 0;
// //         const qualityCost = optionsData.qualityCosts[quality] || 0;
// //         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
// //         return Math.round(totalPrice);
// //     };

// //     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
// //         const price = calculatePrice(material, density, quality, buildVolume);
// //         return price * quantity;
// //     };

// //     const subtotal = files.reduce((acc, file) => {
// //         const orderTotal = calculateItemTotal(
// //             fileOptions[file._id]?.material || 'PLA',
// //             fileOptions[file._id]?.density || '20%',
// //             fileOptions[file._id]?.quality || 'Draft',
// //             file.buildVolume,
// //             fileOptions[file._id]?.quantity || 1
// //         );
// //         return acc + orderTotal;
// //     }, 0);

// //     const gst = Math.round(subtotal * 0.18);
// //     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
// //     const total = subtotal + gst + shippingCharges;

// //     const handleSubmitOrder = async () => {
// //         try {
// //             const orderData = {
// //                 orderId,
// //                 files: files.map(file => ({
// //                     ...file,
// //                     options: fileOptions[file._id],
// //                     price: calculatePrice(
// //                         fileOptions[file._id]?.material || 'PLA',
// //                         fileOptions[file._id]?.density || '20%',
// //                         fileOptions[file._id]?.quality || 'Draft',
// //                         file.buildVolume,
// //                     ),
// //                 })),
// //                 subtotal,
// //                 gst,
// //                 shippingCharges,
// //                 total
// //             };

// //             const response = await fetch('http://172.31.18.216:3001/submit-order', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify(orderData)
// //             });

// //             if (response.ok) {
// //                 console.log('Order submitted successfully');
// //             } else {
// //                 console.error('Error submitting order');
// //             }
// //         } catch (error) {
// //             console.error('Error submitting order:', error);
// //         }
// //     };

// //     useEffect(() => {
// //         handleSubmitOrder();
// //     }, [files, fileOptions]);

// //     return (
// //         <div>
// //             <div className='container'>
// //                 <div className='row'>
// //                     <div className='col-md-7 mt-5'>
// //                         <input
// //                             type="text"
// //                             placeholder="Enter existing Order ID"
// //                             value={orderId}
// //                             onChange={handleOrderIdChange}
// //                         />
// //                         <button onClick={handleFetchFiles}>Fetch Files</button>
// //                         {uploaderVisible && (
// //                             <FileUploader
// //                                 session={orderId}
// //                                 orderId={orderId}
// //                                 onComplete={handleFileUploadComplete}
// //                             />
// //                         )}
// //                     </div>
// //                     <div className='col-md-4 mt-5'>
// //                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
// //                         <OrderSummary
// //                             orderId={orderId}
// //                             files={files}
// //                             subtotal={subtotal}
// //                             gst={gst}
// //                             shippingCharges={shippingCharges}
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //             <div className='container mb-5'>
// //                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
// //                 <div className="row">
// //                     <table>
// //                         <thead className="justify-content-center border-top border-bottom">
// //                             <tr className='justify-content-center text-center'>
// //                                 <th className="col-md-1 py-2">S No.</th>
// //                                 <th className="col-md-2 py-2">File Name</th>
// //                                 <th className="col-md-1 py-2">Technology</th>
// //                                 <th className="col-md-1 py-2">Material</th>
// //                                 <th className="col-md-1 py-2">Color</th>
// //                                 <th className="col-md-1 py-2">Quality</th>
// //                                 <th className="col-md-1 py-2">Density</th>
// //                                 <th className="col-md-1 py-2">Price</th>
// //                                 <th className="col-md-1 py-2">Quantity</th>
// //                                 <th className="col-md-1 py-2">Item Total</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {files.map((file, index) => (
// //                                 <tr key={file._id} className='justify-content-center text-center'>
// //                                     <td className='py-2 text-center'>{index + 1}</td>
// //                                     <td className="py-2 text-start">{file.originalName}<br />{file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}</td>
// //                                     <td>
// //                                         <select
// //                                             className="technology-select"
// //                                             value={fileOptions[file._id]?.technology || ''}
// //                                             onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
// //                                         >
// //                                             {Object.keys(optionsData.technologyOptions).map(technology => (
// //                                                 <option key={technology} value={technology}>
// //                                                     {technology}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </td>
// //                                     <td>
// //                                         <select
// //                                             className="technology-select"
// //                                             value={fileOptions[file._id]?.material || ''}
// //                                             onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
// //                                         >
// //                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(material => (
// //                                                 <option key={material} value={material}>
// //                                                     {material}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </td>
// //                                     <td>
// //                                         <select
// //                                             className="technology-select"
// //                                             value={fileOptions[file._id]?.color || ''}
// //                                             onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
// //                                         >
// //                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(color => (
// //                                                 <option key={color} value={color}>
// //                                                     {color}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </td>
// //                                     <td>
// //                                         <select
// //                                             className="technology-select"
// //                                             value={fileOptions[file._id]?.quality || ''}
// //                                             onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
// //                                         >
// //                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(quality => (
// //                                                 <option key={quality} value={quality}>
// //                                                     {quality}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </td>
// //                                     <td>
// //                                         <select
// //                                             className="technology-select"
// //                                             value={fileOptions[file._id]?.density || ''}
// //                                             onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
// //                                         >
// //                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(density => (
// //                                                 <option key={density} value={density}>
// //                                                     {density}
// //                                                 </option>
// //                                             ))}
// //                                         </select>
// //                                     </td>
// //                                     <td className='col-md-1 text-center'>
// //                                         ₹{calculatePrice(fileOptions[file._id]?.material || 'PLA', fileOptions[file._id]?.density || '20%', fileOptions[file._id]?.quality || 'Draft', file.buildVolume)}
// //                                     </td>
// //                                     <td>
// //                                         <input
// //                                             className="technology-select"
// //                                             type="number"
// //                                             value={fileOptions[file._id]?.quantity || 1}
// //                                             onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
// //                                         />
// //                                     </td>
// //                                     <td className='py-2'>
// //                                         ₹{calculateItemTotal(
// //                                             fileOptions[file._id]?.material || 'PLA',
// //                                             fileOptions[file._id]?.density || '20%',
// //                                             fileOptions[file._id]?.quality || 'Draft',
// //                                             file.buildVolume,
// //                                             fileOptions[file._id]?.quantity || 1
// //                                         )}
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//                 setError(null);
//             } catch (error) {
//                 setError('Error fetching options data.');
//                 console.error('Error fetching options data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         setLoading(true);
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/files/${orderId}`);
//             const data = await response.json();
//             setFiles(data);
//             setError(null);
//         } catch (error) {
//             setError('Error fetching order files.');
//             console.error('Error fetching order files:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchFiles(orderId);
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, 0);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         setLoading(true);
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 setError('Error submitting order.');
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             setError('Error submitting order.');
//             console.error('Error submitting order:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {loading && <p>Loading...</p>}
//                 {error && <p className="error-message">{error}</p>}
//                 <div className="row">
//                     <table>
//                         <thead className="justify-content-center border-top border-bottom">
//                             <tr className='justify-content-center text-center'>
//                                 <th className="col-md-1 py-2">S No.</th>
//                                 <th className="col-md-2 py-2">File Name</th>
//                                 <th className="col-md-1 py-2">Technology</th>
//                                 <th className="col-md-1 py-2">Material</th>
//                                 <th className="col-md-1 py-2">Color</th>
//                                 <th className="col-md-1 py-2">Quality</th>
//                                 <th className="col-md-1 py-2">Density</th>
//                                 <th className="col-md-1 py-2">Price</th>
//                                 <th className="col-md-1 py-2">Quantity</th>
//                                 <th className="col-md-1 py-2">Item Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {files.map((file, index) => (
//                                 <tr key={file._id} className='justify-content-center text-center'>
//                                     <td className='py-2 text-center'>{index + 1}</td>
//                                     <td className="py-2 text-start">{file.originalName}<br />{file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}</td>
//                                     <td>
//                                         <select
//                                             className="technology-select"
//                                             value={fileOptions[file._id]?.technology || ''}
//                                             onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                         >
//                                             {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                 <option key={technology} value={technology}>
//                                                     {technology}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </td>
//                                     <td>
//                                         <select
//                                             className="technology-select"
//                                             value={fileOptions[file._id]?.material || ''}
//                                             onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                         >
//                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.material.map(material => (
//                                                 <option key={material} value={material}>
//                                                     {material}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </td>
//                                     <td>
//                                         <select
//                                             className="technology-select"
//                                             value={fileOptions[file._id]?.color || ''}
//                                             onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                         >
//                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.color.map(color => (
//                                                 <option key={color} value={color}>
//                                                     {color}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </td>
//                                     <td>
//                                         <select
//                                             className="technology-select"
//                                             value={fileOptions[file._id]?.quality || ''}
//                                             onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                         >
//                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.quality.map(quality => (
//                                                 <option key={quality} value={quality}>
//                                                     {quality}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </td>
//                                     <td>
//                                         <select
//                                             className="technology-select"
//                                             value={fileOptions[file._id]?.density || ''}
//                                             onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                         >
//                                             {optionsData.technologyOptions[fileOptions[file._id]?.technology]?.density.map(density => (
//                                                 <option key={density} value={density}>
//                                                     {density}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </td>
//                                     <td className='col-md-1 text-center'>
//                                         ₹{calculatePrice(fileOptions[file._id]?.material || 'PLA', fileOptions[file._id]?.density || '20%', fileOptions[file._id]?.quality || 'Draft', file.buildVolume)}
//                                     </td>
//                                     <td>
//                                         <input
//                                             className="technology-select"
//                                             type="number"
//                                             value={fileOptions[file._id]?.quantity || 1}
//                                             onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                         />
//                                     </td>
//                                     <td className='py-2'>
//                                         ₹{calculateItemTotal(
//                                             fileOptions[file._id]?.material || 'PLA',
//                                             fileOptions[file._id]?.density || '20%',
//                                             fileOptions[file._id]?.quality || 'Draft',
//                                             file.buildVolume,
//                                             fileOptions[file._id]?.quantity || 1
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/files/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             console.log('Fetched files:', data); // Debugging: Check fetched data
//             setFiles(data);
//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchFiles(orderId);
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, 0);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 && <p>No files found. Please fetch files.</p>}
//                 <div className="row">
//                     <table>
//                         <thead className="justify-content-center border-top border-bottom">
//                             <tr className='justify-content-center text-center'>
//                                 <th className="col-md-1 py-2">S No.</th>
//                                 <th className="col-md-2 py-2">File Name</th>
//                                 <th className="col-md-1 py-2">Technology</th>
//                                 <th className="col-md-1 py-2">Material</th>
//                                 <th className="col-md-1 py-2">Color</th>
//                                 <th className="col-md-1 py-2">Quality</th>
//                                 <th className="col-md-1 py-2">Density</th>
//                                 <th className="col-md-1 py-2">Price</th>
//                                 <th className="col-md-1 py-2">Quantity</th>
//                                 <th className="col-md-1 py-2">Item Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {files.map((file, index) => {
//                                 const options = fileOptions[file._id] || {};
//                                 console.log(`Rendering file ${file._id}:`, file, options); // Debugging info
//                                 return (
//                                     <tr key={file._id} className='justify-content-center text-center'>
//                                         <td className='py-2 text-center'>{index + 1}</td>
//                                         <td className="py-2 text-start">
//                                             {file.originalName}<br />
//                                             {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.technology || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                             >
//                                                 {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                     <option key={technology} value={technology}>
//                                                         {technology}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.material || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                     <option key={material} value={material}>
//                                                         {material}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.color || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                     <option key={color} value={color}>
//                                                         {color}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.quality || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                     <option key={quality} value={quality}>
//                                                         {quality}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.density || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                     <option key={density} value={density}>
//                                                         {density}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td className='col-md-1 text-center'>
//                                             ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                         </td>
//                                         <td>
//                                             <input
//                                                 className="technology-select"
//                                                 type="number"
//                                                 value={options.quantity || 1}
//                                                 onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                             />
//                                         </td>
//                                         <td className='py-2'>
//                                             ₹{calculateItemTotal(
//                                                 options.material || 'PLA',
//                                                 options.density || '20%',
//                                                 options.quality || 'Draft',
//                                                 file.buildVolume,
//                                                 options.quantity || 1
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;


// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [existingSubtotal, setExistingSubtotal] = useState(0); // State for existing subtotal

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/files/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             console.log('Fetched files:', data); // Debugging: Check fetched data
//             setFiles(data);

//             // Calculate subtotal for fetched files and update existing subtotal
//             const newSubtotal = data.reduce((acc, file) => {
//                 const orderTotal = calculateItemTotal(
//                     fileOptions[file._id]?.material || 'PLA',
//                     fileOptions[file._id]?.density || '20%',
//                     fileOptions[file._id]?.quality || 'Draft',
//                     file.buildVolume,
//                     fileOptions[file._id]?.quantity || 1
//                 );
//                 return acc + orderTotal;
//             }, 0);
//             setExistingSubtotal(prevSubtotal => prevSubtotal + newSubtotal);

//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchFiles(orderId);
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = existingSubtotal; // Use existing subtotal

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 && <p>No files found. Please fetch files.</p>}
//                 <div className="row">
//                     <table>
//                         <thead className="justify-content-center border-top border-bottom">
//                             <tr className='justify-content-center text-center'>
//                                 <th className="col-md-1 py-2">S No.</th>
//                                 <th className="col-md-2 py-2">File Name</th>
//                                 <th className="col-md-1 py-2">Technology</th>
//                                 <th className="col-md-1 py-2">Material</th>
//                                 <th className="col-md-1 py-2">Color</th>
//                                 <th className="col-md-1 py-2">Quality</th>
//                                 <th className="col-md-1 py-2">Density</th>
//                                 <th className="col-md-1 py-2">Price</th>
//                                 <th className="col-md-1 py-2">Quantity</th>
//                                 <th className="col-md-1 py-2">Item Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {files.map((file, index) => {
//                                 const options = fileOptions[file._id] || {};
//                                 console.log(`Rendering file ${file._id}:`, file, options); // Debugging info
//                                 return (
//                                     <tr key={file._id} className='justify-content-center text-center'>
//                                         <td className='py-2 text-center'>{index + 1}</td>
//                                         <td className="py-2 text-start">
//                                             {file.originalName}<br />
//                                             {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.technology || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                             >
//                                                 {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                     <option key={technology} value={technology}>
//                                                         {technology}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.material || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                     <option key={material} value={material}>
//                                                         {material}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.color || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                     <option key={color} value={color}>
//                                                         {color}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.quality || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                     <option key={quality} value={quality}>
//                                                         {quality}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <select
//                                                 className="technology-select"
//                                                 value={options.density || ''}
//                                                 onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                             >
//                                                 {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                     <option key={density} value={density}>
//                                                         {density}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td className='col-md-1 text-center'>
//                                             ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                         </td>
//                                         <td>
//                                             <input
//                                                 className="technology-select"
//                                                 type="number"
//                                                 value={options.quantity || 1}
//                                                 onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                             />
//                                         </td>
//                                         <td className='py-2'>
//                                             ₹{calculateItemTotal(
//                                                 options.material || 'PLA',
//                                                 options.density || '20%',
//                                                 options.quality || 'Draft',
//                                                 file.buildVolume,
//                                                 options.quantity || 1
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [existingSubtotal, setExistingSubtotal] = useState(0);

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/files/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             console.log('Fetched files:', data);
//             setFiles(data);

//             // Calculate subtotal for fetched files and update existing subtotal
//             const newSubtotal = data.reduce((acc, file) => {
//                 const orderTotal = calculateItemTotal(
//                     fileOptions[file._id]?.material || 'PLA',
//                     fileOptions[file._id]?.density || '20%',
//                     fileOptions[file._id]?.quality || 'Draft',
//                     file.buildVolume,
//                     fileOptions[file._id]?.quantity || 1
//                 );
//                 return acc + orderTotal;
//             }, 0);
//             setExistingSubtotal(prevSubtotal => prevSubtotal + newSubtotal);

//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchFiles(orderId);
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, existingSubtotal);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 ? (
//                     <p>No files found. Please fetch files.</p>
//                 ) : (
//                     <div className="row">
//                         <table>
//                             <thead className="justify-content-center border-top border-bottom">
//                                 <tr className='justify-content-center text-center'>
//                                     <th className="col-md-1 py-2">S No.</th>
//                                     <th className="col-md-2 py-2">File Name</th>
//                                     <th className="col-md-1 py-2">Technology</th>
//                                     <th className="col-md-1 py-2">Material</th>
//                                     <th className="col-md-1 py-2">Color</th>
//                                     <th className="col-md-1 py-2">Quality</th>
//                                     <th className="col-md-1 py-2">Density</th>
//                                     <th className="col-md-1 py-2">Price</th>
//                                     <th className="col-md-1 py-2">Quantity</th>
//                                     <th className="col-md-1 py-2">Item Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {files.map((file, index) => {
//                                     const options = fileOptions[file._id] || {};
//                                     return (
//                                         <tr key={file._id} className='justify-content-center text-center'>
//                                             <td className='py-2 text-center'>{index + 1}</td>
//                                             <td className="py-2 text-start">
//                                                 {file.originalName}<br />
//                                                 {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.technology || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                                 >
//                                                     {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                         <option key={technology} value={technology}>
//                                                             {technology}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.material || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                         <option key={material} value={material}>
//                                                             {material}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.color || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                         <option key={color} value={color}>
//                                                             {color}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.quality || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                         <option key={quality} value={quality}>
//                                                             {quality}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.density || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                         <option key={density} value={density}>
//                                                             {density}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td className='col-md-1 text-center'>
//                                                 ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="technology-select"
//                                                     type="number"
//                                                     value={options.quantity || 1}
//                                                     onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                                 />
//                                             </td>
//                                             <td className='py-2'>
//                                                 ₹{calculateItemTotal(
//                                                     options.material || 'PLA',
//                                                     options.density || '20%',
//                                                     options.quality || 'Draft',
//                                                     file.buildVolume,
//                                                     options.quantity || 1
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;


// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [existingSubtotal, setExistingSubtotal] = useState(0);

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             setFiles(data.files || []);

//             // Calculate subtotal for fetched files and update existing subtotal
//             const newSubtotal = data.files.reduce((acc, file) => {
//                 const orderTotal = calculateItemTotal(
//                     fileOptions[file._id]?.material || 'PLA',
//                     fileOptions[file._id]?.density || '20%',
//                     fileOptions[file._id]?.quality || 'Draft',
//                     file.buildVolume,
//                     fileOptions[file._id]?.quantity || 1
//                 );
//                 return acc + orderTotal;
//             }, 0);
//             setExistingSubtotal(newSubtotal);

//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchFiles(orderId);
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, existingSubtotal);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                             total={total}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 ? (
//                     <p>No files found. Please fetch files.</p>
//                 ) : (
//                     <div className="row">
//                         <table>
//                             <thead className="justify-content-center border-top border-bottom">
//                                 <tr className='justify-content-center text-center'>
//                                     <th className="col-md-1 py-2">S No.</th>
//                                     <th className="col-md-2 py-2">File Name</th>
//                                     <th className="col-md-1 py-2">Technology</th>
//                                     <th className="col-md-1 py-2">Material</th>
//                                     <th className="col-md-1 py-2">Color</th>
//                                     <th className="col-md-1 py-2">Quality</th>
//                                     <th className="col-md-1 py-2">Density</th>
//                                     <th className="col-md-1 py-2">Price</th>
//                                     <th className="col-md-1 py-2">Quantity</th>
//                                     <th className="col-md-1 py-2">Item Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {files.map((file, index) => {
//                                     const options = fileOptions[file._id] || {};
//                                     return (
//                                         <tr key={file._id} className='justify-content-center text-center'>
//                                             <td className='py-2 text-center'>{index + 1}</td>
//                                             <td className="py-2 text-start">
//                                                 {file.originalName}<br />
//                                                 {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.technology || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                                 >
//                                                     {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                         <option key={technology} value={technology}>
//                                                             {technology}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.material || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                         <option key={material} value={material}>
//                                                             {material}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.color || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                         <option key={color} value={color}>
//                                                             {color}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.quality || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                         <option key={quality} value={quality}>
//                                                             {quality}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.density || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                         <option key={density} value={density}>
//                                                             {density}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td className='col-md-1 text-center'>
//                                                 ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="technology-select"
//                                                     type="number"
//                                                     value={options.quantity || 1}
//                                                     onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                                 />
//                                             </td>
//                                             <td className='py-2'>
//                                                 ₹{calculateItemTotal(
//                                                     options.material || 'PLA',
//                                                     options.density || '20%',
//                                                     options.quality || 'Draft',
//                                                     file.buildVolume,
//                                                     options.quantity || 1
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [existingSubtotal, setExistingSubtotal] = useState(0);

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             setFiles(data.files || []);

//             const newSubtotal = data.files.reduce((acc, file) => {
//                 const orderTotal = calculateItemTotal(
//                     file.options.material || 'PLA',
//                     file.options.density || '20%',
//                     file.options.quality || 'Draft',
//                     file.buildVolume,
//                     file.options.quantity || 1
//                 );
//                 return acc + orderTotal;
//             }, 0);
//             setExistingSubtotal(newSubtotal);

//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = async () => {
//         await fetchFiles(orderId);
//         handleSubmitOrder();
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, existingSubtotal);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     ),
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                             total={total}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 ? (
//                     <p>No files found. Please fetch files.</p>
//                 ) : (
//                     <div className="row">
//                         <table>
//                             <thead className="justify-content-center border-top border-bottom">
//                                 <tr className='justify-content-center text-center'>
//                                     <th className="col-md-1 py-2">S No.</th>
//                                     <th className="col-md-2 py-2">File Name</th>
//                                     <th className="col-md-1 py-2">Technology</th>
//                                     <th className="col-md-1 py-2">Material</th>
//                                     <th className="col-md-1 py-2">Color</th>
//                                     <th className="col-md-1 py-2">Quality</th>
//                                     <th className="col-md-1 py-2">Density</th>
//                                     <th className="col-md-1 py-2">Price</th>
//                                     <th className="col-md-1 py-2">Quantity</th>
//                                     <th className="col-md-1 py-2">Item Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {files.map((file, index) => {
//                                     const options = fileOptions[file._id] || {};
//                                     return (
//                                         <tr key={file._id} className='justify-content-center text-center'>
//                                             <td className='py-2'>{index + 1}</td>
//                                             <td className="py-2 text-start">
//                                                 {file.originalName}<br />
//                                                 {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.technology || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                                 >
//                                                     {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                         <option key={technology} value={technology}>
//                                                             {technology}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.material || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                         <option key={material} value={material}>
//                                                             {material}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.color || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                         <option key={color} value={color}>
//                                                             {color}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.quality || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                         <option key={quality} value={quality}>
//                                                             {quality}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.density || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                         <option key={density} value={density}>
//                                                             {density}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td className='col-md-1 text-center'>
//                                                 ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="technology-select"
//                                                     type="number"
//                                                     value={options.quantity || 1}
//                                                     onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                                 />
//                                             </td>
//                                             <td className='py-2'>
//                                                 ₹{calculateItemTotal(
//                                                     options.material || 'PLA',
//                                                     options.density || '20%',
//                                                     options.quality || 'Draft',
//                                                     file.buildVolume,
//                                                     options.quantity || 1
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from './FileUploader';
// import OrderSummary from './OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [orderId, setOrderId] = useState("");
//     const [files, setFiles] = useState([]);
//     const [uploaderVisible, setUploaderVisible] = useState(false);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [existingSubtotal, setExistingSubtotal] = useState(0);

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();
//     }, []);

//     const fetchFiles = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             setFiles(data.files || []);

//             const newSubtotal = data.files.reduce((acc, file) => {
//                 const orderTotal = calculateItemTotal(
//                     file.options.material || 'PLA',
//                     file.options.density || '20%',
//                     file.options.quality || 'Draft',
//                     file.buildVolume,
//                     file.options.quantity || 1
//                 );
//                 return acc + orderTotal;
//             }, 0);
//             setExistingSubtotal(newSubtotal);

//         } catch (error) {
//             console.error('Error fetching files:', error);
//         }
//     };

//     const handleOrderIdChange = (event) => {
//         setOrderId(event.target.value);
//     };

//     const handleFetchFiles = () => {
//         if (orderId) {
//             fetchFiles(orderId);
//             setUploaderVisible(true);
//         }
//     };

//     const handleFileUploadComplete = async () => {
//         await fetchFiles(orderId);
//         handleSubmitOrder();
//     };

//     useEffect(() => {
//         const updateFileOptions = () => {
//             const defaultFileOptions = { ...fileOptions };
//             files.forEach(file => {
//                 if (!defaultFileOptions[file._id]) {
//                     defaultFileOptions[file._id] = {
//                         technology: 'FDM/FFF',
//                         material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
//                         color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
//                         quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
//                         density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
//                         quantity: 1
//                     };
//                 }
//             });
//             setFileOptions(defaultFileOptions);
//         };

//         if (files.length > 0 && Object.keys(optionsData.technologyOptions).length > 0) {
//             updateFileOptions();
//         }
//     }, [files, optionsData]);

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, existingSubtotal);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 orderId,
//                 files: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     ),
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume
//                     )
//                 })),
//                 subtotal,
//                 gst,
//                 shippingCharges,
//                 total
//             };

//             const response = await fetch('http://172.31.18.216:3001/submit-order', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order submitted successfully');
//             } else {
//                 console.error('Error submitting order');
//             }
//         } catch (error) {
//             console.error('Error submitting order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div>
//             <div className='container'>
//                 <div className='row'>
//                     <div className='col-md-7 mt-5'>
//                         <input
//                             type="text"
//                             placeholder="Enter existing Order ID"
//                             value={orderId}
//                             onChange={handleOrderIdChange}
//                         />
//                         <button onClick={handleFetchFiles}>Fetch Files</button>
//                         {uploaderVisible && (
//                             <FileUploader
//                                 session={orderId}
//                                 orderId={orderId}
//                                 onComplete={handleFileUploadComplete}
//                             />
//                         )}
//                     </div>
//                     <div className='col-md-4 mt-5'>
//                         <h1 className='h6 fw-bold text-center'>Order Summary</h1>
//                         <OrderSummary
//                             orderId={orderId}
//                             files={files}
//                             subtotal={subtotal}
//                             gst={gst}
//                             shippingCharges={shippingCharges}
//                             total={total}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='container mb-5'>
//                 <h1 className='h4 fw-bold mt-5'>Uploaded Files</h1>
//                 {files.length === 0 ? (
//                     <p>No files found. Please fetch files.</p>
//                 ) : (
//                     <div className="row">
//                         <table>
//                             <thead className="justify-content-center border-top border-bottom">
//                                 <tr className='justify-content-center text-center'>
//                                     <th className="col-md-1 py-2">S No.</th>
//                                     <th className="col-md-2 py-2">File Name</th>
//                                     <th className="col-md-1 py-2">Technology</th>
//                                     <th className="col-md-1 py-2">Material</th>
//                                     <th className="col-md-1 py-2">Color</th>
//                                     <th className="col-md-1 py-2">Quality</th>
//                                     <th className="col-md-1 py-2">Density</th>
//                                     <th className="col-md-1 py-2">Price</th>
//                                     <th className="col-md-1 py-2">Quantity</th>
//                                     <th className="col-md-1 py-2">Item Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {files.map((file, index) => {
//                                     const options = fileOptions[file._id] || {};
//                                     return (
//                                         <tr key={file._id} className='justify-content-center text-center'>
//                                             <td className='py-2'>{index + 1}</td>
//                                             <td className="py-2 text-start">
//                                                 {file.originalName}<br />
//                                                 {file.dimensions ? `${Math.round(file.dimensions.length)} x ${Math.round(file.dimensions.width)} x ${Math.round(file.dimensions.height)} mm` : '-'}
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.technology || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                                 >
//                                                     {Object.keys(optionsData.technologyOptions).map(technology => (
//                                                         <option key={technology} value={technology}>
//                                                             {technology}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.material || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.material.map(material => (
//                                                         <option key={material} value={material}>
//                                                             {material}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.color || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.color.map(color => (
//                                                         <option key={color} value={color}>
//                                                             {color}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.quality || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.quality.map(quality => (
//                                                         <option key={quality} value={quality}>
//                                                             {quality}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td>
//                                                 <select
//                                                     className="technology-select"
//                                                     value={options.density || ''}
//                                                     onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                                 >
//                                                     {optionsData.technologyOptions[options.technology]?.density.map(density => (
//                                                         <option key={density} value={density}>
//                                                             {density}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             <td className='col-md-1 text-center'>
//                                                 ₹{calculatePrice(options.material || 'PLA', options.density || '20%', options.quality || 'Draft', file.buildVolume)}
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="technology-select"
//                                                     type="number"
//                                                     value={options.quantity || 1}
//                                                     onChange={e => handleOptionChange(file._id, 'quantity', e.target.value)}
//                                                 />
//                                             </td>
//                                             <td className='py-2'>
//                                                 ₹{calculateItemTotal(
//                                                     options.material || 'PLA',
//                                                     options.density || '20%',
//                                                     options.quality || 'Draft',
//                                                     file.buildVolume,
//                                                     options.quantity || 1
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;


import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import OrderSummary from '../components/OrderSummary';
import '../styles/FileUploader.css'; // Add any required styles

const UploadToExistingOrder = () => {
  const [existingOrderId, setExistingOrderId] = useState('');
  const [files, setFiles] = useState([]);
  const [fileOptions, setFileOptions] = useState({});
  const [optionsData, setOptionsData] = useState({
    technologyOptions: {},
    materialCosts: {},
    densityCosts: {},
    qualityCosts: {}
  });
  const [session, setSession] = useState('');

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const response = await fetch('http://172.31.18.216:3001/options');
        const data = await response.json();
        setOptionsData(data);
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };

    fetchOptionsData();

    const sessionIdentifier = Math.random().toString(36).substring(7);
    setSession(sessionIdentifier);

    if (existingOrderId) {
      fetchOrderDetails(existingOrderId);
    }
  }, [existingOrderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
      const orderData = await response.json();
      setFiles(orderData.files);
      setFileOptions(orderData.files.reduce((acc, file) => ({
        ...acc,
        [file._id]: file.options || {}
      }), {}));
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleFileUploadComplete = () => {
    fetchOrderDetails(existingOrderId);
  };

  const handleOptionChange = (fileId, optionType, value) => {
    setFileOptions(prevState => {
      const updatedOptions = { ...prevState[fileId], [optionType]: value };

      if (optionType === 'technology') {
        const newTechnologyOptions = optionsData.technologyOptions[value];
        updatedOptions.material = newTechnologyOptions.material[0] || '';
        updatedOptions.color = newTechnologyOptions.color[0] || '';
        updatedOptions.quality = newTechnologyOptions.quality[0] || '';
        updatedOptions.density = newTechnologyOptions.density[0] || '';
      }

      return {
        ...prevState,
        [fileId]: updatedOptions
      };
    });

    handleSubmitOrder();
  };

  const calculatePrice = (material, density, quality, buildVolume) => {
    const materialCost = optionsData.materialCosts[material] || 0;
    const densityCost = optionsData.densityCosts[density] || 0;
    const qualityCost = optionsData.qualityCosts[quality] || 0;
    const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
    return Math.round(totalPrice);
  };

  const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
    const price = calculatePrice(material, density, quality, buildVolume);
    return price * quantity;
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

  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        orderId: existingOrderId,
        session,
        files: files.map(file => ({
          ...file,
          options: fileOptions[file._id],
          price: calculatePrice(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume,
          ),
        })),
        subtotal,
        gst,
        shippingCharges,
        total
      };

      const response = await fetch('http://172.31.18.216:3001/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        console.log('Order updated successfully');
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  useEffect(() => {
    handleSubmitOrder();
  }, [files, fileOptions]);

  return (
    <div className='container'>
      <h1 className='h4 fw-bold mt-5'>Update Existing Order</h1>
      <input
        type="text"
        value={existingOrderId}
        onChange={e => setExistingOrderId(e.target.value)}
        placeholder="Enter existing Order ID to add files"
        className="form-control mb-3"
      />
      <FileUploader
        session={session}
        orderId={existingOrderId}
        onComplete={handleFileUploadComplete}
      />
      <OrderSummary
        orderId={existingOrderId}
        files={files}
        subtotal={subtotal}
        gst={gst}
        shippingCharges={shippingCharges}
      />
      <div className='mt-4'>
        <h2>Uploaded Files</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>S No.</th>
              <th>File Name</th>
              <th>Technology</th>
              <th>Material</th>
              <th>Color</th>
              <th>Quality</th>
              <th>Density</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={file._id}>
                <td>{index + 1}</td>
                <td>{file.originalName}</td>
                <td>
                  <select
                    value={fileOptions[file._id]?.technology || 'FDM/FFF'}
                    onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
                  >
                    {Object.keys(optionsData.technologyOptions).map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={fileOptions[file._id]?.material || optionsData.technologyOptions['FDM/FFF']?.material?.[0] || ''}
                    onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
                  >
                    {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.material.map(mat => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={fileOptions[file._id]?.color || optionsData.technologyOptions['FDM/FFF']?.color?.[0] || ''}
                    onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
                  >
                    {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.color.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={fileOptions[file._id]?.quality || optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || ''}
                    onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
                  >
                    {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.quality.map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={fileOptions[file._id]?.density || optionsData.technologyOptions['FDM/FFF']?.density?.[0] || ''}
                    onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
                  >
                    {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.density.map(dens => (
                      <option key={dens} value={dens}>{dens}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {calculatePrice(
                    fileOptions[file._id]?.material || 'PLA',
                    fileOptions[file._id]?.density || '20%',
                    fileOptions[file._id]?.quality || 'Draft',
                    file.buildVolume
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={fileOptions[file._id]?.quantity || 1}
                    onChange={e => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
                    min="1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadToExistingOrder;


// import React, { useState, useEffect } from 'react';
// import FileUploader from '../components/FileUploader';
// import OrderSummary from '../components/OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [existingOrderId, setExistingOrderId] = useState('');
//     const [files, setFiles] = useState([]);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [session, setSession] = useState('');

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();

//         const sessionIdentifier = Math.random().toString(36).substring(7);
//         setSession(sessionIdentifier);

//         if (existingOrderId) {
//             fetchOrderDetails(existingOrderId);
//         }
//     }, [existingOrderId]);

//     const fetchOrderDetails = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             const orderData = await response.json();
//             setFiles(orderData.files);
//             setFileOptions(orderData.files.reduce((acc, file) => ({
//                 ...acc,
//                 [file._id]: file.options || {}
//             }), {}));
//         } catch (error) {
//             console.error('Error fetching order details:', error);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchOrderDetails(existingOrderId);
//     };

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, 0);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 newFiles: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume
//                     ),
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     )
//                 }))
//             };

//             const response = await fetch(`http://172.31.18.216:3001/update-order/${existingOrderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order updated successfully');
//             } else {
//                 console.error('Error updating order');
//             }
//         } catch (error) {
//             console.error('Error updating order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div className='container'>
//             <h1 className='h4 fw-bold mt-5'>Update Existing Order</h1>
//             <input
//                 type="text"
//                 value={existingOrderId}
//                 onChange={e => setExistingOrderId(e.target.value)}
//                 placeholder="Enter existing Order ID to add files"
//                 className="form-control mb-3"
//             />
//             <FileUploader
//                 session={session}
//                 orderId={existingOrderId}
//                 onComplete={handleFileUploadComplete}
//             />
//             <OrderSummary
//                 orderId={existingOrderId}
//                 files={files}
//                 subtotal={subtotal}
//                 gst={gst}
//                 shippingCharges={shippingCharges}
//             />
//             <div className='mt-4'>
//                 <h2>Uploaded Files</h2>
//                 <table className='table'>
//                     <thead>
//                         <tr>
//                             <th>S No.</th>
//                             <th>File Name</th>
//                             <th>Technology</th>
//                             <th>Material</th>
//                             <th>Color</th>
//                             <th>Quality</th>
//                             <th>Density</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {files.map((file, index) => (
//                             <tr key={file._id}>
//                                 <td>{index + 1}</td>
//                                 <td>{file.fileName}</td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.technology || 'FDM/FFF'}
//                                         onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                     >
//                                         {Object.keys(optionsData.technologyOptions).map(tech => (
//                                             <option key={tech} value={tech}>{tech}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.material || optionsData.technologyOptions['FDM/FFF']?.material?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.material.map(mat => (
//                                             <option key={mat} value={mat}>{mat}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.color || optionsData.technologyOptions['FDM/FFF']?.color?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.color.map(col => (
//                                             <option key={col} value={col}>{col}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.quality || optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.quality.map(qual => (
//                                             <option key={qual} value={qual}>{qual}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.density || optionsData.technologyOptions['FDM/FFF']?.density?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.density.map(dens => (
//                                             <option key={dens} value={dens}>{dens}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     {calculatePrice(
//                                         fileOptions[file._id]?.material || 'PLA',
//                                         fileOptions[file._id]?.density || '20%',
//                                         fileOptions[file._id]?.quality || 'Draft',
//                                         file.buildVolume
//                                     )}
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         value={fileOptions[file._id]?.quantity || 1}
//                                         onChange={e => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
//                                         min="1"
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;

// import React, { useState, useEffect } from 'react';
// import FileUploader from '../components/FileUploader';
// import OrderSummary from '../components/OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [existingOrderId, setExistingOrderId] = useState('');
//     const [files, setFiles] = useState([]);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [session, setSession] = useState('');

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();

//         const sessionIdentifier = Math.random().toString(36).substring(7);
//         setSession(sessionIdentifier);

//         if (existingOrderId) {
//             fetchOrderDetails(existingOrderId);
//         }
//     }, [existingOrderId]);

//     const fetchOrderDetails = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             const orderData = await response.json();

//             // Ensure files are not duplicated
//             const existingFileIds = files.map(file => file._id);
//             const newFiles = orderData.files.filter(file => !existingFileIds.includes(file._id));
            
//             setFiles(prevFiles => [...prevFiles, ...newFiles]);
//             setFileOptions(prevOptions => orderData.files.reduce((acc, file) => ({
//                 ...acc,
//                 [file._id]: file.options || {}
//             }), prevOptions));
//         } catch (error) {
//             console.error('Error fetching order details:', error);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchOrderDetails(existingOrderId);
//     };

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, 0);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 newFiles: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume
//                     ),
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     )
//                 }))
//             };

//             const response = await fetch(`http://172.31.18.216:3001/update-order/${existingOrderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order updated successfully');
//             } else {
//                 console.error('Error updating order');
//             }
//         } catch (error) {
//             console.error('Error updating order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div className='container'>
//             <h1 className='h4 fw-bold mt-5'>Update Existing Order</h1>
//             <input
//                 type="text"
//                 value={existingOrderId}
//                 onChange={e => setExistingOrderId(e.target.value)}
//                 placeholder="Enter existing Order ID to add files"
//                 className="form-control mb-3"
//             />
//             <FileUploader
//                 session={session}
//                 orderId={existingOrderId}
//                 onComplete={handleFileUploadComplete}
//             />
//             <OrderSummary
//                 orderId={existingOrderId}
//                 files={files}
//                 subtotal={subtotal}
//                 gst={gst}
//                 shippingCharges={shippingCharges}
//             />
//             <div className='mt-4'>
//                 <h2>Uploaded Files</h2>
//                 <table className='table'>
//                     <thead>
//                         <tr>
//                             <th>S No.</th>
//                             <th>File Name</th>
//                             <th>Technology</th>
//                             <th>Material</th>
//                             <th>Color</th>
//                             <th>Quality</th>
//                             <th>Density</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {files.map((file, index) => (
//                             <tr key={file._id}>
//                                 <td>{index + 1}</td>
//                                 <td>{file.fileName}</td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.technology || 'FDM/FFF'}
//                                         onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                     >
//                                         {Object.keys(optionsData.technologyOptions).map(tech => (
//                                             <option key={tech} value={tech}>{tech}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.material || optionsData.technologyOptions['FDM/FFF']?.material?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.material.map(mat => (
//                                             <option key={mat} value={mat}>{mat}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.color || optionsData.technologyOptions['FDM/FFF']?.color?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.color.map(col => (
//                                             <option key={col} value={col}>{col}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.quality || optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.quality.map(qual => (
//                                             <option key={qual} value={qual}>{qual}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.density || optionsData.technologyOptions['FDM/FFF']?.density?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.density.map(dens => (
//                                             <option key={dens} value={dens}>{dens}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     {calculatePrice(
//                                         fileOptions[file._id]?.material || 'PLA',
//                                         fileOptions[file._id]?.density || '20%',
//                                         fileOptions[file._id]?.quality || 'Draft',
//                                         file.buildVolume
//                                     )}
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         value={fileOptions[file._id]?.quantity || 1}
//                                         onChange={e => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
//                                         min="1"
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;


// import React, { useState, useEffect } from 'react';
// import FileUploader from '../components/FileUploader';
// import OrderSummary from '../components/OrderSummary';
// import '../styles/UploadedFiles.css';

// const UploadToExistingOrder = () => {
//     const [existingOrderId, setExistingOrderId] = useState('');
//     const [files, setFiles] = useState([]);
//     const [fileOptions, setFileOptions] = useState({});
//     const [optionsData, setOptionsData] = useState({
//         technologyOptions: {},
//         materialCosts: {},
//         densityCosts: {},
//         qualityCosts: {}
//     });
//     const [session, setSession] = useState('');

//     useEffect(() => {
//         const fetchOptionsData = async () => {
//             try {
//                 const response = await fetch('http://172.31.18.216:3001/options');
//                 const data = await response.json();
//                 setOptionsData(data);
//             } catch (error) {
//                 console.error('Error fetching options data:', error);
//             }
//         };

//         fetchOptionsData();

//         const sessionIdentifier = Math.random().toString(36).substring(7);
//         setSession(sessionIdentifier);

//         if (existingOrderId) {
//             fetchOrderDetails(existingOrderId);
//         }
//     }, [existingOrderId]);

//     const fetchOrderDetails = async (orderId) => {
//         try {
//             const response = await fetch(`http://172.31.18.216:3001/orders/${orderId}`);
//             const orderData = await response.json();
//             setFiles(orderData.files);
//             setFileOptions(orderData.files.reduce((acc, file) => ({
//                 ...acc,
//                 [file._id]: file.options || {}
//             }), {}));
//         } catch (error) {
//             console.error('Error fetching order details:', error);
//         }
//     };

//     const handleFileUploadComplete = () => {
//         fetchOrderDetails(existingOrderId);
//     };

//     const handleOptionChange = (fileId, optionType, value) => {
//         setFileOptions(prevState => {
//             const updatedOptions = { ...prevState[fileId], [optionType]: value };

//             if (optionType === 'technology') {
//                 const newTechnologyOptions = optionsData.technologyOptions[value];
//                 updatedOptions.material = newTechnologyOptions.material[0] || '';
//                 updatedOptions.color = newTechnologyOptions.color[0] || '';
//                 updatedOptions.quality = newTechnologyOptions.quality[0] || '';
//                 updatedOptions.density = newTechnologyOptions.density[0] || '';
//             }

//             return {
//                 ...prevState,
//                 [fileId]: updatedOptions
//             };
//         });

//         handleSubmitOrder();
//     };

//     const calculatePrice = (material, density, quality, buildVolume) => {
//         const materialCost = optionsData.materialCosts[material] || 0;
//         const densityCost = optionsData.densityCosts[density] || 0;
//         const qualityCost = optionsData.qualityCosts[quality] || 0;
//         const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
//         return Math.round(totalPrice);
//     };

//     const calculateItemTotal = (material, density, quality, buildVolume, quantity) => {
//         const price = calculatePrice(material, density, quality, buildVolume);
//         return price * quantity;
//     };

//     const subtotal = files.reduce((acc, file) => {
//         const orderTotal = calculateItemTotal(
//             fileOptions[file._id]?.material || 'PLA',
//             fileOptions[file._id]?.density || '20%',
//             fileOptions[file._id]?.quality || 'Draft',
//             file.buildVolume,
//             fileOptions[file._id]?.quantity || 1
//         );
//         return acc + orderTotal;
//     }, 0);

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     const handleSubmitOrder = async () => {
//         try {
//             const orderData = {
//                 newFiles: files.map(file => ({
//                     ...file,
//                     options: fileOptions[file._id],
//                     price: calculatePrice(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume
//                     ),
//                     itemTotal: calculateItemTotal(
//                         fileOptions[file._id]?.material || 'PLA',
//                         fileOptions[file._id]?.density || '20%',
//                         fileOptions[file._id]?.quality || 'Draft',
//                         file.buildVolume,
//                         fileOptions[file._id]?.quantity || 1
//                     )
//                 }))
//             };

//             const response = await fetch(`http://172.31.18.216:3001/update-order/${existingOrderId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             if (response.ok) {
//                 console.log('Order updated successfully');
//             } else {
//                 console.error('Error updating order');
//             }
//         } catch (error) {
//             console.error('Error updating order:', error);
//         }
//     };

//     useEffect(() => {
//         handleSubmitOrder();
//     }, [files, fileOptions]);

//     return (
//         <div className='container'>
//             <h1 className='h4 fw-bold mt-5'>Update Existing Order</h1>
//             <input
//                 type="text"
//                 value={existingOrderId}
//                 onChange={e => setExistingOrderId(e.target.value)}
//                 placeholder="Enter existing Order ID to add files"
//                 className="form-control mb-3"
//             />
//             <FileUploader
//                 session={session}
//                 orderId={existingOrderId}
//                 onComplete={handleFileUploadComplete}
//             />
//             <OrderSummary
//                 orderId={existingOrderId}
//                 files={files}
//                 subtotal={subtotal}
//                 gst={gst}
//                 shippingCharges={shippingCharges}
//             />
//             <div className='mt-4'>
//                 <h2>Uploaded Files</h2>
//                 <table className='table'>
//                     <thead>
//                         <tr>
//                             <th>S No.</th>
//                             <th>File Name</th>
//                             <th>Technology</th>
//                             <th>Material</th>
//                             <th>Color</th>
//                             <th>Quality</th>
//                             <th>Density</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {files.map((file, index) => (
//                             <tr key={file._id}>
//                                 <td>{index + 1}</td>
//                                 <td>{file.originalName}</td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.technology || 'FDM/FFF'}
//                                         onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
//                                     >
//                                         {Object.keys(optionsData.technologyOptions).map(tech => (
//                                             <option key={tech} value={tech}>{tech}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.material || optionsData.technologyOptions['FDM/FFF']?.material?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.material.map(mat => (
//                                             <option key={mat} value={mat}>{mat}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.color || optionsData.technologyOptions['FDM/FFF']?.color?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.color.map(col => (
//                                             <option key={col} value={col}>{col}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.quality || optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.quality.map(qual => (
//                                             <option key={qual} value={qual}>{qual}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     <select
//                                         value={fileOptions[file._id]?.density || optionsData.technologyOptions['FDM/FFF']?.density?.[0] || ''}
//                                         onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
//                                     >
//                                         {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.density.map(dens => (
//                                             <option key={dens} value={dens}>{dens}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                                 <td>
//                                     {calculatePrice(
//                                         fileOptions[file._id]?.material || 'PLA',
//                                         fileOptions[file._id]?.density || '20%',
//                                         fileOptions[file._id]?.quality || 'Draft',
//                                         file.buildVolume
//                                     )}
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         value={fileOptions[file._id]?.quantity || 1}
//                                         onChange={e => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
//                                         min="1"
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UploadToExistingOrder;
