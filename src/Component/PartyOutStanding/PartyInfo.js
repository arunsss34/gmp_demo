import React, { useEffect, useState,useRef, useContext } from 'react';
import { getFromAPI } from '../../apiCall/ApiCall';
import ToastMessage from '../../ToastMessage';
import { Grid, CircularProgress, Card, CardContent, Typography, Button, Paper } from "@mui/material";
import AgentInfoGraph from '../OutStanding/AgentInfoGraph';
import { ToggleButton } from 'primereact/togglebutton';
import { PrimeIcons } from "primereact/api";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useDispatch, useSelector } from 'react-redux';
import { setId } from './OutStandingSlice';
import colorconfig from '../colorconfig';
import PartyInfoGraph from './PartyInfoGraph';
import { ListBox } from 'primereact/listbox';
import ThemeContext from '../ThemeContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PdfPreview from './PdfPreview';
import { useMediaQuery } from '@mui/material';


export default function PartyInfo({ onNavigate,searchWord,setSearchWord  }) {
  const [loading, setLoading] = useState(false);
  const [getLuckyYarnDetails, setLuckyYarnDetails] = useState([]);
  const [getLuckyWeaveDetails, setLuckyWeaveDetails] = useState([]);
  const [AgentName, setAgentName] = useState(false);
  const [checked, setChecked] = useState(false);
  const [getDayDetails, setDayDetails] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const dispatch = useDispatch();
  const [outstandingTotal, setoutstandingTotal] = useState(0);
  const [outstandingTotalDP, setoutstandingTotalDP] = useState(null);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filteredAgents2, setFilteredAgents2] = useState([]);
  const [initialData, setInitialData] = useState(false);
  const [filteredTotal, setfilteredTotal] = useState(null); 
  const { agent_id, party_id } = useSelector(state => state.idReducer);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const dropdownRef = useRef(null);
  const pdfDropdownRef = useRef(null);
  const [PdfdropdownVisible, setPdfDropdownVisible] = useState(false);
  const [getPdfDetails, setPdfDetails] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfString, setPdfString] = useState('');
  const [fileName, setfileName] = useState('');
  const isMobile = useMediaQuery('(max-width:650px)'); 



  const { currentTheme } = useContext(ThemeContext);
  const accordionData = [
    {
      title: "Lucky Yarn Tex India Private Limited",
      details: getLuckyYarnDetails, 
    },
    {
      title: "Lucky Weaves India Private Limited",
      details: getLuckyWeaveDetails,
    },
  ];

  useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
            if (pdfDropdownRef.current && !pdfDropdownRef.current.contains(event.target)) {
                setPdfDropdownVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
      if (searchWord) {
        const filtered = filteredAgents.filter(item=> item.CustomerName.toLowerCase().includes(searchWord.toLowerCase()));
        setLuckyYarnDetails(filtered);
        const filtered2 = filteredAgents2.filter(item=> item.CustomerName.toLowerCase().includes(searchWord.toLowerCase()));
        setLuckyWeaveDetails(filtered2);
        const filterBoth=[...filtered,...filtered2]
        const filteredSum = filterBoth.reduce((sum, item) =>  sum + item.BalanceAmount, 0 );
        setoutstandingTotal(filteredSum);
      } else {
        setLuckyYarnDetails(filteredAgents); 
        setLuckyWeaveDetails(filteredAgents2); 
        setoutstandingTotal(filteredTotal)
      }
    }, [searchWord]);  

  async function fetchData(day) {
      setLoading(true);
      setLuckyYarnDetails([])
      setLuckyWeaveDetails([])
      try {
          const data = {menu_pk:menu_pk, agent_id: agent_id,day}
          const response1 = await getFromAPI("/party_otd_get_party_info?data=" + JSON.stringify(data));
          setAgentName(response1.customer_name)
          

          response1.agent_info.forEach((party) => {
            if (party["Lucky Yarn Tex India Private Limited"]) {
                const combinedCustomers = party["Lucky Yarn Tex India Private Limited"].sort((a, b) => a.CustomerName.length >= 25 ? 1 : -1);
                setLuckyYarnDetails(combinedCustomers);
                setFilteredAgents(combinedCustomers);
            } 
            if (party["Lucky Weaves India Private Limited"]) {
                const combinedCustomers2 = party["Lucky Weaves India Private Limited"].sort((a, b) => a.CustomerName.length >= 25 ? 1 : -1);
                setLuckyWeaveDetails(combinedCustomers2);
                setFilteredAgents2(combinedCustomers2);
            } 
          });


          setoutstandingTotal(parseInt(response1.value, 10))
          setfilteredTotal(parseInt(response1.value, 10))
          setoutstandingTotalDP(response1.outstanding_sum)
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
  }

  
  async function fetchListData() {
    setLoading(true);
    try {
        const response1 = await getFromAPI("/get_outstanding_dp");
        setPdfDetails(response1.download_type) 
       setDayDetails(response1.outstanding_dp)
       const defaultDay=response1.outstanding_dp[0].day
       fetchData(defaultDay)
       setSelectedDay(response1.outstanding_dp[0])
       setSearchWord('')
    } catch (error) {
        console.error("Error fetching data:", error);
    } 
}


  useEffect(() => {
     fetchListData();
  }, []);

  const handleNavigate = (CustomerID,Company) => {
    const id=agent_id.find(item=>item.Company===Company).id
    dispatch(setId({ agent_id: agent_id, party_id: CustomerID,company: Company,company_id:id}));
    onNavigate('Party Details', 'Party Details');
  };
  const handleDropdownChange = (e) => {
    const value=e.value
    if(value){
    fetchData(value.day)
    setSelectedDay(value);
    setDropdownVisible(false);
    setInitialData(true)
    }
    else{
      setDropdownVisible(false);
    }
    
  };

  async function PdfDownload(download_pk) {
    setLoading(true);
    try {
        const data = { menu_pk,download_pk,customer_id:agent_id };
        const response1 = await getFromAPI("/get_party_outstanding_party_overview_pdf?data=" + JSON.stringify(data));
        //handleDownload(response1.base64string,response1.file_name)
        setPdfString(response1.base64string)
        setfileName(response1.file_name)
        setPdfVisible(true)
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
}

const handleDownload = (base64String,file_name) => {
  if (base64String) {
      // Convert the base64 string to a Blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
  }
};

  const handlePdfChange = (e) => {
    const value=e.value
    if(value){
    PdfDownload(value.download_pk)
    setPdfDropdownVisible(false);
    }else{
      setPdfDropdownVisible(false);
    }
    
  };
  const OperationsMenu=()=>(
    <>
          <ToggleButton
                                        checked={PdfdropdownVisible}
                                        onChange={(e) => {
                                          setPdfDropdownVisible(e.value)
                                          setDropdownVisible(false)
                                        }}
                                        onIcon="pi pi-arrow-down"  
                                        offIcon="pi pi-arrow-down" 
                                        onLabel="" 
                                        offLabel=""
                                        className="small-toggle-button" 
                                        style={{
                                            backgroundColor: PdfdropdownVisible ? 'blue' : 'gray', 
                                            borderColor: PdfdropdownVisible ? 'blue' : 'gray', 
                                        }}
                                    />

                              {PdfdropdownVisible && (
                                  <div className="dropdown-container" ref={pdfDropdownRef}>
                                  <ListBox 
                                      value={selectedPdf}
                                      onChange={(e) => handlePdfChange(e)}
                                      options={getPdfDetails}
                                      optionLabel="download_type"
                                      className="w-full md:w-14rem"
                                      style={{ backgroundColor: 'white', zIndex: 1000, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                                  />
                              </div>
                              )}

            <ToggleButton
                        checked={dropdownVisible}
                        onChange={(e) => {
                          setDropdownVisible(e.value)
                          setPdfDropdownVisible(false)
                        }}
                        onIcon="pi pi-filter-fill"  
                        offIcon="pi pi-filter" 
                        onLabel="" 
                        offLabel=""
                        className="small-toggle-button" 
                        style={{
                            backgroundColor: dropdownVisible ? 'blue' : 'gray', 
                            borderColor: dropdownVisible ? 'blue' : 'gray', 
                        }}
                    />

              {dropdownVisible && (
                  <div className="dropdown-container2" ref={dropdownRef}>
                  <ListBox 
                      value={selectedDay}
                      onChange={(e) => handleDropdownChange(e)}
                      options={getDayDetails}
                      optionLabel="day"
                      className="w-full md:w-14rem"
                      style={{ backgroundColor: 'white', zIndex: 1000, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                  />
              </div>
              )}



            <ToggleButton
            checked={checked}
            onChange={(e) => setChecked(e.value)}
            onIcon="pi pi-chart-bar"  
            offIcon="pi pi-chart-bar" 
            onLabel="" 
            offLabel=""
            className="small-toggle-button" 
            severity="info" 
            outlined
            style={{
            backgroundColor: checked ? 'blue' : 'gray', 
            borderColor: checked ? 'blue' : 'gray', 
            }}
            />
            
    </>
  )

  return (
      <>
          <ToastMessage />
          {loading ? (
            <>
              <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                  <CircularProgress />
              </Grid>
              {pdfLoading&&<div style={{display:'flex',justifyContent:"center", alignItems:"center"}}>PDF Generating Please Wait......</div>}
              </>
          ) : (
            <>
            {isMobile&&
            <div style={{display: 'flex',gap:5,float:'right',position:'relative',marginBottom:5}}>
              <OperationsMenu/>
                
            </div>}
            <div style={{ clear:'both'}}></div>
            <div>
              <Paper elevation={5} style={{padding: 10,  background: currentTheme.background,color:currentTheme.text }}>
              <div style={{ marginBottom: '8px',fontSize:12}}>
                  <span style={{fontWeight: 'bold', opacity:.8 }}>Customer: </span>
                  <span style={{ fontWeight: 'bold', }}>{AgentName}</span>
                </div>
                
              <span style={{ fontWeight:'bold',fontSize:12, }}>
             <span style={{fontSize:16,color:'#c25933'}}> ₹ {outstandingTotal.toLocaleString('en-IN')}</span>{outstandingTotalDP}
              </span>     
              {!isMobile&&
            <div style={{display: 'flex',gap:5,float:'right',position:'relative'}}>

            <OperationsMenu/>
                
            </div>}
            </Paper>
            </div>
                {checked && <PartyInfoGraph />}

                  {accordionData.map((section, sectionIndex) => (
                    section.details.length > 0 && (
                    <div key={sectionIndex} style={{ marginTop:10,marginBottom:10}}>
                      <Accordion sx={{ background: currentTheme.background, color: currentTheme.text,fontWeight:'bold' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: currentTheme.text }} />}
                        id={`panel${sectionIndex + 1}-header`}
                      >
                        {section.title}
                      </AccordionSummary>
                      <AccordionDetails>
                        
                          <div style={{ padding: 5, marginTop: 20, cursor: 'pointer' }}>
                            <Grid container spacing={2}>
                              {section.details.map((item, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                  <Card onClick={() => handleNavigate(item.AgentID,item.Company) } style={{ background: currentTheme.background }}>
                                    <CardContent>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                                        <span style={{ fontWeight: 'bold', color: currentTheme.text }}>{item.AgentName}</span>
                                        <span style={{ fontWeight: 'bold', color: '#c25933' }}>₹{item.BalanceAmount.toLocaleString('en-IN')}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </div>
                        
                      </AccordionDetails>
                      </Accordion>
                    </div>) 
                  ))}
                
                {pdfVisible&&
              <PdfPreview baseLink={pdfString} fileName={fileName} isVisible={pdfVisible} setPdfVisible={setPdfVisible}/>
              }
                
              </>
              
          )}
              </>
  );
}

