import React, { useState, useEffect , useContext} from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart, Series, CommonSeriesSettings, Legend, ValueAxis, Title, Export, Tooltip } from 'devextreme-react/chart';
import { getFromAPI } from '../../apiCall/ApiCall.js';
import ThemeContext from '../ThemeContext';

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const { currentTheme } = useContext(ThemeContext);

  // Fetch date options on component mount
  useEffect(() => {
    const fetchDateOptions = async () => {
      try {
        const response = await getFromAPI('/get_dates');
        setDateOptions(response.dates); // Set the date options for the dropdown
        setSelectedDateRange(response.dates[0]); // Set default date range
      } catch (error) {
        console.error("Error fetching date options:", error);
      }
    };
    fetchDateOptions();
  }, []);

  // Fetch data based on the selected date range
  useEffect(() => {
    const fetchData = async () => {
      if (selectedDateRange) {
        setLoading(true);
        try {
          const { start_date, end_date } = selectedDateRange;
          const data = { start_date, end_date };
          const response = await getFromAPI('/get_sales_analysis_document_type_chart?data=' + JSON.stringify(data));
          setDataSource(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedDateRange]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <FormControl fullWidth margin="normal" sx={{color: currentTheme.text, width: 200, height: 40 }}>
        <InputLabel id="date-range-label" sx={{color: currentTheme.text}}>Date Range</InputLabel>
        <Select
         sx={{color: currentTheme.text}}
          labelId="date-range-label"
          value={selectedDateRange ? selectedDateRange.date_description : ''}
          onChange={(event) => {
            const selectedOption = dateOptions.find(option => option.date_description === event.target.value);
            setSelectedDateRange(selectedOption);
          }}
          label="Date Range"
        >
          {dateOptions.map((option) => (
            <MenuItem key={option.date_description} value={option.date_description}>
              {option.date_description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Chart
        id="chart"
        dataSource={dataSource}
        rotated={false} 
      >
        <CommonSeriesSettings
          argumentField="Month"
          type="stackedbar"
          stacked={true} 
        />
        <Series
          valueField="Fiber Sales Invoice"
          name="Fiber Sales Invoice"
        />
        <Series
          valueField="Fiber Wastage Invoice"
          name="Fiber Wastage Invoice"
        />
        <Series
          valueField="Invoice"
          name="Total Invoice"
        />
        <Series
          valueField="Machine Spare Sales Invoice"
          name="Machine Spare Sales Invoice"
        />
        <Series
          valueField="Machine Sales Invoice"
          name="Machine Sales Invoice"
        />
        <Series
          valueField="Packing Material Invoice"
          name="Packing Material Invoice"
        />
        <ValueAxis position="left">
          <Title text="Amount (in Lakhs)" />
        </ValueAxis>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="top"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          location="edge"
          customizeTooltip={(arg) => `${arg.seriesName}: ${arg.valueText}`}
        />
      </Chart>
    </div>
  );
}

export default App;
