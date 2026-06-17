import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../services/axiosInstance";
import { getRevenueTrend, getRevenueByDoctor } from "../services/revenueService";
import RevenueChart from "../components/RevenueChart";
import PaidPendingPieChart from "../components/PaidPendingPieChart";
import DoctorRevenueChart from "../components/DoctorRevenueChart";
import MonthlyRevenueChart from "../components/MonthlyRevenueChart";
import {getMonthlyRevenue}from "../services/revenueService";

import { MdDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

function RevenueDashboard() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [doctorRevenue, setDoctorRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const fetchRevenue = async () => {
    try {
      console.log("Fetching revenue...");
      const response = await axiosInstance.get("/api/revenue");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Revenue Error:", error);
      console.log(error.response);
    }
  };

  const fetchTrend = async () => {
    try {
      const response = await getRevenueTrend();
      console.log("TREND DATA:", response.data);
      setTrendData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDoctorRevenue = async () => {
    try {
      const response = await getRevenueByDoctor();
      setDoctorRevenue(response.data);
    } catch (error) {
      console.error(error);
    }
  };

const fetchMonthlyRevenue = async () => {

  try {

    const response =
      await getMonthlyRevenue();

    console.log(
      "MONTHLY DATA:",
      response.data
    );

    setMonthlyRevenue(
      response.data
    );

  } catch (error) {

    console.error(
      "MONTHLY ERROR:",
      error
    );

  }
};

  useEffect(() => {
    fetchRevenue();
    fetchTrend();
    fetchDoctorRevenue();
    fetchMonthlyRevenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <MainLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold">
            Loading Revenue Dashboard...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">

        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <MdDashboard className="text-green-500" />
        Revenue Dashboard
      </h1>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h3 className="text-gray-500 text-lg">Total Revenue</h3>
            <p className="text-3xl font-bold text-black mt-2">₹{data.totalRevenue}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h3 className="text-gray-500 text-lg">Paid Revenue</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{data.paidRevenue}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h3 className="text-gray-500 text-lg">Pending Revenue</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{data.pendingRevenue}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 border">
            <h3 className="text-gray-500 text-lg">Total Bills</h3>
            <p className="text-3xl font-bold text-black mt-2">{data.totalBills}</p>
          </div>
        </div>

        {/* Revenue Trend Table */}
        {trendData.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FaChartLine className="text-green-500" /> Revenue Trend
            </h2>
            <div className="bg-white shadow-lg rounded-xl p-6 border">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-gray-500">Date</th>
                    <th className="py-2 text-gray-500">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {trendData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-bold text-black">{item.date}</td>
                      <td className="py-2 font-bold text-green-600">
                        ₹{item.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Line Chart */}
        <div className="mt-10">
          <RevenueChart trendData={trendData} />
        </div>

        {/* Paid vs Pending Pie Chart */}
        <div className="mt-10">
          <PaidPendingPieChart
            paidRevenue={data.paidRevenue}
            pendingRevenue={data.pendingRevenue}
          />
        </div>

        {/* Doctor Revenue Chart */}
        <div className="mt-10">
          <DoctorRevenueChart doctorRevenue={doctorRevenue} />
        </div>

        <div className="mt-10">

          <MonthlyRevenueChart
            monthlyRevenue={
              monthlyRevenue
            }
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default RevenueDashboard;