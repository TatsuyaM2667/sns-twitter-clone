import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaReply, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TweetItem = ({ tweet, user, onLike, onReply, replies, liked, onDelete, onImpression, theme }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (onImpression && tweet.id) {
      onImpression(tweet.id);
    }
    // eslint-disable-next-line
  }, []);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(tweet.id, replyText);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <li style={{ borderBottom: '1px solid #eee', padding: 8, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
      <Link to={tweet.uid ? `/user/${tweet.uid}` : '#'} style={{ textDecoration: 'none' }}>
        {tweet.photoURL && (
          <img src={tweet.photoURL} alt="icon" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
        )}
      </Link>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to={tweet.uid ? `/user/${tweet.uid}` : '#'} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold', marginRight: 8 }}>
            {tweet.displayName}
          </Link>
          <span style={{ color: '#888', fontSize: 12 }}>{tweet.email}</span>
          <span style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <FaEye style={{ marginRight: 2 }} />{tweet.impressions?.length || 0}
          </span>
          {user && tweet.uid === user.uid && (
            <button onClick={() => onDelete(tweet.id)} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', marginLeft: 8 }} title="削除">
              <FaTrash />
            </button>
          )}
        </div>
        {tweet.imageUrl && (
          <img src={tweet.imageUrl} alt="tweet-img" style={{ maxWidth: 240, borderRadius: 8, marginBottom: 8 }} />
        )}
        
        <div style={{ marginBottom: 8, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>{tweet.text}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => onLike(tweet.id)} style={{ background: 'none', border: 'none', color: liked ? '#e53935' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 16 }}>
            {liked ? <FaHeart /> : <FaRegHeart />} <span style={{ marginLeft: 4 }}>{tweet.likes?.length || 0}</span>
          </button>
          <button onClick={() => setShowReply(!showReply)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 16 }}>
            <FaReply /> <span style={{ marginLeft: 4 }}>{replies?.length || 0}</span>
          </button>
        </div>
        {showReply && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="返信を入力..."
              style={{ flex: 1, padding: 6 }}
              required
            />
            <button type="submit" style={{ padding: '6px 12px' }}>返信</button>
          </form>
        )}
        {replies && replies.length > 0 && (
          <ul style={{ marginTop: 8, paddingLeft: 16, borderLeft: '2px solid #eee' }}>
            {replies.map((r, idx) => (
              <li key={r.id || idx} style={{ fontSize: 14, marginBottom: 4 }}>
                <span style={{ fontWeight: 'bold', marginRight: 4 }}>{r.displayName || r.email}</span>
                {r.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default TweetItem;