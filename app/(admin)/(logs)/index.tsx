import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "../../../components/admin/SearchBar";
import LogItem from "../../../components/admin/LogItem";
import { useRouter } from "expo-router";
import Header from "../../../components/Header";
import { getScanHistory } from "../../../services/scanService";

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const result = await getScanHistory(undefined, 50); // Get 50 most recent logs
      if (result.success) {
        setLogs(result.scans);
      } else {
        console.error('Failed to fetch logs:', result.message);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (log.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      log.car?.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      log.car?.model?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#34A75E" />
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
            filteredLogs.map((log) => (
              <LogItem
                key={log._id}
                name={log.user?.fullName || "Unknown User"}
                vehicle={`${log.car?.model || "Unknown"} (${log.car?.plateNumber || "N/A"})`}
                status={log.result || "Pending"}
                time={new Date(log.timestamp).toLocaleTimeString()}
                date={new Date(log.timestamp).toLocaleDateString()}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/(logs)/view-log",
                    params: {
                      scanId: log._id,
                      name: log.user?.fullName,
                      vehicle: `${log.car?.model} (${log.car?.plateNumber})`,
                      status: log.result,
                      time: new Date(log.timestamp).toLocaleTimeString(),
                      date: new Date(log.timestamp).toLocaleDateString(),
                      remarks: log.reason || "No remarks"
                    },
                  })
                }
              />
            ))
          ) : (
            <View className="py-10 items-center">
              <Text className="text-gray-400 text-lg">
                {search ? "No matching logs found" : "No access logs yet"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}