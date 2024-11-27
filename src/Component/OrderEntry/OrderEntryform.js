import React, { useState, useEffect,useContext } from "react";
import { getFromAPI, postToAPI } from "../../apiCall/ApiCall.js";
import {
 Paper, Grid, CircularProgress, Typography
} from "@mui/material";
import Button from 'devextreme-react/button';
import ToastMessage from '../../ToastMessage.js';
import ThemeContext from '../ThemeContext.js';
import { TextBox } from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { Validator, RequiredRule} from 'devextreme-react/validator';
import { ValidationGroup } from "devextreme-react/validation-group"
import DateBox from 'devextreme-react/date-box';
import TagBox, { TagBoxTypes } from 'devextreme-react/tag-box';


const OrderEntryform = () => {
    const [loading, setLoading] = useState(false);
    const { currentTheme } = useContext(ThemeContext);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const [showMessage, setShowMessage] = useState(false);

    const [DocNo, setDocNo] = useState('');
    const [DocDate, setDocDate] = useState('');
    const [orderType, setOrderType] = useState('');
    const [ProfomoNo, setProfomoNo] = useState('');
    const [RefNo, setRefNo] = useState('');
    const [RefDate, setRefDate] = useState('');
    const [Reason, setReason] = useState('');

    const [Name, setName] = useState('');
    const [Address, setAddress] = useState('');
    const [GstNo, setGstNo] = useState('');
    const [DistrictOrState, setDistrictOrState] = useState('');
    const [CountryOrPincode, setCountryOrPincode] = useState('');
    const [ContactName, setContactName] = useState('');
  
    const OrderTypeList = ['Direct', 'Profomo'];
    const OrderNO = ['Order1', 'Order2', 'Order3'];
    const RefNO = ['Ref1', 'Ref2', 'Ref3'];
    const ReasonList = ['Reason1', 'Reason2', 'Reason3'];
    const NameList = ['Name1', 'Name2', 'Name3'];
    const ContactNameList = ['Name1', 'Name2', 'Name3'];


    const defaultStylingMode = 'outlined';
   const labelMode= 'floating';
   const [selectedValues, setSelectedValues] = useState([]);

  // Example data for the dropdown
  const examOptions = [
    { id: 1, examName: "Item1" },
    { id: 2, examName: "Item2" },
    { id: 3, examName: "Item3" },
    { id: 4, examName: "Item4" },
  ];

  // Handler to capture the selected values
  const onSelectionChange = (e) => {
    setSelectedValues(e.value);  // Update selected values
    console.log("Selected values: ", e.value);  // Log selected values on click
  };
  
    const handleSubmit = (e) => {
    
         
    };


  return (
    <>
      <ToastMessage showmessage={showMessage} message={message} variant={variant} setShowMessage={setShowMessage}/>
     {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <div>
                    <ValidationGroup >
                        <Paper
                            elevation={3}
                            style={{
                            padding: '40px',
                            marginTop: '20px',
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                            Document Info
                            </Typography>
                            <br />
                            <br />
                             <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            value={DocNo}
                                            onValueChanged={(e) => setDocNo(e.value)}
                                            label="Document NO"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                          </TextBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                    <DateBox
                                            value={DocDate}
                                            onValueChanged={(e) => setDocDate(e.value)}
                                            label="Document Date"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                        >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </DateBox>
                                           
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                    <SelectBox
                                            searchEnabled={true}
                                            items={OrderTypeList}
                                            value={orderType}
                                            onValueChanged={(e) => setOrderType(e.value)}
                                            label="Order Type"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SelectBox
                                            searchEnabled={true}
                                            items={OrderNO}
                                            value={ProfomoNo}
                                            onValueChanged={(e) => setProfomoNo(e.value)}
                                            label="Profoma / Order No"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SelectBox
                                           searchEnabled={true}
                                            items={RefNO}
                                            value={RefNo}
                                            onValueChanged={(e) => setRefNo(e.value)}
                                            label="Reference No"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <DateBox
                                            value={RefDate}
                                            onValueChanged={(e) => setRefDate(e.value)}
                                            label="Reference Date"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </DateBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SelectBox
                                            searchEnabled={true}
                                            items={ReasonList}
                                            value={Reason}
                                            onValueChanged={(e) => setReason(e.value)}
                                            label="Reason"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                </Grid>

                            
                        </Paper>

                        <Paper
                            elevation={3}
                            style={{
                            padding: '40px',
                            marginTop: '20px',
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                            Customer Info
                            </Typography>
                            <br />
                            <br />
                             <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                    <SelectBox
                                            searchEnabled={true}
                                            items={NameList}
                                            value={Name}
                                            onValueChanged={(e) => setName(e.value)}
                                            label="Name"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            value={Address}
                                            onValueChanged={(e) => setAddress(e.value)}
                                            label="Address"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                          </TextBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            value={GstNo}
                                            onValueChanged={(e) => setGstNo(e.value)}
                                            label="GstNo"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                          </TextBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            value={DistrictOrState}
                                            onValueChanged={(e) => setDistrictOrState(e.value)}
                                            label="District / State"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                          </TextBox>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextBox
                                            value={CountryOrPincode}
                                            onValueChanged={(e) => setCountryOrPincode(e.value)}
                                            label="Country / Pincode"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                          </TextBox>
                                    </Grid>
                                  
                                    <Grid item xs={12} md={4}>
                                        <SelectBox
                                            searchEnabled={true}
                                            items={ContactNameList}
                                            value={ContactName}
                                            onValueChanged={(e) => setContactName(e.value)}
                                            label="ContactName"
                                            stylingMode={defaultStylingMode}
                                            labelMode={labelMode}
                                            style={{ width: '100%' }}
                                            >
                                            <Validator>
                                              <RequiredRule  />
                                            </Validator>
                                            </SelectBox>
                                    </Grid>
                                </Grid>

                            
                        </Paper>
                        <Paper
                            elevation={3}
                            style={{
                            padding: '40px',
                            marginTop: '20px',
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                            Order Items
                            </Typography> 
                            <br />
                            <br />
                            <TagBox
                                items={examOptions}
                                displayExpr="examName"
                                valueExpr="id"
                                showSelectionControls={true}  
                                searchEnabled={true}  
                                onValueChanged={onSelectionChange}
                                value={selectedValues}  
                                placeholder="Select Items"
                            />

                        </Paper>


                        <Grid
                            item
                            xs={12}
                            md={4}
                            style={{ textAlign: 'center', marginTop: '20px' }}
                        >
                            <Button 
                                width={220}
                                text="Save"
                                style={{ background: '#53a112',color:currentTheme.text, fontWeight: 'bold', textTransform: 'none' }}
                                type="normal"
                                onClick={(e) => {
                                const validationGroup = e.validationGroup;
                                if (validationGroup) {
                                    const result = validationGroup.validate();
                                    if (result.isValid) {
                                        handleSubmit(); 
                                    } else {
                                        setMessage("Please fill all required fields correctly.");
                                        setVariant('info');
                                        setShowMessage(true);
                                    }
                                }
                                }}
        />
                        </Grid>
                        </ValidationGroup>
  
              
                </div>
            )}
    </>
  )
}

export default OrderEntryform