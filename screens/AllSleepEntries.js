import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";

import { convertToAmPm } from "../Util.js";
import SingleEntry from "./SingleEntry";

export const AllSleepEntries = () => {
  let entryList = useSelector((state) => state.userEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState({});
  //console.log("entryList from allsleepEntries", entryList);

  return (
    <SafeAreaView style={styles.container}>
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
                    style={tw`font-bold text-2xl text-white mb-3`}
                  >{`${entry.date.slice(5, 7)} / ${entry.date.slice(
                    8,
                    10
                  )} / ${entry.date.slice(0, 4)}`}</Text>

                  <View style={styles.accountItem}>
                    <Text
                      style={tw`font-semibold text-white`}
                    >{`Sleep Start Time:          `}</Text>
                    <Text
                      style={tw`font-extrabold text-white`}
                    >{`${convertToAmPm(entry.startTime)}`}</Text>
                  </View>

                  <View style={styles.accountItem}>
                    <Text
                      style={tw`font-semibold text-white`}
                    >{`Sleep End Time:            `}</Text>
                    <Text
                      style={tw`font-extrabold text-white`}
                    >{`${convertToAmPm(entry.endTime)}`}</Text>
                  </View>

                  <View style={styles.accountItem}>
                    <Text
                      style={tw`font-semibold text-white`}
                    >{`Sleep Quality Score:    `}</Text>
                    <Text style={tw`font-extrabold text-white`}>
                      {entry.quality}
                    </Text>
                  </View>

                  <View style={styles.accountItem}>
                    <Text
                      style={tw`font-semibold text-white`}
                    >{`Sleep Factor Count:     `}</Text>
                    <Text style={tw`font-extrabold text-white`}>{`${
                      (entry.entryFactors &&
                        Object.keys(entry.entryFactors).length) ||
                      "0"
                    }`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
            // style={tw`items-center justify-center h-20`}
            style={styles.modal}
            onPress={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Text style={styles.buttonText}>Back To Sleep Entries</Text>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "90%",
    opacity: 0.95,
  },
  accountItem: {
    flexDirection: "row",
    paddingTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  entryCard: {
    backgroundColor: "#1C3F52",
    borderRadius: 15,
    margin: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  modal: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F78A03",
    opacity: 0.95,
  },
});

export default AllSleepEntries;
