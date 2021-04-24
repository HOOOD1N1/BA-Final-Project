import React, {useEffect} from 'react';
import './Analitics.css';

import Chart from 'chart.js';

const renderChart = (ctx, data=0, labels, text) => {
    Chart.defaults.global.defaultFontColor = "black";
    
     new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
              title: {
                display: true,
                text: [text]
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
      const userId =  JSON.parse(localStorage.getItem('user')).userId;
        const value = await fetch(`http://localhost:8888/analitics/${userId}`);
        let newValues = await value.json();
        console.log("My analytics are" + JSON.parse(newValues.totalPosts))
        const ctx = document.getElementById("canvas-1").getContext('2d');
        const ctx2 = document.getElementById("canvas-2").getContext('2d');
        const ctx3 = document.getElementById("canvas-3").getContext('2d');
        
        let data1 = [JSON.parse(newValues.totalPosts), JSON.parse(newValues.postsResult)];
        let data2 = [JSON.parse(newValues.totalComments), JSON.parse(newValues.commentsResult)];
        let data3 = [JSON.parse(newValues.totalReviews), JSON.parse(newValues.reviewsResult)];

        
        renderChart(ctx, data1, ['Total Posts', 'Your posts'], 'Posts');
        renderChart(ctx2, data2, ['Total Comments', 'Your comments'], 'Comments');
        renderChart(ctx3, data3, ['Total Reviews', 'Your reviews'], 'Reviews');
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