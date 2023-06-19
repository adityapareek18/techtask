package com.andersen.techtask.sample.web.rest;

import com.andersen.techtask.sample.domain.Country;
import com.andersen.techtask.sample.repository.CountryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing {@link Country}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CountryResource {

    private final Logger log = LoggerFactory.getLogger(CountryResource.class);

    private final CountryRepository countryRepository;

    public CountryResource(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    /**
     * {@code GET  /countries} : get all the countries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of operations in body.
     */
    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        log.debug("REST request to get all Countries");
        List<Country> countryList = countryRepository.findAll();
        return ResponseEntity.ok().body(countryList);
    }
}
