import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

export default function CarDropdown({ data, onSelect }: { data: any[]; onSelect: (item: any) => void }) {
  const [value, setValue] = useState(null);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Car"
      searchPlaceholder="Search..."
      value={value}
      onChange={(item) => {
        setValue(item.value);
        onSelect(item);
      }}
      renderLeftIcon={() => (
        <Ionicons name="car-sport" size={20} color="#9CA3AF" style={styles.leftIcon} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  placeholder: { 
    color: "#9CA3AF", 
    fontSize: 14,
    fontFamily: 'Poppins400',
  },
  selectedText: { 
    color: "#111827", 
    fontSize: 14, 
    fontFamily: 'Poppins500',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    fontFamily: 'Poppins400',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  leftIcon: {
    marginRight: 8,
  },
});