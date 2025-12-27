package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.CustomerController;
import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.dto.customer.CustomerResDto;
import com.flykraft.livemenu.service.CustomerService;
import com.flykraft.livemenu.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class CustomerControllerImpl implements CustomerController {
    private final CustomerService customerService;

    @Override
    public ResponseEntity<CustomerResDto> getUserDetails() {
        return ResponseEntity.ok().body(customerService.getCustomerByAuthUser(AuthUtil.getLoggedInUser()).toResponseDto());
    }

    @Override
    public ResponseEntity<CustomerResDto> updateCustomerDetails(CustomerReqDto customerReqDto) {
        return ResponseEntity.ok().body(customerService.updateCustomerDetails(AuthUtil.getLoggedInUser(), customerReqDto).toResponseDto());
    }
}
