import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { WhatsappShareButton, TelegramShareButton, EmailShareButton, WhatsappIcon, TelegramIcon, EmailIcon } from 'react-share';

export default function SharePdf({ baseLink }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Convert base64 string to Blob and create object URL
  const convertBase64ToBlobUrl = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Create object URL from the Blob
    return URL.createObjectURL(blob);
  };

  const showPopup = () => {
    if (!pdfUrl) {
      // Create PDF URL from base64 if it hasn't been created yet
      const formattedBase64 = baseLink.replace('data:application/pdf;base64,', '');
      const blobUrl = convertBase64ToBlobUrl(formattedBase64);
      setPdfUrl(blobUrl);
    }
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
    if (pdfUrl) {
      // Clean up the object URL
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <div>
      {/* Share button */}
      <Button
        text="Share PDF"
        type="default"
        stylingMode="contained"
        onClick={showPopup}
      />

      {/* DevExtreme Popup */}
      <Popup
        visible={isPopupVisible}
        onHiding={hidePopup}
        dragEnabled={true}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Share PDF"
        width={200}
        height={150}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {/* WhatsApp Share Button */}
          {pdfUrl && (
            <>
              <WhatsappShareButton url={pdfUrl} >
                <WhatsappIcon size={50} round />
              </WhatsappShareButton>

              {/* Telegram Share Button */}
              <TelegramShareButton url={pdfUrl} >
                <TelegramIcon size={50} round />
              </TelegramShareButton>

              {/* Gmail (Email) Share Button */}
              {/* <EmailShareButton url={pdfUrl} subject="Check out this PDF" body="Here is an interesting PDF I wanted to share with you.">
                <EmailIcon size={50} round />
              </EmailShareButton> */}
            </>
          )}
        </div>
      </Popup>
    </div>
  );
}