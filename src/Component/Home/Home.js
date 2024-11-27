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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('today');
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [selectedType, setSelectedType] = useState(null);
  const [DocType, setDocType] = useState([]);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const [NoOfBills, setNoOfBills] = useState(null);
  const [taxAmount, setTaxAmount] = useState(null);
  const [netAmount, setNetAmount] = useState(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [chartOptions3, setChartOptions3] = useState({});


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
                label: 'Sales by Type',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
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
              font:{
                weight:300
              }
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

  

  const getStartDate = () => {
    switch (filterType) {
      case 'today':
        return new Date();
      case 'monthly':
        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() - 1);
        return oneMonth;
      case 'yearly':
        const oneYear = new Date();
        oneYear.setFullYear(oneYear.getFullYear() - 1);
        return oneYear; 
      
      default:
        return customStartDate;
    }
  };

  const getEndDate = () => {
    switch (filterType) {
      case 'today':
        return new Date();
      case 'monthly':
        return new Date();
      case 'yearly':
        return new Date();
      default:
        return customEndDate;
    }
  };

  const fetchNotes = async (startDate, endDate) => {
    try {
      setLoading(true);  
      const data = {
        menu_pk,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };
      const response = await getFromAPI('/sales_type_chart?data=' + JSON.stringify(data));
      setNetAmount(response['no.of_bills'][0].NetAmount)
      setTaxAmount(response['no.of_bills'][0].TaxableAmount)
      setNoOfBills(response['no.of_bills'][0].no_of_bills)
      GraphData(response.type)

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

  const handleFilterChange = (filter) => {
    setFilterType(filter);
  };

  useEffect(() => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    fetchNotes(startDate, endDate);
    fetchNotes2(startDate,endDate);
    if (selectedType){
      fetchNotes3(startDate,endDate,selectedType.DocumentType);
    }
  }, [filterType]);

  useEffect(()=>{
   async function DropdownList(){
    try {
      const response = await getFromAPI('/get_document_type');
      setDocType(response.document_type)
      setSelectedType(response.document_type[0])
      const startDate = getStartDate();
      const endDate = getEndDate();
      fetchNotes3(startDate,endDate,response.document_type[0].DocumentType);


    } catch (error) {
      setError('An error occurred while fetching leave requests.');
      console.error('Error fetching leave requests:', error);
    }} 
    DropdownList();
  },[])

  const openDialog = () => setDialogVisible(true);
  const closeDialog = () => setDialogVisible(false);

  const applyCustomFilter = () => {
    setFilterType('custom');
    closeDialog();
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
                    <Grid container spacing={2} >
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
                    </Grid>
                   
                    </Grid>

                    <Grid item md="auto" sm="auto">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                        <Button
                            variant={filterType==='today'?'contained':'outlined'}
                            startIcon={<TodayIcon />}
                            onClick={() => handleFilterChange('today')}
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Today
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button
                            variant={filterType==='monthly'?'contained':'outlined'}
                            startIcon={<TodayIcon />}
                            onClick={() => handleFilterChange('monthly')}
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Month
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button
                            variant={filterType==='yearly'?'contained':'outlined'}
                            startIcon={<TodayIcon />}
                            onClick={() => handleFilterChange('yearly')}
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Year
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button 
                            variant={filterType==='custom'?'contained':'outlined'}
                            size="small" 
                            onClick={openDialog} 
                            style={{ textTransform: 'none' }}
                        >
                            Custom
                        </Button>
                        </Grid>
                    </Grid>
                    </Grid>
                </Grid>
                </div>

                
                <div>
              <Grid container  spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
              <div >
              <Paper elevation={5} style={{ padding: 1}} >
              <Card  style={{padding:5, cursor: 'pointer',}}>
                    <Chart type="bar" data={chartData} options={chartOptions} />
              </Card>
              </Paper>
              </div>
                </Grid>
              <Grid item xs={12} sm={6} md={6}>
              <div >
              <Paper elevation={5} style={{ padding: 1,}} >
              <Card  style={{padding:5, cursor: 'pointer'}}>
                    <Chart type="bar" data={chartData2} options={chartOptions2} />
              </Card>
              </Paper>
              </div>
              </Grid>
              </Grid>
                </div>

                <div style={{ marginTop: 10}}>
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
                </div>

                


            <Dialog
            header="Custom Date Range"
            visible={dialogVisible}
            style={{ width: '30vw' }}
            onHide={closeDialog}
            >
            <div style={{ width: '100%' }}>
                <div style={{ width: '100%', marginBottom: '10px' }}>
                <label htmlFor="startDate" >
                    Start Date
                </label>
                <div style={{ width: '100%' }}>
                    <Calendar
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.value)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    style={{ width: '100%' }} 
                    />
                </div>
                </div>
                <div style={{ width: '100%' }}>
                <label htmlFor="endDate" >
                    End Date
                </label>
                <div style={{ width: '100%' }}>
                    <Calendar
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.value)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    style={{ width: '100%' }} 
                    />
                </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: 10, marginTop: '10px' }}>
                <PRButton label="Apply" icon="pi pi-check" onClick={applyCustomFilter} size="small" />
                <PRButton label="Cancel" icon="pi pi-times" onClick={closeDialog} size="small" severity="secondary" />
            </div>
            </Dialog>




        </div>
      ) }

      <ToastMessage message={message} variant={variant} showMessage={showMessage} setShowMessage={setShowMessage} />
    </>
  );
};

export default Home;