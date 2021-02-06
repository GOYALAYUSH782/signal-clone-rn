import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from './firebase';

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setMessage(snapshot.docs.length > 0 ? snapshot.docs[0].data() : []);
        // setMessages(snapshot.docs.map(doc => doc.data()));
      }
      );
    return unsubscribe;
  }, [message]);

  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)}>
      <Avatar
        rounded
        source={{
          uri: message?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
          {message?.displayName}{message?.displayName ? `:` : ''}{message?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem

const styles = StyleSheet.create({})
