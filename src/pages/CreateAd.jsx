import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
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
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, GIF) file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

  const uploadFileToStorage = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `products/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      setUploadProgress(50);

      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploadProgress(100);
      setIsUploading(false);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      alert('Failed to upload image. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !uploadedFile) {
      alert('Please fill in name, category and upload an image');
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
      const imageUrl = await uploadFileToStorage(uploadedFile);

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
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'products'), productData);
      
      alert('Product created successfully!');

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
      });
      setUploadedFile(null);
      setFilePreview(null);
      setUploadProgress(0);

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
        <div className="upload-section">
          <h2>Product Image</h2>
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <>
                <div className="upload-icon">📷</div>
                <p className="upload-text">Drag and drop product image here</p>
                <p className="upload-subtext">or</p>
                <label className="upload-button">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="upload-info">Supported: JPG, PNG, GIF (Max 10MB)</p>
              </>
            ) : (
              <div className="file-preview-container">
                {filePreview && (
                  <div className="file-preview">
                    <img src={filePreview} alt="Preview" />
                  </div>
                )}
                <div className="file-info">
                  <p className="file-name">{uploadedFile.name}</p>
                  <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  {isUploading && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{uploadProgress}%</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

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
                placeholder="Professional mirrorless camera with 45MP sensor, 8K video, and advanced AI autofocus"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Pricing & Stock</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Regular Price * ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter regular price"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Flash Sale Price ($)</label>
              <input
                type="number"
                name="flashSalePrice"
                value={formData.flashSalePrice}
                onChange={handleInputChange}
                placeholder="Enter sale price"
                min="0"
                step="0.01"
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
                placeholder="Enter stock quantity"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Date 📅</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
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
                <span>⚡ Include in Flash Sale</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Reviews & Ratings</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="e.g., 4.8"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Review Count</label>
              <input
                type="number"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleInputChange}
                placeholder="e.g., 178"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Satisfied Percentage (%)</label>
              <input
                type="number"
                name="satisfiedPercentage"
                value={formData.satisfiedPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 96"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAd;
