package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedDepartments();
        seedAdmin();
        seedDoctors();
        seedReceptionist();
        seedSamplePatient();
        seedMedicines();
    }

    private void seedDepartments() {
        List<String[]> depts = Arrays.asList(
                new String[]{"Cardiology", "Heart conditions, vascular diseases, and cardiac surgery."},
                new String[]{"Neurology", "Brain, spinal cord, and peripheral nervous system care."},
                new String[]{"Orthopedics", "Bone, joint, ligament, and musculoskeletal treatments."},
                new String[]{"Pediatrics", "Comprehensive medical care for infants, children, and adolescents."},
                new String[]{"General Medicine", "Primary healthcare, routine physical exams, and chronic diseases."},
                new String[]{"Dermatology", "Skin, hair, and nail diagnosis and specialized therapeutic care."}
        );

        for (String[] d : depts) {
            if (!departmentRepository.existsByName(d[0])) {
                departmentRepository.save(new Department(d[0], d[1]));
            }
        }
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@hospital.com")) {
            User admin = new User(
                    "admin@hospital.com",
                    passwordEncoder.encode("Admin@123"),
                    "Hospital Administrator",
                    "+91 9876543210",
                    "Administrative Wing, Level 3, Smart Hospital",
                    Role.ADMIN
            );
            userRepository.save(admin);
        }
    }

    private void seedDoctors() {
        Department cardio = departmentRepository.findByName("Cardiology").orElse(null);
        if (cardio != null && !userRepository.existsByEmail("doctor.sarah@hospital.com")) {
            User user1 = new User(
                    "doctor.sarah@hospital.com",
                    passwordEncoder.encode("Doctor@123"),
                    "Dr. Sarah Jenkins",
                    "+91 9876500001",
                    "Cabin 101, Cardiology Block",
                    Role.DOCTOR
            );
            User saved1 = userRepository.save(user1);

            Doctor doctor1 = new Doctor(
                    saved1,
                    cardio,
                    "Cardiologist",
                    "MBBS, MD (Cardiology)",
                    12,
                    new BigDecimal("500.00"),
                    "Room 101",
                    "Monday,Tuesday,Wednesday,Thursday,Friday",
                    LocalTime.of(9, 0),
                    LocalTime.of(17, 0)
            );
            doctorRepository.save(doctor1);
        }

        Department neuro = departmentRepository.findByName("Neurology").orElse(null);
        if (neuro != null && !userRepository.existsByEmail("doctor.james@hospital.com")) {
            User user2 = new User(
                    "doctor.james@hospital.com",
                    passwordEncoder.encode("Doctor@123"),
                    "Dr. James Wilson",
                    "+91 9876500002",
                    "Cabin 204, Neurology Block",
                    Role.DOCTOR
            );
            User saved2 = userRepository.save(user2);

            Doctor doctor2 = new Doctor(
                    saved2,
                    neuro,
                    "Neurologist",
                    "MBBS, DM (Neurology)",
                    9,
                    new BigDecimal("650.00"),
                    "Room 204",
                    "Monday,Wednesday,Friday",
                    LocalTime.of(10, 0),
                    LocalTime.of(16, 0)
            );
            doctorRepository.save(doctor2);
        }

        Department ortho = departmentRepository.findByName("Orthopedics").orElse(null);
        if (ortho != null && !userRepository.existsByEmail("doctor.emily@hospital.com")) {
            User user3 = new User(
                    "doctor.emily@hospital.com",
                    passwordEncoder.encode("Doctor@123"),
                    "Dr. Emily Davis",
                    "+91 9876500003",
                    "Cabin 305, Orthopedics Block",
                    Role.DOCTOR
            );
            User saved3 = userRepository.save(user3);

            Doctor doctor3 = new Doctor(
                    saved3,
                    ortho,
                    "Orthopedic Surgeon",
                    "MBBS, MS (Orthopedics)",
                    15,
                    new BigDecimal("600.00"),
                    "Room 305",
                    "Tuesday,Thursday,Saturday",
                    LocalTime.of(9, 30),
                    LocalTime.of(15, 30)
            );
            doctorRepository.save(doctor3);
        }
    }

    private void seedReceptionist() {
        if (!userRepository.existsByEmail("receptionist@hospital.com")) {
            User receptionist = new User(
                    "receptionist@hospital.com",
                    passwordEncoder.encode("Reception@123"),
                    "Mary Watson",
                    "+91 9876500010",
                    "Front Desk, OPD Counter 1",
                    Role.RECEPTIONIST
            );
            userRepository.save(receptionist);
        }
    }

    private void seedSamplePatient() {
        if (!userRepository.existsByEmail("patient.john@gmail.com")) {
            User patientUser = new User(
                    "patient.john@gmail.com",
                    passwordEncoder.encode("Patient@123"),
                    "Johnathan Doe",
                    "+91 9876500099",
                    "42 Elm Street, Hyderabad",
                    Role.PATIENT
            );
            User savedPatientUser = userRepository.save(patientUser);

            Patient patient = new Patient(
                    savedPatientUser,
                    LocalDate.of(1992, 5, 14),
                    "Male",
                    "O+",
                    "+91 9876500098 (Spouse)",
                    "No known drug allergies. Mild seasonal asthma."
            );
            patientRepository.save(patient);
        }
    }

    private void seedMedicines() {
        if (medicineRepository.count() == 0) {
            medicineRepository.save(new Medicine("Paracetamol 500mg", "Acetaminophen", "Analgesic", "Tablet", "500mg", new BigDecimal("5.00"), 500));
            medicineRepository.save(new Medicine("Amoxicillin 500mg", "Amoxicillin", "Antibiotic", "Capsule", "500mg", new BigDecimal("15.00"), 300));
            medicineRepository.save(new Medicine("Pantoprazole 40mg", "Pantoprazole", "Antacid", "Tablet", "40mg", new BigDecimal("12.00"), 400));
            medicineRepository.save(new Medicine("Cetirizine 10mg", "Cetirizine", "Antihistamine", "Tablet", "10mg", new BigDecimal("4.50"), 250));
            medicineRepository.save(new Medicine("Metformin 500mg", "Metformin HCl", "Antidiabetic", "Tablet", "500mg", new BigDecimal("8.00"), 350));
            medicineRepository.save(new Medicine("Atorvastatin 20mg", "Atorvastatin", "Cardiovascular", "Tablet", "20mg", new BigDecimal("18.00"), 200));
            medicineRepository.save(new Medicine("Azithromycin 500mg", "Azithromycin", "Antibiotic", "Tablet", "500mg", new BigDecimal("25.00"), 150));
            medicineRepository.save(new Medicine("Ibuprofen 400mg", "Ibuprofen", "NSAID", "Tablet", "400mg", new BigDecimal("7.50"), 300));
        }
    }
}
