// components/admin/LogItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  name: string;
  vehicle: string;
  status: string; // accept whatever backend returns (approved/denied/pending)
  time: string;
  date: string;
  onPress: () => void;
};

export default function LogItem({
  name,
  vehicle,
  status,
  time,
  date,
  onPress,
}: Props) {
  const normalized = (status ?? "pending").toString().toLowerCase();
  const display = normalized.charAt(0).toUpperCase() + normalized.slice(1); // "Approved"
  const isApproved = normalized === "approved";
  const isDenied = normalized === "denied";

  const statusColor = isApproved ? "#10B981" : isDenied ? "#EF4444" : "#F59E0B";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-4"
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons
            name={
              isApproved
                ? "checkmark-circle"
                : isDenied
                  ? "close-circle"
                  : "time-outline"
            }
            size={24}
            color={statusColor}
          />
          <Text className="ml-2 text-white font-poppins600 text-2xl">
            {name}
          </Text>
        </View>
        {/* <Text
          className="font-poppins600 text-xl"
          style={{ color: statusColor }}
        >
          {display}
        </Text> */}
      </View>

      <Text className="text-gray-200 text-base font-poppins400 text-xl mt-2 ml-6">
        {vehicle}
      </Text>
      <Text className="text-gray-400 font-poppins400 text-right text-base mt-1">
        {time} · {date}
      </Text>
    </TouchableOpacity>
  );
}
