package com.andersen.techtask.sample.web.rest.requests;

import com.andersen.techtask.sample.domain.Country;
import org.springframework.web.multipart.MultipartFile;

public class CreateCityRequest {
private Long id;
private String name;
private MultipartFile logo;
private Long country;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MultipartFile getLogo() {
        return logo;
    }

    public void setLogo(MultipartFile logo) {
        this.logo = logo;
    }

    public Long getCountry() {
        return country;
    }

    public void setCountry(Long country) {
        this.country = country;
    }
}
