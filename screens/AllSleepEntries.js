import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet
} from 'react-native';
import { convertToAmPm } from '../Util.js';
import tw from 'tailwind-react-native-classnames';
import { auth, database } from '../firebase';
import SingleEntry from './SingleEntry';

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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {entryList.map((entry) => (
          <View key={entry.id}>
            <TouchableOpacity
              onPress={() => {
                setSelectedEntry(entry);
                setModalOpen(!modalOpen);
              }}
              style={tw`bg-gray-50 rounded drop-shadow-xl my-4 mx-3`}
            >
              <View style={tw`px-6 py-4`}>
                <Text style={tw`font-extrabold text-2xl mb-2 text-gray-900`}>{`${entry.date.slice(
                  5,
                  7
                )} / ${entry.date.slice(8, 10)} / ${entry.date.slice(0, 4)}`}</Text>

                <Text style={tw`text-gray-700 text-base font-extrabold leading-7`}>
                  <Text style={tw`font-semibold`}>{`Sleep Start Time:    `}</Text>
                  {`${convertToAmPm(entry.startTime)}`}
                </Text>

                <Text style={tw`text-gray-700 text-base font-extrabold leading-7 bg-gray-200`}>
                  <Text style={tw`font-semibold`}>{`Sleep End Time:    `}</Text>
                  {`${convertToAmPm(entry.endTime)}`}
                </Text>

                <Text style={tw`text-gray-700 text-base font-extrabold leading-7`}>
                  <Text style={tw`font-semibold`}>{`Sleep Quality Score:    `}</Text>
                  {entry.quality}
                </Text>

                <Text style={tw`text-gray-700 text-base font-extrabold leading-7 bg-gray-200`}>
                  <Text style={tw`font-semibold`}>{`Sleep Factor Count:    `}</Text>
                  {`${(entry.entryFactors && Object.keys(entry.entryFactors).length) || '0'}`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <Modal
          transparent={false}
          animationType='slide'
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C3F52'
  }
});

export default AllSleepEntries;
