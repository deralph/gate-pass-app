import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function CarDropdown({ data, onSelect }: { data: any[]; onSelect: (item: any) => void }) {
  const [value, setValue] = useState(null);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Select Car"
      value={value}
      onChange={(item) => {
        setValue(item.value);
        onSelect(item);
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  placeholder: { color: "#9CA3AF", fontSize: 14 },
  selectedText: { color: "#111827", fontSize: 14, fontWeight: "500" },
});
