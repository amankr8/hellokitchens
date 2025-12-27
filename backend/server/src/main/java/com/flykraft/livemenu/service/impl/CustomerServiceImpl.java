package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.entity.Customer;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.repository.CustomerRepository;
import com.flykraft.livemenu.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    @Override
    public Customer loadCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }

    @Override
    public Customer loadCustomerByPhone(String phone) {
        return customerRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with phone: " + phone));
    }

    @Override
    public Customer updateCustomerDetails(Long customerId, CustomerReqDto customerReqDto) {
        Customer customer = loadCustomerById(customerId);
        customer.setName(customerReqDto.getName());
        customer.setPhone(customerReqDto.getPhone());
        customer.setAddress(customerReqDto.getAddress());
        return customerRepository.save(customer);
    }

    @Override
    public Customer registerCustomer(CustomerReqDto customerReqDto) {
        Customer customer = Customer.builder()
                .name(customerReqDto.getName())
                .phone(customerReqDto.getPhone())
                .address(customerReqDto.getAddress())
                .build();
        return customerRepository.save(customer);
    }
}
