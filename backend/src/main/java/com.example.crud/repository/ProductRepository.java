package com.example.crud.repository;

import com.example.crud.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByNameIgnoreCase(String name);
    
    List<Product> findByCategoryIgnoreCase(String category);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Product> findByStockQuantityLessThan(Integer quantity);
    
    @Query("SELECT p FROM Product p WHERE p.price >= :minPrice AND p.stockQuantity > 0 ORDER BY p.price ASC")
    List<Product> findAvailableProductsByMinPrice(@Param("minPrice") BigDecimal minPrice);
    
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findAllCategories();
}
