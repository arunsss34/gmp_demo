import React, { useEffect, useRef, useState, useContext } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getFromAPI } from "../../apiCall/ApiCall.js";
import { Grid, CircularProgress, Typography, Tabs, Tab } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';  
import ThemeContext from '../ThemeContext.js';

const StockReport = () => {
    const gridApiRef = useRef(null);
    const { currentTheme } = useContext(ThemeContext);
    const [getCategoryDetails, setCategoryDetails] = useState([]);
    const [getItemDetails, setItemDetails] = useState([]);
    const [getFrameItemDetails, setFrameItemDetails] = useState([]);
    const [selectWindow, setselectWindow] = useState(0);
    const [loading, setLoading] = useState(false);
    const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [date, setDate] = useState(null);
    const [columnDefs, setColumnDefs] = useState([]);
    const [columnDefsItems, setColumnDefsItems] = useState([]);
    const [columnDefsFrameItems, setColumnDefsFrameItems] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [frameError, setFrameError] = useState(true);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        switch (newValue) {
            case 0:
                handleItems();
                break;
            case 1:
                handleCategory();
                break;
            case 2:
                handleFetchitems();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        handleItems();
    }, []);

    useEffect(() => {
        if (currentTheme) {
            document.documentElement.style.setProperty('--header-background-color', currentTheme.agGrid.headerBackgroundColor);
            document.documentElement.style.setProperty('--row-background-color', currentTheme.agGrid.rowBackgroundColor);
            document.documentElement.style.setProperty('--odd-row-background-color', currentTheme.agGrid.oddRowBackgroundColor);
            document.documentElement.style.setProperty('--even-row-background-color', currentTheme.agGrid.evenRowBackgroundColor);
            document.documentElement.style.setProperty('--data-font-color', currentTheme.agGrid.fontColor || '#ce1111');
            document.documentElement.style.setProperty('--header-font-color', currentTheme.agGrid.headerFontColor || '#741919');
        }
    }, [currentTheme]);

    async function fetchItems() {
        setLoading(true);
        try {
            const data = { menu_pk, type: 1 };
            const response1 = await getFromAPI("/get_stock_details?data=" + JSON.stringify(data));
            setItemDetails(response1.details);
            const keys = response1.fields;
            const initialColumnDefs = keys.map(item => ({
                headerName: item,
                field: item,
                flex: 1,
            }));
            setColumnDefsItems(initialColumnDefs);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategory() {
        setLoading(true);
        try {
            const data = { menu_pk, type: 2 };
            const response1 = await getFromAPI("/get_stock_details?data=" + JSON.stringify(data));
            const details = response1.details;
            const total = response1.total;
            setCategoryDetails([...details, total]);
            const keys = response1.fields;
            const initialColumnDefs = keys.map(item => ({
                headerName: item,
                field: item,
                flex: 1,
            }));
            setColumnDefs(initialColumnDefs);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchFrameItems() {
        setLoading(true);
        try {
            const date2 = new Date(date);
            const formattedDate = date2.getFullYear() + '-' +
                ('0' + (date2.getMonth() + 1)).slice(-2) + '-' +
                ('0' + date2.getDate()).slice(-2);
            const data = { menu_pk, type: 3, date: formattedDate };
            const response1 = await getFromAPI("/get_stock_details?data=" + JSON.stringify(data));
            const total = response1.total;
            const details = response1.details;
            setFrameError(details);
            let key = Object.keys(details);
            let lastKey = key[key.length - 1];
            details[lastKey].push(total);
            setFrameItemDetails(details);
            const keys = response1.fields;
            const initialColumnDefs = keys.map((item, index) => {
                const columnDef = {
                    headerName: item,
                    field: item,
                    flex: 1,
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

    const getRowStyle = (params) => {
        if (params.node.rowIndex === params.api.getDisplayedRowCount() - 1 || /total/i.test(params.node.data['Agent Name'])) {
            return { fontWeight: 'bold', background: currentTheme.background };
        }
        return null;
    };

    const handleItems = () => {
        fetchItems();
        setselectWindow(1);
    };

    const handleCategory = () => {
        fetchCategory();
        setselectWindow(2);
    };

    const handleFetchitems = () => {
        setselectWindow(3);
    };

    const onGridReady = params => {
        gridApiRef.current = params.api;
    };

    async function PdfDownload() {
        setLoading(true);
        setPdfLoading(true);
        try {
            let formattedDate = '';
            if (selectWindow === 3) {
                const date2 = new Date(date);
                formattedDate = date2.getFullYear() + '-' +
                    ('0' + (date2.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date2.getDate()).slice(-2);
            }
            const data = { menu_pk, type: selectWindow, date: formattedDate };
            const response1 = await getFromAPI("/get_stock_pdf?data=" + JSON.stringify(data));
            handleDownload(response1.base64string, response1.file_name);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setPdfLoading(false);
        }
    }

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
        <>
            {loading ? (
                <>
                    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                        <CircularProgress />
                    </Grid>
                    {pdfLoading && <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>PDF Generating Please Wait......</div>}
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="tabs"
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
                            <Tab label="Items" />
                            <Tab label="Category" />
                            {/* <Tab label="Frame" /> */}
                        </Tabs>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', height: '50%', flexGrow: 1 }}>
                            <Button
                                onClick={() => {
                                    if (selectWindow) {
                                        PdfDownload();
                                    }
                                }}
                                label="Pdf"
                            outlined
                            style={{backgroundColor: currentTheme.lightbg, color: '#bf1d54'}}
                            className="pi pi-file-pdf"
                                disabled={(() => {
                                    if (selectWindow === 3) {
                                        if (!frameError || !date) {
                                            return true;
                                        }
                                    }
                                    return false;
                                })()}
                            />
                        </div>
                    </div>
                    <br/>

                    {activeTab === 0 && (
                        <>
                            {getItemDetails && Object.keys(getItemDetails).map(packingKey => {
                                const packingData = getItemDetails[packingKey];
                                return (
                                    <div key={packingKey}>
                                        <div style={{ marginBottom: '1%' }}>
                                            <Typography variant='body1' sx={{color: currentTheme.text}}>Location: <b >{packingKey}</b></Typography>
                                        </div>
                                        {packingData && Object.keys(packingData).map(categoryKey => {
                                            const itemsArray = packingData[categoryKey];
                                            return (
                                                <div key={categoryKey}>
                                                    <div style={{ marginBottom: '2%' }}>
                                                        <Typography variant='body2' sx={{color: currentTheme.text}}>Type: <b>{categoryKey}</b></Typography>
                                                    </div>
                                                    <div className="ag-theme-custom-red" style={{ width: '100%' }}>
                                                        <AgGridReact
                                                            columnDefs={columnDefsItems}
                                                            rowData={itemsArray}
                                                            domLayout='autoHeight'
                                                            onGridReady={onGridReady}
                                                            suppressMovableColumns={true}
                                                        />
                                                    </div>
                                                    <br />
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {activeTab === 1 && (
                        <>
                            {getCategoryDetails.length > 0 &&
                                <div className="ag-theme-custom-red" style={{ height: '100%', width: '100%' }}>
                                    <AgGridReact
                                        columnDefs={columnDefs}
                                        rowData={getCategoryDetails}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady}
                                        suppressMovableColumns={true}
                                        onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                                        getRowStyle={getRowStyle}
                                    />
                                </div>
                            }
                        </>
                    )}

                    {activeTab === 2 && (
                        <div>
                            <div style={{ display: 'flex', gap: 15, marginBottom: '2%' }}>
                                <Calendar value={date} onChange={(e) => setDate(e.value)} showIcon />
                                <Button
                                    onClick={() => {
                                        if (date) {
                                            fetchFrameItems();
                                        } else {
                                            alert('Select the date');
                                        }
                                    }}
                                    className="pi pi-search"
                                    severity='contrast'
                                    size="small"
                                />
                            </div>

                            <>
                                {!frameError ? (
                                    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>No Data Found......</div>
                                ) : (
                                    <>
                                        {getFrameItemDetails && Object.keys(getFrameItemDetails).map(keys => {
                                            const itemsKey = getFrameItemDetails[keys];
                                            return (
                                                <div key={keys}>
                                                    <div style={{ marginBottom: '2%' }}>
                                                        <Typography variant='body2' sx={{color: currentTheme.text}}>Type: <b >{keys}</b></Typography>
                                                    </div>
                                                    <div className="ag-theme-custom-red" style={{ width: '100%' }}>
                                                        <AgGridReact
                                                            columnDefs={columnDefsFrameItems}
                                                            rowData={itemsKey}
                                                            domLayout='autoHeight'
                                                            onGridReady={onGridReady}
                                                            suppressMovableColumns={true}
                                                            getRowStyle={getRowStyle}
                                                            suppressRowTransform={true}
                                                        />
                                                    </div>
                                                    <br />
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default StockReport;
