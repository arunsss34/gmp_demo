import React, { useState} from "react";
import {postToAPI } from "../apiCall/ApiCall.js";
import {
TextField, Container, Paper, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ToastMessage from '../ToastMessage.js';




export default function SignUp() {
  const [getpwd, setpwd] = useState(null);
  const [getconfirmpwd, setconfirmpwd] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {oldpwd:getpwd, newpwd:getconfirmpwd};
      const result = await postToAPI("/update_password", data);
      if (result.rval > 0) {
        setMessage(result.message);
        setShowMessage(true);
        setVariant('success');
        await sleep(2000);
        navigate('/')

      } else {
        setShowMessage(true);
        setMessage(result.message);
        setVariant('error');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 

  return (
    <Container>
      <ToastMessage  showmessage={showMessage} message={message} variant={variant}/>
      <h3 style={{opacity:0.4}}>Update Password</h3>
      <Paper elevation={3} style={{ padding: "40px", textAlign: ""}}>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                    label="Old Password"
                    type="password"
                    variant="outlined"
                    fullWidth 
                    value={getpwd}
                    onChange={(e) => setpwd(e.target.value)}
                    sx={{ marginBottom: 2 }}    
                    required
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    label="New Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={getconfirmpwd}
                    onChange={(e) => setconfirmpwd(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Button
                        type="submit"
                        variant="contained"
                        style={{
                          backgroundColor: '#056646',
                          color: 'white',
                          float: 'right'
                        }}
                    >
                        Submit
                    </Button>
                </Grid>
        </form><br/>
      </Paper>
    </Container>
  );
}
