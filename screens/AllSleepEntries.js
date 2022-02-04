import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button
} from 'react-native';
import { convertToAmPm } from '../Util.js';
import tw from 'tailwind-react-native-classnames';
import { auth, database } from '../firebase';

export const AllSleepEntries = () => {
  const [entryList, setEntryList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState({});

  const currentUserId = 'v3fmHEk6CiTxbU5o8M6tFxuawEI3';
  // User Sam ID, delete once component incorporated to main app
  // Grab userId from the firebase auth component

  const userId = auth.currentUser ? auth.currentUser.uid : currentUserId;

  useEffect(() => {
    const entryRef = database.ref(`sleepEntries/${userId}`);
    entryRef.on('value', (snapshot) => {
      const entries = snapshot.val();
      const entryList = [];
      for (let id in entries) {
        entryList.push(entries[id]);
      }
      setEntryList(entryList);
    });
  }, []);

  return (
    <SafeAreaView style={tw`bg-white`}>
      <ScrollView>
        {entryList.map((entry) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedEntry(entry);
            }}
            style={tw`bg-gray-300 rounded drop-shadow-xl my-3 mx-3`}
          >
            <View style={tw`px-6 py-4`}>
              {/* SLEEP ENTRY DATE */}
              <Text style={tw`font-bold text-xl mb-2`}>{`${entry.date.slice(
                5,
                7
              )} / ${entry.date.slice(8, 10)} / ${entry.date.slice(0, 4)}`}</Text>

              {/* SLEEP ENTRY START TIME */}
              <Text style={tw`text-gray-700 text-base`}>{`Sleep Start Time: ${convertToAmPm(
                entry.startTime
              )}`}</Text>

              {/* SLEEP ENTRY END TIME */}
              <Text style={tw`text-gray-700 text-base`}>{`Sleep End Time: ${convertToAmPm(
                entry.endTime
              )}`}</Text>

              {/* SLEEP QUALITY SCORE */}
              <Text style={tw`text-gray-700 text-base`}>Sleep Quality Score: {entry.quality}</Text>
              <Text style={tw`text-gray-700 text-base`}>
                {`Sleep Factor Count: ${entry.entryFactors && Object.keys(entry.entryFactors).length || "0"}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <Modal
          transparent={false}
          animationType='slide'
          visible={modalOpen}
          onRequestClose={() => {
            setModalOpen(false);
          }}
        >
          <Button
            onPress={() => {
              setModalOpen(false);
            }}
          >
            <Text>Back To Entries</Text>
          </Button>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllSleepEntries;
