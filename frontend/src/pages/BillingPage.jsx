import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layouts/MainLayout";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { createOrder, verifyPayment } from "../services/paymentService";

function BillingPage() {
  const [bills, setBills] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axiosInstance.get("/api/bills");
        console.log( "BILLS RESPONSE:", response.data );
        setBills(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBills();
  }, []);

  const fetchPayment = async (billId) => {
    try {
      const response = await axiosInstance.get(`/api/payments/bill/${billId}`);
      setPaymentDetails((prev) => ({
        ...prev,
        [billId]: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {

  if (!Array.isArray(bills)) {
    console.log("Bills is not array:", bills);
    return;
  }

  bills.forEach((bill) => {

    if (bill.paymentStatus === "PAID") {

      fetchPayment(bill.billId);
     }

  });

}, [bills]);

  const refetchBills = async () => {
    try {
      const response = await axiosInstance.get("/api/bills");
      setBills(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayBill = async (billId) => {
    try {
      const orderResponse = await createOrder(billId);
      const order = orderResponse.data;

      const options = {
        key: "rzp_test_SwHbDd6HGT7QbE",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Hospital Management System",
        description: "Bill Payment",
        handler: async function (response) {
          try {
            await verifyPayment({
              billId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert("Payment Successful");
            refetchBills();
          } catch (error) {
            console.error(error);
            alert("Payment Verification Failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaFileInvoiceDollar className="text-green-500" />
        Billing & Invoices
      </h1>

      <h2 className="text-2xl font-bold mb-4">Billing History</h2>

      <div className="space-y-4">
        {Array.isArray(bills) && bills.map((bill) => (
          <div key={bill.billId} className="border p-4 rounded shadow">
            <p><strong>Bill ID:</strong> {bill.billId}</p>
            <p><strong>Patient:</strong> {bill.patient?.fullName}</p>
            <p><strong>Doctor:</strong> {bill.doctor?.fullName}</p>

                {bill.appointment && (
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  {bill.appointment.appointmentId}
                </p>
              )}

            <p><strong>Appointment Fee:</strong>₹{bill.appointmentFee}{""}✅ PAID</p>
            <p><strong>Consultation Fee:</strong> ₹{bill.consultationFee}</p>
            <p><strong>Test Fee:</strong> ₹{bill.testFee}</p>
            <p><strong>Medicine Fee:</strong> ₹{bill.medicineFee}</p>
            <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>

            {bill.paymentStatus === "PENDING_PAYMENT" && (
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Remaining Amount: ₹
                {(bill.medicineFee || 0) +
                  (bill.testFee || 0)}
              </p>
            )}


            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor:
                    bill.paymentStatus === "PAID" ? "#d1fae5" : "#fef3c7",
                  color:
                    bill.paymentStatus === "PAID" ? "#065f46" : "#92400e",
                }}
              >
                {bill.paymentStatus}
              </span>
            </p>
            <p><strong>Date:</strong> {bill.billDate}</p>

            {/* Payment Details — shown only for PAID bills */}
            {paymentDetails[bill.billId] && (
              <div className="mt-3 p-3 border rounded">
                <h5
                  className="flex items-center gap-2"
                  style={{ color: "#2563eb", fontWeight: "bold", fontSize: "18px",}}>
                  <FaCreditCard />
                  Payment Details
                </h5>
                <p>
                  <strong>Payment ID:</strong>{" "}
                  {paymentDetails[bill.billId].razorpayPaymentId}
                </p>
                <p>
                  <strong>Order ID:</strong>{" "}
                  {paymentDetails[bill.billId].razorpayOrderId}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {paymentDetails[bill.billId].paymentStatus}
                </p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {new Date(
                    paymentDetails[bill.billId].paymentDate
                  ).toLocaleString()}
                </p>
              </div>
            )}

            <div className="mt-3 flex gap-3">
              <a
                href={`http://localhost:8080/api/bills/${bill.billId}/invoice`}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                🧾 Download Invoice
              </a>

              <button
                onClick={async () => {
                  try {
                    await axiosInstance.post(`/api/bills/${bill.billId}/email`);
                    alert("Invoice emailed successfully");
                  } catch (error) {
                    console.error(error);
                    alert("Failed to email invoice");
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                📧 Email Invoice
              </button>

              {(
                bill.paymentStatus === "PENDING" ||
                bill.paymentStatus === "PENDING_PAYMENT")&& (
                <button
                  onClick={() => handlePayBill(bill.billId)}
                  className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <MdPayment /> Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default BillingPage;