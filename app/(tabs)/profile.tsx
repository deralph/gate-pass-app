// screens/ProfileScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import Header from "../../components/Header";

export default function ProfileScreen() {
  // store the raw user object (null while loading)
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // local editable fields (start as empty strings so TextInput is controlled)
  const [name, setName] = useState<string>("");
  const [matric, setMatric] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // editing states & image
  const [isEditingName, setIsEditingName] = useState(false);
  const [imageChange, setImageChange] = useState(false);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [photoEdited, setPhotoEdited] = useState(false);

  const nameInputRef = useRef<TextInput | null>(null);
  const router = useRouter();

  // Fetch profile once
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await getUserProfile();
      if (result?.success && result.user) {
        setUser(result.user);
      } else {
        console.error("Failed to fetch profile:", result?.message ?? result);
        Alert.alert("Error", "Failed to fetch profile.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // When `user` is loaded/updated, populate the local fields.
  useEffect(() => {
    if (user) {
      setName(user.fullName ?? "");
      setMatric(user.studentStaffId ?? "");
      setEmail(user.email ?? "");
      // If profilePicture exists and has a URL, use it; else null
      setProfileUri(user.profilePicture?.url ?? null);
      // reset flags
      setImageChange(false);
      setPhotoEdited(false);
    }
  }, [user]);

  // Focus the name input when editing
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  // Request permission for image picker on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        try {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission needed",
              "We need permission to access your photos to change your profile image."
            );
          }
        } catch (e) {
          console.warn("Permission request failed:", e);
        }
      }
    })();
  }, []);

  // pick image from library
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      // expo returns an object with `canceled` boolean and assets array
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri ?? null;
        if (uri) {
          setImageChange(true);
          setProfileUri(uri);
          setPhotoEdited(true);
          setIsEditingName(false);
        }
      }
    } catch (err) {
      console.warn("Error picking image:", err);
      Alert.alert("Error", "Could not pick the image.");
    }
  };

  // Save handler
  const onSaveChanges = async () => {
    // simple validation
    if (!name || name.trim().length === 0) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Update parameters depend on your API. Here we pass both values; adapt if your function signature differs.
      // If imageChange true send the uri as well (updateUserProfile should handle file upload or URI accordingly).
      const payload = { fullName: name };
      if (imageChange && profileUri) {
        // If your updateUserProfile expects (name, uri) keep it; otherwise adapt.
        // For example: result = await updateUserProfile(name, profileUri);
        // Here I'll call updateUserProfile(payload, profileUri) to be explicit — adapt to your implementation.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await updateUserProfile(payload, profileUri);
        if (result?.success && result.user) {
          setUser(result.user);
          Alert.alert("Saved", "Your profile changes have been saved.");
        } else {
          console.error("Failed to update user:", result?.message ?? result);
          Alert.alert("Error", "Failed to save changes.");
        }
      } else {
        // no image change
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await updateUserProfile(payload);
        if (result?.success && result.user) {
          setUser(result.user);
          Alert.alert("Saved", "Your profile changes have been saved.");
        } else {
          console.error("Failed to update user:", result?.message ?? result);
          Alert.alert("Error", "Failed to save changes.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while saving.");
    } finally {
      // reset editing flags (we already updated user and local fields in user effect)
      setIsEditingName(false);
      setPhotoEdited(false);
      setImageChange(false);
      setLoading(false);
    }
  };

  // Decide whether to show save button: name changed from original OR photo edited
  const showSaveButton =
    (user && name !== (user.fullName ?? "")) || photoEdited || imageChange;

  // Simple avatar fallback: render initials if no profileUri
  const renderAvatar = () => {
    if (profileUri) {
      return (
        <Image
          source={{ uri: profileUri }}
          className="w-32 h-32 rounded-full"
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      );
    }
    const initials = (user?.fullName ?? "U")
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#E5E7EB",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 36, color: "#374151" }}>{initials}</Text>
      </View>
    );
  };

  if (loading && !user) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Header title="Profile" subtitle="Edit your profile" />
      <View className="flex-1 bg-white pt-10 px-6">
        {/* Profile picture */}
        <View className="items-center mb-8">
          <Pressable
            onPress={pickImage}
            className="items-center justify-center"
            accessibilityRole="imagebutton"
          >
            {renderAvatar()}
          </Pressable>

          <Pressable onPress={pickImage} className="mt-3">
            <Text className="text-sm text-[#6B7280]">Edit photo</Text>
          </Pressable>
        </View>

        {/* Fields */}
        <View className="space-y-4">
          {/* Name (click to enable) */}
          <Pressable
            onPress={() => {
              setIsEditingName(true);
            }}
            className="rounded-xl bg-[#F1F8FF] px-4 py-4"
          >
            <Text className="text-xs text-[#374151] mb-1">Name</Text>

            <TextInput
              value={name}
              ref={nameInputRef}
              onChangeText={setName}
              editable={isEditingName}
              placeholder="Enter your name"
              className={`text-base ${isEditingName ? "text-[#111827]" : "text-[#374151]"}`}
              caretHidden={!isEditingName}
            />
          </Pressable>

          {/* Matric Number / Staff ID (non-editable) */}
          <View className="rounded-xl bg-[#F1F8FF] px-4 py-4 mt-3">
            <Text className="text-xs text-[#374151] mb-1">
              Matric Number/Staff ID
            </Text>
            <Text className="text-base text-[#374151]">{matric}</Text>
          </View>

          {/* Email (non-editable) */}
          <View className="rounded-xl bg-[#F1F8FF] px-4 py-4 mt-3">
            <Text className="text-xs text-[#374151] mb-1">Email</Text>
            <Text className="text-base text-[#374151]">{email}</Text>
          </View>

          {/* Reset Password row (navigates) */}
          <Pressable
            onPress={() => {
              router.push("/forgot-password");
            }}
            className="rounded-xl bg-[#F1F8FF] px-4 mt-3 py-4"
          >
            <Text className="text-xs text-[#374151] mb-1">Reset Password</Text>
          </Pressable>
        </View>

        {/* Save/Edit button shown when name or photo editable/changed */}
        {showSaveButton && (
          <View className="mt-6">
            <TouchableOpacity
              onPress={onSaveChanges}
              className="bg-[#2563EB] rounded-xl py-3 items-center"
              activeOpacity={0.9}
              disabled={loading}
            >
              <Text className="text-white font-semibold text-base">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-1" />
      </View>
    </>
  );
}
