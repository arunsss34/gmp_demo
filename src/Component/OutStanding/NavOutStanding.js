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

const NavOutStanding = () => {
  const isMobile = useMediaQuery('(max-width:650px)'); 
  const [activeComponent, setActiveComponent] = useState('Agent Info');
  const [breadcrumbPaths, setBreadcrumbPaths] = useState(['Agent Info']);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const [searchWord, setSearchWord] = useState('');
  const { currentTheme } = useContext(ThemeContext);
  const handleSearchChange = (event) => {
      setSearchWord(event.target.value);
  };

  const PathPages={
    AgentInfo:['Agent Info'],
    PartyInfo:['Agent Info', 'Party Info'],
    PartyDetails:['Agent Info', 'Party Info', 'Party Details']
  }

  const handleNavigation = (componentId, label) => {
    setActiveComponent(componentId);

    if (componentId === 'Agent Info') {
      setBreadcrumbPaths(PathPages.AgentInfo);
    } else if (componentId === 'Party Info') {
      setBreadcrumbPaths(PathPages.PartyInfo);
    } else if (componentId === 'Party Details') {
      setBreadcrumbPaths(PathPages.PartyDetails);
    }
  };

  const handleBreadcrumbClick = (path) => {
    if (path === 'Agent Info') {
      setActiveComponent('Agent Info');
      setBreadcrumbPaths(PathPages.AgentInfo);
    } else if (path === 'Party Info') {
      setActiveComponent('Party Info');
      setBreadcrumbPaths(PathPages.PartyInfo);
    } else if (path === 'Party Details') {
      setActiveComponent('Party Details');
      setBreadcrumbPaths(PathPages.PartyDetails);
    }
  };
  const searchViewMobile=isMobile&&activeComponent === 'Party Details'
  
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
  
      {activeComponent === 'Agent Info' && <AgentInfo onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
      {activeComponent === 'Party Info' && <PartyInfo onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
      {activeComponent === 'Party Details' && <PartyDetails onNavigate={handleNavigation} searchWord={searchWord} setSearchWord={setSearchWord}/>}
    </div>
  );
};

export default NavOutStanding;
