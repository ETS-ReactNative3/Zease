import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function Form() {
  const [text, onChangeText] = useState('text');
  return (
    <View>
      <Text>Todo</Text>
      <TextInput style={styles.input} />
      <Button title='Add Todo' />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    margin: 30,
    borderWidth: 1,
    padding: 10
  }
});
