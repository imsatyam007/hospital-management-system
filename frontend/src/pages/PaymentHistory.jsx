import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const PaymentHistory = () => {
const [payments, setPayments] = useState([]);
const [loading, setLoading] = useState(true);

const fetchPayments = async () => {
try {
const response = await axiosInstance.get("/api/payments");
setPayments(response.data);
} catch (error) {
console.error("Error fetching payments", error);
} finally {
setLoading(false);
}
};

const emailInvoice = async (billId) => {
try {
await axiosInstance.post(`/api/bills/${billId}/email`);
alert("Invoice emailed successfully");
} catch (error) {
console.error(error);
alert("Failed to send invoice");
}
};

useEffect(() => {
fetchPayments();
}, []);

if (loading) {
return <div className="p-4">Loading payments...</div>;
}

return ( <div className="container mt-4"> <h2>Payment History</h2>

```
  <table className="table table-bordered table-striped mt-3">
    <thead>
      <tr>
        <th>Payment ID</th>
        <th>Patient</th>
        <th>Doctor</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Payment Date</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {payments.map((payment) => (
        <tr key={payment.paymentId}>
          <td>{payment.paymentId}</td>
          <td>{payment.patientName}</td>
          <td>{payment.doctorName}</td>
          <td>₹{payment.amount}</td>
          <td>{payment.paymentStatus}</td>
          <td>
            {new Date(payment.paymentDate).toLocaleString()}
          </td>

          <td>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() =>
                window.open(
                  `https://hospital-management-system-y2sv.onrender.com/api/bills/${payment.billId}/invoice`,
                  "_blank"
                )
              }
            >
              Download Invoice
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                emailInvoice(payment.billId)
              }
            >
              Email Invoice
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

);
};

export default PaymentHistory;

