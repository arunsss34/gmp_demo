import React, { useEffect, useState,useRef,useMemo, useContext } from 'react';
import { getFromAPI } from '../../apiCall/ApiCall';
import ToastMessage from '../../ToastMessage';
import { Grid, CircularProgress, Card, CardContent, Typography, Button, Paper } from "@mui/material";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useDispatch,useSelector } from 'react-redux';
import { setId } from './OutStandingSlice';
import AgentInfoGraph from '../OutStanding/AgentInfoGraph';
import { ToggleButton } from 'primereact/togglebutton';
import colorconfig from '../colorconfig';
import { ListBox } from 'primereact/listbox';
import ThemeContext from '../ThemeContext';
import PdfPreview from './PdfPreview';
import { useMediaQuery } from '@mui/material';



export default function AgentInfo({ onNavigate,searchWord,setSearchWord }) {
  const [loading, setLoading] = useState(false);
  const [getAgentDetails, setAgentDetails] = useState([]);
  const [getDayDetails, setDayDetails] = useState([]);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
  const [outstandingTotal, setoutstandingTotal] = useState(null);
  const [outstandingTotalDP, setoutstandingTotalDP] = useState(null);
  const [PdfdropdownVisible, setPdfDropdownVisible] = useState(false);
  const [getPdfDetails, setPdfDetails] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [filteredTotal, setfilteredTotal] = useState(null); 
  const dropdownRef = useRef(null);
  const pdfDropdownRef = useRef(null);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfString, setPdfString] = useState('');
  const [fileName, setfileName] = useState('');
  const isMobile = useMediaQuery('(max-width:650px)'); 


  const { currentTheme } = useContext(ThemeContext);

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
        const filtered = filteredAgents.filter(item=> item.AgentName.toLowerCase().includes(searchWord.toLowerCase()));
        setAgentDetails(filtered);
        const filteredSum = filtered.reduce((sum, item) =>  sum + item.BalanceAmount, 0 );
        setoutstandingTotal(filteredSum);
      } else {
        setAgentDetails(filteredAgents); 
        setoutstandingTotal(filteredTotal)
      }
    }, [searchWord]);

  async function fetchData(day) {
      setLoading(true);
      try {
          const data = { menu_pk,day };
          const response1 = await getFromAPI("/get_agent_details?data=" + JSON.stringify(data));
          setAgentDetails(response1.agent_details)
          setFilteredAgents(response1.agent_details)
          setoutstandingTotal(parseInt(response1.value, 10))
          setfilteredTotal(parseInt(response1.value, 10))
          setoutstandingTotalDP(response1.outstanding_total)
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

  const handleNavigate = (agentID) => {
    dispatch(setId({ agent_id: agentID, party_id: 0 }));
    onNavigate('Party Info', 'Party Info');
  };

  const handleDropdownChange = (e) => {
    const value=e.value
    if(value){
    fetchData(value.day)
    setSelectedDay(value);
    setDropdownVisible(false);
    }else{
      setDropdownVisible(false);
    }
    
  };

  async function PdfDownload(download_pk) {
    setLoading(true);
    setPdfLoading(true)
    try {
        const data = { menu_pk,download_pk };
        const response1 = await getFromAPI("/get_outstanding_overview_pdf?data=" + JSON.stringify(data));
        //handleDownload(response1.base64string,response1.file_name)
        setPdfString(response1.base64string)
        setfileName(response1.file_name)
        setPdfVisible(true)
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
        setPdfLoading(false)
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
                                  <div className="dropdown-container" ref={dropdownRef}>
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
            <div >
            <Paper elevation={5} style={{ padding: 10, background: currentTheme.background,color: currentTheme.text }}>
            <div style={{ fontWeight:'bold',fontSize:12}}>
             Outstanding Receivable
            </div>
             <span style={{ fontWeight:'bold',fontSize:12, }}>
             <span style={{fontSize:16,color:'#c25933'}}> ₹ {outstandingTotal?.toLocaleString('en-IN')}</span>{outstandingTotalDP}
              </span> 
            {!isMobile&&
            <div style={{display: 'flex',gap:5,float:'right',position:'relative'}}>

            <OperationsMenu/>
                
            </div>}
            </Paper>
            </div>              
            {checked && <AgentInfoGraph />}
            {getAgentDetails.length > 0 ? (
            <div style={{ padding: 5,marginTop: 20,cursor:'pointer' }}>
                <Grid container spacing={2}>
                  {getAgentDetails.map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card onClick={()=>{handleNavigate(item.data)}} style={{background: currentTheme.background}}>
                          <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:12 }}>
                                <span style={{ fontWeight: 'bold', color: currentTheme.text}}>{item.AgentName}</span>
                                <span style={{ fontWeight: 'bold', color: '#c25933' }}>₹{item.BalanceAmount.toLocaleString('en-IN')}</span>
                            </div>   
                          </CardContent>
                        </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
                  (outstandingTotal===0) && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10vh" }}>
                      <p>No Data Found!!!</p>
                    </div>
                  )
                )}
              {pdfVisible&&
              <PdfPreview baseLink={pdfString} fileName={fileName} isVisible={pdfVisible} setPdfVisible={setPdfVisible}/>
              }  
              </>
              )}
              </>
  );
}
