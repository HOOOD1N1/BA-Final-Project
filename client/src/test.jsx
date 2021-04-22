import React, { useEffect } from "react";
import Chart from "chart.js";
import "./test.css";

const BasicComponent = (props) => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const canvasElement = document.querySelector("#basicCanvas");

    const data = [12, 5, 7, 4] 
    Chart.defaults.global.defaultFontColor = "black";

    new Chart(canvasElement, {
      type: "bar",
      data: {
        labels: ["Luna trecuta", "Ieri", "Azi"],
        datasets: [
          {
            data: data,
            borderColor: "#4b92ff",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: {
          display: false,
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
      },
    });
  });

  return (
    <>
        <div>
      <canvas id="basicCanvas"></canvas>
      </div>
    </>
  );
};

export default BasicComponent;
