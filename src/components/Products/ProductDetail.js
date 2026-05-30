// src/components/Products/ProductDetail.js
import React, { useState, useEffect } from 'react';
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
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [colorsArray, setColorsArray] = useState([]);
  const [sizesArray, setSizesArray] = useState([]);
  const [sizeStockMap, setSizeStockMap] = useState({});
  const [activeTab, setActiveTab] = useState('description');

  const BASE_URL = 'https://menghor-store-backend.onrender.com';

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
      
      if (data.size_stock) {
        try {
          stockMap = JSON.parse(data.size_stock);
          setSizeStockMap(stockMap);
        } catch {
          setSizeStockMap({});
        }
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
        setSelectedSize(sizes[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
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
    
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success('Added to cart!');
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountPercent = product.discount_price 
    ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-800">{product.title}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images Gallery */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-square">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <i className="fas fa-image text-6xl text-gray-300"></i>
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    mainImage === img 
                      ? 'border-indigo-600 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-indigo-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star text-yellow-400"></i>
              <i className="fas fa-star-half-alt text-yellow-400"></i>
            </div>
            <span className="text-sm text-gray-500">(128 reviews)</span>
            {product.category_name && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-indigo-600">{product.category_name}</span>
              </>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-6">
            {product.discount_price ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-indigo-600">${product.discount_price}</span>
                <span className="text-gray-400 line-through text-xl">${product.original_price}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                  Save {discountPercent}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-indigo-600">${product.original_price}</span>
            )}
          </div>
          
          {/* Colors */}
          {colorsArray.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color: <span className="font-semibold text-indigo-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colorsArray.map((color) => (
                  <button
                    key={color}
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
          
          {/* Sizes with Stock */}
          {sizesArray.length > 0 && (
            <div className="mb-6">
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
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`relative w-12 h-12 border rounded-xl transition font-medium ${
                        selectedSize === size
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                          : isOutOfStock
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      {size}
                      {isOutOfStock && (
                        <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white rounded-full px-1">
                          out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedSize && sizeStockMap[selectedSize] > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ In stock ({sizeStockMap[selectedSize]} available)
                </p>
              )}
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          
          {/* Tabs */}
          <div className="mt-8 border-t border-gray-200">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-3 text-sm font-medium transition relative ${
                  activeTab === 'description' 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3 text-sm font-medium transition relative ${
                  activeTab === 'shipping' 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping Info
                {activeTab === 'shipping' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`py-3 text-sm font-medium transition relative ${
                  activeTab === 'returns' 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Returns
                {activeTab === 'returns' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === 'description' && (
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-3 text-gray-600">
                  <p>📦 Free shipping on orders over $50</p>
                  <p>🚚 Delivery within 3-5 business days</p>
                  <p>📍 Worldwide shipping available</p>
                </div>
              )}
              {activeTab === 'returns' && (
                <div className="space-y-3 text-gray-600">
                  <p>🔄 30-day easy returns</p>
                  <p>💯 Money-back guarantee</p>
                  <p>📞 Contact our support for returns</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;