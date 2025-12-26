import React from 'react';
import { useNavigate } from 'react-router-dom';
import TweetList from '../components/TweetList';

const Profile = ({ user, profile, tweets, theme, onLike, onReply, repliesMap, likedMap, onDelete, onImpression }) => {
  const myTweets = user ? tweets.filter(t => t.uid === user.uid) : [];
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: theme === 'dark' ? '#181c20' : '#fff', borderRadius: 12, boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* カバー画像風 */}
      <div style={{ height: 180, background: theme === 'dark' ? '#222' : '#e3f2fd', position: 'relative' }}>
        {profile?.coverURL && <img src={profile.coverURL} alt="cover" style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
        {/* アイコン */}
        <div style={{ position: 'absolute', left: 32, bottom: -48, borderRadius: '50%', border: '4px solid #fff', background: '#fff' }}>
          {profile?.photoURL && <img src={profile.photoURL} alt="icon" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />}
        </div>
      </div>
      <div style={{ padding: '64px 32px 24px 32px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/profile/edit')}
            style={{ background: theme === 'dark' ? '#23272f' : '#e3f2fd', color: theme === 'dark' ? '#e3f2fd' : '#1976d2', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            プロフィール設定
          </button>
        </div>
        <h2 style={{ margin: '8px 0 0 0', fontSize: 28, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>{profile?.displayName || user?.email}</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>@{user?.email?.split('@')[0]}</div>
        {/* 自己紹介欄（今後拡張可） */}
        {profile?.bio && <div style={{ marginBottom: 16, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>{profile.bio}</div>}
        <div style={{ display: 'flex', gap: 16, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>
          <div><strong>{myTweets.length}</strong> 投稿</div>
          <div><strong>{profile?.followers?.length || 0}</strong> フォロワー</div>
          <div><strong>{profile?.following?.length || 0}</strong> フォロー</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #eee', background: theme === 'dark' ? '#23272f' : '#fafbfc', padding: '24px 32px' }}>
        <h3 style={{ margin: 0, marginBottom: 16, color: theme === 'dark' ? '#e3f2fd' : '#1976d2', fontSize: 20 }}>投稿</h3>
        <TweetList tweets={myTweets} user={user} onLike={onLike} onReply={onReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={onDelete} onImpression={onImpression} theme={theme} />
      </div>
    </div>
  );
};

export default Profile; 