import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Period = "week" | "month" | "year";

export function UserEvolutionChart() {
  const [period, setPeriod] = useState<Period>("week");

  const data = {
    week: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      users: [4, 5, 2, 2, 0, 1, 3],
    },
    month: {
      labels: Array.from({ length: 30 }, (_, i) => `Jour ${i + 1}`),
      users: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    year: {
      labels: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      users: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
    },
  };

  const chartData = {
    labels: data[period].labels,
    datasets: [
      {
        label: "Utilisateurs",
        data: data[period].users,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Evolution des utilisateurs",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Evolution des utilisateurs</h2>
          <select
            className="select select-bordered w-full max-w-xs"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
          >
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
            <option value="year">Année</option>
          </select>
        </div>
        <div>
          <Line options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
}
