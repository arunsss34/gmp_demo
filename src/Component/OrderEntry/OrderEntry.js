import React, { useEffect, useState, useContext,useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getFromAPI } from "../../apiCall/ApiCall.js";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { Button } from 'primereact/button';  
import ThemeContext from '../ThemeContext.js';
import OrderEntryDialog from './OrderEntryDialog.js'

const StockReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columnDefs, setColumnDefs] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const gridRef=useRef(null)

    const { currentTheme } = useContext(ThemeContext);


    const fetchReportData = async () => {
        setLoading(true); 
  
        try {
          const reportResponse = await getFromAPI(`/get_JudgeWiseEvaluatioDetails`);
          setReportData(reportResponse.report || []);
          const keys = Object.keys(reportResponse.report[0] || {});
          const initialColumnDefs = keys.map(key => ({
            headerName: key,
            field: key,
            sortable: true,
            filter: true,
            resizable: true,
            cellStyle: { whiteSpace: 'nowrap', overflow: 'hidden' },
            aggFunc: "sum"
          }));
  
          setColumnDefs(initialColumnDefs);
        } catch (error) {
          console.error("Error fetching report data:", error);
        } finally {
          setLoading(false); 
        }
      };

    useEffect(() => {
        fetchReportData();
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

   
    return (
        <div>
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <div>
                        <Typography variant="h5" sx={{ color: currentTheme.text, fontWeight: 'bold',fontSize: 16 }}>
                               Customer Orders
                        </Typography>
                        
                    <div style={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1,marginTop:10,marginBottom:10 }}>
                        <OrderEntryDialog/>
                    </div>

                        <>
                        <div className="ag-theme-custom-red" style={{ width: '100%' }}>
                                            <AgGridReact
                                                rowData={reportData}
                                                columnDefs={columnDefs}
                                                minWidth={200}  // Set min width for grid
                                                domLayout='autoHeight'
                                                suppressMovableColumns={true}
                                                suppressRowTransform={true}
                                                rowSelection='single'
                                                onGridReady={(params) => {
                                                    gridRef.current = params.api; 
                                                  }} 
                                            />
                                        </div>
                                        <br />
                                  
                        </>
                    
                </div>
            )}
        </div>
    );
};

export default StockReport;
