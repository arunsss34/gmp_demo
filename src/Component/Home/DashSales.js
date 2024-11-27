import React, { useEffect, useState, useContext } from 'react';
import { Chart, CommonSeriesSettings,Tooltip, Series, Label, Legend, ValueAxis, Export } from 'devextreme-react/chart';
import Grid from '@mui/material/Grid';
import { Tabs, Tab, Typography, Box, CircularProgress } from '@mui/material'; // Import CircularProgress
import { getFromAPI } from "../../apiCall/ApiCall.js";
import DashCountSales from '../SalesDash/DashCount';
import DashCountReceipt from './ReceiptCount.js';
import ThemeContext from '../ThemeContext';


function Scales() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const periods = ['week', '2_week', 'month', 'year'];
  const [period, setPeriod] = useState(periods[0]); 
  const [count, setCount] = useState({no_of_bills: 0, TaxableAmount: 0, NetAmount: 0});
  const [count1, setCount1] = useState({no_of_bills: 0, ReceivedAmount: 0, BalanceAmount: 0});
  const [date, setDate] = useState('');

  const { currentTheme } = useContext(ThemeContext);

  const handleTabChange = async (event, newValue) => {
    setSelectedIndex(newValue);
    const newPeriod = periods[newValue];
    setPeriod(newPeriod); 
  };

  function onPointClick(e) {
    e.target.select();
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getFromAPI(`/get_sales_receipt_charts?data=${JSON.stringify({value: period})}`);
      console.log(response, "---------ttt");
      setDataSource(response.sales || []);
      setCount(response.bills[0] || {});
      setCount1(response.receipt_bill[0] || {});
      setDate(response.last_updated_date)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, [period]); 

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  const tabContent = [
    { title: 'Week' },
    { title: '2 Week' },
    { title: 'Month' },
    { title: 'Year' },
  ];

  const formatLakhs = (value) => {
    const lakhValue = value / 100000;
    return lakhValue.toFixed(2) + 'Lakhs';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Grid container alignItems={'center'} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} 
      sx={{ mb: 3 }}
      >
      <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
              {date}
            </Typography>
      </Grid>
      <DashCountSales count={count} count1={count1} type = {1}/><br/>
      {/* <DashCountReceipt count1={count1}/><br/> */}
      <Grid item xs={12} md={8}>
        <Tabs
          value={selectedIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '.MuiTab-root': {
              color: currentTheme.text, // Color for inactive tabs
            },
            '.Mui-selected': {
              color: currentTheme.text, // Color for the selected tab
            },
            fontSize:5
          }}
        >
          {tabContent.map((tab, index) => (
            <Tab key={index} label={tab.title} />
          ))}
        </Tabs>
      </Grid><br/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} sx={{
          // border: '.5px solid #ece5e5',
          // borderRadius: 1,
          background: currentTheme.background,
        }}>
          <Chart
            id="chart"
            dataSource={dataSource}
            onPointClick={onPointClick}
          >
            <ValueAxis
              min={0} 
              grid={{ visible: false }} 
            >
              <Label
                visible={true}
                customizeText={(e) => formatLakhs(e.value)}
              />
            </ValueAxis>
            <CommonSeriesSettings
              argumentField="label"
              type="bar"
              hoverMode="allArgumentPoints"
              selectionMode="allArgumentPoints"
            >
              {/* <Label visible={true} customizeText={(e) => formatLakhs(e.value)} /> */}
            </CommonSeriesSettings>
            <Tooltip
              enabled={true}
              customizeTooltip={(e) => ({
                text: `${formatLakhs(e.value)}`
              })}
            />
            <Series
              argumentField="label"
              valueField="sales"
              name="sales"
            />
            <Series
              valueField="receipts"
              name="receipts"
            />
            <Legend
              verticalAlignment="bottom"
              horizontalAlignment="center"
            />
            <Export enabled={true} />
          </Chart>
        </Grid>
        {/* <Grid item xs={12} md={12} sx={{
          // border: '.5px solid #ece5e5',
          // borderRadius: 1,
          background: currentTheme.background,
          marginTop: 1
        }}>
          <Typography sx={{textAlign: 'center', color: currentTheme.text}}>Sales by Customer</Typography>
          <ScalesByCustomer period={period}/>
        </Grid>

        <Grid item xs={12} md={12} sx={{
          // border: '.5px solid #ece5e5',
          // borderRadius: 1,
          background: currentTheme.background,
          marginTop: 1
        }}>
          <Typography sx={{textAlign: 'center', color: currentTheme.text}}>Sales by Type</Typography>
          <ScalesByType period={period}/>
        </Grid>

        <Grid item xs={12} md={12} sx={{
          // border: '.5px solid #ece5e5',
          // borderRadius: 1,
          background: currentTheme.background,
          marginTop: 1
        }}>
          <Typography sx={{textAlign: 'center', color: currentTheme.text}}>Sales by Document Type</Typography>
          <SalesStackedBar period={period}/>
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default Scales;
