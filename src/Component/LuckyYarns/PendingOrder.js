import React, { useEffect, useState, useContext, useRef } from 'react';
import { DataGrid } from 'devextreme-react/data-grid'; 
import { getFromAPI } from "../../apiCall/ApiCall.js";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { Button } from 'primereact/button';
import ThemeContext from '../ThemeContext.js';
import 'devextreme/dist/css/dx.light.css';
import { Summary,GroupItem, TotalItem,SortByGroupSummaryInfo } from 'devextreme-react/data-grid';
import { useDispatch,useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';


const PendingOrder = () => {
    const [frameItemDetails, setFrameItemDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [frameError, setFrameError] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const gridRef = useRef(null);
    const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
    const [searchWord, setSearchWord] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);


    const handleSearchChange = (event) => {
        setSearchWord(event.target.value);
    };

    useEffect(() => {
        if (searchWord) {
          const filtered = filteredItems.filter(item=> 
            item.ItemDescription.toLowerCase().includes(searchWord.toLowerCase()) ||
            item['Party Name'].toLowerCase().includes(searchWord.toLowerCase()) ||
            item['Agent Name'].toLowerCase().includes(searchWord.toLowerCase()) );
          setFrameItemDetails(filtered);
        } else {
          setFrameItemDetails(filteredItems); 
        }
      }, [searchWord]);


    const { currentTheme } = useContext(ThemeContext);

    useEffect(() => {
        // Fetch the date options
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                await getLud(); // Fetch date options
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        // Set CSS variables based on the current theme
        if (currentTheme) {
            document.documentElement.style.setProperty('--header-background-color', currentTheme.agGrid.headerBackgroundColor);
            document.documentElement.style.setProperty('--row-background-color', currentTheme.agGrid.rowBackgroundColor);
            document.documentElement.style.setProperty('--odd-row-background-color', currentTheme.agGrid.oddRowBackgroundColor);
            document.documentElement.style.setProperty('--even-row-background-color', currentTheme.agGrid.evenRowBackgroundColor);
            document.documentElement.style.setProperty('--data-font-color', currentTheme.agGrid.fontColor || '#ce1111');
            document.documentElement.style.setProperty('--header-font-color', currentTheme.agGrid.headerFontColor || '#741919');
        }
    }, [currentTheme]);

    const getLud = async () => {
        try {
            const response = await getFromAPI(`customer_pending_order_dates`);
            console.log(response, "-good");

            setSelectedDate(response.last_updated_date); // Set default date
        } catch (error) {
            console.error("Error fetching date options:", error);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchFrameItems();
        }
    }, [selectedDate]);

    async function fetchFrameItems() {
        setLoading(true);
        try {
            const data = { menu_pk:menu_pk, date: selectedDate };
            const response = await getFromAPI(`/get_pending_customer_po_details?data=${JSON.stringify(data)}`);
            console.log(response, "-vs");
            const details = response.details;
            setFrameError(details);
            setFrameItemDetails(details);
            setFilteredItems(details)

            const keys = response.fields;
            const initialColumns = keys.map((item, index) => {
                const column = {
                    dataField: item,
                    caption: item,
                };
            
                if (index === 3) {
                    column.groupIndex = 1; 
                }
                if (index === 4) {
                    column.groupIndex = 2;
                }                
            
                return column;
            });
            

            setColumns(initialColumns);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    }

    const PdfDownload = async () => {
        setLoading(true);
        setPdfLoading(true);
        try {
            const data = { date: selectedDate };
            const response = await getFromAPI(`/get_customer_po_pdf?data=${JSON.stringify(data)}`);
            console.log(response, "-----bg");
            handleDownload(response.base64string[0], response.file_name);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setPdfLoading(false);
        }
    };

    const handleDownload = (base64String, file_name) => {
        if (base64String) {
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(link.href);
        }
    };


    return (
        <div>
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                    <CircularProgress />
                    {pdfLoading && <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>PDF Generating Please Wait......</div>}
                </Grid>
            ) : (
                <div>
                    <Grid container alignItems={'center'} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold', fontSize: 16 }}>
                            As On {selectedDate}
                        </Typography>
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'flex-end',gap:20, height: '50%', flexGrow: 1 }}>
                    <div className="search-container">
                            <InputText
                            className="p-inputtext-sm search-input"
                            value={searchWord}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            />
                            <i className="pi pi-search search-icon" ></i>
                        </div>
                        <Button
                            onClick={() => {
                                if (selectedDate) {
                                    PdfDownload();
                                }
                            }}
                            label="Pdf"
                            outlined
                            style={{ backgroundColor: currentTheme.lightbg, color: '#bf1d54' }}
                            className="pi pi-file-pdf"
                            disabled={!selectedDate || !frameError}
                        />
                    </div>
                    {!frameError ? (
                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>No Data Found......</div>
                    ) : (
                        <>

                                    <div >
                                        <div style={{ width: '100%' }}>
                                            <DataGrid
                                                ref={gridRef}
                                                dataSource={frameItemDetails}
                                                columns={columns}
                                                showBorders={true}
                                                allowColumnReordering={true}
                                                columnAutoWidth={true}
                                                className={`${currentTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}
                                                selection={{
                                                    mode: 'single', 
                                                }}
                                                grouping={{
                                                    contextMenuEnabled: true
                                                }}
                                                groupPanel= {{
                                                    visible: true  
                                                }}
                                               
                                            >
                                                    <Summary>
                                                    <TotalItem
                                                        column="Price"
                                                        summaryType="sum"
                                                        customizeText={(e) => `Total: ${e.value.toFixed(2)}`} 
                                                    />
                                                    <TotalItem
                                                        column="Bags"
                                                        summaryType="sum"
                                                        customizeText={(e) => e.value.toFixed(2)}
                                                    />
                                                    <TotalItem
                                                        column="PendingBags"
                                                        summaryType="sum"
                                                        customizeText={(e) => e.value.toFixed(2)}
                                                    />
                                                   {/* <GroupItem
                                                        column="Price"
                                                        summaryType="sum"
                                                        customizeText={(e) => `₹${e.value.toFixed(2)}`} 
                                                        showInGroupFooter={false}
                                                        alignByColumn={true}
                                                    /> */}
                                                    <GroupItem
                                                        column="Bags"
                                                        summaryType="sum"
                                                        customizeText={(e) => `${e.value.toFixed(2)}`}
                                                        showInGroupFooter={false}
                                                        alignByColumn={true}
                                                    />
                                                    <GroupItem
                                                         column="PendingBags"
                                                         summaryType="sum"
                                                         customizeText={(e) =>  `${e.value.toFixed(2)}`}
                                                         showInGroupFooter={false}
                                                         alignByColumn={true}
                                                    />   
                                                </Summary>
                                                <SortByGroupSummaryInfo summaryItem="count" />
                                                </DataGrid>
                                        </div>
                                        <br />
                                    </div>
                              
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PendingOrder;
