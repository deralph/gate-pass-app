import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { logActivity } from './activityService';

export const processScan = async (qrCodeData: string, adminId: string) => {
  try {
    // Parse QR code data
    const dataParts = qrCodeData.split('|');
    const data: any = {};
    
    dataParts.forEach(part => {
      const [key, value] = part.split(':');
      data[key] = value;
    });
    
    const userId = data.USER;
    const plateNumber = data.CAR;
    
    // Get user and car data
    const [userDoc, carDoc] = await Promise.all([
      getDoc(doc(db, 'users', userId)),
      getDoc(doc(db, 'cars', `${userId}_${plateNumber}`))
    ]);
    
    if (!userDoc.exists() || !carDoc.exists()) {
      return { 
        success: false, 
        error: 'Invalid QR code: User or car not found',
        isValid: false
      };
    }
    
    const userData = userDoc.data();
    const carData = carDoc.data();
    
    // Check if user is currently in or out
    const lastScanDoc = await getDoc(doc(db, 'scans', `${userId}_${plateNumber}_last`));
    let isCurrentlyIn = false;
    let scanId = null;
    
    if (lastScanDoc.exists()) {
      isCurrentlyIn = lastScanDoc.data().type === 'in';
      scanId = lastScanDoc.data().scanId;
    }
    
    // Determine scan type
    const scanType = isCurrentlyIn ? 'out' : 'in';
    
    // Create scan record
    const newScanId = `${userId}_${plateNumber}_${Date.now()}`;
    const scanData = {
      scanId: newScanId,
      userId,
      plateNumber,
      adminId,
      type: scanType,
      timestamp: new Date().toISOString(),
      userData: {
        fullName: userData.fullName,
        matric: userData.matric,
        email: userData.email
      },
      carData: {
        model: carData.model,
        color: carData.color
      },
      isValid: true
    };
    
    // Save scan record
    await Promise.all([
      setDoc(doc(db, 'scans', newScanId), scanData),
      setDoc(doc(db, 'scans', `${userId}_${plateNumber}_last`), {
        scanId: newScanId,
        type: scanType,
        timestamp: new Date().toISOString()
      })
    ]);
    
    // Update car status
    await updateDoc(doc(db, 'cars', `${userId}_${plateNumber}`), {
      lastScan: new Date().toISOString(),
      isIn: scanType === 'in'
    });
    
    // Log activity
    await logActivity(userId, `scan_${scanType}`, {
      plateNumber,
      adminId,
      scanId: newScanId
    });
    
    await logActivity(adminId, `processed_scan_${scanType}`, {
      userId,
      plateNumber,
      scanId: newScanId
    });
    
    return { 
      success: true, 
      scanData,
      userData,
      carData,
      isCurrentlyIn: !isCurrentlyIn // Return new status
    };
  } catch (error: any) {
    console.error('Process scan error:', error);
    return { success: false, error: error.message };
  }
};

export const getScanHistory = async (userId: string, limit = 20) => {
  try {
    // This would require a composite index in Firestore
    // For now, we'll get all scans and filter client-side
    // In a real app, you'd use a proper query with indexing
    const scansQuery = query(
      collection(db, 'scans'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(scansQuery);
    const scans: any[] = [];
    
    querySnapshot.forEach((doc) => {
      scans.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, scans };
  } catch (error: any) {
    console.error('Get scan history error:', error);
    return { success: false, error: error.message };
  }
};