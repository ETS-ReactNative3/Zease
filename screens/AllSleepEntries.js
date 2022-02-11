import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { convertToAmPm } from "../Util.js";
import SingleEntry from "./SingleEntry";

export const AllSleepEntries = () => {
  let entryList = useSelector((state) => state.userEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState({});

  if (entryList.length < 1) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={tw`text-gray-700 text-2xl font-bold p-10 text-center`}>
            Come back here once you've added your first sleep entry!
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.cardContainer}>
        {entryList
          .sort((entry1, entry2) => (entry1.date < entry2.date ? 1 : -1))
          .map((entry) => (
            <View key={entry.id}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedEntry(entry);
                  setModalOpen(!modalOpen);
                }}
                style={styles.entryCard}
              >
                <View style={tw`px-6 py-4`}>
                  <Text
                    style={tw`font-bold text-2xl text-white mb-2 text-center`}
                  >{`${entry.date.slice(5, 7)} / ${entry.date.slice(8, 10)} / ${entry.date.slice(
                    0,
                    4
                  )}`}</Text>

                  <View style={styles.accountItem}>
                    <View style={styles.header}>
                      <Text style={tw`font-semibold text-white`}>{`Sleep Start Time:`}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={tw`font-bold text-white`}>{`${convertToAmPm(
                        entry.startTime
                      )}`}</Text>
                    </View>
                  </View>

                  <View style={styles.accountItem}>
                    <View style={styles.header}>
                      <Text style={tw`font-semibold text-white`}>{`Sleep End Time:`}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={tw`font-bold text-white`}>{`${convertToAmPm(
                        entry.endTime
                      )}`}</Text>
                    </View>
                  </View>

                  <View style={styles.accountItem}>
                    <View style={styles.header}>
                      <Text style={tw`font-semibold text-white`}>{`Sleep Quality Score:`}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={tw`font-bold text-white`}>{entry.quality}</Text>
                    </View>
                  </View>

                  <View style={styles.accountItem}>
                    <View style={styles.header}>
                      <Text style={tw`font-semibold text-white`}>{`Sleep Factor Count:`}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text style={tw`font-bold text-white`}>{`${
                        (entry.entryFactors && Object.keys(entry.entryFactors).length) || "0"
                      }`}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <StatusBar style="light" />
            </View>
          ))}
        <Modal
          transparent={false}
          animationType="slide"
          visible={modalOpen}
          onRequestClose={() => {
            setModalOpen(!modalOpen);
          }}
        >
          <SingleEntry entry={selectedEntry} />
          <TouchableOpacity
            style={styles.modal}
            onPress={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Text style={styles.buttonText}>Back To Sleep Entries</Text>
          </TouchableOpacity>
        </Modal>
        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95
  },
  cardContainer: {
    width: "100%",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  accountItem: {
    flexDirection: "row",
    paddingTop: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18
  },
  entryCard: {
    backgroundColor: "#1C3F52",
    borderRadius: 15,
    margin: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 5
  },
  header: {
    flex: 4
  },
  item: {
    flex: 3
  },
  modal: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F78A03",
    opacity: 0.95
  }
});

export default AllSleepEntries;
