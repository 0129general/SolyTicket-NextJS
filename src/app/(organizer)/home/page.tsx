"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AuthApi } from "@/app/api/authentication";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";

// Register the components you need
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

type MonthlyStat = {
  month: string;
  ticketsSold: number;
  earnings: number;
  ticketsSoldChange: number;
  earningsChange: number;
};

const staticEventStats = [
  {
    eventName: "Konser 1",
    monthlyData: [
      { month: "Ocak", ticketsSold: 120, totalTickets: 150, earnings: 3000 },
      { month: "Şubat", ticketsSold: 130, totalTickets: 150, earnings: 3200 },
      { month: "Mart", ticketsSold: 110, totalTickets: 150, earnings: 2900 },
      { month: "Nisan", ticketsSold: 140, totalTickets: 150, earnings: 3500 },
      { month: "Mayıs", ticketsSold: 135, totalTickets: 150, earnings: 3300 },
      { month: "Haziran", ticketsSold: 145, totalTickets: 150, earnings: 3600 },
    ],
  },
  {
    eventName: "Festival 2",
    monthlyData: [
      { month: "Ocak", ticketsSold: 250, totalTickets: 300, earnings: 7500 },
      { month: "Şubat", ticketsSold: 260, totalTickets: 300, earnings: 7800 },
      { month: "Mart", ticketsSold: 240, totalTickets: 300, earnings: 7200 },
      { month: "Nisan", ticketsSold: 270, totalTickets: 300, earnings: 8100 },
      { month: "Mayıs", ticketsSold: 265, totalTickets: 300, earnings: 7950 },
      { month: "Haziran", ticketsSold: 275, totalTickets: 300, earnings: 8250 },
    ],
  },
  {
    eventName: "Tiyatro 3",
    monthlyData: [
      { month: "Ocak", ticketsSold: 180, totalTickets: 200, earnings: 5400 },
      { month: "Şubat", ticketsSold: 190, totalTickets: 200, earnings: 5700 },
      { month: "Mart", ticketsSold: 170, totalTickets: 200, earnings: 5100 },
      { month: "Nisan", ticketsSold: 200, totalTickets: 200, earnings: 6000 },
      { month: "Mayıs", ticketsSold: 195, totalTickets: 200, earnings: 5850 },
      { month: "Haziran", ticketsSold: 205, totalTickets: 200, earnings: 6150 },
    ],
  },
  {
    eventName: "Spor 4",
    monthlyData: [
      { month: "Ocak", ticketsSold: 400, totalTickets: 500, earnings: 12000 },
      { month: "Şubat", ticketsSold: 420, totalTickets: 500, earnings: 12600 },
      { month: "Mart", ticketsSold: 380, totalTickets: 500, earnings: 11400 },
      { month: "Nisan", ticketsSold: 450, totalTickets: 500, earnings: 13500 },
      { month: "Mayıs", ticketsSold: 440, totalTickets: 500, earnings: 13200 },
      {
        month: "Haziran",
        ticketsSold: 460,
        totalTickets: 500,
        earnings: 13800,
      },
    ],
  },
  {
    eventName: "Seminer 5",
    monthlyData: [
      { month: "Ocak", ticketsSold: 90, totalTickets: 100, earnings: 2700 },
      { month: "Şubat", ticketsSold: 95, totalTickets: 100, earnings: 2850 },
      { month: "Mart", ticketsSold: 85, totalTickets: 100, earnings: 2550 },
      { month: "Nisan", ticketsSold: 98, totalTickets: 100, earnings: 2940 },
      { month: "Mayıs", ticketsSold: 97, totalTickets: 100, earnings: 2910 },
      { month: "Haziran", ticketsSold: 99, totalTickets: 100, earnings: 2970 },
    ],
  },

];

const HomePageForOrg: React.FC = () => {
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID) as string;
  const [monthlyComparisons, setMonthlyComparisons] = useState<MonthlyStat[]>([]);
  const eventColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];
  const [totalEvents, setTotalEvents] = useState<number>(18);
  const [totalEarnings, setTotalEarnings] = useState<number>(350000);
  const [activeAds, setActiveAds] = useState<number>(3);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = new AuthApi({});
        const res = await api.getOrganizerStatistics(userId);
        if (res && res.data) {
          setMonthlyComparisons(res.data.monthlyComparisons);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);
  const getChartData = (label: string, data: number[], color: string) => ({
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label,
        data: [10, 20, 30, 40, 50, 60],
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  });

  const soldTickets = (label: string, data: number[], color: string) => ({
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label,
        data: [200, 300, 250, 175, 200, 350],
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  });

  const earnings = (label: string, data: number[], color: string) => ({
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label,
        data: [5000, 7000, 6800, 4000, 6000, 10000],
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  });

  const percentage = (label: string, data: number[], color: string) => ({
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label,
        data: [50, 80, 100, 40, 60, 90],
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const ticketsSoldGraph = {
    labels: staticEventStats[0].monthlyData.map((data) => data.month),
    datasets: staticEventStats.map((event, index) => ({
      label: event.eventName,
      data: event.monthlyData.map((data) => data.ticketsSold),
      borderColor: eventColors[index],
      backgroundColor: `${eventColors[index]}33`,
      fill: true,
    })),
  };

  const earningsGraph = {
    labels: staticEventStats[0].monthlyData.map((data) => data.month),
    datasets: staticEventStats.map((event, index) => ({
      label: event.eventName,
      data: event.monthlyData.map((data) => data.earnings),
      borderColor: eventColors[index],
      backgroundColor: `${eventColors[index]}33`,
      fill: true,
    })),
  };

  const ticketRatioGraph = {
    labels: staticEventStats[0].monthlyData.map((data) => data.month),
    datasets: staticEventStats.map((event, index) => ({
      label: event.eventName,
      data: event.monthlyData.map((data) =>
        ((data.ticketsSold / data.totalTickets) * 100).toFixed(2)
      ),
      borderColor: eventColors[index],
      backgroundColor: `${eventColors[index]}33`,
      fill: true,
    })),
  };



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Genel İstatistikler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p>Toplam Etkinlik</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {totalEarnings.toLocaleString()} TL
            </p>
            <p>Toplam Kazanç</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{activeAds}</p>
            <p>Aktif Reklamlar</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          Son 5 Etkinlik - Satılan Biletler
        </h2>
        <div className="relative w-full h-64">
          <Line data={ticketsSoldGraph} options={options} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          Son 5 Etkinlik - Kazançlar (TL)
        </h2>
        <div className="relative w-full h-64">
          <Line data={earningsGraph} options={options} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          Son 5 Etkinlik - Bilet Satış Oranı (%)
        </h2>
        <div className="relative w-full h-64">
          <Line data={ticketRatioGraph} options={options} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Aylık Satılan Biletler</h2>
        <div className="relative w-full h-64">
          <Line
            data={soldTickets(
              "Satılan Biletler",
              monthlyComparisons.map((stat) => stat.ticketsSold),
              "rgba(75, 192, 192, 1)"
            )}
            options={options}
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Aylık Kazançlar</h2>
        <div className="relative w-full h-64">
          <Line
            data={earnings(
              "Kazançlar",
              monthlyComparisons.map((stat) => stat.earnings),
              "rgba(153, 102, 255, 1)"
            )}
            options={options}
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Aylık Bilet Satış Oranı (%)</h2>
        <div className="relative w-full h-64">
          <Line
            data={percentage(
              "Satılan Bilet Değişimi",
              monthlyComparisons.map((stat) => stat.ticketsSoldChange),
              "rgba(255, 159, 64, 1)"
            )}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePageForOrg;
