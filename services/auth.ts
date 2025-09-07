import { authService, db } from "../config/firebase";

// Sign up function
export const signUp = async (userData, carData, profilePicture, carPicture) => {
  try {
    // 1. Create user with email and password
    const userCredential = await authService.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    const userId = userCredential.user.uid;

    // 2. Upload profile picture to Firebase Storage
    const profilePicRef = storageService.ref(`profilePictures/${userId}`);
    await profilePicRef.put(profilePicture);
    const profilePictureUrl = await profilePicRef.getDownloadURL();

    // 3. Upload car picture to Firebase Storage
    const carPicRef = storageService.ref(
      `carPictures/${userId}/${carData.plateNumber}`
    );
    await carPicRef.put(carPicture);
    const carPictureUrl = await carPicRef.getDownloadURL();

    // 4. Create user document in Firestore
    await db.collection("users").doc(userId).set({
      fullName: userData.fullName,
      studentStaffId: userData.studentStaffId,
      email: userData.email,
      role: userData.role,
      profilePictureUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    // 5. Add car to user's cars subcollection
    const carRef = await db
      .collection("users")
      .doc(userId)
      .collection("cars")
      .add({
        plateNumber: carData.plateNumber.toUpperCase().replace(/\s/g, ""),
        model: carData.model,
        color: carData.color,
        carPictureUrl,
        barcodeData: `USER:${userData.studentStaffId}|CAR:${carData.plateNumber}`,
        isActive: true,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, userId };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message };
  }
};

// Sign in function
export const signIn = async (studentStaffId, password) => {
  try {
    // You'll need to get the email associated with this studentStaffId
    // This might require a query to find the user with this ID
    const usersQuery = await db
      .collection("users")
      .where("studentStaffId", "==", studentStaffId)
      .limit(1)
      .get();

    if (usersQuery.empty) {
      return { success: false, error: "User not found" };
    }

    const userDoc = usersQuery.docs[0];
    const userData = userDoc.data();

    // Sign in with email and password
    const userCredential = await authService.signInWithEmailAndPassword(
      userData.email,
      password
    );

    return { success: true, userId: userCredential.user.uid };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message };
  }
};
