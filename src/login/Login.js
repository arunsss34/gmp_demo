import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { postToAPI } from "../apiCall/ApiCall.js";
import { Container, Paper, Alert, Stack, Typography, Link, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  Login as LoginIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress"; 
import {decodeToken} from '../jwtdecode'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <br/>Powered by Innalytics
    </Typography>
  );
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const data = { username: username, password: password };
      const result = await postToAPI("/login", data);
      if (result.rval > 0) {
        Cookies.set("token", result.token);
        Cookies.set("Islogin", 'true');
        const role = decodeToken(result.token)['role_fk'];
        if (role === 1) {
          navigate('/SuperAdmin');
        }
        window.location.reload();
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container maxWidth="xs" className="login_c">
      <Paper elevation={3} style={{ padding: "40px", textAlign: "center"}}>
        <LockOpenIcon
          style={{ color: "#899499", width: "50px", height: "50px" }}
        />
        <br />
        <br />
        <br/>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username or ID"
            type="text"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <br />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            style={{
              width: "100%",
              marginBottom: 16,
              backgroundColor: '#899499',
              color: 'white'
            }}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LoginIcon />} 
            disabled={loading} 
          >
            {loading ? "Logging In..." : "Login"}
          </Button>
          <Stack sx={{ width: "100%" }} spacing={2}>
            {showAlert && (
              <Alert severity="error" onClose={handleCloseAlert}>
                User Invalid
              </Alert>
            )}
          </Stack>
        </form>
        <Grid container>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                {/* {"Don't have an account? Sign Up"} */}
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Paper>
    </Container>
  );
}
