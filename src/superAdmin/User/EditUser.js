import React, { useState, useEffect,useRef } from "react";
import { getFromAPI, postToAPI } from "../../apiCall/ApiCall.js";
import { Container, Grid, CircularProgress} from "@mui/material";
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';     
import { InputText } from "primereact/inputtext";
import ToastMessage from '../../ToastMessage.js';
import { Dropdown } from 'primereact/dropdown';

export default function EditUser({setDialogVisible,propsdata,handleRefresh}) {
  const [getUserName, setUserName] = useState('');
  const [getAddress, setAddress] = useState('');
  const [getLocation, setLocation] = useState('');
  const [getMobileNo, setMobileNo] = useState('');
  const [getRole, setRole] = useState('');
  const [getRoleDetails, setRoleDetails] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [error, setError] = useState(false);



  
  const handleContactNoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
        setMobileNo(value);
        setError(value.length !== 10);
    }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const response1 = await getFromAPI("/get_role");
        setRoleDetails(response1.role);
        setRole({role:propsdata.role,role_pk:propsdata.role_fk})
        setUserName(propsdata.name)
        setAddress(propsdata.address)
        setLocation(propsdata.location)
        setMobileNo(propsdata.mobile)
        
      } catch (error) {
        console.error("Error fetching options:", error);
        setMessage("Error fetching options.");
        setVariant("error");
        setShowMessage(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error){
      return
    }

    setLoading(true); 
    try {
      const data = {
       
        name:getUserName,
        address:getAddress,    
        location: getLocation,
        mobile:getMobileNo,
        role_fk:getRole.role_pk,
        user_pk:propsdata.user_pk
      };

      const result = await postToAPI("/edit_user", data);
      if (result.rval> 0) {
        setMessage(result.message);
        setVariant('success');
        setShowMessage(true);
        setUserName('');
        setLocation('');
        setMobileNo('');
        handleRefresh();
        await sleep(2000);
        setDialogVisible(false);
      } else {
        setMessage(result.message || "Failed to add team.");
        setVariant('error');
        setShowMessage(true);
      }
    } catch (error) {
      console.error("Error adding team:", error);
      setMessage("An error occurred. Please try again.");
      setVariant("error");
      setShowMessage(true);
    } finally {
      setLoading(false); 
    }


  };


  return (
    <Container maxWidth="xl">
      <ToastMessage showmessage={showMessage} message={message} variant={variant} setShowMessage={setShowMessage}/>  
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <><br/>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <Dropdown style={{width:'100%'}} value={getRole} onChange={(e) => setRole(e.value)} options={getRoleDetails} optionLabel="role"
               placeholder="Roles" className="w-full md:w-14rem" />
              
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FloatLabel >
                  <InputText style={{width:'100%'}} id="username" className="p-inputtext-lg" value={getUserName} onChange={(e) => setUserName(e.target.value)} required/>
                  <label for="username">Username</label>
              </FloatLabel>
              </Grid>
              
              <Grid item xs={12} md={6}>
              <FloatLabel>
                  <InputText style={{width:'100%'}} id="location" className="p-inputtext-lg"value={getLocation} onChange={(e) => setLocation(e.target.value)} />
                  <label for="location">Location</label>
              </FloatLabel>
              
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="p-field">
                <FloatLabel>
                <InputText 
                    id="MobileNO"
                    style={{ width: '100%' }} 
                    className={`p-inputtext-lg ${error ? 'p-invalid' : ''}`}
                    value={getMobileNo}
                    onChange={handleContactNoChange}
                    required
                />
                <label htmlFor="MobileNO">Mobile NO</label>
                  </FloatLabel>
                    {error && (
                    <small className="p-error">
                    Contact number must be 10 digits long
                </small>
            )}
        </div>
              
              </Grid>
              <Grid item xs={12} md={12}>
              <FloatLabel>
                  <InputText style={{width:'100%'}} id="address" className="p-inputtext-lg" value={getAddress} onChange={(e) => setAddress(e.target.value)} required/>
                  <label for="address">Address</label>
              </FloatLabel>
              </Grid>

              
            
      
            </Grid><br/>
            <Grid item xs={12} md={4}>
                <Button style={{background:'#48a1eb;', color: 'white'}} label="Update" icon="pi pi-check" size="small" type="submit"/>
                &nbsp;&nbsp;
            </Grid>
          </form><br/>
         
          
        </>
      )}
     
    </Container>
  );
}
