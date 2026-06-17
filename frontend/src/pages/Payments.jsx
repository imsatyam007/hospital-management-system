import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PaymentList from "../components/PaymentList";
import { getPayments } from "../services/paymentService";
import { FaCreditCard } from "react-icons/fa";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPayments()
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const successfulPayments = payments.filter(
    (payment) => payment.paymentStatus === "SUCCESS")

    const filteredPayments = payments.filter(
        (payment) =>
            payment.patientName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
            payment.doctorName
            .toLowerCase()
            .includes(search.toLowerCase())
        );

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <FaCreditCard className="text-blue-500" />
            Payments
    </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <div className="bg-white shadow rounded-xl p-5">
    <h3 className="text-gray-500">Total Payments</h3>
    <p className="text-3xl font-bold text-blue-600">
      {payments.length}
    </p>
  </div>

  <div className="bg-white shadow rounded-xl p-5">
    <h3 className="text-gray-500">Successful Payments</h3>
    <p className="text-3xl font-bold text-green-600">
      {successfulPayments.length}
    </p>
  </div>

  <div className="bg-white shadow rounded-xl p-5">
    <h3 className="text-gray-500">Total Revenue</h3>
    <p className="text-3xl font-bold text-purple-600">
      ₹{totalRevenue}
    </p>
  </div>
  </div>

<div className="mb-4">
  <input
    type="text"
    placeholder="Search by Patient or Doctor..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-2 border rounded-lg"
  />
</div>
      <PaymentList payments={filteredPayments} />
    </MainLayout>
  );
}

export default Payments;