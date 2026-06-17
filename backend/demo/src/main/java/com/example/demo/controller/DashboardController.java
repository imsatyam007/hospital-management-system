package com.example.demo.controller;

import com.example.demo.repository.DoctorRepository;

import com.example.demo.entity.Patient;

import com.example.demo.entity.Appointment;

import com.example.demo.repository.PatientRepository;

import com.example.demo.repository.AppointmentRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.time.Month;

import java.util.*;

@RestController

@RequestMapping("/api/dashboard")

@CrossOrigin(origins = "http://localhost:5173")

public class DashboardController {

    @Autowired
    private PatientRepository
            patientRepository;

            @Autowired
private DoctorRepository
        doctorRepository;

    @Autowired
    private AppointmentRepository
            appointmentRepository;

            @GetMapping("/stats")
public Map<String, Long>
getDashboardStats() {

    Map<String, Long>
            stats =

            new HashMap<>();

    stats.put(

            "patients",

            patientRepository.count()
    );

    stats.put(

            "doctors",

            doctorRepository.count()
    );

    stats.put(

            "appointments",

            appointmentRepository.count()
    );

    return stats;
}

    @GetMapping(
            "/monthly-patients"
    )
    public List<Map<String, Object>>
    getMonthlyPatients() {

        List<Patient>
                patients =

                patientRepository.findAll();

        Map<String, Integer>
                monthlyData =

                new LinkedHashMap<>();

        for (
                Month month :
                Month.values()
        ) {

            monthlyData.put(

                    month.name()
                            .substring(0, 3),

                    0
            );
        }

        for (
                Patient patient :
                patients
        ) {

            if (
                    patient.getCreatedAt()
                            != null
            ) {

                String month =

                        patient

                                .getCreatedAt()

                                .getMonth()

                                .name()

                                .substring(0, 3);

                monthlyData.put(

                        month,

                        monthlyData.get(
                                month
                        ) + 1
                );
            }
        }

        List<Map<String, Object>>
                result =

                new ArrayList<>();

        monthlyData.forEach(

                (month, count) -> {

                    Map<String, Object>
                            data =

                            new HashMap<>();

                    data.put(
                            "month",
                            month
                    );

                    data.put(
                            "patients",
                            count
                    );

                    result.add(data);
                }
        );

        return result;
    }

    @GetMapping(
            "/monthly-appointments"
    )
    public List<Map<String, Object>>
    getMonthlyAppointments() {

        List<Appointment>
                appointments =

                appointmentRepository.findAll();

        Map<String, Integer>
                monthlyData =

                new LinkedHashMap<>();

        for (
                Month month :
                Month.values()
        ) {

            monthlyData.put(

                    month.name()
                            .substring(0, 3),

                    0
            );
        }

        for (
                Appointment appointment :
                appointments
        ) {

            if (
                    appointment.getCreatedAt()
                            != null
            ) {

                String month =

                        appointment

                                .getCreatedAt()

                                .getMonth()

                                .name()

                                .substring(0, 3);

                monthlyData.put(

                        month,

                        monthlyData.get(
                                month
                        ) + 1
                );
            }
        }

        List<Map<String, Object>>
                result =

                new ArrayList<>();

        monthlyData.forEach(

                (month, count) -> {

                    Map<String, Object>
                            data =

                            new HashMap<>();

                    data.put(
                            "month",
                            month
                    );

                    data.put(
                            "appointments",
                            count
                    );

                    result.add(data);
                }
        );

        return result;
    }
}