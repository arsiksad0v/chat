import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import { Message } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastDatetime, setLastDatetime] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async (datetime: string | null) => {
    try {
      const response = await axios.get<Message[]>('http://146.185.154.90:8000/messages', {
        params: datetime ? { datetime } : {},
      });
      setMessages((prevMessages) => [...prevMessages, ...response.data]);
      if (response.data.length > 0) {
        setLastDatetime(response.data[response.data.length - 1].datetime);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages(lastDatetime);

    intervalRef.current = setInterval(() => {
      fetchMessages(lastDatetime);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lastDatetime]);

  const handleSendMessage = async (message: string, author: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    await axios.post('http://146.185.154.90:8000/messages', new URLSearchParams({ message, author }));
    fetchMessages(lastDatetime);
    intervalRef.current = setInterval(() => {
      fetchMessages(lastDatetime);
    }, 3000);
  };

  return (
    <div>
      <MessageList messages={messages} />
      <MessageForm onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;