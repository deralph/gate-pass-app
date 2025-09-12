import { db } from '../config/firebase';
import { doc, setDoc, updateDoc, getDoc,arrayUnion } from 'firebase/firestore';
import { logActivity } from './activityService';
import { sendNotification } from './notificationService';


export const handleAccessDenied = async (userId: string, plateNumber: string, adminId: string, reason = "Driver mismatch detected") => {
  try {
    // Send notification to user
    await sendNotification(
      userId,
      'access_denied',
      'Access Denied',
      `Your vehicle ${plateNumber} was denied access at the gate. Reason: ${reason}`,
      {
        plateNumber,
        timestamp: new Date().toISOString(),
        adminId,
        reason
      }
    );
    
    // Log security alert for suspicious activity
    await sendNotification(
      userId,
      'security_alert',
      'Security Alert',
      `Suspicious activity detected with your vehicle ${plateNumber}. If this wasn't you, please contact security.`,
      {
        plateNumber,
        timestamp: new Date().toISOString(),
        adminId,
        type: 'unauthorized_attempt'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error handling access denied:', error);
    return { success: false, error };
  }
};

export const handleVehicleUsageAlert = async (userId: string, plateNumber: string, scanData: any) => {
  try {
    // Send notification about vehicle usage
    await sendNotification(
      userId,
      'vehicle_usage',
      'Vehicle Access',
      `Your vehicle ${plateNumber} was used at the gate at ${new Date(scanData.timestamp).toLocaleTimeString()}`,
      {
        plateNumber,
        timestamp: scanData.timestamp,
        type: scanData.type,
        location: 'AAUA Main Gate'
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error sending vehicle usage alert:', error);
    return { success: false, error };
  }
};
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


// export const processScan = async (qrCodeData: string, adminId: string) => {
//   try {
//     // Parse QR code data (format: USER:userId|ID:userIdentifier|CAR:plateNumber|TIMESTAMP:timestamp)
//     const dataParts = qrCodeData.split('|');
//     const data: any = {};
    
//     dataParts.forEach(part => {
//       const [key, value] = part.split(':');
//       data[key] = value;
//     });
    
//     const userId = data.USER;
//     const userIdentifier = data.ID;
//     const plateNumber = data.CAR;
    
//     if (!userId || !plateNumber) {
//       return { success: false, error: 'Invalid QR code format' };
//     }
    
//     // Get user and car data
//     const [userDoc, carDoc] = await Promise.all([
//       getDoc(doc(db, 'users', userId)),
//       getDoc(doc(db, 'cars', `${userId}_${plateNumber}`))
//     ]);
    
//     if (!userDoc.exists() || !carDoc.exists()) {
//       return { 
//         success: false, 
//         error: 'Invalid QR code: User or vehicle not found' 
//       };
//     }
    
//     const userData = userDoc.data();
//     const carData = carDoc.data();
    
//     // Check if user is currently in or out
//     const lastScanDoc = await getDoc(doc(db, 'scans', `${userId}_${plateNumber}_last`));
//     let isCurrentlyIn = false;
    
//     if (lastScanDoc.exists()) {
//       isCurrentlyIn = lastScanDoc.data().type === 'in';
//     }
    
//     // Determine scan type
//     const scanType = isCurrentlyIn ? 'out' : 'in';
    
//     // Create scan record
//     const scanId = `${userId}_${plateNumber}_${Date.now()}`;
//     const scanData = {
//       scanId,
//       userId,
//       plateNumber,
//       adminId,
//       type: scanType,
//       result: 'pending',
//       timestamp: new Date().toISOString(),
//       userData: {
//         fullName: userData.fullName,
//         matric: userData.matric,
//         email: userData.email
//       },
//       carData: {
//         model: carData.model,
//         color: carData.color
//       },
//       rawData: qrCodeData,
//       isValid: true
//     };
    
//     // Save scan record (we'll update the result later when admin approves/rejects)
//     await updateDoc(doc(db, 'scans', scanId), scanData);
    
//     return { 
//       success: true, 
//       scanData,
//       userData,
//       carData,
//       isCurrentlyIn
//     };
//   } catch (error: any) {
//     console.error('Process scan error:', error);
//     return { success: false, error: error.message };
//   }
// };

export const updateScanResult = async (scanId: string, result: 'approved' | 'denied', reason?: string) => {
  try {
    await updateDoc(doc(db, 'scans', scanId), {
      result,
      reason,
      processedAt: new Date().toISOString()
    });
    
    // Update last scan record
    const scanDoc = await getDoc(doc(db, 'scans', scanId));
    const scanData = scanDoc.data();
    
    if (scanData) {
      await updateDoc(doc(db, 'scans', `${scanData.userId}_${scanData.plateNumber}_last`), {
        scanId,
        type: result === 'approved' ? scanData.type : 'denied',
        timestamp: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Update scan result error:', error);
    return { success: false, error: error.message };
  }
};