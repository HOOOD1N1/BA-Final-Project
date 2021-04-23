import React, {useState, useEffect} from 'react';
import './AnaliticsPage.css';
import {Bar, Pie} from 'react-chartjs-2';
import Taskbar from '../TaskBar/TaskBar';
import {renderChart} from '../Analitics/Analitics';


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
    useEffect(()=>{
        const canvas1 = document.getElementById("page1").getContext('2d');
        const canvas2 = document.getElementById("page2").getContext('2d');
        // const canvas3 = document.getElementById("page3").getContext('2d');
        // const canvas4 = document.getElementById("page4").getContext('2d');
        // const canvas5 = document.getElementById("page5").getContext('2d');
        // const canvas6 = document.getElementById("page6").getContext('2d');
        renderChart(canvas1);
        renderChart(canvas2);
        // renderChart(canvas3);
        // renderChart(canvas4);
        // renderChart(canvas5);
        // renderChart(canvas6);

    },[])

    return(
        <div className="analitics-page">
            <Taskbar image={props.image}/>
            <div className="grid_section">
            <section className="title_section">
                <h1 className="title_card" style={{textAlign: 'center'}}>
                    Analytics
                </h1>
            </section>
            <section className="analytics-grid">
                <div className="analytics-span">
                <div id="span1" className="canvas-page">
                <canvas id="page1" ></canvas>
                </div>
                {/* <div className="canvas-page">
                <canvas id="page2" className="canvas-page "></canvas>
                </div> */}
                
                </div>
                {/* <canvas id="page3" className="canvas-page"></canvas>
                <canvas id="page4" className="canvas-page"></canvas>
                <canvas id="page5" className="canvas-page"></canvas>
                <canvas id="page6" className="canvas-page"></canvas> */}

            </section>
            </div>
        </div>
        );
    }

export default AnaliticsPage;