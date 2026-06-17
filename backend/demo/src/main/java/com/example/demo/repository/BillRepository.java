package com.example.demo.repository;

import com.example.demo.entity.Bill;
import com.example.demo.entity.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillRepository
        extends JpaRepository<Bill, Long> {

    List<Bill>
    findByPatientPatientId(Long patientId);

    List<Bill>
    findByPaymentStatus(String paymentStatus);

    Optional<Bill>
    findByAppointment(
            Appointment appointment
    );
}