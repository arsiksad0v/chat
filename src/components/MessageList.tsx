import React from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg._id}>
          <strong>{msg.author}</strong>: {msg.message} <em>{new Date(msg.datetime).toLocaleString()}</em>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;