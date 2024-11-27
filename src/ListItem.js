import React, { useState, useEffect, useContext } from "react";
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { setSelectedComponent } from './renderSlice';
import { getFromAPI } from './apiCall/ApiCall';
import ThemeContext from './Component/ThemeContext';

// Icon imports
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useMediaQuery } from '@mui/material';


// Map of icons to their components
const iconMap = {
  DashboardIcon: DashboardIcon,
  AssignmentIcon: AssignmentIcon,
  AddBoxIcon: AddBoxIcon,
  PersonIcon: PersonIcon,
  HomeIcon: HomeIcon,
  AssessmentIcon: AssessmentIcon,
  MonetizationOnIcon: MonetizationOnIcon,
  ReceiptIcon: ReceiptIcon,
  PaymentIcon: PaymentIcon,
  InventoryIcon: InventoryIcon,
  AccountBalanceWalletIcon: AccountBalanceWalletIcon
};

const RecursiveMenu = ({setOpen, items, openIndices, setOpenIndices, parentKey = '', dispatch, activeMenuKey, setActiveMenuKey }) => {
  const isMobile = useMediaQuery('(max-width:650px)');

  const handleClick = (index, item) => {
    const currentKey = `${parentKey}${index}`;
    setOpenIndices(prevIndices => {
      const newIndices = { ...prevIndices };
      if (newIndices[currentKey]) {
        delete newIndices[currentKey];
      } else {
        newIndices[currentKey] = true;
      }
      return newIndices;
    });
    setActiveMenuKey(currentKey);
    dispatch(setSelectedComponent({ menu_pk: item.menupk }));
    if (!item.sublist || item.sublist.length === 0) {
      if (isMobile) {
        setOpen(false);
      }
    }

  };

  const createIconComponent = (iconName) => {
    return iconMap[iconName];
  };

  const { currentTheme } = useContext(ThemeContext);

  return (
    <List component="div" disablePadding sx={{ background: currentTheme.background }}>
      {items.map((item, index) => {
        const currentKey = `${parentKey}${index}`;
        return (
          <React.Fragment key={item.menupk}>
            <ListItemButton
              onClick={() => handleClick(index, item)}
              style={{
                backgroundColor: currentKey === activeMenuKey ? currentTheme.activeMenuBackground : 'transparent',
                color: currentKey === activeMenuKey ? currentTheme.activeMenuText : currentTheme.text
              }}
            >
              {item.icon && (
                <ListItemIcon style={{ color: currentTheme.text }}>
                  {React.createElement(createIconComponent(item.icon))}
                </ListItemIcon>
              )}
              <ListItemText primary={item.menu_description} />
              {item.sublist && item.sublist.length > 0 && (openIndices[currentKey] ?
                <ExpandLess sx={{ color: currentTheme.text }} /> :
                <ExpandMore sx={{ color: currentTheme.text }} />
              )}
            </ListItemButton>
            {item.sublist && item.sublist.length > 0 && (
              <Collapse in={!!openIndices[currentKey]} timeout="auto" unmountOnExit>
                <RecursiveMenu
                  items={item.sublist}
                  openIndices={openIndices}
                  setOpenIndices={setOpenIndices}
                  parentKey={currentKey}
                  dispatch={dispatch}
                  activeMenuKey={activeMenuKey}
                  setActiveMenuKey={setActiveMenuKey}
                  setOpen={setOpen}
                />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

const MainMenu = ({setOpen}) => {
  const dispatch = useDispatch();
  const [mainMenuList, setMainMenuList] = useState([]);
  const [openIndices, setOpenIndices] = useState({});
  const [activeMenuKey, setActiveMenuKey] = useState('');
  const { currentTheme } = useContext(ThemeContext);

  async function fetchData() {
    try {
      const response = await getFromAPI("/main_menu");
      setMainMenuList(response.main_menu);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      style={{ background: currentTheme.background }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          style={{ background: currentTheme.background, color: currentTheme.text, opacity: .7 }}
          component="div"
          id="nested-list-subheader"
          inset
        >
          Main Menu
        </ListSubheader>
      }
    >
      <RecursiveMenu
        items={mainMenuList}
        openIndices={openIndices}
        setOpenIndices={setOpenIndices}
        dispatch={dispatch}
        activeMenuKey={activeMenuKey}
        setActiveMenuKey={setActiveMenuKey}
        setOpen={setOpen}
      />
    </List>
  );
};

export default MainMenu;
