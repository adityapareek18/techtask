package com.andersen.techtask.sample.repository;

import com.andersen.techtask.sample.domain.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

    @Override
    List<Country> findAll();

    @Override
    Page<Country> findAll(Pageable pageable);

    Country findCountryById(Long id);

}
