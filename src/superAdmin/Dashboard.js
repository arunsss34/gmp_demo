import React, { useState, useContext} from "react";
import ThemeContext from '../Component/ThemeContext';
import { styled, createTheme,MenuItem,Menu, ThemeProvider, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MainMenu from '../ListItem';
import { decodeToken } from '../jwtdecode';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useSelector} from 'react-redux';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import AppsIcon from '@mui/icons-material/Apps';
import User from "./User/userList";
import colorconfig from "../Component/colorconfig";
import Home from '../Component/Home/Home1';
import Outstanding from "../Component/outstanding";
import NavOutStanding from '../Component/OutStanding/NavOutStanding';
import StockReport from '../Component/StockReport/StockReport';
import ColorsChange from '../Component/ColorsChange';
import SalesAnalysis from '../Component/SalesDash/Home';
import Frame from '../Component/frame/Frame';
import CustomerPo from '../Component/CustomerPO/CustomerPo';
import OrderEntry from '../Component/OrderEntry/OrderEntry';
import { useMediaQuery } from '@mui/material';
import PartyOutstanding from '../Component/PartyOutStanding/NavOutStanding';
import PendingOrder from "../Component/LuckyYarns/PendingOrder"
import LuckyWeavesPendingOrder from "../Component/LuckyWeaves/PendingOrder"
import FrameLuckyWeaves from '../Component/frame/FrameLuckyWeaves';


const drawerWidth = 270;
const token = Cookies.get('token');

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'fixed',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
          
        }),
        width: theme.spacing(0),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(0),
        },
      }),
    },
    zIndex: 0,
  }),
);
const defaultTheme = createTheme();

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width:650px)');
  const [open, setOpen] = useState(!isMobile);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const theme = useTheme();
  const navigate = useNavigate();

  const { currentTheme } = useContext(ThemeContext);

  console.log(currentTheme, "---------ssgod-")

  

  const [anchorEl, setAnchorEl] = useState(null);
  const open1 = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  
  const selectedComponent = useSelector(state => state.renderComponent.selectedComponent.component);
  

  const component = {
    User:<User/>,
    Outstanding:<Outstanding/>,
    NavOutStanding:<NavOutStanding/>,
    StockReport:<StockReport/>,
    Dashboard:<Home/>,
    SalesAnalysis:<SalesAnalysis/>,
    Frame: <Frame/>,
    CustomerPo:<CustomerPo/>,
    OrderEntry:<OrderEntry/>,
    PartyOutstanding:<PartyOutstanding/>,
    PendingOrder:<PendingOrder/>,
    LuckyWeavesPendingOrder:<LuckyWeavesPendingOrder/>,
    FrameLuckyWeaves:<FrameLuckyWeaves/>
  };

  const rendercomponent = () =>{
    return component[selectedComponent];
  }

  return (
    <ThemeProvider theme={defaultTheme} style={{background:'red'}}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" open={open} className="appbar" sx={{background: currentTheme.background, color: colorconfig.darkgreen}}>
        <Toolbar
              sx={{
                pr: "20px",

              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpen(!open)}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon  sx={{color: currentTheme.text}}/>
              </IconButton>
              {/* <img src={icon} alt="icon" width='23px' /> */}
              <Typography
                component="h1"
                variant="h6"
                color={currentTheme.text}
                noWrap
                sx={{ flexGrow: 1, fontSize: 16 }}
              >
                 <h4>{decodeToken(token)['comp_name']}</h4>
              </Typography>
              <ColorsChange/> 
              <IconButton
                onClick={handleMenu}
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <span style={{ fontSize: 14, fontWeight: "bold", color: currentTheme.text }}>
                  {decodeToken(token)['username']}&nbsp;&nbsp;&nbsp;
                </span>
                <AccountCircleIcon style={{color:currentTheme.text}}/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open1}
                onClose={handleClose}
              >
                <div>
                  <MenuItem onClick={handleClose}>
                    <PersonOutlineIcon />
                    {decodeToken(token)['username']}&nbsp;&nbsp;&nbsp;
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon />
                    &nbsp;Logout
                  </MenuItem>
                </div>
              </Menu>
            </Toolbar>
          </AppBar>
        <Drawer variant="permanent" open={open} >
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [],
                  background: currentTheme.lightbg,
                  padding: 2.23
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <AppsIcon sx={{color: currentTheme.text}}/>
                </IconButton>
              </Toolbar>
              <List component="nav" style={{background: currentTheme.background}}  sx={{
                      overflow: 'scroll',
                      height: '87vh',
                      background: currentTheme.background,
                      '&::-webkit-scrollbar': {
                          width: '0px',
                          background: currentTheme.background,
                      },
                      '&::-webkit-scrollbar-track': {
                          background: currentTheme.background,
                      },
                      '&::-webkit-scrollbar-thumb': {
                          background: currentTheme.background, 
                          borderRadius: '0px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                          background: currentTheme.background,
                      },
                  }}>
                <MainMenu setOpen={setOpen}/>
              </List>
        </Drawer>
        <Box
            component="main"
            sx={{
              backgroundColor: currentTheme.lightbg, 
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              marginLeft: open ? `${drawerWidth}px` : 0,
              transition: 'margin-left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms', 
              width: `calc(100% - ${drawerWidth}px)`,
              [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${theme.spacing(9)}px)`, 
                marginLeft: open ? `${theme.spacing(9)}px` : 0, 
              },
              overflow: 'scroll',
                      '&::-webkit-scrollbar': {
                          width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                          background: currentTheme.background,
                      },
                      '&::-webkit-scrollbar-thumb': {
                          background: currentTheme.background, 
                          borderRadius: '6px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                          background: currentTheme.background,
                      },
            }}
          >
          <Toolbar />
          <Container position='absolute' maxWidth="lg" sx={{ mt: 4, mb: 4}} >
          {rendercomponent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}