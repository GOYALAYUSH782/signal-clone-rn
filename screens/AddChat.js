import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase';

const AddChat = ({ navigation }) => {
  const [input, setInput] = useState('');

  const createChat = async () => {
    db
      .collection('chats')
      .add({
        chatName: input
      })
      .then(() => navigation.goBack())
      .catch(err => alert(err.message))
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a new Chat',
      headerBackTitle: 'Chats',
      headerStyle: { backgroungColor: '#fff' },
      headerTintStyle: { color: 'black' },
      headerTintColor: 'black',
    })
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a Chat name"
        value={input} onChangeText={text => setInput(text)}
        leftIcon={
          <Icon name='wechat' size={24} color='black' type='antdesign' />
        }
        onSubmitEditing={input && createChat}
      />
      <Button disabled={!input} onPress={createChat} title='Create Chat' />
    </View>
  )
}

export default AddChat

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    padding: 30
  }
})
