import React, { useEffect, useState, useContext,useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getFromAPI } from "../../apiCall/ApiCall.js";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { Button } from 'primereact/button';  
import { Calendar } from 'primereact/calendar';
import ThemeContext from '../ThemeContext.js';
import { InputText } from 'primereact/inputtext';


const StockReport = () => {
    const [frameItemDetails, setFrameItemDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [date, setDate] = useState(null);
    const [selectedDate, setselectedDate] = useState(null);

    const [columnDefsFrameItems, setColumnDefsFrameItems] = useState([]);
    const [frameError, setFrameError] = useState(true);
    const gridRef=useRef(null)
    const [searchWord, setSearchWord] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);


    const handleSearchChange = (event) => {
        setSearchWord(event.target.value);
    };

    useEffect(() => {
        if (searchWord) {
          const filtered = {};

          Object.keys(filteredItems).forEach(key => {
                const items = filteredItems[key];
            
                const filteredObj = items.filter(item => 
                    item.Count && item.Count.toLowerCase().includes(searchWord.toLowerCase())
                );
                if (filteredObj.length>0){
                    filtered[key] = filteredObj;
                }
            });
          setFrameItemDetails(filtered);
        } else {
          setFrameItemDetails(filteredItems); 
        }
      }, [searchWord]);

    const { currentTheme } = useContext(ThemeContext);

    useEffect(() => {
        // Fetch the last update date and set it
        const fetchInitialData = async () => {
            try {
                setLoading(true)
                await getLud(); // Fetch the last update date
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
            document.documentElement.style.setProperty('--data-font-color', currentTheme.agGrid.fontColor || '#ce1111'); // Use the theme's data font color or fallback
            document.documentElement.style.setProperty('--header-font-color', currentTheme.agGrid.headerFontColor || '#741919'); // Use the theme's header font color or fallback
        }
    }, [currentTheme]);

    const getLud = async () => {
        try {
            const response = await getFromAPI(`get_frame_last_update_dt`);
            const latestDate = new Date(response.dates);
            setDate(latestDate);
            setselectedDate(response.last_updated_date)
        } catch (error) {
            console.error("Error fetching last update date:", error);
        }
    };

    useEffect(() => {
        if (date) {
            fetchFrameItems();
        }
    }, [date]);

    async function fetchFrameItems() {
        setLoading(true);
        try {
            const date2 = new Date(date);
            const formattedDate = `${date2.getFullYear()}-${('0' + (date2.getMonth() + 1)).slice(-2)}-${('0' + date2.getDate()).slice(-2)}`;
            const data = { menu_pk: 11, type: 3, date: formattedDate }; 
            const response = await getFromAPI(`/get_stock_details?data=${JSON.stringify(data)}`);
            console.log(response, 'fetch frame');
            const total = response.total;
            const details = response.details;
            setFrameError(details);
            let key = Object.keys(details);
            let lastKey = key[key.length - 1];
            details[lastKey].push(total);

            setFrameItemDetails(details);
            setFilteredItems(details)
            


            const keys = response.fields;
            const initialColumnDefs = keys.map((item, index) => {
                const columnDef = {
                    headerName: item,
                    field: item,
                    flex: 1,
                    minWidth: 200,  // Set minimum width for columns
                };

                if (index === 0) {
                    columnDef.rowSpan = params => {
                        const data = params.data;
                        let span = 1;

                        for (let i = 1; ; i++) {
                            const nextRow = params.api.getDisplayedRowAtIndex(params.node.rowIndex + i);
                            if (nextRow && data[item] === nextRow.data[item]) {
                                span++;
                            } else {
                                break;
                            }
                        }

                        return span;
                    };

                    columnDef.cellClass = params => {
                        const currentItem = params.data[item];
                        const previousRow = params.api.getDisplayedRowAtIndex(params.node.rowIndex + 1);

                        if (previousRow && previousRow.data[item] === currentItem) {
                            return 'centered-cell';
                        }
                        return '';
                    };

                    columnDef.cellRenderer = params => {
                        const currentItem = params.data[item];
                        const previousRow = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1);

                        if (previousRow && previousRow.data[item] === currentItem) {
                            return '';
                        }
                        return params.value;
                    };
                }

                return columnDef;
            });
            setColumnDefsFrameItems(initialColumnDefs);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    }

    const getRowStyle = params => {
        if (params.node.rowIndex === params.api.getDisplayedRowCount() - 1 || /total/i.test(params.node.data['Lot No'])) {
            return { fontWeight: 'bold', background: currentTheme.background };
        }
        return null;
    };

    async function PdfDownload() {
        setLoading(true);
        setPdfLoading(true);
        try {
            const date2 = new Date(date);
            const formattedDate = `${date2.getFullYear()}-${('0' + (date2.getMonth() + 1)).slice(-2)}-${('0' + date2.getDate()).slice(-2)}`;
            const data = { menu_pk: 11, type: 3, date: formattedDate }; 
            const response = await getFromAPI(`/get_stock_pdf?data=${JSON.stringify(data)}`);
            handleDownload(response.base64string, response.file_name);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setPdfLoading(false);
        }
    }

    const handleDownload = (base64String, file_name) => {
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

    const onSelectionChanged = params => {
        const selectedRows = params.api.getSelectedRows();
    
        if (selectedRows.length > 0) {
            const selectedRow = selectedRows[0];     
            const selectedNode = params.api.getSelectedNodes()[0]; 
            const selectedIndex = selectedNode.rowIndex;
    
            selectNextRow(params.api, selectedIndex);
        }
    };
    
    const selectNextRow = (gridApi, currentIndex) => {
        const firstColumnField = gridApi.getColumnDefs()[0].field; 
        const rowCount = gridApi.getDisplayedRowCount(); 
        
        const currentFirstColumnValue = gridApi.getDisplayedRowAtIndex(currentIndex).data[firstColumnField];
        
        let nextIndex = currentIndex + 1;
        
        while (nextIndex < rowCount) {
            const nextRowNode = gridApi.getDisplayedRowAtIndex(nextIndex);
            const nextFirstColumnValue = nextRowNode.data[firstColumnField];
            
            if (nextFirstColumnValue === currentFirstColumnValue) {
                nextRowNode.setSelected(true);
                nextIndex++; 
            } else {
                break;
            }
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
                    <Grid container alignItems={'center'} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} 
                        sx={{ mb: 3 }}
                        >
                        <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
                               As On {selectedDate}
                                </Typography>
                        </Grid>
                    <div style={{ display: 'flex', justifyContent: 'flex-end',gap:20, flexGrow: 1 }}>
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
                                if (date) {
                                    PdfDownload();
                                }
                            }}
                            label=" Pdf" outlined
                            style={{backgroundColor: currentTheme.lightbg, color: '#bf1d54', size:100}}
                            className="pi pi-file-pdf"
                            disabled={!date || !frameError}
                        />
                    </div>
                    {Object.keys(frameItemDetails).length === 0? (
                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>No Data Found......</div>
                    ) : (
                        <>
                            {frameItemDetails && Object.keys(frameItemDetails).map(keys => {
                                const itemsKey = frameItemDetails[keys];
                                return (
                                    <div key={keys}>
                                        <div style={{ marginBottom: '2%' }}>
                                            <Typography variant='body2' sx={{color:currentTheme.text}}>Type: <b>{keys}</b></Typography>
                                        </div>
                                        <div className="ag-theme-custom-red" style={{ width: '100%' }}>
                                            <AgGridReact
                                                columnDefs={columnDefsFrameItems}
                                                rowData={itemsKey}
                                                minWidth={200}  // Set min width for grid
                                                domLayout='autoHeight'
                                                suppressMovableColumns={true}
                                                getRowStyle={getRowStyle}
                                                suppressRowTransform={true}
                                                rowSelection='multiple'
                                                onSelectionChanged={onSelectionChanged}
                                                onGridReady={(params) => {
                                                    gridRef.current = params.api; 
                                                  }} 
                                            />
                                        </div>
                                        <br />
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StockReport;
