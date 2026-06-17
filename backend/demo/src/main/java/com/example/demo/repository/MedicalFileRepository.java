package com.example.demo.repository;

import com.example.demo.entity.MedicalFile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicalFileRepository
        extends JpaRepository<MedicalFile, Long> {

                Optional<MedicalFile>
                findById(Long fileId);
}