package com.example.demo.repository;

import com.example.demo.entity.DoctorTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorTimeSlotRepository
        extends JpaRepository<DoctorTimeSlot, Long> {

    List<DoctorTimeSlot>
    findByDoctorDoctorIdAndSlotDate(
            Long doctorId,
            LocalDate slotDate
    );

    boolean existsByDoctorDoctorIdAndSlotDateAndSlotTime(
                Long doctorId,
                LocalDate slotDate,
                LocalTime slotTime
        );


}