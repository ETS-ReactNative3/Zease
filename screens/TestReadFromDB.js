import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { database } from '../firebase';

function TestReadFromDB() {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const userRef = database.ref('users');
    userRef.on('value', (snapshot) => {
      const users = snapshot.val();
      const userList = [];
      for (let id in users) {
        userList.push(users[id]);
      }
      console.log('my user list: ', userList);
      setUserList(userList);
    });
  }, []);
  return (
    <View>
      {userList.map((user) => (
        <Text key={user.id}>
          {user.name} {user.email} {user.sleepGoalEnd}
        </Text>
      ))}
    </View>
  );
}

export default TestReadFromDB;
