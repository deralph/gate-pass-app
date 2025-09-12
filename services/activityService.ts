import { db, auth } from '../config/firebase';
import { doc, setDoc, collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export const logActivity = async (userId: string, action: string, details: any = {}) => {
  try {
    const activityId = `${userId}_${Date.now()}`;
    const activityData = {
      activityId,
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      // You could add more context like IP address, location, etc.
    };
    
    await setDoc(doc(db, 'activities', activityId), activityData);
    return { success: true };
  } catch (error) {
    console.error('Log activity error:', error);
    return { success: false, error };
  }
};

export const getUserActivities = async (userId: string, limit = 50) => {
  try {
    const activitiesQuery = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(activitiesQuery);
    const activities: any[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, activities };
  } catch (error: any) {
    console.error('Get user activities error:', error);
    return { success: false, error: error.message };
  }
};

export const getAdminActivities = async (limit = 100) => {
  try {
    // Get all activities (admin view)
    const activitiesQuery = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(activitiesQuery);
    const activities: any[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, activities };
  } catch (error: any) {
    console.error('Get admin activities error:', error);
    return { success: false, error: error.message };
  }
};