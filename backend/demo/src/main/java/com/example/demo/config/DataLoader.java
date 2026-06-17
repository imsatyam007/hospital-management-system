package com.example.demo.config;

import com.example.demo.entity.Doctor;
import com.example.demo.entity.Patient;
import com.example.demo.entity.User;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // ── Seed admin user ──────────────────────────────
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@HMS2025"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Admin user created");
        }

        // ── Seed doctors ─────────────────────────────────
        if (doctorRepository.count() == 0) {

            Doctor d1 = new Doctor();
            d1.setFullName("Dr. Arjun Sharma");
            d1.setSpecialization("Cardiology");
            d1.setPhone("9876543210");
            d1.setEmail("arjun@hms.com");
            d1.setExperience(10);
            doctorRepository.save(d1);

            Doctor d2 = new Doctor();
            d2.setFullName("Dr. Priya Patel");
            d2.setSpecialization("Neurology");
            d2.setPhone("9876543211");
            d2.setEmail("priya@hms.com");
            d2.setExperience(8);
            doctorRepository.save(d2);

            Doctor d3 = new Doctor();
            d3.setFullName("Dr. Rahul Verma");
            d3.setSpecialization("Orthopedics");
            d3.setPhone("9876543212");
            d3.setEmail("rahul@hms.com");
            d3.setExperience(12);
            doctorRepository.save(d3);

            Doctor d4 = new Doctor();
            d4.setFullName("Dr. Sneha Gupta");
            d4.setSpecialization("Pediatrics");
            d4.setPhone("9876543213");
            d4.setEmail("sneha@hms.com");
            d4.setExperience(6);
            doctorRepository.save(d4);

            System.out.println("✅ Sample doctors created");
        }

        // ── Seed patients ────────────────────────────────
        if (patientRepository.count() == 0) {

            Patient p1 = new Patient();
            p1.setFullName("Amit Kumar");
            p1.setPhone("9123456780");
            p1.setGender("Male");
            p1.setBloodGroup("A+");
            p1.setAddress("123 MG Road, Delhi");
            p1.setEmail("iamsatyamc+amit@gmail.com");   // ✅ added
            patientRepository.save(p1);

            Patient p2 = new Patient();
            p2.setFullName("Sunita Devi");
            p2.setPhone("9123456781");
            p2.setGender("Female");
            p2.setBloodGroup("B+");
            p2.setAddress("456 Park Street, Mumbai");
            p2.setEmail("iamsatyamc+sunita@gmail.com"); // ✅ added
            patientRepository.save(p2);

            Patient p3 = new Patient();
            p3.setFullName("Ravi Singh");
            p3.setPhone("9123456782");
            p3.setGender("Male");
            p3.setBloodGroup("O+");
            p3.setAddress("789 Lake View, Bangalore");
            p3.setEmail("iamsatyamc+ravi@gmail.com");   // ✅ added
            patientRepository.save(p3);

            Patient p4 = new Patient();
            p4.setFullName("Meera Joshi");
            p4.setPhone("9123456783");
            p4.setGender("Female");
            p4.setBloodGroup("AB+");
            p4.setAddress("321 Hill Road, Chennai");
            p4.setEmail("iamsatyamc+meera@gmail.com");  // ✅ added
            patientRepository.save(p4);

            System.out.println("✅ Sample patients created");
        }
    }
}