import React from "react";
import axios from "axios";

const DownloadZip = ({ orderId }) => {
    const handleDownload = async () => {
        console.log(`Downloading for orderId: ${orderId}`); // Debug log

        try {
            const response = await axios.get(
                `http://localhost:3001/download-zip/${orderId}`,
                { responseType: "blob" }
            );

            console.log("API Response:", response);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `order-${orderId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading ZIP file:", error);
        }
    };


    return (
        <button className="btn btn-primary" onClick={handleDownload}>
            Download All Files as ZIP
        </button>
    );
};

export default DownloadZip;
