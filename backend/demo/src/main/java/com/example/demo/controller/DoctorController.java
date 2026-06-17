package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.service
        .DoctorService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")

public class DoctorController {

    private final DoctorService
            doctorService;

    public DoctorController(
            DoctorService doctorService
    ) {

        this.doctorService =
                doctorService;
    }

    @GetMapping
    public List<Doctor> getDoctors() {

        return doctorService
                .getAllDoctors();
    }

    @PostMapping
    public Doctor addDoctor(
            @RequestBody Doctor doctor
    ) {

        return doctorService
                .addDoctor(doctor);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(
            @PathVariable Long id
    ) {

        doctorService.deleteDoctor(id);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor
    ) {

        return doctorService
                .updateDoctor(id, doctor);
    }
}