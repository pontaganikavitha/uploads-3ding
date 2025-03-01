import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploaderAdding';
import OrderSummary from '../components/OrderSummary';
import '../styles/UploadedFiles.css';
import { v4 as uuidv4 } from 'uuid';


const AddingNewFileToOrderId = () => {
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
                const response = await fetch('http://test1.3ding.in/api/options');
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
            const response = await fetch(`http://test1.3ding.in/api/orders/${orderId}`);
            const orderData = await response.json();

            const processedFiles = orderData.files.map(file => ({
                ...file,
                _id: file._id || uuidv4(), // Ensure each file has a unique _id
            }));

            setFiles(processedFiles);
            setFileOptions(processedFiles.reduce((acc, file) => ({
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

    useEffect(() => {
        const updateFileOptions = () => {
            const defaultFileOptions = { ...fileOptions };
            files.forEach(file => {
                if (!defaultFileOptions[file._id]) {
                    defaultFileOptions[file._id] = {
                        technology: 'FDM/FFF',
                        material: optionsData.technologyOptions['FDM/FFF']?.material?.[0] || '',
                        color: optionsData.technologyOptions['FDM/FFF']?.color?.[0] || '',
                        quality: optionsData.technologyOptions['FDM/FFF']?.quality?.[0] || '',
                        density: optionsData.technologyOptions['FDM/FFF']?.density?.[0] || '',
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
                [fileId]: updatedOptions,
            };
        });

        handleSubmitOrder();
    };



    const calculatePrice = (material, density, quality, buildVolume, customPrice = 0) => {
        if (customPrice !== 0) {
            return customPrice; // Use customPrice if provided
        }

        const materialCost = optionsData.materialCosts[material] || 0;
        const densityCost = optionsData.densityCosts[density] || 0;
        const qualityCost = optionsData.qualityCosts[quality] || 0;
        const totalPrice = (materialCost + densityCost + qualityCost) * buildVolume;
        return Math.round(totalPrice);
    };

    const calculateItemTotal = (material, density, quality, buildVolume, quantity, customPrice = 0) => {
        const price = calculatePrice(material, density, quality, buildVolume, customPrice);
        return price * quantity;
    };

    const subtotal = files.reduce((acc, file) => {
        const customPrice = fileOptions[file._id]?.customPrice || 0;
        const orderTotal = calculateItemTotal(
            fileOptions[file._id]?.material || 'PLA',
            fileOptions[file._id]?.density || '20%',
            fileOptions[file._id]?.quality || 'Draft',
            file.buildVolume,
            fileOptions[file._id]?.quantity || 1,
            customPrice
        );
        return acc + orderTotal;
    }, 0);


    const gst = Math.round(subtotal * 0.18);
    const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
    const total = subtotal + gst + shippingCharges;

    const handleSubmitOrder = async () => {
        try {
            if (!existingOrderId || !session || !files) {
                console.error("Missing orderId, session, or files data.");
                return null; // Prevent further execution until data is available
            }

            const fileOptionsValid = files.every(file => fileOptions[file._id]);
            if (!fileOptionsValid) {
                console.error('Some files do not have corresponding options.');
                return;
            }

            const orderData = {
                orderId: existingOrderId,
                session,
                files: files.map(file => {
                    const customPrice = fileOptions[file._id]?.customPrice || 0;
                    const calculatedPrice = calculatePrice(
                        fileOptions[file._id]?.material || 'PLA',
                        fileOptions[file._id]?.density || '20%',
                        fileOptions[file._id]?.quality || 'Draft',
                        file.buildVolume,
                        customPrice
                    );

                    return {
                        ...file,
                        options: fileOptions[file._id],
                        price: calculatedPrice, // Use the calculated price or customPrice
                        itemTotal: calculatedPrice * (fileOptions[file._id]?.quantity || 1),
                    };
                }),
                subtotal,
                gst,
                shippingCharges,
                total,
            };

            const response = await fetch('http://test1.3ding.in/api/submit-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                console.error('Error submitting order:', response.status);
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
        <div className='container'>
            <div className='row'>

                <div className='col-md-6 mt-5'>
                    <h1 className='h4 fw-bold'>Add Files to Existing Order</h1>
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
                </div>
                <div className='col-md-4 offset-md-1 mt-5 pt-md-5'>
                    <OrderSummary
                        orderId={existingOrderId}
                        files={files}
                        subtotal={subtotal}
                        gst={gst}
                        shippingCharges={shippingCharges}
                    />
                </div>
                <div className='mt-4'>
                    <h2>Uploaded Files</h2>
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
                                    <tr key={file._id || index}>
                                        <td className='py-2 text-center'>{index + 1}</td>
                                        <td className="py-2 text-start">{file.originalName}</td>
                                        <td>
                                            <select
                                                className="technology-select"
                                                value={fileOptions[file._id]?.technology || 'FDM/FFF'}
                                                onChange={e => handleOptionChange(file._id, 'technology', e.target.value)}
                                                disabled={fileOptions[file._id]?.customPrice}
                                            >
                                                {Object.keys(optionsData.technologyOptions).map(tech => (
                                                    <option key={tech} value={tech}>{tech}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="technology-select"
                                                value={fileOptions[file._id]?.material || ''}
                                                onChange={e => handleOptionChange(file._id, 'material', e.target.value)}
                                                disabled={fileOptions[file._id]?.customPrice}
                                            >
                                                {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.material.map(mat => (
                                                    <option key={mat} value={mat}>{mat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="technology-select"
                                                value={fileOptions[file._id]?.color || ''}
                                                onChange={e => handleOptionChange(file._id, 'color', e.target.value)}
                                                disabled={fileOptions[file._id]?.customPrice}
                                            >
                                                {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.color.map(col => (
                                                    <option key={col} value={col}>{col}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="technology-select"
                                                value={fileOptions[file._id]?.quality || ''}
                                                onChange={e => handleOptionChange(file._id, 'quality', e.target.value)}
                                                disabled={fileOptions[file._id]?.customPrice}
                                            >
                                                {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.quality.map(qual => (
                                                    <option key={qual} value={qual}>{qual}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="technology-select"
                                                value={fileOptions[file._id]?.density || ''}
                                                onChange={e => handleOptionChange(file._id, 'density', e.target.value)}
                                                disabled={fileOptions[file._id]?.customPrice}
                                            >
                                                {optionsData.technologyOptions[fileOptions[file._id]?.technology || 'FDM/FFF']?.density.map(den => (
                                                    <option key={den} value={den}>{den}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='col-md-1 text-center'>
                                            ₹ {calculatePrice(
                                                fileOptions[file._id]?.material || 'PLA',
                                                fileOptions[file._id]?.density || '20%',
                                                fileOptions[file._id]?.quality || 'Draft',
                                                file.buildVolume,
                                                fileOptions[file._id]?.customPrice || 0 // Pass customPrice if available
                                            )}
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={fileOptions[file._id]?.quantity || 1}
                                                onChange={e => handleOptionChange(file._id, 'quantity', parseInt(e.target.value))}
                                                className="form-control"
                                            />
                                        </td>
                                        <td className='col-md-1 text-center'>
                                            ₹ {calculateItemTotal(
                                                fileOptions[file._id]?.material || 'PLA',
                                                fileOptions[file._id]?.density || '20%',
                                                fileOptions[file._id]?.quality || 'Draft',
                                                file.buildVolume,
                                                fileOptions[file._id]?.quantity || 1,
                                                fileOptions[file._id]?.customPrice || 0
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default AddingNewFileToOrderId;
