import React, { useEffect, useState } from 'react';
import Chart, {
  ArgumentAxis,
  Legend,
  Series,
  ValueAxis,
  Label,
  Export,
  Tick,
} from 'devextreme-react/chart';
import 'devextreme/dist/css/dx.light.css';
import { getFromAPI } from '../../apiCall/ApiCall.js';

function App({ period }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = { value: period };
      const response = await getFromAPI('/get_sales_analysis_type_chart?data=' + JSON.stringify(data));
      
      // Sort data by Type (or whatever field determines the order)
      const sortedData = response.sales_type
        .map(item => ({
          ...item,
          TaxableAmount: (item.TaxableAmount / 100000).toFixed(2) // Convert to lakhs
        }))
        .sort((a, b) => a.Type.localeCompare(b.Type)); // Change sorting logic if necessary

      setDataSource(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const customizeText = (e) => `${e.value}`; // Customize text for ArgumentAxis

  return (
    <Chart
      dataSource={dataSource}
      rotated={true}
      id="chart"
      height={500}
    >
      <ArgumentAxis>
        <Label customizeText={customizeText} />
      </ArgumentAxis>

      <ValueAxis
        min={0} // Ensure the axis starts at 0
        grid={{ visible: false }} // Hide grid lines
      >
        <Tick visible={true} />
        <Label
          visible={true}
          customizeText={(e) => `${e.value} Lakhs`} // Customize label to show in lakhs
        />
      </ValueAxis>

      <Series
        valueField="TaxableAmount"
        argumentField="Type"
        type="bar"
        color="#506a7e"
      >
        <Label
          visible={true}
          customizeText={(e) => `${e.value} Lakhs`} 
          backgroundColor="#c18e92"
        />
      </Series>

      <Legend visible={false} />
      <Export enabled={true} />
    </Chart>
  );
}

export default App;
