import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/AllAds.css';

const AllAds = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFlashSaleOnly, setShowFlashSaleOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      alert('Failed to load products. Please refresh the page.');
    }
  };

  // Filter and sort products - FIXED
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFlashSale = !showFlashSaleOnly || product.isFlashSale === true;
      return matchesCategory && matchesSearch && matchesFlashSale;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'flashsale':
          // Show flash sale products first
          if (a.isFlashSale && !b.isFlashSale) return -1;
          if (!a.isFlashSale && b.isFlashSale) return 1;
          return 0;
          
        case 'newest':
          // Newest first
          const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : 
                       a.createdAt?.toDate ? a.createdAt.toDate() : 
                       new Date(a.createdAt || 0);
          const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : 
                       b.createdAt?.toDate ? b.createdAt.toDate() : 
                       new Date(b.createdAt || 0);
          return dateB - dateA;
          
        case 'oldest':
          // Oldest first
          const dateA2 = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : 
                        a.createdAt?.toDate ? a.createdAt.toDate() : 
                        new Date(a.createdAt || 0);
          const dateB2 = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : 
                        b.createdAt?.toDate ? b.createdAt.toDate() : 
                        new Date(b.createdAt || 0);
          return dateA2 - dateB2;
          
        case 'highestPrice':
          return parseFloat(b.price || 0) - parseFloat(a.price || 0);
          
        case 'lowestPrice':
          return parseFloat(a.price || 0) - parseFloat(b.price || 0);
          
        default:
          return 0;
      }
    });

  const handleEditClick = (product) => {
    setEditingProduct({...product});
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveEdit = async () => {
    try {
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name,
        category: editingProduct.category,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        flashSalePrice: editingProduct.flashSalePrice ? parseFloat(editingProduct.flashSalePrice) : null,
        isFlashSale: editingProduct.isFlashSale,
        availableStock: parseInt(editingProduct.availableStock),
        deliveryDate: editingProduct.deliveryDate,
        rating: editingProduct.rating ? parseFloat(editingProduct.rating) : 0,
        reviewCount: editingProduct.reviewCount ? parseInt(editingProduct.reviewCount) : 0,
        satisfiedPercentage: editingProduct.satisfiedPercentage ? parseInt(editingProduct.satisfiedPercentage) : 0,
        updatedAt: new Date()
      });

      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setShowEditModal(false);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="all-ads-container">
        <div className="loading-message">
          <h2>⏳ Loading products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="all-ads-container">
      <div className="all-ads-header">
        <div className="header-content">
          <h1>📦 All Products</h1>
          <p>Manage your product catalog</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>{products.filter(p => p.isFlashSale).length}</h3>
            <p>Flash Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{products.reduce((sum, p) => sum + (p.availableStock || 0), 0)}</h3>
            <p>Total Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(0)}</h3>
            <p>Total Value</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Camera">Camera</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphones">Headphones</option>
            <option value="Watch">Watch</option>
            <option value="TV">TV</option>
            <option value="Gaming">Gaming</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Food">Food & Beverage</option>
            <option value="Home">Home & Living</option>
            <option value="Sports">Sports & Fitness</option>
            <option value="Books">Books</option>
            <option value="Toys">Toys & Games</option>
            <option value="Other">Other</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="flashsale">⚡ Flash Sale First</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestPrice">Highest Price</option>
            <option value="lowestPrice">Lowest Price</option>
          </select>

          <button 
            className={`flash-sale-filter ${showFlashSaleOnly ? 'active' : ''}`}
            onClick={() => setShowFlashSaleOnly(!showFlashSaleOnly)}
          >
            ⚡ Flash Sale {showFlashSaleOnly && '✓'}
          </button>
        </div>

        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
            ⊞ Grid
          </button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            ☰ List
          </button>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="no-ads-message">
          <h2>📭 No products found</h2>
          <p>Try adjusting your filters or create a new product</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="ads-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="ad-card">
              <div className="ad-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="no-image">📷</div>
                )}
                {product.isFlashSale && (
                  <span className="flash-sale-badge">⚡ FLASH SALE</span>
                )}
              </div>
              <div className="ad-content">
                <h3>{product.name}</h3>
                <div className="ad-meta">
                  <span>📂 {product.category}</span>
                  <span>⭐ {product.rating || 0}</span>
                </div>
                <p className="ad-description">
                  {product.description || 'No description'}
                </p>
                <div className="price-section">
                  {product.isFlashSale && product.flashSalePrice ? (
                    <>
                      <span className="original-price">${product.price}</span>
                      <span className="flash-price">${product.flashSalePrice}</span>
                      <span className="discount-badge">
                        -{Math.round((1 - product.flashSalePrice / product.price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="regular-price">${product.price}</span>
                  )}
                  <span className="stock-badge">📦 {product.availableStock || 0} in stock</span>
                </div>
                <div className="ad-actions">
                  <button className="btn-edit" onClick={() => handleEditClick(product)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ads-list">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Flash Sale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={product.isFlashSale ? 'flash-sale-row' : ''}>
                  <td>
                    <div className="product-cell">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div style={{width: '60px', height: '60px', background: '#f0f0f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📷</div>
                      )}
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    {product.isFlashSale && product.flashSalePrice ? (
                      <div>
                        <span style={{textDecoration: 'line-through', color: '#999', fontSize: '12px'}}>${product.price}</span>
                        <span style={{color: '#ff4444', fontWeight: 'bold', marginLeft: '8px'}}>${product.flashSalePrice}</span>
                      </div>
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td>{product.availableStock || 0}</td>
                  <td>⭐ {product.rating || 0}</td>
                  <td>{product.isFlashSale ? <span style={{color: '#ff4444', fontWeight: 'bold'}}>⚡ Yes</span> : 'No'}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleEditClick(product)}>✏️</button>
                      <button onClick={() => handleDeleteProduct(product.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h2>✏️ Edit Product</h2>
            
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" name="name" value={editingProduct.name} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={editingProduct.category} onChange={handleEditChange}>
                    <option value="Camera">Camera</option>
                    <option value="Phone">Phone</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Watch">Watch</option>
                    <option value="TV">TV</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food & Beverage</option>
                    <option value="Home">Home & Living</option>
                    <option value="Sports">Sports & Fitness</option>
                    <option value="Books">Books</option>
                    <option value="Toys">Toys & Games</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea name="description" value={editingProduct.description} onChange={handleEditChange} rows="3"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Regular Price ($)</label>
                  <input type="number" name="price" value={editingProduct.price} onChange={handleEditChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Flash Sale Price ($)</label>
                  <input type="number" name="flashSalePrice" value={editingProduct.flashSalePrice || ''} onChange={handleEditChange} step="0.01" />
                </div>
                <div className="form-group">
                  <label>Available Stock</label>
                  <input type="number" name="availableStock" value={editingProduct.availableStock} onChange={handleEditChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Date</label>
                  <input type="text" name="deliveryDate" value={editingProduct.deliveryDate || ''} onChange={handleEditChange} placeholder="25 January 2026" />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isFlashSale" checked={editingProduct.isFlashSale} onChange={handleEditChange} />
                    <span>⚡ Enable Flash Sale</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input type="number" name="rating" value={editingProduct.rating || ''} onChange={handleEditChange} min="0" max="5" step="0.1" />
                </div>
                <div className="form-group">
                  <label>Review Count</label>
                  <input type="number" name="reviewCount" value={editingProduct.reviewCount || ''} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label>Satisfied %</label>
                  <input type="number" name="satisfiedPercentage" value={editingProduct.satisfiedPercentage || ''} onChange={handleEditChange} min="0" max="100" />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSaveEdit}>💾 Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAds;
