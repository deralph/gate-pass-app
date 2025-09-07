import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PrimaryButton from "../../../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ViewLogs() {
const { name, vehicle, status, time, date } = useLocalSearchParams();


  const isApproved = status === "Approved";

  return (<View className="flex-1 bg-admin pt-6">
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
<View className="p-6">
    <View className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-6">
          
        <Text
          className={`font-poppins600 text-xl`}
          style={{ color: isApproved ? "#10B981" : "#EF4444" }}
        >
          {status}
        </Text>
          <Text className=" text-white font-bold font-poppins600 text-2xl mt-3">
            {name}
          </Text>

      <Text className="text-gray-200 text-base font-poppins400 text-xl mt-1 ">
        {vehicle}
      </Text>
      <Text className="text-gray-400 font-poppins400  text-xl mt-6">
        {time} . {date}
      </Text>
      <Text className="text-gray-400 font-poppins400  text-xl my-2">
        Barcode scan
      </Text>
    </View>
    <View className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-8">
      <Text className="text-gray-400 font-poppins400  text-xl mt-1">
        Remarks
      </Text>
      <Text className="text-gray-400 font-poppins400  text-xl my-2">
        Entry sucessful
      </Text>
      </View>
         <PrimaryButton
            title="View Vehicle history"
            // onPress={handleLogin}
            onPress={()=> router.push('/(admin)')}
             className="bg-[#34A75E]" admin
          />
      </View>
      </View>
    
  );
}
