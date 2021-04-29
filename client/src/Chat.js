import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import React, { useState } from 'react';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const Chat = ({user}) => {
  const [messages, setMessages] = useState([]);
  // const { data, loading, error } = useQuery(messagesQuery);
  useQuery(messagesQuery, {
    onCompleted: ({messages}) => setMessages(messages)
  });
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({subscriptionData}) => {
      setMessages(messages.concat(subscriptionData.data.messageAdded))
    }
  });
  const [addMessage] = useMutation(addMessageMutation);
  // const messages = data ? data.messages : [];

  const handleSend = async (text) => {
    // const message = {id: text, from: 'you', text};
    // setMessages(messages.concat(message));
    await addMessage({variables: { input: { text } }})
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
