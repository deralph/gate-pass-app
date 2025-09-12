import { db, auth } from '../config/firebase';
import { doc, setDoc, updateDoc, getDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { uploadToStorage } from './storageService';
import { generateQRCodeData, saveQRCode } from './qrCodeService';
import { logActivity } from './activityService';

export const addCar = async (carData: any, carImage: string | null) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Upload car image
    let carImageURL = null;
    if (carImage) {
      carImageURL = await uploadToStorage(carImage, `cars/${user.uid}/${carData.plateNumber}`);
    }
    
    // Generate QR code data
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    const qrCodeData = generateQRCodeData(user.uid, userData?.matric, carData.plateNumber);
    
    // Prepare car data
    const carDocData = {
      ...carData,
      carImageURL,
      qrCodeData,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    // Save car to Firestore
    await Promise.all([
      setDoc(doc(db, 'cars', `${user.uid}_${carData.plateNumber}`), carDocData),
      updateDoc(doc(db, 'userCars', user.uid), {
        cars: arrayUnion({
          plateNumber: carData.plateNumber,
          model: carData.model,
          color: carData.color,
          carImageURL,
          qrCodeData
        })
      })
    ]);
    
    // Save QR code image
    await saveQRCode(user.uid, carData.plateNumber, qrCodeData);
    
    // Log activity
    await logActivity(user.uid, 'car_added', {
      plateNumber: carData.plateNumber,
      model: carData.model
    });
    
    return { success: true, qrCodeData };
  } catch (error: any) {
    console.error('Add car error:', error);
    return { success: false, error: error.message };
  }
};

export const updateCar = async (carId: string, carData: any, carImage: string | null) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Upload new car image if provided
    let carImageURL = carData.carImageURL;
    if (carImage) {
      carImageURL = await uploadToStorage(carImage, `cars/${user.uid}/${carData.plateNumber}`);
    }
    
    // Update car data
    const updatedCarData = {
      ...carData,
      carImageURL,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'cars', carId), updatedCarData);
    
    // Also update in userCars array
    const userCarsDoc = await getDoc(doc(db, 'userCars', user.uid));
    if (userCarsDoc.exists()) {
      const userCars = userCarsDoc.data().cars;
      const updatedCars = userCars.map((car: any) => 
        car.plateNumber === carData.plateNumber ? { ...car, ...carData, carImageURL } : car
      );
      
      await updateDoc(doc(db, 'userCars', user.uid), {
        cars: updatedCars
      });
    }
    
    // Log activity
    await logActivity(user.uid, 'car_updated', {
      plateNumber: carData.plateNumber,
      model: carData.model
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Update car error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserCars = async (userId: string) => {
  try {
    const userCarsDoc = await getDoc(doc(db, 'userCars', userId));
    if (userCarsDoc.exists()) {
      return { success: true, cars: userCarsDoc.data().cars };
    }
    
    // If userCars doesn't exist, try to get from cars collection
    const carsQuery = query(
      collection(db, 'cars'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(carsQuery);
    const cars: any[] = [];
    
    querySnapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    
    // Save to userCars for future reference
    if (cars.length > 0) {
      await setDoc(doc(db, 'userCars', userId), {
        cars: cars.map(car => ({
          plateNumber: car.plateNumber,
          model: car.model,
          color: car.color,
          carImageURL: car.carImageURL,
          qrCodeData: car.qrCodeData
        }))
      });
    }
    
    return { success: true, cars };
  } catch (error: any) {
    console.error('Get user cars error:', error);
    return { success: false, error: error.message };
  }
};

export const regenerateQRCode = async (plateNumber: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    // Generate new QR code data
    const qrCodeData = generateQRCodeData(user.uid, userData?.matric, plateNumber);
    
    // Update in Firestore
    const carId = `${user.uid}_${plateNumber}`;
    await updateDoc(doc(db, 'cars', carId), {
      qrCodeData,
      updatedAt: new Date().toISOString()
    });
    
    // Update in userCars array
    const userCarsDoc = await getDoc(doc(db, 'userCars', user.uid));
    if (userCarsDoc.exists()) {
      const userCars = userCarsDoc.data().cars;
      const updatedCars = userCars.map((car: any) => 
        car.plateNumber === plateNumber ? { ...car, qrCodeData } : car
      );
      
      await updateDoc(doc(db, 'userCars', user.uid), {
        cars: updatedCars
      });
    }
    
    // Save new QR code image
    await saveQRCode(user.uid, plateNumber, qrCodeData);
    
    // Log activity
    await logActivity(user.uid, 'qr_regenerated', {
      plateNumber
    });
    
    return { success: true, qrCodeData };
  } catch (error: any) {
    console.error('Regenerate QR code error:', error);
    return { success: false, error: error.message };
  }
};