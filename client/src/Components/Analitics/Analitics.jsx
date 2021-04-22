import React, {useState, useEffect} from 'react';
import './Analitics.css';
import {Bar} from 'react-chartjs-2';
import Chart from 'chart.js';

const renderChart = (ctx, data=0) => {
    Chart.defaults.global.defaultFontColor = "black";
    
     new Chart(ctx, {
            type: "bar",
            data: {
                labels: ['Luna trecuta', 'Ieri', 'Azi'],
                datasets: [{
                    data: [12, 5, 7, 4],
                    borderColor: "#4b92ff",
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
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
                <canvas id="canvas-1"></canvas>
                <canvas id="canvas-2"></canvas>
                <canvas id="canvas-3"></canvas>
            {/* <Bar
            data={{
                labels: ['Luna trecuta', 'Ieri', 'Azi'],
                datasets: [{
                    label: '# your posts',
                    data: [12, 5, 7, 4],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1,
                }],
            
            
            
            }}
            options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }} 
            height={50}
            width={50}/>
            <Bar
            data={{
                labels: ['Luna trecuta', 'Ieri', 'Azi'],
                datasets: [{
                    label: '# overall posts',
                    data: [12, 5, 7, 4],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1,
                }],
            
            
            
            }}
            options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }} 
            height={50}
            width={50}/>
            <Bar
            height={50}
            width={50}
            data={{
                labels: ['Luna trecuta', 'Ieri', 'Azi'],
                datasets: [{
                    label: '# of posts',
                    data: [12, 5, 7, 4],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    
                    borderWidth: 1,
                }],
            
            
            
            }}
            options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }} 
    /> */}
</div>
        </aside>
    );
}