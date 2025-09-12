import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadToStorage } from './storageService';
import { generateQRCodeData, saveQRCode } from './qrCodeService';
import { logActivity } from './activityService';

// Set persistence
setPersistence(auth, browserLocalPersistence);

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: any, 
  carData: any,
  profileImage: string | null,
  carImage: string | null
) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Upload images
    let profileURL = null;
    let carImageURL = null;
    
    if (profileImage) {
      profileURL = await uploadToStorage(profileImage, `profiles/${user.uid}`);
    }
    
    if (carImage) {
      carImageURL = await uploadToStorage(carImage, `cars/${user.uid}/${carData.plateNumber}`);
    }
    
    // Update user profile
    if (profileURL) {
      await updateProfile(user, {
        displayName: userData.fullName,
        photoURL: profileURL
      });
    }
    
    // Prepare user data for Firestore
    const userDocData = {
      uid: user.uid,
      ...userData,
      profileURL,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Prepare car data for Firestore
    const carDocData = {
      ...carData,
      carImageURL,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    // Generate QR code data
    const qrCodeData = generateQRCodeData(user.uid, userData.matric, carData.plateNumber);
    carDocData.qrCodeData = qrCodeData;
    
    // Save to Firestore in a transaction
    await Promise.all([
      setDoc(doc(db, 'users', user.uid), userDocData),
      setDoc(doc(db, 'cars', `${user.uid}_${carData.plateNumber}`), carDocData),
      setDoc(doc(db, 'userCars', user.uid), {
        cars: [{
          plateNumber: carData.plateNumber,
          model: carData.model,
          color: carData.color,
          carImageURL,
          qrCodeData
        }]
      }, { merge: true })
    ]);
    
    // Save QR code (if you want to store the image)
    await saveQRCode(user.uid, carData.plateNumber, qrCodeData);
    
    // Log activity
    await logActivity(user.uid, 'user_signup', {
      userId: user.uid,
      email: user.email,
      matric: userData.matric
    });
    
    return { success: true, user, qrCodeData };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Log activity
    await logActivity(user.uid, 'user_login', {
      userId: user.uid,
      email: user.email
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

export const signInAdmin = async (adminId: string, password: string) => {
  try {
    // For admin, we'll check custom claims or a separate admin collection
    const userCredential = await signInWithEmailAndPassword(auth, adminId, password);
    const user = userCredential.user;
    
    // Verify if user is admin
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
      await auth.signOut();
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }
    
    // Log activity
    await logActivity(user.uid, 'admin_login', {
      userId: user.uid,
      email: user.email
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    // Log activity (we don't have userId here, so we log by email)
    await logActivity('system', 'password_reset_request', {
      email
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

export const createAdminAccount = async (email: string, password: string, adminData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: adminData.fullName
    });
    
    // Save admin data with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      ...adminData,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Log activity
    await logActivity(user.uid, 'admin_created', {
      adminId: user.uid,
      email: user.email,
      createdBy: auth.currentUser?.uid || 'system'
    });
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Create admin error:', error);
    return { success: false, error: error.message };
  }
};