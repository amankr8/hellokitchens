package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.Customer;
import com.flykraft.livemenu.repository.CustomerRepository;
import com.flykraft.livemenu.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @Override
    public Customer getCustomerByAuthUser(AuthUser authUser) {
        return customerRepository.findByAuthUser(authUser)
                .orElseThrow(() -> new RuntimeException("Customer not found for user: " + authUser.getUsername()));
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @Override
    public Customer updateCustomerDetails(AuthUser authUser, CustomerReqDto customerReqDto) {
        Customer customer = getCustomerByAuthUser(authUser);
        customer.setName(customerReqDto.getName());
        customer.setEmail(customerReqDto.getEmail());
        customer.setPhone(customerReqDto.getPhone());
        customer.setAddress(customerReqDto.getAddress());
        return customerRepository.save(customer);
    }

    @Override
    public void registerCustomer(AuthUser authUser, CustomerReqDto customerReqDto) {
        Customer customer = Customer.builder()
                .authUser(authUser)
                .name(customerReqDto.getName())
                .email(customerReqDto.getEmail())
                .phone(customerReqDto.getPhone())
                .address(customerReqDto.getAddress())
                .build();
        customerRepository.save(customer);
    }
}
