import * as React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

function MyApp({ showmessage, message, variant, resetShowMessage }) {
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (showmessage) {
      enqueueSnackbar(message, { variant: variant });
      resetShowMessage(); 
    }
  }, [showmessage, message, variant, enqueueSnackbar, resetShowMessage]);

  return null;
}

export default function IntegrationNotistack({ showmessage, message, variant, setShowMessage }) {
  const resetShowMessage = () => {
    setShowMessage(false); 
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={6000}
    >
      <MyApp showmessage={showmessage} message={message} variant={variant} resetShowMessage={resetShowMessage} />
    </SnackbarProvider>
  );
}