import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";

import { convertToAmPm } from "../Util.js";
import SingleEntry from "./SingleEntry";
import { fetchUserEntries } from "../store/userEntries";

export const AllSleepEntries = () => {
  let entryList = useSelector((state) => state.userEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState({});

  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView>
        {entryList.map((entry) => (
          <View key={entry.id}>
            <TouchableOpacity
              onPress={() => {
                setSelectedEntry(entry);
                setModalOpen(!modalOpen);
              }}
              style={tw`bg-gray-300 rounded drop-shadow-xl my-3 mx-3`}
            >
              <View style={tw`px-6 py-4`}>
                {/* SLEEP ENTRY DATE */}
                <Text style={tw`font-bold text-xl mb-2`}>{`${entry.date.slice(
                  5,
                  7
                )} / ${entry.date.slice(8, 10)} / ${entry.date.slice(
                  0,
                  4
                )}`}</Text>

                {/* SLEEP ENTRY START TIME */}
                <Text
                  style={tw`text-gray-700 text-base`}
                >{`Sleep Start Time: ${convertToAmPm(entry.startTime)}`}</Text>

                {/* SLEEP ENTRY END TIME */}
                <Text
                  style={tw`text-gray-700 text-base`}
                >{`Sleep End Time: ${convertToAmPm(entry.endTime)}`}</Text>

                {/* SLEEP QUALITY SCORE */}
                <Text style={tw`text-gray-700 text-base`}>
                  Sleep Quality Score: {entry.quality}
                </Text>
                <Text style={tw`text-gray-700 text-base`}>
                  {`Sleep Factor Count: ${
                    (entry.entryFactors &&
                      Object.keys(entry.entryFactors).length) ||
                    "0"
                  }`}
                </Text>
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
          <Pressable
            style={tw`flex-1 items-center justify-center`}
            onPress={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <Text>Back To Entries</Text>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllSleepEntries;
