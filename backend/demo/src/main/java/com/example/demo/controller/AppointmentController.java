package com.example.demo.controller;

import com.example.demo.entity.Appointment;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.DoctorTimeSlot;
import com.example.demo.entity.Patient;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.DoctorTimeSlotRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.AppointmentService;
import com.example.demo.service.EmailService;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorTimeSlotRepository slotRepository;

    @Autowired
    private RazorpayClient razorpayClient;

    @Value("${spring.mail.username}")
    private String adminEmail;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
        public Appointment getAppointmentById(
                @PathVariable Long id
        ) {
            return appointmentRepository
                 .findById(id)
                 .orElseThrow(() ->
                            new RuntimeException(
                                 "Appointment not found"
                            ));
        }

        @PostMapping("/appointment-order")
        public String createAppointmentOrder() throws Exception {

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", 200 * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "appointment_fee");

            return razorpayClient
                    .orders
                    .create(orderRequest)
                    .toString();
        }

    @PostMapping
    public Appointment addAppointment(
            @RequestBody Appointment appointment) {

        // Step 1 — fetch full Patient from DB
        Patient patient = patientRepository
                .findById(appointment.getPatient().getPatientId())
                .orElseThrow(() ->
                    new RuntimeException("Patient not found"));

        // Step 2 — fetch full Doctor from DB
        Doctor doctor = doctorRepository
                .findById(appointment.getDoctor().getDoctorId())
                .orElseThrow(() ->
                    new RuntimeException("Doctor not found"));

        // Step 3 — handle slot booking if slot is provided
        if (appointment.getSlot() != null
                && appointment.getSlot().getSlotId() != null) {

            Long slotId = appointment.getSlot().getSlotId();

            DoctorTimeSlot slot = slotRepository
                    .findById(slotId)
                    .orElseThrow(() ->
                        new RuntimeException("Slot not found"));

            if (!slot.isAvailable()) {
                throw new RuntimeException("Slot already booked");
            }

            slot.setAvailable(false);
            slotRepository.save(slot);
            appointment.setSlot(slot);
        }

        // Step 4 — set full objects on appointment
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        // Step 5 — save to DB
        Appointment saved = appointmentService.addAppointment(appointment);

        // Step 6 — send confirmation email
        try {
            String patientEmail = patient.getEmail();

            if (patientEmail != null && !patientEmail.isBlank()) {

                System.out.println("PATIENT EMAIL: " + patientEmail);
                System.out.println("ADMIN EMAIL: " + adminEmail);
                System.out.println("EMAIL METHOD STARTING");

                emailService.sendAppointmentEmail(
                        adminEmail,
                        patientEmail,
                        patient.getFullName(),
                        doctor.getFullName(),
                        saved.getAppointmentDate()
                );

                System.out.println("✅ EMAIL METHOD COMPLETED");

            } else {
                System.out.println("⚠️ No email for patient: " + patient.getFullName());
            }

        } catch (Exception e) {
            System.err.println("❌ Email failed: " + e.getMessage());
            e.printStackTrace();
        }

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }
}