import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Grid, CircularProgress} from "@mui/material";
import { getFromAPI } from '../../apiCall/ApiCall';
import { useSelector } from 'react-redux';

ChartJS.register(...registerables, ChartDataLabels);

export default function PartyInfoGraph() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(false);

    const menu_pk = useSelector(state => state.renderComponent.propsdata.props);
    const { agent_id } = useSelector(state => state.idReducer);

    async function fetchData() {
        setLoading(true);
        try {
            const data = {menu_pk:menu_pk, agent_id:agent_id}
            const response1 = await getFromAPI("/get_each_agent_graph?data=" + JSON.stringify(data));
            GraphData(response1)
            
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    function GraphData(response1){
        const x_axis = response1.map(item => Object.keys(item)[0]);
        const y_axis = response1.map(item => Object.values(item)[0]);

        const data = {
            labels: x_axis,
            datasets: [
                {
                    label:"Amount",
                    data: y_axis,
                    borderWidth: 1
                }
            ]
        };

        const options = {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: function(value) {
                        return '₹' + value.toLocaleString();
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        font: {
                            weight: 'normal'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Outstanding',
                        font: {
                            weight: 'normal'
                        }
                    }
                }
            }
        };
        

        setChartData(data);
        setChartOptions(options);
    }

    useEffect(() => {
       fetchData()
    }, []);

    return (
        
        <div >
            {loading ? (
              <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                  <CircularProgress />
              </Grid>
          ) : (<>
            <Chart type="bar" data={chartData} options={chartOptions} /><br/></>)}
        </div>
    );
}
