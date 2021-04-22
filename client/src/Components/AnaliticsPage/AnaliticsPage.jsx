import React, {useState, useEffect} from 'react';
import './AnaliticsPage.css';
import {Bar, Pie} from 'react-chartjs-2';
import Taskbar from '../TaskBar/TaskBar';


 const AnaliticsPage =(props) =>{
     const [analiticsData, setAnaliticsData] = useState({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
       const userId =  JSON.parse(localStorage.getItem('user')).userId;
       const data = await fetch(`http://localhost:8888/analitics/${userId}`, {
        method: "POST",
        headers: {
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
          "Content-Type": "application/json",
        },
       });
       //console.log(data.json());
       const newData = await data.json();
       setAnaliticsData(newData);
    },[])

    return(
        <div className="analitics-page">
            <Taskbar image={props.image}/>
            <div className="grid_section">
            <section className="title_section">
                <h1 className="title_card" style={{textAlign: 'center'}}>
                    Analitics
                </h1>
            </section>
            <section className="section">
            <Bar
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
            
            </section>
            <section className="section">Section 2
            <Bar
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
            </section>
            <section className="section">Section 3
            <Bar
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
            </section>
            </div>
            
        </div>
    );
}

export default AnaliticsPage;