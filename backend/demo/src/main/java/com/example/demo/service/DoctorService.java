package com.example.demo.service;

import com.example.demo.entity.Doctor;
import com.example.demo.repository
        .DoctorRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository
            doctorRepository;

    public DoctorService(
            DoctorRepository doctorRepository
    ) {

        this.doctorRepository =
                doctorRepository;
    }

    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }

    public Doctor addDoctor(
            Doctor doctor
    ) {

        return doctorRepository.save(
                doctor);
    }

    public void deleteDoctor(Long id) {

        doctorRepository.deleteById(id);
    }

    public Doctor updateDoctor(
            Long id,
            Doctor updatedDoctor
    ) {

        Doctor doctor =
                doctorRepository.findById(id)
                        .orElseThrow();

        doctor.setFullName(
                updatedDoctor.getFullName());

        doctor.setSpecialization(
                updatedDoctor
                        .getSpecialization());

        doctor.setPhone(
                updatedDoctor.getPhone());

        doctor.setEmail(
                updatedDoctor.getEmail());

        doctor.setExperience(
                updatedDoctor
                        .getExperience());

        return doctorRepository.save(
                doctor);
    }
}