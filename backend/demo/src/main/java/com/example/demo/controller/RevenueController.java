package com.example.demo.controller;

import com.example.demo.dto.DoctorRevenueDTO;
import com.example.demo.dto.MonthlyRevenueDTO;
import com.example.demo.dto.RevenueDTO;
import com.example.demo.dto.RevenueTrendDTO;
import com.example.demo.entity.Bill;
import com.example.demo.repository.BillRepository;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.HashMap;

@RestController
@RequestMapping("/api/revenue")
@CrossOrigin(origins = "http://localhost:5173")
public class RevenueController {

    private final BillRepository billRepository;

    public RevenueController(BillRepository billRepository) {
        this.billRepository = billRepository;
    }
    @GetMapping("/test")
        public String test() {
        return "Revenue API Works";
        }

    @GetMapping
    public RevenueDTO getRevenue() {

        List<Bill> bills = billRepository.findAll();

        double totalRevenue = bills.stream()
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        double paidRevenue = billRepository
                .findByPaymentStatus("PAID")
                .stream()
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        double pendingRevenue = billRepository
                .findByPaymentStatus("PENDING")
                .stream()
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        return new RevenueDTO(
                totalRevenue,
                paidRevenue,
                pendingRevenue,
                (long) bills.size()
        );
    }

    @GetMapping("/trend")
    public List<RevenueTrendDTO> getRevenueTrend() {

        Map<String, Double> revenueMap = new TreeMap<>();
        List<Bill> bills = billRepository.findAll();

        for (Bill bill : bills) {
            String date = bill.getBillDate().toString();
            revenueMap.put(
                    date,
                    revenueMap.getOrDefault(date, 0.0) + bill.getTotalAmount()
            );
        }

        return revenueMap.entrySet()
                .stream()
                .map(entry -> new RevenueTrendDTO(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }

    @GetMapping("/doctor")
        public List<DoctorRevenueDTO>
        getRevenueByDoctor() {

        Map<String, Double> revenueMap =
                new HashMap<>();

        List<Bill> bills =
                billRepository.findAll();

        for (Bill bill : bills) {

                String doctorName =
                        bill.getDoctor()
                        .getFullName();

                revenueMap.put(

                        doctorName,

                        revenueMap.getOrDefault(
                                doctorName,
                                0.0
                        )

                        +

                        bill.getTotalAmount()
                );
        }

        return revenueMap
                 .entrySet()
                 .stream()
                 .map(entry ->

                        new DoctorRevenueDTO(

                                entry.getKey(),

                                entry.getValue()
                        )
                )
                .toList();
        }

        @GetMapping("/monthly")
        public List<MonthlyRevenueDTO>
        getMonthlyRevenue() {

         Map<String, Double> revenueMap =
                new TreeMap<>();

        List<Bill> bills =
                billRepository.findAll();

        DateTimeFormatter formatter =
                 DateTimeFormatter.ofPattern(
                        "MMM yyyy"
                );

        for (Bill bill : bills) {

                String month =
                        bill.getBillDate()
                        .format(
                                formatter
                        );

                revenueMap.put(

                        month,

                        revenueMap.getOrDefault(
                                month,
                                0.0
                        )

                        +

                        bill.getTotalAmount()
         );
        }

        return revenueMap
                .entrySet()
                .stream()
                .map(entry ->

                        new MonthlyRevenueDTO(

                                entry.getKey(),

                                entry.getValue()
                        )
                )
                .toList();
        }
}