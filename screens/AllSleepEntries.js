import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';

import { database } from '../firebase';

export const SingleSleepEntry = () => {
  const date = 'Wednesday, Febraury 2';
  const hours = '7.75 hours';
  const quality = '82';
  const factors = ['meditation', 'caffeine', 'sleep podcast'];

  return (
    <TouchableOpacity style={tw`bg-gray-200 rounded drop-shadow-xl my-3 mx-3`}>
      <View style={tw`px-6 py-4`}>
        <Text style={tw`font-bold text-xl mb-2`}>{date}</Text>
        <Text style={tw`text-gray-700 text-base`}>Sleep Time: {hours}</Text>
        <Text style={tw`text-gray-700 text-base`}>Sleep Quality Score: {quality}</Text>
        {/* <Text style={tw`text-gray-700 text-base`}>Sleep Factors: {factors}</Text> */}
        <Text style={tw`text-gray-700 text-base`}>
          Sleep Factors: {factors.map((factor) => `#${factor}  `)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const AllSleepEntries = () => {
  let userRef = database.ref(`users/`);
  console.log(
    userEntriesRef.on('value', (snapshot) => {
      let entriesObject = snapshot.val();
    })
  );

  // const dbRef = database.ref();
  // dbRef
  //   .child('users')
  //   .child('name')
  //   .get()
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val());
  //     } else {
  //       console.log('No data available');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  return (
    <SafeAreaView>
      <ScrollView>
        <SingleSleepEntry />
        <SingleSleepEntry />
        <SingleSleepEntry />
        <SingleSleepEntry />
        <SingleSleepEntry />
        <SingleSleepEntry />
        <SingleSleepEntry />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllSleepEntries;
