import React, { useEffect, useState } from 'react';
import { getFromAPI } from '../apiCall/ApiCall';
import ToastMessage from '../ToastMessage';
import { Grid, CircularProgress, Card, CardContent, Typography, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Tune';
import { ListBox } from 'primereact/listbox';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function Outstanding() {
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [getAgentDetails, setAgentDetails] = useState([]);

  const cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];


  const handleIconClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownChange = (e) => {
    setSelectedCity(e.value);
    setDropdownVisible(false);
  };

  async function fetchData() {
      setLoading(true);
      try {
          const response1 = await getFromAPI("/get_agent_details");
          setAgentDetails(response1.agent_details)
          console.log('===',response1)
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
  }

  useEffect(() => {
      fetchData();
  }, []);

  const handleRefresh = () => {
      fetchData();
  };

  return (
      <>
          <ToastMessage />
          {loading ? (
              <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                  <CircularProgress />
              </Grid>
          ) : (
              <>
                <div style={{ marginTop: 50, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative' }}>
                      <SearchIcon
                          fontSize="large"
                          style={{ color: '#06827d', cursor: 'pointer' }}
                          onClick={handleIconClick}
                      />
                      {dropdownVisible && (
                          <div style={{ position: 'absolute', top: '40px', right: 0, zIndex: 1000 }}>
                          <ListBox 
                              value={selectedCity}
                              onChange={(e) => handleDropdownChange(e)}
                              options={cities}
                              optionLabel="name"
                              className="w-full md:w-14rem"
                              style={{ backgroundColor: 'white', zIndex: 1000, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                          />
                      </div>
                      )}
                </div>

            <div style={{ padding: 5,marginTop: 20 }}>
                <Grid container spacing={2}>
                  {getAgentDetails.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={8}>
                              <Typography variant="h6">{item.AgentName}</Typography>
                            </Grid>
                            <Grid item xs={4} container direction="column" alignItems="flex-end">
                             <b>&#8377;{item.BalanceAmount.toLocaleString('en-IN')}</b>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
              </>
          )}
      </>
  );
}
