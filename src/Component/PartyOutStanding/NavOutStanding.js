import React, { useState,useEffect, useContext } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import AgentInfo from './AgentInfo';
import PartyInfo from './PartyInfo';
import PartyDetails from './PartyDetails';
import colorconfig from '../colorconfig';
import { getFromAPI } from '../../apiCall/ApiCall';
import { useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import ThemeContext from '../ThemeContext';
import { useMediaQuery } from '@mui/material';

const PathPages={
  PartyInfo:['Party Info'],
  AgentInfo:['Party Info', 'Agent Info'],
  PartyDetails:['Party Info', 'Agent Info', 'Party Details']
}
const InfoNames={
  PartyInfo:'Party Info',
  AgentInfo:'Agent Info',
  PartyDetails:'Party Details'
}

const NavOutStanding = () => {
  const isMobile = useMediaQuery('(max-width:650px)'); 
  const [activeComponent, setActiveComponent] = useState(InfoNames.PartyInfo);
  const [breadcrumbPaths, setBreadcrumbPaths] = useState(PathPages.PartyInfo);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const [searchWord, setSearchWord] = useState('');
  const { currentTheme } = useContext(ThemeContext);
  const handleSearchChange = (event) => {
      setSearchWord(event.target.value);
  };

  

  const handleNavigation = (componentId, label) => {
    setActiveComponent(componentId);

    if (componentId === InfoNames.PartyInfo) {
      setBreadcrumbPaths(PathPages.PartyInfo);
    } else if (componentId === InfoNames.AgentInfo) {
      setBreadcrumbPaths(PathPages.AgentInfo);
    } else if (componentId === InfoNames.PartyDetails) {
      setBreadcrumbPaths(PathPages.PartyDetails);
    }
  };

  const handleBreadcrumbClick = (path) => {
    if (path === InfoNames.PartyInfo) {
      setActiveComponent(InfoNames.PartyInfo);
      setBreadcrumbPaths(PathPages.PartyInfo);
    } else if (path === InfoNames.AgentInfo) {
      setActiveComponent(InfoNames.AgentInfo);
      setBreadcrumbPaths(PathPages.AgentInfo);
    } else if (path === InfoNames.PartyDetails) {
      setActiveComponent(InfoNames.PartyDetails);
      setBreadcrumbPaths(PathPages.PartyDetails);
    }
  };
  const searchViewMobile=isMobile&&activeComponent === InfoNames.PartyDetails
  
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: searchViewMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems:searchViewMobile?'': 'center', marginBottom: '5px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbPaths.map((path, index) => (
            index !== breadcrumbPaths.length - 1 ? (
              <Link
                key={path}
                color="inherit"
                onClick={() => handleBreadcrumbClick(path)}
                style={{ cursor: 'pointer', color: currentTheme.text, fontWeight: 'bold', opacity: 0.7 }}
              >
                {path}
              </Link>
            ) : (
              <Typography key={path} variant='h6' style={{ cursor: 'pointer', color: currentTheme.text, fontWeight: 'bold', opacity: 0.7 }}>
                {path}
              </Typography>
            )
          ))}
        </Breadcrumbs>
  
        <div style={{ display: 'flex', marginTop: searchViewMobile ? '5px' : '0',justifyContent:searchViewMobile?'flex-end':'', alignItems:searchViewMobile?'': 'center' }}>
          <div className="search-container">
            <InputText
              className="p-inputtext-sm search-input"
              value={searchWord}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
            <i className="pi pi-search search-icon" ></i>
          </div>
        </div>
      </div>
  
      {activeComponent === InfoNames.PartyInfo && <AgentInfo onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
      {activeComponent === InfoNames.AgentInfo && <PartyInfo onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
      {activeComponent === InfoNames.PartyDetails && <PartyDetails onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
    </div>
  );
};

export default NavOutStanding;
