package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.Customer;

public interface CustomerService {

    Customer getCustomerByAuthUser(AuthUser authUser);

    Customer updateCustomerDetails(AuthUser authUser, CustomerReqDto customerReqDto);

    void registerCustomer(AuthUser authUser, CustomerReqDto customerReqDto);
}
