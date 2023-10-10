import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons"; // Import the Feather icon set

const SearchInput = ({ handleSearchInput }) => {
  const [searchString, setSearchString] = useState("");
  const passSearchString = (searchText) => {
    setSearchString(searchText);
    handleSearchInput(searchString);
  };
  return (
    <View className="border-b border-b-white p-2 rounded-full flex-row items-center">
      <View className="mr-2">
        <Feather name="search" size={24} color="gray" />
      </View>
      <TextInput
        placeholder="Search for a team..."
        className="flex-1 text-white"
        placeholderTextColor={"white"}
        value={searchString}
        onChangeText={(searchText) => passSearchString(searchText)}
      />
    </View>
  );
};

export default SearchInput;
