import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { getScanDetails } from "../../../services/scanService";

export default function ViewLogs() {
  const { scanId, name, vehicle, status, time, date } = useLocalSearchParams();
  const [scanDetails, setScanDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (scanId) {
      fetchScanDetails();
    }
  }, [scanId]);

  const fetchScanDetails = async () => {
    try {
      const result = await getScanDetails(scanId as string);
      if (result.success) {
        setScanDetails(result.scan);
      } else {
        console.error('Failed to fetch scan details:', result.message);
      }
    } catch (error) {
      console.error('Error fetching scan details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#34A75E" />
        <Text className="text-white mt-4">Loading log details...</Text>
      </View>
    );
  }

  const isApproved = status === "approved";

  return (
    <View className="flex-1 bg-admin pt-6">
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
            {status?.toString().toUpperCase()}
          </Text>
          <Text className="text-white font-bold font-poppins600 text-2xl mt-3">
            {name}
          </Text>

          <Text className="text-gray-200 text-base font-poppins400 text-xl mt-1">
            {vehicle}
          </Text>
          <Text className="text-gray-400 font-poppins400 text-xl mt-6">
            {time} . {date}
          </Text>
          <Text className="text-gray-400 font-poppins400 text-xl my-2">
            Barcode scan
          </Text>
        </View>
        
        <View className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-8">
          <Text className="text-gray-400 font-poppins400 text-xl mt-1">
            Remarks
          </Text>
          <Text className="text-gray-400 font-poppins400 text-xl my-2">
            {scanDetails?.reason || "No remarks available"}
          </Text>
        </View>
        
        <PrimaryButton
          title="View Vehicle history"
          onPress={() => router.push({
            pathname: "/(admin)/vehicle-history",
            params: { 
              plateNumber: scanDetails?.car?.plateNumber,
              userId: scanDetails?.user?._id
            }
          })}
          className="bg-[#34A75E]"
          admin
        />
      </View>
    </View>
  );
}