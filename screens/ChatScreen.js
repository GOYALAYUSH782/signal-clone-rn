import React, { useLayoutEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, ScrollView, Platform, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebase';
import * as firebase from 'firebase';

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [scrollView, setScrollView] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Avatar
            rounded
            source={{
              uri: messages[messages.length - 1]?.data.photoURL //|| 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
            }}
          />
          <Text style={{ marginLeft: 10, fontWeight: '700', color: 'white' }} ellipsizeMode='tail' numberOfLines={1}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <AntDesign name='arrowleft' size={24} color='white' />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 70,
          marginRight: 20
        }}>
          <TouchableOpacity>
            <FontAwesome name='video-camera' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='call' size={24} color='white' />
          </TouchableOpacity>
        </View>
      )
    })

  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL
    });
    setInput('');
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => (
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      ));

    return unsubscribe;

  }, [route]);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: 'white'
    }}>
      <StatusBar style='light' />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView
              style={{ paddingTop: 15 }}
              ref={ref => setScrollView(ref)}
              // onContentSizeChange={() => scrollView.scrollToEnd({ animated: false })}
              onContentSizeChange={(w, h) => scrollView.scrollTo({ y: h })}
            >
              {messages.map(({ id, data }) => (
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      position='absolute'
                      // WEB
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5
                      }}
                      size={30}
                      bottom={-15}
                      right={-5}
                      rounded
                      source={{
                        uri: data.photoURL
                      }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                    <View key={id} style={styles.sender}>
                      <Avatar
                        position='absolute'
                        containerStyle={{
                          position: 'absolute',
                          bottom: -15,
                          left: -5
                        }}
                        size={30}
                        bottom={-15}
                        left={-5}
                        rounded
                        source={{
                          uri: data.photoURL
                        }}
                      />
                      <Text style={styles.senderText}>{data.message}</Text>
                      <Text style={styles.senderName}>{data.displayName}</Text>
                    </View>
                  )
              ))}
              <View style={{ height: 15 }}></View>
            </ScrollView>
            {/* <View style={{ marginTop: 5 }}></View> */}
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={text => setInput(text)}
                placeholder='Signal Message'
                style={styles.textInput}
                onSubmitEditing={input.length && sendMessage}
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={sendMessage}
                disabled={!input} 
              >
                <Ionicons name='send' size={24} color='#2B68E6' />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  receiver: {
    padding: 15,
    alignSelf: 'flex-end',
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative'
  },
  sender: {
    padding: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#2B68E6',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative'
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 5,
    marginBottom: 15
  },
  receiverText: {
    color: 'black',
    fontWeight: '500',
    marginRight: 5
  },
  senderName: {
    color: 'white',
    left: 10,
    paddingRight: 10,
    fontSize: 10
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: '#ECECEC',
    padding: 10,
    color: 'grey',
    borderRadius: 30
  }
})
