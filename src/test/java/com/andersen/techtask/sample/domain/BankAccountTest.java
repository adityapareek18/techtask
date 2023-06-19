package com.andersen.techtask.sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.andersen.techtask.sample.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BankAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(City.class);
        City bankAccount1 = new City();
        bankAccount1.setId(1L);
        City bankAccount2 = new City();
        bankAccount2.setId(bankAccount1.getId());
        assertThat(bankAccount1).isEqualTo(bankAccount2);
        bankAccount2.setId(2L);
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);
        bankAccount1.setId(null);
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);
    }
}
