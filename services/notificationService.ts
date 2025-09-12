// services/notificationService.ts
import { db, auth } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  updateDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

// Types for notifications
export interface Notification {
  id?: string;
  userId: string;
  type: 'access_denied' | 'vehicle_usage' | 'system' | 'security_alert' | 'qr_regenerated';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date | Timestamp;
}

// Send a notification to a user
export const sendNotification = async (
  userId: string, 
  type: Notification['type'], 
  title: string,
  message: string,
  data?: any
) => {
  try {
    const notificationData = {
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    
    return { 
      success: true, 
      id: docRef.id 
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

// Get all notifications for the current user
export const getUserNotifications = async (userId: string, limit = 20) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    const notifications: Notification[] = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      } as Notification);
    });
    
    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error };
  }
};

// Mark a notification as read
export const markAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId: string) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    const updatePromises: Promise<void>[] = [];
    
    querySnapshot.forEach((doc) => {
      updatePromises.push(updateDoc(doc.ref, { read: true }));
    });
    
    await Promise.all(updatePromises);
    
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error };
  }
};

// Get unread notifications count
export const getUnreadCount = async (userId: string) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return { success: false, error };
  }
};

// Real-time listener for notifications
export const listenForNotifications = (
  userId: string, 
  callback: (notifications: Notification[]) => void
) => {
  const notificationsQuery = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(notificationsQuery, (querySnapshot) => {
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      } as Notification);
    });
    callback(notifications);
  });
};