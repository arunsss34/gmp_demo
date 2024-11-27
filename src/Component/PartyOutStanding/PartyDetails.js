import React, { useEffect, useState,useRef, useContext } from 'react';
import { getFromAPI } from '../../apiCall/ApiCall';
import ToastMessage from '../../ToastMessage';
import { Grid, CircularProgress, Card, CardContent, Typography, Box, Divider, Paper } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { ToggleButton } from 'primereact/togglebutton';
import { ListBox } from 'primereact/listbox';
import colorconfig from '../colorconfig';
import PartyDetailsGraph from './PartyDetailsGraph';
import ThemeContext from '../ThemeContext';
import PdfPreview from './PdfPreview';
import { useMediaQuery } from '@mui/material';



export default function PartyDetails({ onNavigate,searchWord,setSearchWord }) {
    const [loading, setLoading] = useState(false);
    const [partyDetails, setPartyDetails] = useState([]);
    const [tds, setTDS] = useState(null);
    const [partyTotal, setPartyTotal] = useState(null);
    const [agentName, setAgentName] = useState(false);
    const [customerName, setCustomerName] = useState(null);
    const [checked, setChecked] = useState(false);
    const [getDayDetails, setDayDetails] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const dispatch = useDispatch();
    const [outstandingTotal, setoutstandingTotal] = useState(null);
    const [initialData, setInitialData] = useState(false);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [pdfLoading, setPdfLoading] = useState(false);
    const { agent_id, party_id,company,company_id } = useSelector(state => state.idReducer);
    const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
    const dropdownRef = useRef(null);
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
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchWord) {
          const filtered = filteredAgents.filter(item=> item.InvoiceNo.toLowerCase().includes(searchWord.toLowerCase()));
          setPartyDetails(filtered);
        } else {
          setPartyDetails(filteredAgents); 
        }
      }, [searchWord]);  

    async function fetchData(day) {
        setLoading(true);
        try {
            const data = { menu_pk, agent_id:party_id, customer_id: company_id,day,company };
            const response = await getFromAPI("/party_otd_get_party_details_by_agent?data=" + JSON.stringify(data));
            console.log(response,"]]]]]]")
            setPartyDetails(response.party_details);
            setFilteredAgents(response.party_details);
            setPartyTotal(response.party_total);
            setoutstandingTotal(response.outstanding_sum)
            setTDS(response.tds_amount);
            setAgentName(response.agent_name);
            setCustomerName(response.party_name);
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

    const handleDropdownChange = (e) => {
      const value=e.value
      if(value){
        fetchData(value.day)
        setSelectedDay(value);
        setDropdownVisible(false);
        setInitialData(true)
      }else{
        setDropdownVisible(false);
        }
      };

      async function PdfDownload() {
        setLoading(true);
        setPdfLoading(true)
        try {
            const data = { menu_pk,agent_id:party_id, customer_id: company_id,company };
            const response1 = await getFromAPI("/get_party_outstanding_party_details_overview_pdf?data=" + JSON.stringify(data));
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
    const OperationsMenu=()=>(
        <>
               <ToggleButton
                                        onClick={PdfDownload}
                                        onIcon="pi pi-arrow-down"  
                                        offIcon="pi pi-arrow-down" 
                                        onLabel="" 
                                        offLabel=""
                                        className="small-toggle-button" 
                                    />

            <ToggleButton
                        checked={dropdownVisible}
                        onChange={(e) => setDropdownVisible(e.value)}
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
                <Box >
                    {isMobile&&
                    <div style={{display: 'flex',gap:5,float:'right',position:'relative'}}>
                    <OperationsMenu/>
                        
                    </div>}
                    <div style={{ clear:'both'}}></div>
                    <Grid container spacing={3} >
                        <Grid item xs={12} md={12}>
                            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1, background: currentTheme.background}}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{padding:1, color:currentTheme.text, fontWeight: 'bold'}} variant="body2" color="textSecondary">
                                                <strong style={{opacity:.8 }}>Agent:</strong> {agentName}
                                            </Typography>
                                            <Typography sx={{padding:1,  color:currentTheme.text, fontWeight: 'bold'}} variant="body2" color="textSecondary">
                                                <strong style={{opacity:.8 }}>Customer:</strong> {customerName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography sx={{padding:1,  color:currentTheme.text, fontWeight: 'bold'}} variant="body2" color="textSecondary">
                                                <strong style={{opacity:.8 }}>TDS:</strong> ₹{tds?.toLocaleString('en-IN')}
                                            </Typography>
                                            <Typography sx={{padding:1,  color:currentTheme.text, fontWeight: 'bold'}} variant="body2" color="textSecondary">
                                                <strong style={{opacity:.8 }}>Party Total:</strong> ₹{partyTotal?.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <div style={{marginTop:10}}>
                    <span style={{color: '#ed2913' , fontWeight:'bold', opacity:.9}}>
              {outstandingTotal}
              </span>    <br/> 
              {!isMobile&&
            <div style={{display: 'flex',gap:5,float:'right',position:'relative'}}>

            <OperationsMenu/>
                
            </div>}
                {checked && <PartyDetailsGraph />}
                </div>
                {partyDetails.length > 0 ? (
                    <Grid container spacing={3} mt={3}>
                        {partyDetails.map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card variant="outlined" sx={{cursor:'pointer',background: currentTheme.background}}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="body2" fontWeight="bold" style={{color: currentTheme.text}}>
                                                {item.InvoiceNo}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold" color={currentTheme.text}>
                                                {item.InvoiceDate}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box>
                                          <div>
                                            <Typography variant="body2" color="textSecondary" mb={1} sx={{color:currentTheme.text}}>
                                                  <strong>Amount:</strong> {item.NetAmount.toLocaleString('en-IN')}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary" mb={1} sx={{color:currentTheme.text}}>
                                                  <strong>Balance:</strong> ₹{item.BalanceAmount.toLocaleString('en-IN')}
                                              </Typography>
                                          </div>

                                          <div>
                                              <Typography variant="body2" color="textSecondary" mb={1} sx={{color:currentTheme.text}}>
                                                  <strong>Terms:</strong> {item.Terms}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary" sx={{color:currentTheme.text}}>
                                                  <strong>Pending Days:</strong> {item.PendingDays}
                                              </Typography>
                                          </div>
                                            
                                            
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    (initialData || agentName) && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10vh" }}>
                        <p>No Data Found!!!</p>
                      </div>
                    )
                  )}
                  {pdfVisible&&
              <PdfPreview baseLink={pdfString} fileName={fileName} isVisible={pdfVisible} setPdfVisible={setPdfVisible}/>
              } 
                </Box>
            )}


        </>
    );
}
