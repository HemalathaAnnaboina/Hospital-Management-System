# Smart Hospital Management System 🏥

A full-stack, enterprise-grade healthcare management application designed to digitize and centralize operations including patient records, doctor scheduling, consultation workflows, medical diagnoses, digital prescriptions, and automated billing.

---

## 🌟 Key Highlights & Modules

### 1. Role-Based Access Control (RBAC) & JWT Security
- **Spring Security 6 + JJWT** stateless authentication.
- 4 Distinct Roles:
  - **`ADMIN`**: Hospital stats, doctor directory management, clinical departments, master appointment calendar.
  - **`DOCTOR`**: Daily consultation queue, patient medical history inspection, symptoms/diagnosis entry, multi-medicine digital prescribing, appointment status updates.
  - **`RECEPTIONIST`**: Walk-in patient registration, patient search & profile updates, slot scheduling, appointment rescheduling/cancellations, invoice generation, payment collection (Cash, Card, UPI).
  - **`PATIENT`**: Self-registration, specialized doctor discovery by department, real-time slot booking with double-booking prevention, medical record access, prescription downloads, and billing receipts.

### 2. Double-Booking Prevention Algorithm
- Slot uniqueness strictly enforced at the backend:
  $$\text{Slot} = (\text{doctor\_id}, \text{appointment\_date}, \text{appointment\_time})$$
- The backend verifies active appointments (`BOOKED` or `CONFIRMED`). Duplicate booking requests are rejected with **HTTP 409 Conflict**, preventing concurrent race conditions.

### 3. Server-Side Financial Billing Integrity
- The backend calculates and validates invoice totals:
  $$\text{Total Amount} = (\text{Consultation Fee} + \text{Test Charges} + \text{Medicine Charges} + \text{Other Charges}) - \text{Discount}$$
- No client-manipulated totals are trusted.

---

## 🛠 Technology Stack

### Backend
- **Java 21 / 23**
- **Spring Boot 3.3.5** (Spring Web, Spring Data JPA, Spring Security, Validation)
- **Hibernate ORM**
- **MySQL 8.0** (Relational normalized database: InnoDB)
- **JJWT 0.12.6** (HMAC-SHA512 token signing)
- **Apache Maven 3.9.9**

### Frontend
- **React.js 19**
- **Vite 8.3**
- **React Router DOM 7**
- **Axios** with request & response interceptors
- **Lucide Icons**
- **Vanilla CSS Design System** (Light healthcare clinical aesthetic, Slate & Teal color palette, responsive layout, accessible modals)

---

## 🚀 Default Credentials (Quick Demo Access)

The application auto-seeds initial demonstration accounts and departments on first startup:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `Admin@123` |
| **Doctor (Cardiology)** | `doctor.sarah@hospital.com` | `Doctor@123` |
| **Doctor (Neurology)** | `doctor.james@hospital.com` | `Doctor@123` |
| **Doctor (Orthopedics)** | `doctor.emily@hospital.com` | `Doctor@123` |
| **Receptionist** | `receptionist@hospital.com` | `Reception@123` |
| **Patient** | `patient.john@gmail.com` | `Patient@123` |

*(The login screen also features 1-click **Quick Demo Auto-Fill** buttons for instant testing).*

---

## ⚙️ Running Locally

### 1. Database Setup
Make sure MySQL 8.0 is running on `localhost:3306`:
```sql
CREATE DATABASE IF NOT EXISTS hospital_db;
```
Database credentials can be adjusted in [`backend/src/main/resources/application.properties`](file:///d:/AI_Agents/hosiptal_mangement/backend/src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Hemalatha@456
```

### 2. Run Backend (Spring Boot)
From the repository root:
```powershell
# Set JAVA_HOME and run Spring Boot
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
& ".\tools\apache-maven-3.9.9\bin\mvn.cmd" -f backend\pom.xml spring-boot:run
```
Backend will start on: **`http://localhost:8080`**

### 3. Run Frontend (React Vite)
From the `frontend` folder:
```powershell
cd frontend
npm run dev
```
Frontend will be accessible at: **`http://localhost:5173`**

---

## 🏛 Database Entities & Relationships
- `users`: ID, email, hashed password, full name, phone, address, role (`ADMIN`, `DOCTOR`, `RECEPTIONIST`, `PATIENT`).
- `departments`: ID, name, description, active status.
- `doctors`: ID, user_id (1-1), department_id (N-1), specialization, qualification, experience, fee, room, schedule.
- `patients`: ID, user_id (1-1), DOB, gender, blood group, emergency contact, medical alerts.
- `appointments`: ID, appointment_number, patient_id, doctor_id, department_id, date, time, status (`BOOKED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), reason.
- `medical_records`: ID, record_number, patient_id, doctor_id, appointment_id, symptoms, diagnosis, notes.
- `prescriptions`: ID, prescription_number, patient_id, doctor_id, appointment_id, notes.
- `prescription_medicines`: ID, prescription_id, medicine_id, medicine_name, dosage, frequency, duration, instructions.
- `medicines`: ID, name, generic_name, dosage_form, strength, unit_price, stock_quantity.
- `bills`: ID, bill_number, patient_id, appointment_id, consultation_fee, test_charges, medicine_charges, other_charges, discount, total_amount, payment_status (`PENDING`, `PAID`, `CANCELLED`), payment_method, paid_at.
- `bill_items`: ID, bill_id, item_name, item_type, quantity, unit_price, amount.
