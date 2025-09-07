import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import SearchBar from "../../../components/admin/SearchBar";
import LogItem from "../../../components/admin/LogItem";
import { useNavigation,useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const logsData = [
  {
    name: "Wilson Babafemi",
    vehicle: "Toyota corolla (ABC-123)",
    status: "Approved",
    time: "15:34:17",
    date: "03 sept 2025",
  },
  {
    name: "Adisat Yetunde",
    vehicle: "Toyota Camry (DEF-789)",
    status: "Denied",
    time: "15:14:20",
    date: "03 sept 2025",
  },
  {
    name: "Femmy Wills",
    vehicle: "Hyundai sonata (MNO-321)",
    status: "Approved",
    time: "15:04:10",
    date: "03 sept 2025",
  },
  {
    name: "Aluko Favour",
    vehicle: "Lexus RX 350 (IJK-567)",
    status: "Approved",
    time: "14:58:17",
    date: "03 sept 2025",
  },
  {
    name: "Aluko Favour",
    vehicle: "Lexus RX 350 (IJK-567)",
    status: "Approved",
    time: "14:58:17",
    date: "03 sept 2025",
  },
];

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const router = useRouter()
  const navigation = useNavigation();

  const filteredLogs = logsData.filter(
    (log) =>
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-admin pt-6">
      {/* Header */}
      <View className="flex-row items-center px-6 mt-12 pb-2">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text className="ml-4 text-2xl font-poppins600 text-white">
          Access Logs
        </Text>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-white font-poppins600 text-xl">
          Access Logs
        </Text>
        <Text className="text-gray-300 font-poppins400 text-base mt-1">
          Track and review all vehicle entries and exits
        </Text>

        {/* SearchBar */}
        <SearchBar value={search} onChangeText={setSearch} />

        {/* Log List */}
        <View className="mt-5">
          {filteredLogs.map((log, index) => (
            <LogItem
              key={index}
              name={log.name}
              vehicle={log.vehicle}
              status={log.status as "Approved" | "Denied"}
              time={log.time}
              date={log.date}
              onPress={() =>
  router.push({
    pathname: "/(admin)/(logs)/view-log",
    params: {
      name: log.name,
      vehicle: log.vehicle,
      status: log.status,
      time: log.time,
      date: log.date,
    },
  })
}

            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
