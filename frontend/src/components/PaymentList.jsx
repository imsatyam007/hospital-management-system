import { resendInvoice } from "../services/paymentService";

function PaymentList({ payments }) {

  const handleResendInvoice = async (billId) => {
    try {
      await resendInvoice(billId);
      alert("Invoice emailed successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to send invoice");
    }
  };

  return (
    <table className="w-full table-fixed border-collapse border border-gray-600">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="w-16 p-3 text-left">ID</th>
          <th className="w-40 p-3 text-left">Patient</th>
          <th className="w-52 p-3 text-left">Doctor</th>
          <th className="w-28 p-3 text-left">Amount</th>
          <th className="w-28 p-3 text-left">Status</th>
          <th className="w-32 p-3 text-left">Date</th>
          <th className="w-48 p-3 text-center">Invoice</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr
            key={payment.paymentId}
            className="border-b border-gray-700 hover:bg-gray-800"
          >
            <td className="p-3">{payment.paymentId}</td>
            <td className="p-3">{payment.patientName}</td>
            <td className="p-3">{payment.doctorName}</td>
            <td className="p-3">₹{payment.amount}</td>
            <td className="p-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded">
                {payment.paymentStatus}
              </span>
            </td>
            <td className="p-3">
              {new Date(payment.paymentDate).toLocaleDateString()}
            </td>
            <td className="p-3 text-center">
                <div className="flex gap-2 justify-center">
    
                    <a
                        href={`http://localhost:8080/api/bills/${payment.billId}/invoice/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                        >
                        👁View
                    </a>

                    <a
                    href={`http://localhost:8080/api/bills/${payment.billId}/invoice`}
                    target="_blank"
                     rel="noreferrer"
                     className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                    ⬇ Download
                    </a>

                    <button
                    onClick={() => handleResendInvoice(payment.billId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                    📧 Email
                    </button>

                </div>
                </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PaymentList;