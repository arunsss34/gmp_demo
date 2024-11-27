import React, { useState} from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import AddNewUser from './AddNewUser';

const NewUser = ({handleRefresh}) => {
    const [dialogVisible, setDialogVisible] = useState(false);


    return (
        <div className="card">
            <Button
                label= 'Add'
                icon="pi pi-plus"
                size='small'
                style={{background:'#48a1eb;', color: 'white'}}
                onClick={() => setDialogVisible(true)}
            />
            <Dialog
                header="Add New User"
                visible={dialogVisible}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                modal
                onHide={() => setDialogVisible(false)}
            >
                 <AddNewUser setDialogVisible={setDialogVisible} handleRefresh={handleRefresh} />
            </Dialog>
        </div>
    );
};

export default NewUser;
