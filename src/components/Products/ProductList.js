import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import { getProducts, getCategories } from '../../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    } else {
      setFilters(prev => ({ ...prev, category: '' }));
    }
  }, [location.search, searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(p => p.category_id === parseInt(filters.category));
    }
    
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      const price = parseFloat(filters.minPrice);
      filtered = filtered.filter(p => {
        const finalPrice = p.discount_price || p.original_price;
        return finalPrice >= price;
      });
    }
    
    if (filters.maxPrice) {
      const price = parseFloat(filters.maxPrice);
      filtered = filtered.filter(p => {
        const finalPrice = p.discount_price || p.original_price;
        return finalPrice <= price;
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.category) {
      setSearchParams({ category: newFilters.category });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === parseInt(filters.category));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ProductFilter 
            categories={categories}
            filters={filters}
            setFilters={handleFilterChange}
          />
        </div>
        
        <div className="lg:w-3/4">
          {currentCategory && (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{currentCategory.name}</h2>
              <p className="text-gray-500 mt-1">Discover our {currentCategory.name} collection</p>
            </div>
          )}
          
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Found <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> products
            </p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No products found in this category</p>
              <button 
                onClick={() => handleFilterChange({ ...filters, category: '' })}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;