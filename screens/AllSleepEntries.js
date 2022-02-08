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
      <ScrollView style={styles.cardContainer}>
        {entryList.map((entry) => (
          <View key={entry.id}>
            <TouchableOpacity
              onPress={() => {
                setSelectedEntry(entry);
                setModalOpen(!modalOpen);
              }}
              style={styles.entryCard}
            >
              <View style={tw`px-6 py-4`}>
                <Text style={tw`font-bold text-2xl text-white mb-3`}>{`${entry.date.slice(
                  5,
                  7
                )} / ${entry.date.slice(8, 10)} / ${entry.date.slice(0, 4)}`}</Text>

                <View style={styles.accountItem}>
                  <Text style={tw`font-semibold text-white`}>{`Sleep Start Time:          `}</Text>
                  <Text style={tw`font-extrabold text-white`}>{`${convertToAmPm(
                    entry.startTime
                  )}`}</Text>
                </View>

                <View style={styles.accountItem}>
                  <Text style={tw`font-semibold text-white`}>{`Sleep End Time:            `}</Text>
                  <Text style={tw`font-extrabold text-white`}>{`${convertToAmPm(
                    entry.endTime
                  )}`}</Text>
                </View>

                <View style={styles.accountItem}>
                  <Text style={tw`font-semibold text-white`}>{`Sleep Quality Score:    `}</Text>
                  <Text style={tw`font-extrabold text-white`}>{entry.quality}</Text>
                </View>

                <View style={styles.accountItem}>
                  <Text style={tw`font-semibold text-white`}>{`Sleep Factor Count:     `}</Text>
                  <Text style={tw`font-extrabold text-white`}>{`${
                    (entry.entryFactors && Object.keys(entry.entryFactors).length) || '0'
                  }`}</Text>
                </View>
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
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    width: '90%',
    opacity: 0.95
  },
  accountItem: {
    flexDirection: 'row',
    paddingTop: 10
  },
  entryCard: {
    backgroundColor: '#1C3F52',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 5
  }
});

export default AllSleepEntries;
