import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import SearchInput from "../components/home/SearchInput";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
const Home = () => {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_LINKS_TO_SHOW = 5; // Show 5 links at a time for example
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/inter/Inter-Black.ttf"),
    "Inter-Italic": require("../assets/fonts/inter/Inter-Italic.ttf"),
    "Inter-Regular": require("../assets/fonts/inter/Inter-Regular.ttf"),
    "Inter-ExtraBoldItalic": require("../assets/fonts/inter/Inter-ExtraBoldItalic.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const handleSearchInput = (payload) => {
    setSearch(payload);
  };

  async function fetchTeams(page = 1) {
    setLoading(true);
    try {
      const response = await axios.get("http://169.1.238.73:2000/team", {
        params: {
          query: search,
          page: page,
        },
      });
      setTeams(response.data.clubs);
      setPaginationLinks(response.data.pagination);
      setCurrentPage(1);
      setLoading(false);
      navigation.navigate("View Results", { response });
    } catch (error) {
      console.error("Error fetching teams:", error.message);
    }
  }

  console.log(paginationLinks);
  return (
    <View className="flex-1 bg-black">
      <View className="w-full flex items-center justify-center mt-8 h-fit">
        <AntDesign name="swap" size={80} color="red" />
        <Text className="font-[Inter-Italic] text-white text-4xl">
          Transfer Market
        </Text>
      </View>
      <View className="flex-1 mt-[20%]">
        <SearchInput handleSearchInput={handleSearchInput} />
        <View className="w-full flex items-center justify-center mt-8">
          <TouchableOpacity
            className="w-fit py-2 px-8 rounded-md bg-red-500"
            onPress={() => fetchTeams()}
          >
            <Text className="text-white font-[Inter-Regular] text-xl">
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
