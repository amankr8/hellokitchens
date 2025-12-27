package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.Customer;

public interface CustomerService {

    Customer loadCustomerById(Long customerId);

    Customer loadCustomerByPhone(String phone);

    Customer updateCustomerDetails(Long customerId, CustomerReqDto customerReqDto);

    Customer registerCustomer(CustomerReqDto customerReqDto);
}
