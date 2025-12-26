import React from 'react';
import { useNavigate } from 'react-router-dom';
import TweetInput from '../components/TweetInput';

const TweetPostPage = ({ onTweet, theme }) => {
  const navigate = useNavigate();
  const handleTweet = (text, imageUrl) => {
    onTweet(text, imageUrl);
    navigate('/');
  };
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', background: theme === 'dark' ? '#23272f' : '#fff', borderRadius: 12, boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', color: theme === 'dark' ? '#e3f2fd' : '#1976d2' }}>ツイートする</h2>
      <TweetInput onTweet={handleTweet} />
    </div>
  );
};

export default TweetPostPage;