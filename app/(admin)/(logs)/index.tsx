import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "../../../components/admin/SearchBar";
import LogItem from "../../../components/admin/LogItem";
import { useRouter } from "expo-router";
import Header from "../../../components/Header";
import { db } from "../../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsQuery = query(
          collection(db, 'scans'),
          orderBy('timestamp', 'desc'),
          where('isValid', '==', true) // Only show valid scans
        );
        
        const querySnapshot = await getDocs(logsQuery);
        const logsData: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          logsData.push({
            id: doc.id,
            name: data.userData?.fullName || 'Unknown',
            vehicle: `${data.carData?.model || 'Vehicle'} (${data.plateNumber})`,
            status: data.result === 'approved' ? 'Approved' : 'Denied',
            time: new Date(data.timestamp).toLocaleTimeString(),
            date: new Date(data.timestamp).toLocaleDateString(),
            rawData: data
          });
        });
        
        setLogs(logsData);
        setFilteredLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = logs.filter(
        (log) =>
          log.name.toLowerCase().includes(search.toLowerCase()) ||
          log.vehicle.toLowerCase().includes(search.toLowerCase()) ||
          log.rawData.plateNumber.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [search, logs]);

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading access logs...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin pt-6">
      {/* Header */}
      <Header title="Access Logs" admin />
 
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
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <LogItem
                key={index}
                name={log.name}
                vehicle={log.vehicle}
                status={log.status}
                time={log.time}
                date={log.date}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/view-log",
                    params: {
                      id: log.id,
                      name: log.name,
                      vehicle: log.vehicle,
                      status: log.status,
                      time: log.time,
                      date: log.date,
                    },
                  })
                }
              />
            ))
          ) : (
            <View className="py-10 items-center">
              <Text className="text-gray-400">No access logs found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}