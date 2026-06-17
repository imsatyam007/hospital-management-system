package com.example.demo.service;

import com.example.demo.entity.Patient;
import com.example.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(
            PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
        }

        public Patient getPatientById(Long id) {
                return patientRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        }

public Patient updatePatient(
        Long id,
        Patient updatedPatient
) {

    Patient patient =
            patientRepository.findById(id)
            .orElseThrow();

    patient.setFullName(
            updatedPatient.getFullName());

    patient.setGender(
            updatedPatient.getGender());

    patient.setPhone(
            updatedPatient.getPhone());

    patient.setAddress(
            updatedPatient.getAddress());

    patient.setBloodGroup(
            updatedPatient.getBloodGroup());

    return patientRepository.save(patient);
}
}