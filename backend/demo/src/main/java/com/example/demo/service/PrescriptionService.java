package com.example.demo.service;

import com.example.demo.entity.Prescription;
import com.example.demo.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

        private final BillRepository billRepository;

    public PrescriptionService(
        PrescriptionRepository prescriptionRepository,
        BillRepository billRepository
    ) {
        this.prescriptionRepository =
             prescriptionRepository;

        this.billRepository =
                billRepository;
    }

    public List<Prescription>
    getAllPrescriptions() {

        return prescriptionRepository.findAll();
    }

    public Prescription addPrescription(
        Prescription prescription
) {

    Prescription savedPrescription =
            prescriptionRepository.save(
                    prescription
            );

    System.out.println(
            "Appointment = "
            + savedPrescription.getAppointment()
    );

    System.out.println(
            "Medicine Fee = "
            + savedPrescription.getMedicineFee()
    );

    System.out.println(
            "Test Fee = "
            + savedPrescription.getTestFee()
    );

    Bill bill = billRepository
            .findByAppointment(
                    savedPrescription.getAppointment()
            )
            .orElseThrow(
                    () -> new RuntimeException(
                            "Bill not found"
                    )
            );

    System.out.println(
            "Bill Found = "
            + bill.getBillId()
    );

    Double medicineFee =
            savedPrescription.getMedicineFee() == null
            ? 0.0
            : savedPrescription.getMedicineFee();

    Double testFee =
            savedPrescription.getTestFee() == null
            ? 0.0
            : savedPrescription.getTestFee();

    bill.setMedicineFee(medicineFee);
    bill.setTestFee(testFee);

    bill.setTotalAmount(
            bill.getConsultationFee()
            +
            medicineFee
            +
            testFee
    );

    System.out.println(
            "Saving Bill..."
    );

    System.out.println(
            "Medicine Fee = "
            + bill.getMedicineFee()
    );

    System.out.println(
            "Test Fee = "
            + bill.getTestFee()
    );

    System.out.println(
            "Total Amount = "
            + bill.getTotalAmount()
    );

    billRepository.save(bill);

    return savedPrescription;
}

    public void deletePrescription(
            Long id
    ) {
        prescriptionRepository.deleteById(id);
    }
}