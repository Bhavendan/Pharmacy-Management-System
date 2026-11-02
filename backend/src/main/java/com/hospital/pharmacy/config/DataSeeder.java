package com.hospital.pharmacy.config;

import com.hospital.pharmacy.dto.PaymentUpdateRequest;
import com.hospital.pharmacy.dto.PrescriptionItemRequest;
import com.hospital.pharmacy.dto.PrescriptionRequest;
import com.hospital.pharmacy.dto.PrescriptionResponse;
import com.hospital.pharmacy.entity.*;
import com.hospital.pharmacy.enums.*;
import com.hospital.pharmacy.repository.*;
import com.hospital.pharmacy.service.BillService;
import com.hospital.pharmacy.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final SupplierRepository supplierRepository;
    private final DrugRepository drugRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final PrescriptionRepository prescriptionRepository;

    private final PasswordEncoder passwordEncoder;
    private final PrescriptionService prescriptionService;
    private final BillService billService;

    public void seedAllData() {
        log.info("Starting Pharmacy DataSeeder execution...");

        List<User> seededUsers = seedUsers();
        List<Patient> seededPatients = seedPatients();
        List<Supplier> seededSuppliers = seedSuppliers();
        List<Drug> seededDrugs = seedDrugs();

        seedInventoryBatches(seededDrugs);
        seedPrescriptionsAndBills(seededUsers, seededPatients, seededDrugs);

        log.info("DataSeeder successfully completed seeding full demo dataset!");
    }

    @Transactional
    public List<User> seedUsers() {
        log.info("Seeding users...");
        List<User> usersToSave = new ArrayList<>();

        if (!userRepository.existsByEmail("admin@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("System Admin")
                    .email("admin@pharmacy.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("9876543201")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build());
        }

        if (!userRepository.existsByEmail("doctor1@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("Dr. Sarah Jenkins")
                    .email("doctor1@pharmacy.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("9876543202")
                    .role(Role.DOCTOR)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("doctor2@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("Dr. Marcus Vance")
                    .email("doctor2@pharmacy.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("9876543203")
                    .role(Role.DOCTOR)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("doctor3@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("Dr. Elena Rostova")
                    .email("doctor3@pharmacy.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("9876543204")
                    .role(Role.DOCTOR)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("doctor@hospital.com")) {
            usersToSave.add(User.builder()
                    .name("Dr. Alexander Fleming")
                    .email("doctor@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("9876543205")
                    .role(Role.DOCTOR)
                    .enabled(true)
                    .build());
        }

        if (!userRepository.existsByEmail("pharmacist1@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("James Wilson")
                    .email("pharmacist1@pharmacy.com")
                    .password(passwordEncoder.encode("Pharmacist@123"))
                    .phone("9876543206")
                    .role(Role.PHARMACIST)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("pharmacist2@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("Anita Roy")
                    .email("pharmacist2@pharmacy.com")
                    .password(passwordEncoder.encode("Pharmacist@123"))
                    .phone("9876543207")
                    .role(Role.PHARMACIST)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("pharmacist3@pharmacy.com")) {
            usersToSave.add(User.builder()
                    .name("David Patel")
                    .email("pharmacist3@pharmacy.com")
                    .password(passwordEncoder.encode("Pharmacist@123"))
                    .phone("9876543208")
                    .role(Role.PHARMACIST)
                    .enabled(true)
                    .build());
        }
        if (!userRepository.existsByEmail("pharmacist@hospital.com")) {
            usersToSave.add(User.builder()
                    .name("Chief Pharmacist Robert")
                    .email("pharmacist@hospital.com")
                    .password(passwordEncoder.encode("Pharmacist@123"))
                    .phone("9876543209")
                    .role(Role.PHARMACIST)
                    .enabled(true)
                    .build());
        }

        if (!usersToSave.isEmpty()) {
            userRepository.saveAll(usersToSave);
        }
        return userRepository.findAll();
    }

    @Transactional
    public List<Patient> seedPatients() {
        log.info("Seeding patients...");
        if (patientRepository.count() >= 20) {
            return patientRepository.findAll();
        }

        List<Patient> patients = Arrays.asList(
                Patient.builder().patientCode("PAT-1001").name("John Doe").dateOfBirth(LocalDate.of(1985, 4, 12)).gender("Male").phone("9876543210").address("123 Maple St, NY").bloodGroup("A+").allergies("Penicillin").build(),
                Patient.builder().patientCode("PAT-1002").name("Jane Smith").dateOfBirth(LocalDate.of(1990, 8, 25)).gender("Female").phone("9876543211").address("456 Oak Ave, CA").bloodGroup("O+").allergies("None").build(),
                Patient.builder().patientCode("PAT-1003").name("Robert Johnson").dateOfBirth(LocalDate.of(1972, 11, 3)).gender("Male").phone("9876543212").address("789 Pine Rd, TX").bloodGroup("B+").allergies("Sulfa drugs").build(),
                Patient.builder().patientCode("PAT-1004").name("Maria Garcia").dateOfBirth(LocalDate.of(1988, 2, 19)).gender("Female").phone("9876543213").address("101 Cedar Ln, FL").bloodGroup("AB+").allergies("Aspirin").build(),
                Patient.builder().patientCode("PAT-1005").name("Michael Brown").dateOfBirth(LocalDate.of(1965, 6, 30)).gender("Male").phone("9876543214").address("202 Elm St, IL").bloodGroup("O-").allergies("None").build(),
                Patient.builder().patientCode("PAT-1006").name("Linda Davis").dateOfBirth(LocalDate.of(1995, 12, 15)).gender("Female").phone("9876543215").address("303 Birch Dr, WA").bloodGroup("A-").allergies("Ibuprofen").build(),
                Patient.builder().patientCode("PAT-1007").name("William Miller").dateOfBirth(LocalDate.of(1980, 9, 8)).gender("Male").phone("9876543216").address("404 Walnut St, OH").bloodGroup("B-").allergies("Pollen, Dust").build(),
                Patient.builder().patientCode("PAT-1008").name("Elizabeth Taylor").dateOfBirth(LocalDate.of(1958, 3, 22)).gender("Female").phone("9876543217").address("505 Chestnut Ave, PA").bloodGroup("AB-").allergies("None").build(),
                Patient.builder().patientCode("PAT-1009").name("David Anderson").dateOfBirth(LocalDate.of(1992, 7, 14)).gender("Male").phone("9876543218").address("606 Spruce Rd, GA").bloodGroup("O+").allergies("Codeine").build(),
                Patient.builder().patientCode("PAT-1010").name("Barbara Thomas").dateOfBirth(LocalDate.of(1978, 5, 1)).gender("Female").phone("9876543219").address("707 Ash St, NC").bloodGroup("A+").allergies("None").build(),
                Patient.builder().patientCode("PAT-1011").name("James Jackson").dateOfBirth(LocalDate.of(1983, 10, 27)).gender("Male").phone("9876543220").address("808 Beech Ln, VA").bloodGroup("B+").allergies("Latex").build(),
                Patient.builder().patientCode("PAT-1012").name("Jennifer White").dateOfBirth(LocalDate.of(2001, 1, 11)).gender("Female").phone("9876543221").address("909 Cypress Ave, MI").bloodGroup("O+").allergies("Peanuts").build(),
                Patient.builder().patientCode("PAT-1013").name("Charles Harris").dateOfBirth(LocalDate.of(1969, 12, 5)).gender("Male").phone("9876543222").address("111 Magnolia St, TN").bloodGroup("A+").allergies("Amoxicillin").build(),
                Patient.builder().patientCode("PAT-1014").name("Patricia Martin").dateOfBirth(LocalDate.of(1987, 4, 18)).gender("Female").phone("9876543223").address("222 Poplar Rd, MO").bloodGroup("AB+").allergies("None").build(),
                Patient.builder().patientCode("PAT-1015").name("Christopher Thompson").dateOfBirth(LocalDate.of(1998, 8, 9)).gender("Male").phone("9876543224").address("333 Redwood Dr, CO").bloodGroup("O-").allergies("None").build(),
                Patient.builder().patientCode("PAT-1016").name("Susan Martinez").dateOfBirth(LocalDate.of(1974, 6, 17)).gender("Female").phone("9876543225").address("444 Sycamore St, AZ").bloodGroup("B+").allergies("Morphine").build(),
                Patient.builder().patientCode("PAT-1017").name("Daniel Robinson").dateOfBirth(LocalDate.of(1991, 3, 31)).gender("Male").phone("9876543226").address("555 Alder Ave, MA").bloodGroup("A-").allergies("None").build(),
                Patient.builder().patientCode("PAT-1018").name("Jessica Clark").dateOfBirth(LocalDate.of(1982, 11, 23)).gender("Female").phone("9876543227").address("666 Willow Rd, WI").bloodGroup("O+").allergies("Ciprofloxacin").build(),
                Patient.builder().patientCode("PAT-1019").name("Matthew Rodriguez").dateOfBirth(LocalDate.of(2005, 5, 14)).gender("Male").phone("9876543228").address("777 Hickory St, MN").bloodGroup("AB-").allergies("None").build(),
                Patient.builder().patientCode("PAT-1020").name("Sarah Lewis").dateOfBirth(LocalDate.of(1963, 9, 2)).gender("Female").phone("9876543229").address("888 Juniper Dr, OR").bloodGroup("B-").allergies("Dust Mites").build(),
                Patient.builder().patientCode("PAT-1021").name("Anthony Lee").dateOfBirth(LocalDate.of(1977, 1, 20)).gender("Male").phone("9876543230").address("999 Larch Rd, SC").bloodGroup("A+").allergies("None").build(),
                Patient.builder().patientCode("PAT-1022").name("Karen Walker").dateOfBirth(LocalDate.of(1989, 7, 7)).gender("Female").phone("9876543231").address("124 Maple St, NY").bloodGroup("O+").allergies("Shellfish").build(),
                Patient.builder().patientCode("PAT-1023").name("Mark Hall").dateOfBirth(LocalDate.of(1994, 10, 12)).gender("Male").phone("9876543232").address("457 Oak Ave, CA").bloodGroup("B+").allergies("None").build(),
                Patient.builder().patientCode("PAT-1024").name("Nancy Allen").dateOfBirth(LocalDate.of(1952, 8, 28)).gender("Female").phone("9876543233").address("790 Pine Rd, TX").bloodGroup("AB+").allergies("Erythromycin").build(),
                Patient.builder().patientCode("PAT-1025").name("Steven Young").dateOfBirth(LocalDate.of(1986, 2, 4)).gender("Male").phone("9876543234").address("102 Cedar Ln, FL").bloodGroup("O-").allergies("None").build()
        );

        List<Patient> toSave = new ArrayList<>();
        for (Patient p : patients) {
            if (!patientRepository.existsByPatientCode(p.getPatientCode())) {
                toSave.add(p);
            }
        }
        if (!toSave.isEmpty()) {
            patientRepository.saveAll(toSave);
        }
        return patientRepository.findAll();
    }

    @Transactional
    public List<Supplier> seedSuppliers() {
        log.info("Seeding suppliers...");
        if (supplierRepository.count() >= 8) {
            return supplierRepository.findAll();
        }

        List<Supplier> suppliers = Arrays.asList(
                Supplier.builder().name("Sun Pharmaceutical Industries").contactPerson("Rajesh Sharma").phone("9811122233").email("contact@sunpharma.com").address("Mumbai, MH").licenseNumber("LIC-SP-8821").active(true).build(),
                Supplier.builder().name("Cipla Healthcare Ltd").contactPerson("Vikram Mehta").phone("9822233344").email("sales@cipla.com").address("Bengaluru, KA").licenseNumber("LIC-CP-9932").active(true).build(),
                Supplier.builder().name("Lupin Laboratories").contactPerson("Sunita Rao").phone("9833344455").email("info@lupin.com").address("Pune, MH").licenseNumber("LIC-LP-7743").active(true).build(),
                Supplier.builder().name("Dr. Reddy's Laboratories").contactPerson("Amit Patel").phone("9844455566").email("supply@drreddys.com").address("Hyderabad, TS").licenseNumber("LIC-DR-6654").active(true).build(),
                Supplier.builder().name("Apollo Pharmacy Wholesalers").contactPerson("Ritu Verma").phone("9855566677").email("orders@apollowholesale.com").address("Chennai, TN").licenseNumber("LIC-AP-5565").active(true).build(),
                Supplier.builder().name("Zydus Lifesciences Ltd").contactPerson("Sanjay Gupta").phone("9866677788").email("zydus@zyduslife.com").address("Ahmedabad, GJ").licenseNumber("LIC-ZY-4476").active(true).build(),
                Supplier.builder().name("Torrent Pharmaceuticals").contactPerson("Alok Joshi").phone("9877788899").email("sales@torrentpharma.com").address("Vadodara, GJ").licenseNumber("LIC-TP-3387").active(true).build(),
                Supplier.builder().name("Mankind Pharma").contactPerson("Vikas Singh").phone("9888899900").email("info@mankindpharma.com").address("New Delhi, DL").licenseNumber("LIC-MP-2298").active(true).build()
        );

        supplierRepository.saveAll(suppliers);
        return supplierRepository.findAll();
    }

    @Transactional
    public List<Drug> seedDrugs() {
        log.info("Seeding drug catalog...");
        if (drugRepository.count() >= 30) {
            return drugRepository.findAll();
        }

        List<Drug> drugs = Arrays.asList(
                // Antibiotics
                Drug.builder().innName("Amoxicillin").brandName("Amoxil 500mg").category("Antibiotics").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("8.50")).reorderLevel(50).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Azithromycin").brandName("Zithromax 500mg").category("Antibiotics").dosageForm("Tablet").unit("Strip of 3").sellingPrice(new BigDecimal("12.00")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Ciprofloxacin").brandName("Cipro 500mg").category("Antibiotics").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("9.20")).reorderLevel(40).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Ceftriaxone").brandName("Rocephin 1g").category("Antibiotics").dosageForm("Injection").unit("Vial").sellingPrice(new BigDecimal("15.00")).reorderLevel(25).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Doxycycline").brandName("Vibramycin 100mg").category("Antibiotics").dosageForm("Capsule").unit("Strip of 10").sellingPrice(new BigDecimal("7.80")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Analgesics / Antipyretics
                Drug.builder().innName("Paracetamol").brandName("Dolo 650mg").category("Analgesics").dosageForm("Tablet").unit("Strip of 15").sellingPrice(new BigDecimal("4.00")).reorderLevel(100).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Ibuprofen").brandName("Advil 400mg").category("Analgesics").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("5.50")).reorderLevel(60).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Tramadol").brandName("Ultram 50mg").category("Analgesics").dosageForm("Capsule").unit("Strip of 10").sellingPrice(new BigDecimal("14.00")).reorderLevel(20).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Diclofenac").brandName("Voveran 50mg").category("Analgesics").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("6.00")).reorderLevel(40).gstPercentage(new BigDecimal("5.00")).active(true).build(),

                // Antihistamines
                Drug.builder().innName("Cetirizine").brandName("Zyrtec 10mg").category("Antihistamines").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("3.50")).reorderLevel(50).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Fexofenadine").brandName("Allegra 120mg").category("Antihistamines").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("11.00")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Antacids / GI
                Drug.builder().innName("Omeprazole").brandName("Prilosec 20mg").category("Antacids").dosageForm("Capsule").unit("Strip of 14").sellingPrice(new BigDecimal("9.00")).reorderLevel(45).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Pantoprazole").brandName("Protonix 40mg").category("Antacids").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("8.00")).reorderLevel(50).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Aluminum Hydroxide").brandName("Gelusil Antacid Syrup").category("Antacids").dosageForm("Syrup").unit("Bottle 200ml").sellingPrice(new BigDecimal("6.50")).reorderLevel(20).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Ondansetron").brandName("Zofran 4mg").category("Antacids").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("10.50")).reorderLevel(25).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Vitamins
                Drug.builder().innName("Cholecalciferol").brandName("Vitamin D3 60k").category("Vitamins").dosageForm("Capsule").unit("Pack of 4").sellingPrice(new BigDecimal("16.00")).reorderLevel(35).gstPercentage(new BigDecimal("18.00")).active(true).build(),
                Drug.builder().innName("Multivitamin").brandName("Becosules Performance").category("Vitamins").dosageForm("Tablet").unit("Bottle of 30").sellingPrice(new BigDecimal("22.00")).reorderLevel(40).gstPercentage(new BigDecimal("18.00")).active(true).build(),
                Drug.builder().innName("Ascorbic Acid").brandName("Limcee 500mg").category("Vitamins").dosageForm("Tablet").unit("Strip of 15").sellingPrice(new BigDecimal("5.00")).reorderLevel(50).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Calcium Carbonate").brandName("Shelcal 500mg").category("Vitamins").dosageForm("Tablet").unit("Strip of 15").sellingPrice(new BigDecimal("9.50")).reorderLevel(40).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Diabetes
                Drug.builder().innName("Metformin").brandName("Glucophage 500mg").category("Diabetes").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("4.50")).reorderLevel(80).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Glimepiride").brandName("Amaryl 2mg").category("Diabetes").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("7.00")).reorderLevel(50).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Insulin Human").brandName("Humulin R 100IU").category("Diabetes").dosageForm("Injection").unit("Vial 10ml").sellingPrice(new BigDecimal("35.00")).reorderLevel(15).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Cardiovascular / Blood Pressure
                Drug.builder().innName("Amlodipine").brandName("Norvasc 5mg").category("Blood-Pressure").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("3.80")).reorderLevel(70).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Telmisartan").brandName("Micardis 40mg").category("Blood-Pressure").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("6.20")).reorderLevel(60).gstPercentage(new BigDecimal("5.00")).active(true).build(),
                Drug.builder().innName("Atorvastatin").brandName("Lipitor 20mg").category("Cardiovascular").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("13.50")).reorderLevel(45).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Clopidogrel").brandName("Plavix 75mg").category("Cardiovascular").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("15.00")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Metoprolol").brandName("Lopressor 50mg").category("Cardiovascular").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("8.40")).reorderLevel(40).gstPercentage(new BigDecimal("5.00")).active(true).build(),

                // Respiratory
                Drug.builder().innName("Salbutamol").brandName("Ventolin Inhaler").category("Respiratory").dosageForm("Inhaler").unit("Canister").sellingPrice(new BigDecimal("18.00")).reorderLevel(25).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Montelukast").brandName("Singulair 10mg").category("Respiratory").dosageForm("Tablet").unit("Strip of 10").sellingPrice(new BigDecimal("14.50")).reorderLevel(35).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Diphenhydramine").brandName("Benadryl Cough Syrup").category("Respiratory").dosageForm("Syrup").unit("Bottle 100ml").sellingPrice(new BigDecimal("7.50")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Dermatological
                Drug.builder().innName("Hydrocortisone").brandName("Hydrocort Cream 1%").category("Dermatological").dosageForm("Cream").unit("Tube 20g").sellingPrice(new BigDecimal("7.20")).reorderLevel(20).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Clotrimazole").brandName("Candid Cream 1%").category("Dermatological").dosageForm("Cream").unit("Tube 30g").sellingPrice(new BigDecimal("6.80")).reorderLevel(25).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Povidone Iodine").brandName("Betadine Ointment 5%").category("Dermatological").dosageForm("Ointment").unit("Tube 15g").sellingPrice(new BigDecimal("5.00")).reorderLevel(30).gstPercentage(new BigDecimal("12.00")).active(true).build(),

                // Ophthalmic & Otic
                Drug.builder().innName("Tobramycin").brandName("Tobrex Eye Drops").category("Ophthalmic").dosageForm("Drops").unit("Bottle 5ml").sellingPrice(new BigDecimal("12.50")).reorderLevel(20).gstPercentage(new BigDecimal("12.00")).active(true).build(),
                Drug.builder().innName("Ciprofloxacin Otic").brandName("Ciplox Ear Drops").category("Otic").dosageForm("Drops").unit("Bottle 10ml").sellingPrice(new BigDecimal("9.00")).reorderLevel(20).gstPercentage(new BigDecimal("12.00")).active(true).build()
        );

        drugRepository.saveAll(drugs);
        return drugRepository.findAll();
    }

    @Transactional
    public void seedInventoryBatches(List<Drug> drugs) {
        log.info("Seeding inventory batches (FEFO, Low Stock, Expiring, Expired)...");
        if (inventoryBatchRepository.count() >= 50) {
            return;
        }

        LocalDate today = LocalDate.now();
        List<InventoryBatch> batches = new ArrayList<>();
        int batchCounter = 100;

        for (Drug drug : drugs) {
            batchCounter++;
            String b1 = "BCH-2026-" + batchCounter;
            String b2 = "BCH-2026-" + (batchCounter + 500);

            if ("Dolo 650mg".equals(drug.getBrandName()) || "Amoxil 500mg".equals(drug.getBrandName())) {
                // FEFO scenario: Batch A expires earlier, Batch B expires later
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b1 + "-FEFO1")
                        .manufactureDate(today.minusMonths(5))
                        .expiryDate(today.plusDays(15)) // Expiring soon (15 days)
                        .quantity(25)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.6")))
                        .binLocation("BIN-A-01")
                        .status(BatchStatus.AVAILABLE)
                        .receivedDate(today.minusMonths(4))
                        .build());

                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b2 + "-FEFO2")
                        .manufactureDate(today.minusMonths(2))
                        .expiryDate(today.plusMonths(14)) // Healthy long expiry
                        .quantity(200)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.6")))
                        .binLocation("BIN-A-02")
                        .status(BatchStatus.AVAILABLE)
                        .receivedDate(today.minusMonths(1))
                        .build());
            } else if ("Humulin R 100IU".equals(drug.getBrandName()) || "Ultram 50mg".equals(drug.getBrandName())) {
                // Low Stock scenario (qty <= reorder level)
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b1 + "-LOW")
                        .manufactureDate(today.minusMonths(6))
                        .expiryDate(today.plusMonths(8))
                        .quantity(8)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.7")))
                        .binLocation("COLD-STORAGE-1")
                        .status(BatchStatus.AVAILABLE)
                        .receivedDate(today.minusMonths(5))
                        .build());
            } else if (drug.getId() % 6 == 0) {
                // Expired batch scenario
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b1 + "-EXPIRED")
                        .manufactureDate(today.minusMonths(18))
                        .expiryDate(today.minusDays(20)) // Expired 20 days ago
                        .quantity(15)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.5")))
                        .binLocation("DISPOSAL-BIN-1")
                        .status(BatchStatus.EXPIRED)
                        .receivedDate(today.minusMonths(17))
                        .build());

                // Healthy replacement batch
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b2 + "-FRESH")
                        .manufactureDate(today.minusDays(10))
                        .expiryDate(today.plusMonths(18))
                        .quantity(120)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.6")))
                        .binLocation("BIN-B-12")
                        .status(BatchStatus.AVAILABLE)
                        .receivedDate(today.minusDays(5))
                        .build());
            } else if (drug.getId() % 7 == 0) {
                // Out of stock scenario
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b1 + "-OOS")
                        .manufactureDate(today.minusMonths(12))
                        .expiryDate(today.plusMonths(6))
                        .quantity(0)
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.6")))
                        .binLocation("BIN-D-01")
                        .status(BatchStatus.OUT_OF_STOCK)
                        .receivedDate(today.minusMonths(11))
                        .build());
            } else {
                // Standard healthy stock batch
                batches.add(InventoryBatch.builder()
                        .drug(drug)
                        .batchNumber(b1 + "-STD")
                        .manufactureDate(today.minusMonths(3))
                        .expiryDate(today.plusMonths(12 + (int)(drug.getId() % 10)))
                        .quantity(80 + (int)(drug.getId() * 3))
                        .unitCost(drug.getSellingPrice().multiply(new BigDecimal("0.55")))
                        .binLocation("BIN-GEN-" + (drug.getId() % 15 + 1))
                        .status(BatchStatus.AVAILABLE)
                        .receivedDate(today.minusMonths(2))
                        .build());
            }
        }

        inventoryBatchRepository.saveAll(batches);
        log.info("Saved {} inventory batches.", batches.size());
    }

    public void seedPrescriptionsAndBills(List<User> users, List<Patient> patients, List<Drug> drugs) {
        log.info("Seeding prescriptions, FEFO dispensing, and bills...");
        if (prescriptionRepository.count() >= 20) {
            return;
        }

        List<User> doctors = users.stream().filter(u -> u.getRole() == Role.DOCTOR).toList();
        if (doctors.isEmpty() || patients.isEmpty() || drugs.isEmpty()) {
            log.warn("Cannot seed prescriptions: missing doctors, patients, or drugs.");
            return;
        }

        LocalDate today = LocalDate.now();

        for (int i = 1; i <= 25; i++) {
            String rxNum = String.format("RX-2026-%03d", i);
            Patient patient = patients.get((i - 1) % patients.size());
            User doctor = doctors.get((i - 1) % doctors.size());
            Drug drug1 = drugs.get((i * 2) % drugs.size());
            Drug drug2 = drugs.get((i * 3 + 1) % drugs.size());

            PrescriptionRequest req = PrescriptionRequest.builder()
                    .prescriptionNumber(rxNum)
                    .patientId(patient.getId())
                    .doctorId(doctor.getId())
                    .prescriptionDate(today.minusDays(25 - i))
                    .diagnosis(getDiagnosisForIndex(i))
                    .notes("Patient evaluated and prescribed standard course.")
                    .items(Arrays.asList(
                            PrescriptionItemRequest.builder()
                                    .drugId(drug1.getId())
                                    .dosage("1 Tablet / Capsule")
                                    .frequency("Twice daily after meals")
                                    .duration("5 days")
                                    .quantity(10)
                                    .instructions("Take with water")
                                    .build(),
                            PrescriptionItemRequest.builder()
                                    .drugId(drug2.getId())
                                    .dosage("1 Tablet")
                                    .frequency("Once daily at bedtime")
                                    .duration("7 days")
                                    .quantity(7)
                                    .instructions("Do not chew")
                                    .build()
                    ))
                    .build();

            try {
                // 1. Create prescription (status = PENDING)
                PrescriptionResponse created = prescriptionService.createPrescription(req);
                Long rxId = created.getId();

                // Distribution:
                // i = 1..8 -> PENDING
                // i = 9..12 -> VERIFIED
                // i = 13..23 -> DISPENSED (via real business logic FEFO)
                // i = 24..25 -> CANCELLED

                if (i >= 9 && i <= 12) {
                    prescriptionService.verifyPrescription(rxId);
                } else if (i >= 13 && i <= 23) {
                    prescriptionService.verifyPrescription(rxId);
                    prescriptionService.dispensePrescription(rxId);

                    Prescription rx = prescriptionRepository.findById(rxId).orElse(null);
                    if (rx != null && rx.getBill() != null) {
                        Bill bill = rx.getBill();
                        if (i % 2 == 0) {
                            PaymentUpdateRequest pReq = PaymentUpdateRequest.builder()
                                    .paymentStatus(PaymentStatus.PAID)
                                    .paymentMethod(i % 3 == 0 ? PaymentMethod.UPI : (i % 4 == 0 ? PaymentMethod.CARD : PaymentMethod.CASH))
                                    .build();
                            billService.updatePayment(bill.getId(), pReq);
                        }
                    }
                } else if (i >= 24) {
                    prescriptionService.cancelPrescription(rxId);
                }
            } catch (Exception e) {
                log.warn("Failed to create demo prescription {}: {}", rxNum, e.getMessage());
            }
        }
        log.info("Completed seeding prescriptions and bills.");
    }

    private String getDiagnosisForIndex(int i) {
        String[] diagnoses = {
                "Acute Upper Respiratory Tract Infection",
                "Essential Primary Hypertension",
                "Type 2 Diabetes Mellitus",
                "Bacterial Gastroenteritis",
                "Acute Bronchitis & Cough",
                "Vitamin D Deficiency & Fatigue",
                "Allergic Rhinitis & Sinusitis",
                "Osteoarthritis - Knee Pain",
                "Gastroesophageal Reflux Disease (GERD)",
                "Migraine Headaches",
                "Broad Spectrum Bacterial Infection",
                "Hyperlipidemia & High Cholesterol"
        };
        return diagnoses[(i - 1) % diagnoses.length];
    }
}
