package com.flykraft.livemenu.repository;

import com.flykraft.livemenu.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
