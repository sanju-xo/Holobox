import { db, storage } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Get all products from Firestore
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    throw error;
  }
};

// Upload product image to Storage
export const uploadProductImage = async (file, productName) => {
  try {
    const timestamp = Date.now();
    const fileName = `${productName}_${timestamp}`;
    const storageRef = ref(storage, `products/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Image uploaded successfully');
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = '';
    
    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile, productData.name);
    }
    
    // Add product to Firestore
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      availableStock: Number(productData.availableStock),
      imageUrl: imageUrl,
      rating: 0,
      reviewCount: 0,
      satisfiedPercentage: 0,
      isFlashSale: false,
      flashSalePrice: 0,
      deliveryDate: productData.deliveryDate || '',
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Product added successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData, imageFile) => {
  try {
    const productRef = doc(db, 'products', productId);
    
    let updateData = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      availableStock: Number(productData.availableStock),
      deliveryDate: productData.deliveryDate || '',
      updatedAt: serverTimestamp()
    };
    
    // Upload new image if provided
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile, productData.name);
      updateData.imageUrl = imageUrl;
    }
    
    await updateDoc(productRef, updateData);
    console.log('✅ Product updated successfully');
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    console.log('✅ Product deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
};

// Update flash sale status
export const updateFlashSaleStatus = async (productId, isFlashSale, flashSalePrice) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      isFlashSale: isFlashSale,
      flashSalePrice: isFlashSale ? Number(flashSalePrice) : 0,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Flash sale status updated');
  } catch (error) {
    console.error('❌ Error updating flash sale:', error);
    throw error;
  }
};
