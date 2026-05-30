
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProduct } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [maxStock, setMaxStock] = useState(0);
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [colorsArray, setColorsArray] = useState([]);
  const [sizesArray, setSizesArray] = useState([]);
  const [sizeStockMap, setSizeStockMap] = useState({});

  const BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(id);
      setProduct(data);
      
      // Parse colors
      let colors = [];
      if (data.colors) {
        if (typeof data.colors === 'string') {
          try {
            colors = JSON.parse(data.colors);
          } catch {
            colors = data.colors.split(',').map(c => c.trim());
          }
        } else if (Array.isArray(data.colors)) {
          colors = data.colors;
        }
      }
      setColorsArray(colors);
      
      // Parse sizes and size stock
      let sizes = [];
      let stockMap = {};
      if (data.sizes) {
        if (typeof data.sizes === 'string') {
          try {
            sizes = JSON.parse(data.sizes);
          } catch {
            sizes = data.sizes.split(',').map(s => s.trim());
          }
        } else if (Array.isArray(data.sizes)) {
          sizes = data.sizes;
        }
      }
      setSizesArray(sizes);
      
      // Parse size stock
      if (data.size_stock) {
        try {
          stockMap = JSON.parse(data.size_stock);
          setSizeStockMap(stockMap);
        } catch {
          setSizeStockMap({});
        }
      } else {
        setSizeStockMap({});
      }
      
      // Set main image
      const mainImg = data.main_image ? `${BASE_URL}${data.main_image}` : null;
      setMainImage(mainImg);
      
      // Set all images
      let subImgs = [];
      if (data.sub_images) {
        if (typeof data.sub_images === 'string') {
          try {
            subImgs = JSON.parse(data.sub_images);
          } catch {
            subImgs = [];
          }
        } else if (Array.isArray(data.sub_images)) {
          subImgs = data.sub_images;
        }
      }
      const fullSubImgs = subImgs.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`);
      const allImgs = [mainImg, ...fullSubImgs].filter(img => img);
      setAllImages(allImgs);
      
      // Set default selections
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
      if (sizes.length > 0) {
        const firstSize = sizes[0];
        setSelectedSize(firstSize);
        // Set max stock based on selected size
        const stockForSize = stockMap[firstSize] || data.stock || 0;
        setMaxStock(stockForSize);
        setQuantity(1);
      } else {
        setMaxStock(data.stock || 0);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  // Update max stock when size changes
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const stockForSize = sizeStockMap[size] || product?.stock || 0;
    setMaxStock(stockForSize);
    // Reset quantity to 1 if current quantity exceeds new max stock
    if (quantity > stockForSize) {
      setQuantity(stockForSize > 0 ? 1 : 0);
    }
  };

  // Update quantity with stock limit
  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > maxStock) {
      setQuantity(maxStock);
      toast.error(`Only ${maxStock} items available in stock`);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (colorsArray.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (sizesArray.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    // Check if quantity exceeds stock
    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available`);
      return;
    }
    
    if (maxStock === 0) {
      toast.error('Out of stock');
      return;
    }
    
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success('Added to cart!');
  };

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > maxStock) val = maxStock;
    setQuantity(val);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Product not found</p>
        <Link to="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const discountPercent = product.discount_price 
    ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)
    : 0;

  const getColorStyle = (colorName) => {
    const colorMap = {
      'red': '#ef4444', 'blue': '#3b82f6', 'green': '#22c55e', 'black': '#1f2937',
      'white': '#ffffff', 'yellow': '#eab308', 'purple': '#8b5cf6', 'pink': '#ec4899',
      'orange': '#f97316', 'brown': '#8b4513', 'gray': '#6b7280', 'navy': '#1e3a8a'
    };
    const lowerColor = colorName.toLowerCase();
    if (colorMap[lowerColor]) {
      return { backgroundColor: colorMap[lowerColor], border: lowerColor === 'white' ? '1px solid #ddd' : 'none' };
    }
    return { backgroundColor: lowerColor, border: '1px solid #ddd' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                <i className="fas fa-image text-6xl text-gray-400"></i>
              </div>
            )}
          </div>
          
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                    mainImage === img ? 'border-indigo-600 shadow-md' : 'border-gray-200 hover:border-indigo-400'
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          
          {product.category_name && (
            <p className="text-gray-500 mb-4">
              Category: <span className="text-indigo-600">{product.category_name}</span>
            </p>
          )}
          
          <div className="flex items-center space-x-3 mb-4">
            {product.discount_price ? (
              <>
                <span className="text-3xl font-bold text-indigo-600">${product.discount_price}</span>
                <span className="text-gray-400 line-through text-xl">${product.original_price}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Save {discountPercent}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-indigo-600">${product.original_price}</span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>
          
          {/* Colors */}
          {colorsArray.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color: <span className="font-semibold text-indigo-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colorsArray.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : 'hover:scale-105'
                    }`}
                    style={getColorStyle(color)}
                    title={color}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Sizes with Stock Display */}
          {sizesArray.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: <span className="font-semibold text-indigo-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizesArray.map((size) => {
                  const stockForSize = sizeStockMap[size] || 0;
                  const isOutOfStock = stockForSize === 0;
                  
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => !isOutOfStock && handleSizeChange(size)}
                      disabled={isOutOfStock}
                      className={`relative w-14 h-14 border rounded-lg transition font-medium ${
                        selectedSize === size
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      {size}
                      {isOutOfStock && (
                        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                          sold out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-500 mt-2">
                  Stock available: <strong className="text-indigo-600">{sizeStockMap[selectedSize] || 0}</strong> items
                </p>
              )}
            </div>
          )}
          
          {/* Quantity with Stock Limit - FIXED */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Max: {maxStock})
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={maxStock}
                className="w-20 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={quantity >= maxStock}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {maxStock === 0 && (
              <p className="text-red-500 text-sm mt-2">This size is out of stock</p>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mb-4">
            {maxStock > 0 ? (
              <p className="text-green-600 font-semibold flex items-center gap-2">
                <i className="fas fa-check-circle"></i> In Stock ({maxStock} available)
              </p>
            ) : (
              <p className="text-red-600 font-semibold flex items-center gap-2">
                <i className="fas fa-times-circle"></i> Out of Stock
              </p>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={maxStock === 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i className="fas fa-shopping-cart"></i>
            {maxStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <Link to="/products" className="block text-center mt-4 text-indigo-600 hover:text-indigo-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;