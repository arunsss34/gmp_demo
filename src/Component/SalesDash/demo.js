import React from 'react';
import Chart, {
  ArgumentAxis,
  Legend,
  Series,
  ValueAxis,
  Label,
  Export,
  Tick,
} from 'devextreme-react/chart';

const data = [
  { day: "1", sales: 4 },
  { day: "2", sales: 2 },
  { day: "3", sales: 10 },
  { day: "4", sales: 7 },
  { day: "5", sales: 7 },
  { day: "6", sales: 6 },
  { day: "7", sales: 2 },
  { day: "8", sales: 2 },
  { day: "9", sales: 4 },
  { day: "10", sales: 9 }
];

const customizeText = (e) => `Day ${e.value}`;

function App() {
  return (
    <Chart
      title="Daily Sales"
      dataSource={data} // Provide data directly
      rotated={true} // Rotates the chart to horizontal bars
      id="chart"
      height={600} // Optional: Set height for better visual
    >
      <ArgumentAxis>
        <Label customizeText={customizeText} />
      </ArgumentAxis>

      <ValueAxis>
        <Tick visible={false} />
        <Label visible={false} />
      </ValueAxis>

      <Series
        valueField="sales"
        argumentField="day"
        type="bar" // Horizontal bars
        color="#79cac4"
      >
        <Label
          visible={true}
          backgroundColor="#c18e92"
        />
      </Series>

      <Legend visible={false} />
      <Export enabled={true} />
    </Chart>
  );
}

export default App;
