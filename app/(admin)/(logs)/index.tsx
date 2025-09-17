// screens/(admin)/(logs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import SearchBar from "../../../components/admin/SearchBar";
import LogItem from "../../../components/admin/LogItem";
import { useRouter } from "expo-router";
import Header from "../../../components/Header";
import { getScanHistory } from "../../../services/scanService";

type RawLog = {
  _id: string;
  userId?: { _id: string; fullName?: string; email?: string };
  carId?: { _id: string; model?: string; plateNumber?: string };
  status?: string; // e.g. "approved", "denied"
  timestamp?: string;
  [k: string]: any;
};

export default function AccessLogs() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<RawLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const result = await getScanHistory(undefined, 50); // your service call
      // handle both shapes: result.scans (array) or result (array)
      const scans = Array.isArray(result?.scans)
        ? result.scans
        : (result?.scans ?? []);
      setLogs(scans);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const matchesSearch = (log: RawLog, q: string) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    const userName = log.userId?.fullName ?? "";
    const plate = log.carId?.plateNumber ?? "";
    const model = log.carId?.model ?? "";
    return (
      userName.toLowerCase().includes(s) ||
      plate.toLowerCase().includes(s) ||
      model.toLowerCase().includes(s)
    );
  };

  const filteredLogs = logs.filter((log) => matchesSearch(log, search));

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
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-white font-poppins600 text-xl">Access Logs</Text>
        <Text className="text-gray-300 font-poppins400 text-base mt-1">
          Track and review all vehicle entries and exits
        </Text>

        {/* SearchBar */}
        <SearchBar value={search} onChangeText={setSearch} />

        {/* Log List */}
        <View className="mt-5">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const name = log.userId?.fullName ?? "Unknown User";
              const vehicle = `${log.carId?.model ?? "Unknown"} (${log.carId?.plateNumber ?? "N/A"})`;
              const status = log.status ?? "pending";

              return (
                <LogItem
                  key={log._id}
                  name={name}
                  vehicle={vehicle}
                  status={status}
                  time={
                    log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString()
                      : ""
                  }
                  date={
                    log.timestamp
                      ? new Date(log.timestamp).toLocaleDateString()
                      : ""
                  }
                  onPress={() =>
                    router.push({
                      pathname: "/(admin)/(logs)/view-log",
                      params: {
                        scanId: log._id,
                        name,
                        vehicle,
                        status,
                        time: log.timestamp
                          ? new Date(log.timestamp).toLocaleTimeString()
                          : "",
                        date: log.timestamp
                          ? new Date(log.timestamp).toLocaleDateString()
                          : "",
                        remarks: log.reason ?? "No remarks",
                      },
                    })
                  }
                />
              );
            })
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
