import React, { useState} from 'react';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import EditUser from './EditUser';
import EditIcon from '@mui/icons-material/Edit';

const EditUserDetails = ({propsdata, handleRefresh}) => {
    const [dialogVisible, setDialogVisible] = useState(false);


    return (
        <div className="card">
            <EditIcon
                style={{color: '#06827d', cursor: 'pointer'}}
                onClick={() => setDialogVisible(true)}
            />
            <Dialog
                header="Edit User"
                visible={dialogVisible}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                modal
                onHide={() => setDialogVisible(false)}
            >
                 <EditUser setDialogVisible={setDialogVisible} propsdata={propsdata} handleRefresh={handleRefresh}/>
            </Dialog>
        </div>
    );
};

export default EditUserDetails;
