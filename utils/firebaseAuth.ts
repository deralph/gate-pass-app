// utils/firebaseAuth.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';

// Types
export interface CarData {
  plate: string;
  model: string;
  color: string;
  carURL?: string;
}

export interface UserData {
  uid: string;
  fullName: string;
  matric: string;
  email: string;
  profileURL?: string;
  car: CarData;
  createdAt: string;
  role?: 'user' | 'admin';
}

// Image Picker Function
export const pickImage = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

// Image Upload Function
export const uploadToStorage = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `${path}/${filename}_${Date.now()}`);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// User Sign Up Function
export const handleUserSignUp = async (
  email: string, 
  password: string, 
  fullName: string, 
  matric: string,
  carData: CarData,
  profileUri?: string,
  carUri?: string
): Promise<User> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    
    // Upload images if provided
    let profileURL = undefined;
    let carURL = undefined;
    
    if (profileUri) {
      profileURL = await uploadToStorage(profileUri, 'profiles');
    }
    
    if (carUri) {
      carURL = await uploadToStorage(carUri, 'cars');
    }
    
    // Update user profile
    if (profileURL) {
      await updateProfile(user, {
        displayName: fullName,
        photoURL: profileURL,
      });
    }
    
    // Save user data to Firestore
    const userData: UserData = {
      uid: user.uid,
      fullName,
      matric,
      email: email.trim(),
      profileURL,
      car: {
        ...carData,
        carURL
      },
      createdAt: new Date().toISOString(),
      role: 'user'
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    // Also save car data to a separate subcollection for easier querying
    await setDoc(doc(db, 'users', user.uid, 'cars', carData.plate), {
      ...carData,
      carURL,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

// User Sign In Function
export const handleUserSignIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Admin Sign In Function
export const handleAdminSignIn = async (adminID: string, password: string): Promise<User> => {
  try {
    // First try to sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, adminID.trim(), password);
    const user = userCredential.user;
    
    // Check if user has admin privileges
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
      await auth.signOut(); // Sign out if not admin
      throw new Error('Access denied. Admin privileges required.');
    }
    
    return user;
  } catch (error: any) {
    console.error('Admin login error:', error);
    throw new Error(error.message || 'Failed to sign in as admin');
  }
};

// Password Reset Function
export const handlePasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() && userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};