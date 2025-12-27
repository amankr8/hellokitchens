package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.dto.customer.CustomerResDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/v1/customers")
public interface CustomerController {

    @GetMapping
    ResponseEntity<CustomerResDto> getUserDetails();

    @PutMapping
    ResponseEntity<CustomerResDto> updateCustomerDetails(@RequestBody CustomerReqDto customerReqDto);
}
