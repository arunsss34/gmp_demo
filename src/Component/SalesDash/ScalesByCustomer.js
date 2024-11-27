import React, { useEffect, useState, useContext } from 'react';
import PieChart, {
  Series,
  Label,
  Tooltip,
  Legend,
  Title
} from 'devextreme-react/pie-chart';
import 'devextreme/dist/css/dx.light.css';
import { getFromAPI } from "../../apiCall/ApiCall.js";
import { SelectBox } from 'devextreme-react/select-box';
import ThemeContext from '../ThemeContext';
import { Grid, CircularProgress } from "@mui/material";


function App({ period }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docTypeDp, setDocTypeDp] = useState([]);
  const [docType, setDocType] = useState('Top 10');

  const { currentTheme } = useContext(ThemeContext);

  const fetchDocumentTypes = async () => {
    try {
      const response = await getFromAPI(`/get_document_type`);
      setDocTypeDp(response.document_type);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  const fetchData = async (selectedDocType) => {
    setLoading(true);
    try {
      const data = { value: period, type: selectedDocType };
      const response = await getFromAPI(`/get_sales_customer_pie_chart?data=${JSON.stringify(data)}`);
      console.log(response, "------bb")
      const formattedData = response.customer.map(item => ({
        name: item.CustomerName,
        value: (item.TaxableAmount / 100000).toFixed(2)
      }));
      setDataSource(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    if (docType) {
      fetchData(docType);
    }
  }, [docType]);

  return (
    <div>
      <SelectBox
        items={docTypeDp}
        value={docType}
        displayExpr="DocumentType"
        valueExpr="DocumentType"
        onValueChanged={(e) => setDocType(e.value)}
        placeholder="Select Document Type"
        width={200}
        style={{background: 'white', color: currentTheme.text}}
      />
      {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                    <CircularProgress />
                </Grid>
            ) : (
              <>
      {dataSource.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: currentTheme.text }}>
          <h3>No Data Available</h3>
        </div>
      ) : (
        <PieChart
          id="pie-chart"
          dataSource={dataSource}
          type="doughnut"
          palette="Bright"
          innerRadius={0.6}
          height={400}
        >
          <Series
            argumentField="name"
            valueField="value"
          >
            <Label
              visible={false}
              position="outside"
              font={{ size: 8 }}
              customizeText={(pointInfo) => `${pointInfo.argumentText}: ${pointInfo.valueText} Lakhs`}
            />
          </Series>
          <Tooltip
            enabled={true}
            customizeTooltip={(pointInfo) => ({
              text: `${pointInfo.argumentText}: ${pointInfo.valueText} Lakhs`
            })}
          />
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
        </PieChart>
      )}
      </>
      )}
    </div>
  );
}

export default App;
