# Hospital Pharmacy Management System (HPMS)

A full-stack web application designed to digitize and simplify hospital pharmacy operations, including medicine inventory management, prescription processing, billing, and reporting.

## Features

- **User Authentication:** Secure JWT-based authentication with role-based access control (Admin, Doctor, Pharmacist).
- **Medicine Management:** Add, update, search, and manage medicine details.
- **Inventory Management:** Track medicine batches, quantities, manufacturing dates, and expiry dates.
- **FEFO Inventory:** Automatically dispense medicines from batches with the earliest expiry dates (First Expiry, First Out).
- **Prescription Management:** Create, verify, dispense, and track patient prescriptions.
- **Billing System:** Generate invoices automatically with GST and discount calculations.
- **Patient Management:** Maintain patient profiles and medical information.
- **Supplier Management:** Manage supplier details and pharmaceutical license information.
- **Dashboard & Reports:** View sales, stock levels, low-stock alerts, and expiring medicines.
- **API Documentation:** Interactive API documentation using Swagger/OpenAPI.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT, BCrypt |
| Database | MySQL 8.0 |
| ORM | Spring Data JPA, Hibernate |
| API | REST APIs, Swagger/OpenAPI |
| Tools | Git, Maven, npm |

## System Architecture

The application follows a three-tier architecture:

1. **Frontend:** React-based user interface.
2. **Backend:** Spring Boot REST APIs handling business logic and authentication.
3. **Database:** MySQL for storing and managing application data.

## User Roles

- **Admin:** Manages users, medicines, suppliers, and overall pharmacy operations.
- **Doctor:** Manages patient records and creates prescriptions.
- **Pharmacist:** Manages inventory, verifies prescriptions, dispenses medicines, and handles billing.

## Installation & Setup

### Prerequisites

- Java JDK 21 or compatible project version
- Node.js and npm
- MySQL 8.0+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd Pharmacy-Management
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE pharmacy_db;
```

Update the database credentials in:

`backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pharmacy_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run the Backend

```bash
cd backend
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Backend URL: `http://localhost:8080`

Swagger API Documentation: `http://localhost:8080/swagger-ui.html`

### 4. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Core Workflow

1. Doctor creates a prescription for a patient.
2. Pharmacist reviews and verifies the prescription.
3. Pharmacist dispenses the prescribed medicines.
4. The system automatically deducts inventory using FEFO logic.
5. An invoice is generated with applicable taxes and discounts.
6. Payment status is updated after payment processing.

## Future Improvements

- Cloud deployment and hosting.
- Automated email and notification services.
- Advanced inventory analytics.
- Integration with external hospital systems.

## License

This project is developed for educational and academic purposes.
