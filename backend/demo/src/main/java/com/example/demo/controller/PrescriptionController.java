package com.example.demo.controller;

import com.example.demo.entity.Prescription;
import com.example.demo.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.PrescriptionService;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    @Autowired
        private PrescriptionService prescriptionService;

    @Autowired
        private PrescriptionRepository prescriptionRepository;

    // Create Prescription
    @PostMapping
        public Prescription addPrescription(
        @RequestBody Prescription prescription
        ) {
        return prescriptionService.addPrescription(
            prescription
        );
        }

    // Get All Prescriptions
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // Get Prescription By ID
    @GetMapping("/{id}")
    public Prescription getPrescriptionById(
            @PathVariable Long id
    ) {
        return prescriptionRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Prescription not found"
                        )
                );
    }

    // Get Prescriptions By Patient
    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPatientPrescriptions(
            @PathVariable Long patientId
    ) {
        return prescriptionRepository
                .findByPatientPatientId(patientId);
    }

    // Delete Prescription
    @DeleteMapping("/{id}")
    public String deletePrescription(
            @PathVariable Long id
    ) {
        prescriptionRepository.deleteById(id);

        return "Prescription deleted successfully";
    }
}