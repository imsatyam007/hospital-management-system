package com.example.demo.controller;

import com.example.demo.dto.PaymentHistoryDTO;
import com.example.demo.dto.PaymentVerificationRequest;
import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import java.time.LocalDateTime;
import java.util.List;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Payment;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.service.InvoiceEmailService;
import com.example.demo.service.PdfInvoiceService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

        @Autowired
        private InvoiceEmailService invoiceEmailService;

        @Autowired
        private PdfInvoiceService pdfInvoiceService;

    @PostMapping("/create-order/{billId}")
    public String createOrder(
            @PathVariable Long billId
    ) throws Exception {

        Bill bill =
                billRepository
                        .findById(billId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Bill not found"
                                        )
                        );

        JSONObject orderRequest =
                new JSONObject();

                Double amountToPay =
                "PENDING_PAYMENT".equals(
                        bill.getPaymentStatus()
                )
                ? (bill.getMedicineFee() == null ? 0.0 : bill.getMedicineFee())
                + (bill.getTestFee() == null ? 0.0 : bill.getTestFee())
        : bill.getTotalAmount();

        orderRequest.put(
                "amount",
                amountToPay * 100
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "bill_" + billId
        );

        Order order =
                razorpayClient
                        .orders
                        .create(orderRequest);

        return order.toString();
    }

        @PostMapping("/appointment-order")
         public String createAppointmentOrder() throws Exception {
        return razorpayClient.orders.create(
                new JSONObject()
                .put("amount", 200 * 100)
                .put("currency", "INR")
                .put("receipt", "appointment_fee")
                ).toString();
        }

    @PostMapping("/verify")
    public String verifyPayment(
            @RequestBody
            PaymentVerificationRequest request
    ) {

        Bill bill =
                billRepository
                        .findById(
                                request.getBillId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Bill not found"
                                        )
                        );

        Payment payment = new Payment();

        payment.setBill(bill);
        payment.setAmount(bill.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());

        payment.setPaymentStatus(
        "SUCCESS");

        payment.setRazorpayOrderId(
                request.getRazorpayOrderId()
        );

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );

        paymentRepository.save(payment);

        bill.setPaymentStatus(
                "PAID"
        );

        billRepository.save(
                bill
        );

        byte[] pdf =
                pdfInvoiceService.generateInvoice(
                        bill
                );

        invoiceEmailService.sendInvoice(

                bill.getPatient()
                .getEmail(),

                bill.getPatient()
                .getFullName(),

                pdf
        );

        return "Payment Verified Successfully";
    }

    @GetMapping
        public List<PaymentHistoryDTO> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(payment -> new PaymentHistoryDTO(
                        payment.getPaymentId(),
                        payment.getRazorpayPaymentId(),
                        payment.getRazorpayOrderId(),
                        payment.getAmount(),
                        payment.getPaymentStatus(),
                        payment.getPaymentDate(),
                        payment.getBill().getBillId(),
                        payment.getBill().getPatient().getFullName(),
                        payment.getBill().getDoctor().getFullName()
                ))
                .toList();
        }

        @GetMapping("/bill/{billId}")
public ResponseEntity<PaymentHistoryDTO> getPaymentByBill(
        @PathVariable Long billId
) {

    Payment payment = paymentRepository
            .findByBillBillId(billId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Payment not found"));

    PaymentHistoryDTO dto =
            new PaymentHistoryDTO(
                    payment.getPaymentId(),
                    payment.getRazorpayPaymentId(),
                    payment.getRazorpayOrderId(),
                    payment.getAmount(),
                    payment.getPaymentStatus(),
                    payment.getPaymentDate(),
                    payment.getBill().getBillId(),
                    payment.getBill()
                            .getPatient()
                            .getFullName(),
                    payment.getBill()
                            .getDoctor()
                            .getFullName()
            );

    return ResponseEntity.ok(dto);
}

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }
}