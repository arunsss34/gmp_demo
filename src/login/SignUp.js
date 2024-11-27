import React, { useState, useEffect } from "react";
import { getFromAPI, postToAPI } from "../apiCall/ApiCall.js";
import {
  FormControl, InputLabel, MenuItem, Select,
  TextField, Container, Paper, Grid, CircularProgress
} from "@mui/material";
import Button from "@mui/material/Button";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ToastMessage from '../ToastMessage.js';

export default function SignUp() {
  const [getdob, setdob] = useState(null);
  const [getfirstname, setfirstname] = useState(null);
  const [getlastname, setlastname] = useState(null);
  const [getusername, setusername] = useState(null);
  const [getdept, setdept] = useState(null);
  const [getpwd, setpwd] = useState(null);
  const [getconfirmpwd, setconfirmpwd] = useState(null);
  const [getmobile, setmobile] = useState(null);
  const [getdeptdp, setdeptdp] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [loading, setLoading] = useState(false); // Loader state

  const dateformatconvert = (inputDateTime) => {
    if (inputDateTime !== null) {
      const utcDate = new Date(inputDateTime);
      const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit' };
      const indiaDate = new Intl.DateTimeFormat('en-IN', options).format(utcDate);
      const parts = indiaDate.split('/');
      const rearrangedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return rearrangedDate;
    } else {
      return null;
    }
  }

  useEffect(() => {
    async function fetchTaskData() {
      setLoading(true);
      try {
        const response = await getFromAPI("/dept");
        setdeptdp(response.dept);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false); 
      }
    }
    fetchTaskData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form submission starts
    try {
      const data = {
        firstname: getfirstname, lastname: getlastname, username: getusername,
        dept_fk: getdept['dept_pk'], pwd: getpwd, confirmpwd: getconfirmpwd, mobile: getmobile, dob: dateformatconvert(getdob)
      };
      const result = await postToAPI("/register", data);
      if (result.rval > 0) {
        setMessage(result.message);
        setShowMessage(true);
        setVariant('success');
        setconfirmpwd(null);
        setusername(null);
        setfirstname(null);
        setmobile(null);
        setlastname(null);
        setdeptdp([]);
        setdept(null);

        await sleep(2000);
      } else {
        setShowMessage(true);
        setMessage(result.message);
        setVariant('error');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when form submission ends
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <Container>
      <ToastMessage showmessage={showMessage} message={message} variant={variant} />
      <h3 style={{ opacity: 0.4 }}>Register</h3>
      <Paper elevation={3} style={{ padding: "40px", textAlign: "" }}>
        {/* Show loader while loading */}
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="First Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={getfirstname}
                  onChange={(e) => setfirstname(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Last Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={getlastname}
                  onChange={(e) => setlastname(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Date of Birth"
                      value={getdob || null}
                      onChange={(date) => { setdob(date) }}
                      renderInput={(params) => <TextField {...params} required />}
                      fullWidth
                      required
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="dept-label">Department</InputLabel>
                  <Select
                    labelId="dept-label"
                    id="dept-select"
                    value={getdept}
                    onChange={(e) => { setdept(e.target.value) }}
                    label="Department"
                    required
                  >
                    {getdeptdp.map((item) => (
                      <MenuItem key={item.dept_pk} value={item} name={item.dept_pk}>
                        {item.dept_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Mobile No"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={getmobile}
                  onChange={(e) => setmobile(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="User Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={getusername}
                  onChange={(e) => setusername(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Password"
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
                  label="Confirm Password"
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
                Register
              </Button>
            </Grid>
          </form>
        )}
        <br />
      </Paper>
    </Container>
  );
}
