package com.example.demo.service;

import com.example.demo.entity.Bill;
import com.example.demo.entity.Payment;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class paymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    public Payment savePayment(
            String paymentId,
            String orderId,
            String signature,
            Double amount,
            Long billId
    ) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found"));

        Payment payment = new Payment();

        // Fix: use correct setter names matching Payment.java entity
        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpayOrderId(orderId);
        payment.setRazorpaySignature(signature);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus("SUCCESS"); // Fix: was setStatus
        payment.setBill(bill);

        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }
}