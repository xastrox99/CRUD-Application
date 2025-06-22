package com.example.crud.service;

import com.example.crud.model.Product;
import com.example.crud.repository.ProductRepository;
import com.example.crud.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product create(Product product) {
        // Validate that product with same name doesn't exist
        Optional<Product> existingProduct = repo.findByNameIgnoreCase(product.getName());
        if (existingProduct.isPresent()) {
            throw new IllegalArgumentException("Product with name '" + product.getName() + "' already exists");
        }
        return repo.save(product);
    }

    public Product update(Long id, Product updatedProduct) {
        Product product = findById(id);
        
        // Check if name is being changed and if it conflicts with existing product
        if (!product.getName().equalsIgnoreCase(updatedProduct.getName())) {
            Optional<Product> existingProduct = repo.findByNameIgnoreCase(updatedProduct.getName());
            if (existingProduct.isPresent()) {
                throw new IllegalArgumentException("Product with name '" + updatedProduct.getName() + "' already exists");
            }
        }
        
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setDescription(updatedProduct.getDescription());
        product.setCategory(updatedProduct.getCategory());
        product.setStockQuantity(updatedProduct.getStockQuantity());
        
        return repo.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        repo.delete(product);
    }

    public List<Product> findByCategory(String category) {
        return repo.findByCategoryIgnoreCase(category);
    }

    public List<Product> findByNameContaining(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    public List<Product> findByPriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        return repo.findByPriceBetween(minPrice, maxPrice);
    }

    public List<String> findAllCategories() {
        return repo.findAllCategories();
    }
}
