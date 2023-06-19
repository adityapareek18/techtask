package com.andersen.techtask.sample.web.rest;

import com.andersen.techtask.sample.domain.City;
import com.andersen.techtask.sample.repository.CountryRepository;
import com.andersen.techtask.sample.security.AuthoritiesConstants;
import com.andersen.techtask.sample.web.rest.errors.BadRequestAlertException;
import com.andersen.techtask.sample.repository.CityRepository;
import com.andersen.techtask.sample.web.rest.requests.CreateCityRequest;
import com.andersen.techtask.sample.web.rest.util.ResponseUtil;
import com.andersen.techtask.sample.web.rest.util.HeaderUtil;
import com.andersen.techtask.sample.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link City}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CityResource {

    private final Logger log = LoggerFactory.getLogger(CityResource.class);

    private static final String ENTITY_NAME = "city";

    @Value("${spring.application.name}")
    private String applicationName;

    private final CityRepository cityRepository;

    private final CountryRepository countryRepository;

    public CityResource(CityRepository cityRepository, CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }

    @PostMapping(value = "/cities", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<City> createCity(@ModelAttribute CreateCityRequest req) throws URISyntaxException {
        log.debug("REST request to save city : {}", req);
        City city = new City();
        if (req.getId() != null) {
            throw new BadRequestAlertException("A new city cannot already have an ID", ENTITY_NAME, "idexists");
        }
        try {
            city.setName(req.getName());
            city.setCountry(countryRepository.findCountryById(req.getCountry()));
            city.setLogo(req.getLogo().getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        City result = cityRepository.save(city);
        return ResponseEntity
            .created(new URI("/api/city/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cities/:id} : Updates an existing city.
     *
     * @param id   the id of the city to save.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated city,
     * or with status {@code 400 (Bad Request)} if the city is not valid,
     * or with status {@code 500 (Internal Server Error)} if the city couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping("/cities/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.EDITOR + "\")")
    public ResponseEntity<City> updateCity(
        @PathVariable(value = "id", required = false) final Long id,
        @ModelAttribute CreateCityRequest req
    ) throws URISyntaxException {
        log.debug("REST request to update City : {}, {}", id, req);
        if (req.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, req.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<City> result = cityRepository
            .findById(req.getId())
            .map(city -> {
                if (req.getName() != null) {
                    city.setName(req.getName());
                }
                if (req.getCountry() != null) {
                    city.setCountry(countryRepository.findCountryById(req.getCountry()));
                }

                if (!req.getLogo().isEmpty()) {
                    try {
                        city.setLogo(req.getLogo().getBytes());
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
                return city;
            })
            .map(cityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, req.getId().toString())
        );
    }

    /**
     * {@code GET  /cities} : get all the cities.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cities in body.
     */
    @GetMapping("/cities")
    public ResponseEntity<List<City>> getAllCities(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of city");
        Page<City> page = cityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cities/:id} : get the "id" city.
     *
     * @param id the id of the city to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the city, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cities/{id}")
    public ResponseEntity<City> getCity(@PathVariable Long id) {
        log.debug("REST request to get City : {}", id);
        Optional<City> city = cityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(city);
    }

    @GetMapping("/cities/searchByName")
    public ResponseEntity<List<City>> searchCitiesByName(@RequestParam("name") String name) {
        log.debug("REST request to search city : {}", name);
        List<City> cities = cityRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok().body(cities);
    }

    @GetMapping("/cities/searchByCountryName")
    public ResponseEntity<List<City>> searchCitiesByCountryName(@RequestParam("countryName") String countryName) {
        List<City> cities = cityRepository.findByCountryNameContainingIgnoreCase(countryName);
        return ResponseEntity.ok().body(cities);
    }
}
