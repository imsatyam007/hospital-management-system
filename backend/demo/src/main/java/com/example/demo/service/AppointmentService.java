package com.example.demo.service;

import com.example.demo.entity.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;

import java.util.List;

// ✅ Removed unused EmailService import — email is sent in Controller

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            BillRepository billRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment addAppointment(Appointment appointment) {

    System.out.println("SERVICE METHOD CALLED");

    appointment.setAppointmentFee(200.0);

    appointment.setPaymentStatus("PAID");

    appointment.setAppointmentStatus("CONFIRMED");

    Appointment savedAppointment =
            appointmentRepository.save(appointment);

    System.out.println("APPOINTMENT SAVED");

    Bill bill = new Bill();

    bill.setAppointment(savedAppointment);
    bill.setPatient(savedAppointment.getPatient());
    bill.setDoctor(savedAppointment.getDoctor());
    bill.setPaymentStatus("PENDING");

bill.setAppointmentFee(
        savedAppointment.getAppointmentFee()
);

bill.setConsultationFee(1000.0);

bill.setTestFee(0.0);

bill.setMedicineFee(0.0);

bill.setTotalAmount(
        bill.getAppointmentFee()
        +
        bill.getConsultationFee()
        +
        bill.getTestFee()
        +
        bill.getMedicineFee()
);
    bill.setBillDate(savedAppointment.getAppointmentDate());

    System.out.println("CREATING BILL");

    billRepository.save(bill);

    System.out.println("BILL SAVED");

    return savedAppointment;
}

public void deleteAppointment(Long id) {
    System.out.println("DELETING APPOINTMENT: " + id);

    appointmentRepository.deleteById(id);

    System.out.println("APPOINTMENT DELETED");
}
}