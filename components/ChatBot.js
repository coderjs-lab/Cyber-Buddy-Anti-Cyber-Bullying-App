//Importing components from libraries
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import {dialogflowConfig} from '../components/env'


const BOT_USER = {
  _id: 2,
  name: 'Cyber Buddy',
  avatar: require('../assets/-bot.png')
};

export default class ChatBot extends Component {
    state = {
      messages: [
        {
          _id: 1,
          text: `Hey! Greetings for the day!\nI am your Cyber Buddy\n\nWould you like to be my friend?`,
          createdAt: new Date(),
          user: BOT_USER
        }
      ]
    };


    componentDidMount() {
      Dialogflow_V2.setConfiguration(
        dialogflowConfig.client_email,
        dialogflowConfig.private_key,
        Dialogflow_V2.LANG_ENGLISH_US,
        dialogflowConfig.project_id
      );
    }

    //Function to retrieve the response from dialogflow
    handleGoogleResponse(result) {
      let text = result.queryResult.fulfillmentMessages[0].text.text[0];
      this.sendBotResponse(text);
    }

  //Function to send the message by the user to the bot
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    let message = messages[0].text;
  Dialogflow_V2.requestQuery(
    message,
    result => this.handleGoogleResponse(result),
    error => console.log(error)
  );
  }

  //Function to send the response of the bot
  sendBotResponse(text) {
  let msg = {
    _id: this.state.messages.length + 1,
    text,
    createdAt: new Date(),
    user: BOT_USER
  };

  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, [msg])
  }));
}

  //Displaying various components in render
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1           
          }}
        />
      </View>
    );
  }
}