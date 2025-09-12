import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function ViewLogs() {
  const { id, name, vehicle, status, time, date } = useLocalSearchParams();
  const [logDetails, setLogDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (id) {
        try {
          const logDoc = await getDoc(doc(db, 'scans', id as string));
          if (logDoc.exists()) {
            setLogDetails(logDoc.data());
          }
        } catch (error) {
          console.error("Error fetching log details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchLogDetails();
  }, [id]);

  const isApproved = status === "Approved";

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading log details...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-admin">
      <View className="flex-row items-center px-6 mt-12 pb-2">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => router.back()}
        />
        <Text className="ml-4 text-2xl font-poppins600 text-white">
          Access Log Details
        </Text>
      </View>

      <View className="p-6">
        <View className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-6">
          <Text
            className={`font-poppins600 text-xl`}
            style={{ color: isApproved ? "#10B981" : "#EF4444" }}
          >
            {status}
          </Text>
          <Text className="text-white font-bold font-poppins600 text-2xl mt-3">
            {name || "Unknown User"}
          </Text>

          <Text className="text-gray-200 text-base font-poppins400 text-xl mt-1">
            {vehicle || "Unknown Vehicle"}
          </Text>
          
          {logDetails && (
            <>
              <Text className="text-gray-400 font-poppins400 text-xl mt-6">
                Scan Time: {time}
              </Text>
              <Text className="text-gray-400 font-poppins400 text-xl my-2">
                Date: {date}
              </Text>
              <Text className="text-gray-400 font-poppins400 text-xl my-2">
                Plate Number: {logDetails.plateNumber}
              </Text>
              <Text className="text-gray-400 font-poppins400 text-xl my-2">
                Processed By: {logDetails.adminId?.substring(0, 8)}...
              </Text>
            </>
          )}
        </View>
        
        <View className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-8">
          <Text className="text-gray-400 font-poppins400 text-xl mt-1">
            Remarks
          </Text>
          <Text className="text-gray-400 font-poppins400 text-xl my-2">
            {isApproved ? "Entry successful" : "Entry denied - Driver mismatch"}
          </Text>
        </View>
        
        <PrimaryButton
          title="View Vehicle History"
          onPress={() => router.push({
            pathname: "/(admin)/vehicle-history",
            params: { plateNumber: logDetails?.plateNumber }
          })}
          className="bg-[#34A75E]"
          admin
        />
      </View>
    </ScrollView>
  );
}