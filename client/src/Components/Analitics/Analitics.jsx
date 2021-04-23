import React, {useEffect} from 'react';
import './Analitics.css';

import Chart from 'chart.js';

const renderChart = (ctx, data=0) => {
    Chart.defaults.global.defaultFontColor = "black";
    
     new Chart(ctx, {
            type: "bar",
            data: {
                labels: ['Last Month', 'Last week', 'Today'],
                datasets: [{
                    data: [12, 5, 7, 4],
                    
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
              title: {
                display: true,
                text: ["Personal Progress"]
            },
                legend: {
                  display: false
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
        }
    }
        
    )
    
}



export default function Analitics(props){

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
        const ctx = document.getElementById("canvas-1").getContext('2d');
        const ctx2 = document.getElementById("canvas-2").getContext('2d');
        const ctx3 = document.getElementById("canvas-3").getContext('2d');
        renderChart(ctx);
        renderChart(ctx2);
        renderChart(ctx3);
    })

    return (
        <aside className="aside-analitics right ">
            <div className="chartjs-aside-wrapper">
                <div id="canvas-1'1" style={{position: 'relative', marginTop:'10px', height: '150px', width:'100%'}}>
                <canvas id="canvas-1"></canvas>
                </div>
                < div id="canvas-1'1" style={{position: 'relative',marginTop:'10px', height: '150px', width:'100%'}}>
                <canvas id="canvas-2"></canvas>
                </div>
                <div id="canvas-1'1" style={{position: 'relative',marginTop:'10px', height: '150px', width:'100%'}}>
                <canvas id="canvas-3"></canvas>
                </div>
            
            </div>
        </aside>
    );
}
export {renderChart};