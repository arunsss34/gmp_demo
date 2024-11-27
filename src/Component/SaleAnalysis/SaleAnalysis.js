import React, { useState, useEffect } from 'react';
import { Button, Card,Paper, Grid, Typography, } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import { Button as PRButton } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';  
import ToastMessage from '../../ToastMessage';
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getFromAPI } from '../../apiCall/ApiCall';
import { Dropdown } from 'primereact/dropdown';
import TodayIcon from '@mui/icons-material/Today';
import { Chart } from 'primereact/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables, ChartDataLabels);

import { useDispatch,useSelector } from 'react-redux';

const SaleAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [selectedType, setSelectedType] = useState(null);
  const [DocType, setDocType] = useState([]);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const [NoOfBills, setNoOfBills] = useState(0);
  const [taxAmount, setTaxAmount] = useState(null);
  const [netAmount, setNetAmount] = useState(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [chartOptions3, setChartOptions3] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [Periods,setPeriods]=useState([])


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const last20Years = Array.from({ length: 20 }, (v, i) => currentYear - i);
    setYears(last20Years.map(year => ({ label: year, value: year })));
    setSelectedYear(currentYear);


    async function DropdownList(){
      try {
        const response = await getFromAPI('/get_dates');
        setPeriods(response.dates)
        setSelectedPeriod(response.dates[0])
      } catch (error) {
        setError('An error occurred while fetching leave requests.');
        console.error('Error fetching leave requests:', error);
      }} 
      DropdownList();
}, []);


  function formatNumber(num) {
    if (num < 1000) {
      return num.toString(); 
    } else if (num >= 1000 && num < 100000) {
      return (num / 1000).toFixed(1) + 'K'; 
    } else {
      return (num / 100000).toFixed(1) + 'L'; 
    }
  }

  function GraphData(response1){

  const response=  [
      {
         "DocumentType":"Fiber Sales Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":36119322,
         "5":9118960,
         "6":51960506,
         "7":12185504,
         "8":0,
         "9":0,
         "10":0,
         "11":0,
         "12":0
      },
      {
         "DocumentType":"Fiber Wastage Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":7081090,
         "5":3630567,
         "6":3667598,
         "7":2506088,
         "8":2045563,
         "9":944768,
         "10":0,
         "11":0,
         "12":0
      },
      {
         "DocumentType":"Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":348467693,
         "5":347287864,
         "6":365985728,
         "7":393524162,
         "8":395339242,
         "9":119500737,
         "10":0,
         "11":0,
         "12":0
      },
      {
         "DocumentType":"Machine Sales Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":200000,
         "5":1000000,
         "6":0,
         "7":0,
         "8":0,
         "9":0,
         "10":0,
         "11":0,
         "12":0
      },
      {
         "DocumentType":"Machine Spare Sales Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":106786,
         "5":1248397,
         "6":2960421,
         "7":101958,
         "8":625548,
         "9":236885,
         "10":0,
         "11":0,
         "12":0
      },
      {
         "DocumentType":"Packing Material Invoice",
         "1":0,
         "2":0,
         "3":0,
         "4":0,
         "5":69000,
         "6":6000,
         "7":0,
         "8":0,
         "9":0,
         "10":0,
         "11":0,
         "12":0
      }
   ]
    
    const x_axis = response.map(item => item.DocumentType);
    console.log(x_axis)
    // const y_axis = response1
    // .filter(item => item.TaxableAmount > 0)
    // .map(item => Object.values(item)[1]);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: x_axis,
      datasets: [
          {
              type: 'bar',
              label: 'Dataset 1',
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              data: [50, 25, 12, 48, 90, 76, 42]
          },
          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              data: [21, 84, 24, 75, 37, 65, 34]
          },
          {
              type: 'bar',
              label: 'Dataset 3',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: [41, 52, 24, 74, 23, 21, 32]
          }
      ]
  };
  const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          tooltips: {
              mode: 'index',
              intersect: false
          },
          legend: {
              labels: {
                  color: textColor
              }
          },
          datalabels: {
            formatter: (value) => formatNumber(value),
        }
      },
      scales: {
          x: {
              stacked: true,
              ticks: {
                  color: textColorSecondary,
                  font: {
                    size: 10,weight:100
                }
              },
              grid: {
                  color: surfaceBorder
              }
          },
          y: {
              stacked: true,
              ticks: {
                  color: textColorSecondary,
                  font: {
                    size: 10,weight:100
                }
              },
              grid: {
                  color: surfaceBorder
              }
          }
      }
  };

    setChartData(data)
    setChartOptions(options);
}

function GraphData2(response1){
  const x_axis = response1
    .filter(item => item.TaxableAmount > 0)
    .map(item => Object.values(item)[0]);
    const y_axis = response1
    .filter(item => item.TaxableAmount > 0)
    .map(item => Object.values(item)[1]);

  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const data = {
      labels: x_axis,
      datasets: [
          {
              label: 'Sales by Document Type',
              backgroundColor: documentStyle.getPropertyValue('--pink-500'),
              borderColor: documentStyle.getPropertyValue('--pink-500'),
              data: y_axis
          },
      ]
  };
  const options = {
      indexAxis: 'x',
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
          legend: {
              labels: {
                  fontColor: textColor
              }
          },
          datalabels: {
            color: textColor,
            align: 'top',
            formatter: (value) => formatNumber(value),
        }
      },
      
        layout: {
            padding: {
                top: 0 
            }
        },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                    size: 10,weight:100
                }
              },
              grid: {
                  display: false,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                    size: 10,weight:100
                }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };

  setChartData2(data)
  setChartOptions2(options);
}

function GraphData3(response1){
  const x_axis = response1
    .filter(item => item.TaxableAmount > 0)
    .map(item => Object.values(item)[0]);
    const y_axis = response1
    .filter(item => item.TaxableAmount > 0)
    .map(item => Object.values(item)[1]);

  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const data = {
      labels: x_axis,
      datasets: [
          {
              label: 'Sales by Customer',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              borderColor: documentStyle.getPropertyValue('--green-500'),
              data: y_axis
          },
      ]
  };
  const options = {
    indexAxis: 'y',
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
        legend: {
            labels: {
                fontColor: textColor
            }
        },
        datalabels: {
          color: textColor,
          anchor: 'center',
          align: 'right',
          formatter: (value) => formatNumber(value),
      }
    },
    
      layout: {
          padding: {
              top: 0 
          }
      },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary,
                font: {
                  size: 10,weight:100
              }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary,
                font: {
                  size: 10,weight:100
              }
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
    }
};

  setChartData3(data)
  setChartOptions3(options);
}



  const fetchNotes = async (start_date, end_date) => {
    try {
      const data = {
        menu_pk,
        start_date,
        end_date,
        year:selectedYear
      };
      const response = await getFromAPI('/get_sales_analysis_charts?data=' + JSON.stringify(data));
      GraphData(response)
      console.log(response)

    } catch (error) {
      setError('An error occurred while fetching leave requests.');
      console.error('Error fetching leave requests:', error);
    } 
  };
  const fetchNotes2 = async (startDate, endDate) => {
    try {
      setLoading(true);  
      const data = {
        menu_pk,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };
      const response = await getFromAPI('/get_sales_document_type_chart?data=' + JSON.stringify(data));
      GraphData2(response.document_type)

    } catch (error) {
      setError('An error occurred while fetching leave requests.');
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);  
    }
  };
  const fetchNotes3 = async (startDate, endDate,selectedType) => {
    try {
        
      const data = {
        menu_pk,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        type:selectedType
      };
      const response = await getFromAPI('/get_sales_customer_chart?data=' + JSON.stringify(data));
      GraphData3(response.customer_chart)
    } catch (error) {
      setError('An error occurred while fetching leave requests.');
      console.error('Error fetching leave requests:', error);
    } 
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };






  return (
    <>
      {loading ? (
        <div className="card"><br/>
          <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> 
        </div>
      ) :
        (
        <div >
                <div style={{ marginBottom: 10, width: '100%' }}>
                <Grid container justifyContent="space-between"  spacing={2}>
                    <Grid item md="auto" sm="auto">
                    {/* <Grid container spacing={2} >
                            <Grid item xs="auto" sm="auto">
                                <Paper elevation={2}>
                                    <Card sx={{ padding: { xs: 0.5, sm: 1, md: 1 }, cursor: 'pointer' }}>
                                        <Typography variant='body2' sx={{ color: 'grey' }}>No of Bills</Typography>
                                        <Typography variant='body1'>
                                            {NoOfBills}
                                        </Typography>
                                    </Card>
                                </Paper>
                            </Grid>

                        <Grid item xs="auto" sm="auto">
                            <Paper elevation={2}>
                                <Card sx={{ padding:  { xs: 0.5, sm: 1, md: 1 }, cursor: 'pointer' }}>
                                    <Typography variant='body2' sx={{ color: 'grey' }}>Taxable Amount</Typography>
                                    <Typography variant='body1'>
                                        ₹{taxAmount?.toLocaleString('en-IN')}
                                    </Typography>
                                </Card>
                            </Paper>
                        </Grid>

                        <Grid item xs="auto" sm="auto">
                            <Paper elevation={2}>
                                <Card sx={{ padding:  { xs: 0.5, sm: 1, md: 1 }, cursor: 'pointer' }}>
                                    <Typography variant='body2' sx={{ color: 'grey' }}>Net Amount</Typography>
                                    <Typography variant='body1'>
                                        ₹{netAmount?.toLocaleString('en-IN')}
                                    </Typography>
                                </Card>
                            </Paper>
                        </Grid>
                    </Grid> */}
                   
                    </Grid>

                    <Grid item md="auto" sm="auto">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                        <Dropdown 
                        value={selectedYear} 
                        options={years} 
                        onChange={(e) => {
                          setSelectedYear(e.value)
                          const startDate = selectedPeriod.start_date
                          const endDate = selectedPeriod.end_date
                          fetchNotes(startDate,endDate)
                        }} 
                        placeholder="Select a Year"
                        optionLabel="value" 
                        />
                        </Grid>
                        <Grid item>
                        <Dropdown 
                            value={selectedPeriod} 
                            options={Periods} 
                            onChange={(e) => {
                              setSelectedPeriod(e.value)
                              const startDate = e.value.start_date
                              const endDate =  e.value.end_date
                              fetchNotes(startDate,endDate)
                            }} 
                            optionLabel="date_description" 
                            placeholder="Select a Period" 
                        />
                        </Grid>
                      
                    </Grid>
                    </Grid>
                </Grid>
                </div>

                
                <div>
              <Grid container  spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
              <div >
                <Paper elevation={5} style={{ padding: 1}} >
                <Card  style={{padding:5, cursor: 'pointer',}}>
                      <Chart type="bar" data={chartData} options={chartOptions} />
                </Card>
                </Paper>
                  </div>
                </Grid>
                {/* <Grid item xs={12} sm={12} md={12}>
                <div >
                    <Paper
                      elevation={5}
                      sx={{
                        padding: 1,
                        width: { xs: '100%', sm: '100%', md: '70%' }, 
                      }}
                    >
                      <Card sx={{ padding: 5, cursor: 'pointer', }}>
                        <Chart type="bar" data={chartData} options={chartOptions} />
                      </Card>
                    </Paper>
                  </div>
                </Grid> */}


              </Grid>
                </div>

                {/* <div style={{ marginTop: 10}}>
                <Paper elevation={5} style={{ padding: 1}} >
                <Card  style={{padding:10, cursor: 'pointer'}}>
                
                    <Dropdown 
                            value={selectedType} 
                            onChange={(e) =>{
                            setSelectedType(e.value)
                            const startDate = getStartDate();
                            const endDate = getEndDate();
                            fetchNotes3(startDate,endDate,e.value.DocumentType);
                            } } 
                            options={DocType} 
                            optionLabel="DocumentType" 
                            placeholder="Select a type" 
                        />
                    <Chart type="bar" data={chartData3} options={chartOptions3} />
                    </Card>
                    </Paper>
                </div> */}

                


          




        </div>
      ) }

      <ToastMessage message={message} variant={variant} showMessage={showMessage} setShowMessage={setShowMessage} />
    </>
  );
};

export default SaleAnalysis;