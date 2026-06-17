package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.entity.DoctorTimeSlot;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.DoctorTimeSlotRepository;
import com.example.demo.service.SlotGeneratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorTimeSlotController {

    @Autowired
    private DoctorTimeSlotRepository slotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
        private SlotGeneratorService slotGeneratorService;

    @PostMapping
    public DoctorTimeSlot createSlot(
            @RequestBody DoctorTimeSlot slot
    ) {

        Doctor doctor =
                doctorRepository
                        .findById(
                                slot.getDoctor()
                                        .getDoctorId()
                        )
                        .orElseThrow();

        slot.setDoctor(doctor);

        return slotRepository.save(slot);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorTimeSlot> getSlotsByDoctor(

            @PathVariable Long doctorId,

            @RequestParam String date

    ) {

        return slotRepository
                .findByDoctorDoctorIdAndSlotDate(

                        doctorId,

                        LocalDate.parse(date)
                );
    }

    @PutMapping("/book/{slotId}")
    public DoctorTimeSlot bookSlot(
            @PathVariable Long slotId
    ) {

        DoctorTimeSlot slot =
                slotRepository
                        .findById(slotId)
                        .orElseThrow();

        slot.setAvailable(false);

        return slotRepository.save(slot);
    }

    @PostMapping("/generate/{doctorId}")
        public String generateSlots(
                @PathVariable Long doctorId
        ) {

        slotGeneratorService
                .generateSlotsForDoctor(
                        doctorId
                );

        return "Slots Generated Successfully";
        }

        @PostMapping("/generate-all")
public String generateAllSlots() {

    try {

        System.out.println("GENERATE ALL CALLED");

        slotGeneratorService
                .generateSlotsForAllDoctors();

        return "Slots Generated For All Doctors";

    } catch (Exception e) {

        e.printStackTrace();

        return e.getMessage();
    }
}


}