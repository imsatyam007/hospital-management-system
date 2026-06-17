package com.example.demo.service;

import com.example.demo.entity.Doctor;
import com.example.demo.entity.DoctorTimeSlot;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.DoctorTimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotGeneratorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorTimeSlotRepository slotRepository;

    @Transactional
    public void generateSlotsForDoctor(Long doctorId) {
        Doctor doctor = doctorRepository
                .findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalDate today = LocalDate.now();

        for (int day = 0; day < 7; day++) {
            LocalDate date = today.plusDays(day);
            String shift = doctor.getShift();

            if ("MORNING".equals(shift)) {
                generateShift(doctor, date, LocalTime.of(9, 0), LocalTime.of(13, 0));
            } else if ("AFTERNOON".equals(shift)) {
                generateShift(doctor, date, LocalTime.of(13, 0), LocalTime.of(17, 0));
            } else if ("EVENING".equals(shift)) {
                generateShift(doctor, date, LocalTime.of(17, 0), LocalTime.of(21, 0));
            } else if ("NIGHT".equals(shift)) {
                generateShift(doctor, date, LocalTime.of(21, 0), LocalTime.of(23, 59));
            }
        }
    }

    @Transactional
    public void generateSlotsForAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        System.out.println("Generating slots for " + doctors.size() + " doctors...");
        for (Doctor doctor : doctors) {
            System.out.println("Generating for doctor: " + doctor.getFullName());
            generateSlotsForDoctor(doctor.getDoctorId());
        }
        System.out.println("Done generating all slots.");
    }

    @Transactional
    private void generateShift(
            Doctor doctor,
            LocalDate date,
            LocalTime start,
            LocalTime end
    ) {
        System.out.println(
                "Doctor: " + doctor.getFullName()
                + " | Date: " + date
                + " | Start: " + start
                + " | End: " + end
        );
        List<LocalTime> existingTimes = slotRepository
                .findByDoctorDoctorIdAndSlotDate(
                        doctor.getDoctorId(),
                        date
                )
                .stream()
                .map(DoctorTimeSlot::getSlotTime)
                .toList();
        System.out.println(
                "Existing Slots Found: "
                + existingTimes.size()
        );
        LocalTime current = start;
        List<DoctorTimeSlot> slotsToSave =
                new ArrayList<>();
        int count = 0;
        
        while (current.isBefore(end)&&
        !current.equals(LocalTime.MIDNIGHT)) {
            count++;
            if (count > 100) {
                System.out.println(
                        "INFINITE LOOP DETECTED!"
                );
                break;
            }
            System.out.println(
                    "Current Time = "
                    + current
            );
            if (!existingTimes.contains(current)) {
                DoctorTimeSlot slot =
                        new DoctorTimeSlot();
                slot.setDoctor(doctor);
                slot.setSlotDate(date);
                slot.setSlotTime(current);
                slot.setAvailable(true);
                slotsToSave.add(slot);
                System.out.println(
                        "Added Slot: "
                        + current
                );
            }
            current =
                    current.plusMinutes(30);
        }
        System.out.println(
                "Slots To Save = "
                + slotsToSave.size()
        );
        if (!slotsToSave.isEmpty()) {
            slotRepository.saveAll(
                    slotsToSave
            );
            System.out.println(
                    "Saved Successfully"
            );
        }
    }
}