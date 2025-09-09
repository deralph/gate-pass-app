// utils/adminUtils.ts
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const createAdminAccount = async (
  email: string, 
  password: string, 
  fullName: string, 
  adminID: string
) => {
  try {
    // Create the admin user account
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: fullName,
    });
    
    // Save admin data to Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      fullName,
      adminID,
      email: email.trim(),
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, message: 'Admin account created successfully' };
  } catch (error: any) {
    console.error('Admin creation error:', error);
    return { success: false, message: error.message };
  }
};

// Function to switch to admin creation screen (for development purposes)
export const enableAdminCreation = async () => {
  // This would typically be a secure function that checks if the current user
  // has super admin privileges before allowing admin creation
  console.log("Admin creation mode enabled");
};