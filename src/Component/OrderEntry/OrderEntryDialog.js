import React, { useState,useContext} from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import OrderEntryForm from './OrderEntryform';
import ThemeContext from '../ThemeContext.js';



const NewItem = ({}) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const { currentTheme } = useContext(ThemeContext);

    
    const CloseDialog=()=>{
        setDialogVisible(false)
        
    }

    return (
        <div className="card">
            <Button
                label= 'Add' outlined
                icon="pi pi-plus"
                style={{backgroundColor: currentTheme.lightbg, color: '#bf1d54', size:100}}
                onClick={() => setDialogVisible(true)}
            />
            <Dialog
                header="Customer Order Entry"
                visible={dialogVisible}
                style={{
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    margin: '0',
                    padding: '0',
                    top: '0',
                    left: '0',
                    position: 'fixed'
                }}
                headerStyle={{backgroundColor:currentTheme.lightbg, color: currentTheme.text, fontSize: '10px' }}
                maximizable
                modal
                contentStyle={{backgroundColor:currentTheme.lightbg,color: currentTheme.text, height: '300px' }}
                onHide={CloseDialog}
                closeIcon={<i className="pi pi-times custom-close-icon" style={{color: currentTheme.text}} />}
                maximizeIcon={<i className="pi pi-window-maximize custom-maximize-icon" style={{color: currentTheme.text}}/>}
            >
                 <OrderEntryForm />
            </Dialog>
        </div>
    );
};

export default NewItem;