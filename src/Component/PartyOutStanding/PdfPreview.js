import React, { useState,useContext } from 'react';
import { Popup } from 'devextreme-react/popup';
import { Worker,Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useMediaQuery } from '@mui/material';
import { Button } from 'devextreme-react/button';
import ThemeContext from '../ThemeContext';



function PdfPreview({ baseLink, isVisible, setPdfVisible, fileName }) {
  const [isDialogOpen, setIsDialogOpen] = useState(isVisible);
  const { currentTheme } = useContext(ThemeContext);


const handleDownload = (base64String, file_name) => {
  if (base64String) {
    // Convert the base64 string to a Blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(link.href);
  }
};

  const closeDialog = () => {
    setIsDialogOpen(false);
    setPdfVisible(false);
  };

  const formattedSrc = baseLink.startsWith('data:application/pdf;base64,') 
    ? baseLink 
    : `data:application/pdf;base64,${baseLink}`;
  
  const isMobile = useMediaQuery('(max-width:650px)'); 

  return (
    <div>
      <Popup
        visible={isDialogOpen}
        onHiding={closeDialog}
        dragEnabled={true}
        hideOnOutsideClick={true}
        showTitle={true}
        title={fileName}
        fullScreen={true}
        showCloseButton={true}
      >
        {isMobile ? (
          // for mobile view
          <>
            <Button
              text="Download PDF"
              type="default"
              stylingMode="contained"
              onClick={() => handleDownload(baseLink, fileName)} 
            />
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={formattedSrc} />
            </Worker>
          </>
        ) : (
          // for desktop view
          <iframe
            src={formattedSrc}
            width="100%"
            height="100%"
            title="PDF Preview"
            className="pdf-preview"
          />
        )}
      </Popup>

      
    </div>
  );
}

export default PdfPreview;