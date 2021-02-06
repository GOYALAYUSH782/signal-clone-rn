import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import CustomListItem from '../CustomListItem'
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsibscribe = db.collection('chats').onSnapshot(snapshot => {
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    });

    return unsibscribe;
  }, []);

  const signOut = () => {
    auth.signOut();
    navigation.replace('Login');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: { backgroungColor: '#fff' },
      headerTintStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: 'row',
          marginRight: 20,
          justifyContent: 'space-between',
          width: 80
        }}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name='camerao' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddChat')}>
            <SimpleLineIcons name='pencil' size={24} color='black' />
          </TouchableOpacity>
        </View>
      )
    })
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate('Chat', {
      id,
      chatName
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    height: '100%'
  }
})
