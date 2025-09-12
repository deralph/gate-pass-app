import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { db } from "../../config/firebase";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Search users by name, ID, or email
      const usersQuery = query(
        collection(db, 'users'),
        or(
          where('fullName', '>=', searchTerm),
          where('fullName', '<=', searchTerm + '\uf8ff'),
          where('matric', '==', searchTerm),
          where('email', '==', searchTerm)
        )
      );
      
      // Search cars by plate number
      const carsQuery = query(
        collection(db, 'cars'),
        where('plateNumber', '>=', searchTerm.toUpperCase()),
        where('plateNumber', '<=', searchTerm.toUpperCase() + '\uf8ff')
      );
      
      const [usersSnapshot, carsSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(carsQuery)
      ]);
      
      const searchResults: any[] = [];
      
      // Process user results
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        searchResults.push({
          id: doc.id,
          type: 'user',
          name: data.fullName,
          detail: data.matric || data.email,
          image: data.profileURL
        });
      });
      
      // Process car results
      carsSnapshot.forEach((doc) => {
        const data = doc.data();
        searchResults.push({
          id: doc.id,
          type: 'car',
          name: data.model,
          detail: data.plateNumber,
          image: data.carImageURL
        });
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-admin">
      <Header title="Search" admin />
      
      <View className="p-4">
        <View className="flex-row items-center bg-green-700/30 border border-green-600 rounded-xl px-4 py-3">
          <TextInput
            placeholder="Search by name, ID, plate number, or email"
            placeholderTextColor="#D1D5DB"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="ml-2 flex-1 text-white font-poppins400 text-xl"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <FontAwesome5 name="search" size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="py-6 items-center">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Searching...</Text>
          </View>
        )}

        <ScrollView className="mt-4">
          {results.length > 0 ? (
            results.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-xl p-4 mb-3"
                onPress={() => {
                  if (item.type === 'user') {
                    router.push({
                      pathname: "/(admin)/user-details",
                      params: { userId: item.id }
                    });
                  } else {
                    router.push({
                      pathname: "/(admin)/vehicle-details",
                      params: { carId: item.id }
                    });
                  }
                }}
              >
                <View className="flex-row items-center">
                  {item.image ? (
                    <Image 
                      source={{ uri: item.image }} 
                      className="w-12 h-12 rounded-full mr-3" 
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-green-700 justify-center items-center mr-3">
                      <FontAwesome5 
                        name={item.type === 'user' ? 'user' : 'car'} 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                  )}
                  
                  <View className="flex-1">
                    <Text className="text-white font-poppins600 text-lg">
                      {item.name}
                    </Text>
                    <Text className="text-gray-300">
                      {item.detail}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1 capitalize">
                      {item.type}
                    </Text>
                  </View>
                  
                  <FontAwesome5 name="chevron-right" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            !loading && (
              <View className="py-10 items-center">
                <FontAwesome5 name="search" size={32} color="#6B7280" />
                <Text className="text-gray-400 mt-4">
                  {searchTerm ? "No results found" : "Enter a search term to begin"}
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}