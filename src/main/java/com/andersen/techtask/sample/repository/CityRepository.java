package com.andersen.techtask.sample.repository;

import com.andersen.techtask.sample.domain.City;
import com.andersen.techtask.sample.domain.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Page<City> findAllByCountry(Pageable pageable, Country country);
    List<City> findByNameContainingIgnoreCase(String name);

    List<City> findByCountryNameContainingIgnoreCase(String countryName);
}
