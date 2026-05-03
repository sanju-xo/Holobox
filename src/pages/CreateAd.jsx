import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/CreateAd.css';

const CreateAd = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    flashSalePrice: '',
    isFlashSale: false,
    availableStock: '',
    deliveryDate: '',
    rating: '',
    reviewCount: '',
    satisfiedPercentage: '',
    imageUrl: '' // ✅ Image URL added
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.name || !formData.category || !formData.imageUrl) {
      alert('Please fill in name, category and image URL');
      return;
    }

    if (!formData.price || !formData.availableStock) {
      alert('Please fill in price and available stock');
      return;
    }

    if (formData.isFlashSale && !formData.flashSalePrice) {
      alert('Please set flash sale price');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        flashSalePrice: formData.flashSalePrice ? parseFloat(formData.flashSalePrice) : null,
        isFlashSale: formData.isFlashSale,
        availableStock: parseInt(formData.availableStock),
        deliveryDate: formData.deliveryDate,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : 0,
        satisfiedPercentage: formData.satisfiedPercentage ? parseInt(formData.satisfiedPercentage) : 0,
        imageUrl: formData.imageUrl, // ✅ Direct URL stored
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'products'), productData);

      alert('Product created successfully!');

      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        flashSalePrice: '',
        isFlashSale: false,
        availableStock: '',
        deliveryDate: '',
        rating: '',
        reviewCount: '',
        satisfiedPercentage: '',
        imageUrl: ''
      });

    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  return (
    <div className="create-ad-container">
      <div className="create-ad-header">
        <h1>Create New Product</h1>
        <p>Add products to your shopping app</p>
      </div>

      <form onSubmit={handleSubmit} className="create-ad-form">

        {/* ✅ Image URL Section */}
        <div className="form-section">
          <h2>Product Image</h2>

          <div className="form-group full-width">
            <label>Image URL *</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* ✅ Live Preview */}
          {formData.imageUrl && (
            <div className="file-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Canon EOS R5 Mark II"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
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

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2>Pricing & Stock</h2>
          <div className="form-grid">

            <div className="form-group">
              <label>Regular Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Flash Sale Price</label>
              <input
                type="number"
                name="flashSalePrice"
                value={formData.flashSalePrice}
                onChange={handleInputChange}
                disabled={!formData.isFlashSale}
              />
            </div>

            <div className="form-group">
              <label>Available Stock *</label>
              <input
                type="number"
                name="availableStock"
                value={formData.availableStock}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isFlashSale"
                  checked={formData.isFlashSale}
                  onChange={handleInputChange}
                />
                ⚡ Flash Sale
              </label>
            </div>

          </div>
        </div>

        {/* Ratings */}
        <div className="form-section">
          <h2>Reviews & Ratings</h2>
          <div className="form-grid">

            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Review Count</label>
              <input
                type="number"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Satisfaction %</label>
              <input
                type="number"
                name="satisfiedPercentage"
                value={formData.satisfiedPercentage}
                onChange={handleInputChange}
              />
            </div>

          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Create Product
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateAd;