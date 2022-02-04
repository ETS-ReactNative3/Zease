import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { database } from '../firebase';

export const AllSleepEntries = () => {
  const [entryList, setEntryList] = useState([]);

  useEffect(() => {
    const entryRef = database.ref('simplesleepEntries');
    entryRef.on('value', (snapshot) => {
      const entries = snapshot.val();
      const entryList = [];
      for (let id in entries) {
        entryList.push(entries[id]);
      }
      setEntryList(entryList);
    });
  }, []);
  const date = new Date();

  return (
    <SafeAreaView>
      <ScrollView>
        {entryList.map((entry) => (
          <TouchableOpacity style={tw`bg-gray-200 rounded drop-shadow-xl my-3 mx-3`}>
            <View style={tw`px-6 py-4`}>
              <Text style={tw`font-bold text-xl mb-2`}>{date.getFullYear()}</Text>
              <Text style={tw`text-gray-700 text-base`}>Sleep Time: {entry.length}</Text>
              <Text style={tw`text-gray-700 text-base`}>Sleep Quality Score: {entry.quality}</Text>
              <Text style={tw`text-gray-700 text-base`}>
                Sleep Factors:{' '}
                {entry.factors.map((factor) => (
                  <Text>#{factor} </Text>
                ))}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllSleepEntries;
