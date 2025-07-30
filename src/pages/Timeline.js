import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TweetList from '../components/TweetList';

const Timeline = ({ user, profile, tweets, loading, theme, onLike, onReply, repliesMap, likedMap, onDelete, onImpression }) => {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'relative' }}>
      <SearchBar theme={theme} />
      {user && profile ? (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#888' }}>読み込み中...</div>
          ) : (
            <TweetList tweets={tweets} user={user} onLike={onLike} onReply={onReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={onDelete} onImpression={onImpression} theme={theme} />
          )}
          <button
            onClick={() => navigate('/tweet')}
            style={{ position: 'fixed', right: 40, bottom: 40, width: 56, height: 56, borderRadius: '50%', background: '#1976d2', color: '#fff', fontSize: 32, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.16)', cursor: 'pointer', zIndex: 1000 }}
            title="ツイートする"
          >
            ＋
          </button>
        </>
      ) : (
        <div>ログインしてください</div>
      )}
    </div>
  );
};

export default Timeline; 