import React,{useEffect,useState,useMemo} from 'react'
import NewDoc from './NewUser.js';
import { getFromAPI,postToAPI } from "../../apiCall/ApiCall.js";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Grid, CircularProgress, } from "@mui/material";
import EditUserDetails from './EditUserDetails.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ToastMessage from '../../ToastMessage.js';

const MySwal = withReactContent(Swal);

function UserList() {
  const [getUserDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');


  async function fetchOptions() {
    setLoading(true);
    try {
      const response1 = await getFromAPI("/get_user_list");
        setUserDetails(response1.user_list);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleRefresh = ()=>{
    fetchOptions();
  }

  const CustomButtonComponentEdit = (rowData) => {
    return (
        <EditUserDetails propsdata={rowData} handleRefresh={handleRefresh} />
    );
};

const handleDelete =  (rowData) => {
  MySwal.fire({
    title: `Are you sure delete the user ${rowData.name}?`,
    text: "Do you want to proceed?",
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(rowData)
    } 
  });
};

async function deleteUser(rowData){
  setLoading(true); 
  try {
    const data = {
      user_pk:rowData.user_pk
    };
    const result = await postToAPI("/delete_user", data);
    if (result.rval> 0) {
      setMessage(result.message);
      setVariant('success');
      setShowMessage(true);
  
      await sleep(2000);
      handleRefresh();
    } else {
      setMessage(result.message || "Failed to delete user.");
      setVariant('error');
      setShowMessage(true);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    setMessage("An error occurred. Please try again.");
    setVariant("error");
    setShowMessage(true);
  } finally {
    setLoading(false); 
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const deleteIcon = (props)=>{
  return <DeleteForeverIcon onClick={() => handleDelete(props)} style={{color: 'red' , cursor: 'pointer'}}/>
}



  return (
    <div>  
    <ToastMessage showmessage={showMessage} message={message} variant={variant} setShowMessage={setShowMessage}/>  

    <NewDoc handleRefresh={handleRefresh} />

    <br />
    {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
        <CircularProgress />
      </Grid>
      ) : (
        <div className="card">
            <DataTable value={getUserDetails} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="serial" header="S.No" body={(rowData)=>getUserDetails.indexOf(rowData) + 1} headerClassName="custom-header"/>
                        <Column field="name" header="Name" headerClassName="custom-header"/>
                        <Column field="role" header="Role" headerClassName="custom-header"/>
                        <Column field="address" header="Address" headerClassName="custom-header"/>
                        <Column field="location" header="Location" headerClassName="custom-header"/>
                        <Column field="mobile" header="Mobile" headerClassName="custom-header" />
                        <Column header="Edit" body={CustomButtonComponentEdit} headerClassName="custom-header"/>
                        <Column header="Delete" body={deleteIcon} headerClassName="custom-header"/>
            </DataTable>
        </div>
      )}
   
  </div>
  )
}

export default UserList