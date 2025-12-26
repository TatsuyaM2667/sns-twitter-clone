import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import TweetList from '../components/TweetList';
import { FaEnvelope } from 'react-icons/fa';

const UserProfile = ({ currentUser, theme, onLike, onReply, repliesMap, likedMap, onDelete, onImpression }) => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData({ uid, ...snap.data() });
        setFollowers(snap.data().followers || []);
        setFollowing(snap.data().following || []);
        setIsFollowing((snap.data().followers || []).includes(currentUser?.uid));
      }
    };
    fetchUser();
  }, [uid, currentUser]);

  useEffect(() => {
    const fetchTweets = async () => {
      const q = query(collection(db, 'tweets'), where('uid', '==', uid));
      const snap = await getDocs(q);
      setUserTweets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTweets();
  }, [uid]);

  const handleFollow = async () => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', uid);
    const meRef = doc(db, 'users', currentUser.uid);
    if (isFollowing) {
      await updateDoc(userRef, { followers: arrayRemove(currentUser.uid) });
      await updateDoc(meRef, { following: arrayRemove(uid) });
      setIsFollowing(false);
      setFollowers(followers.filter(f => f !== currentUser.uid));
    } else {
      await updateDoc(userRef, { followers: arrayUnion(currentUser.uid) });
      await updateDoc(meRef, { following: arrayUnion(uid) });
      setIsFollowing(true);
      setFollowers([...followers, currentUser.uid]);
    }
  };

  if (!userData) return <div style={{ padding: 32 }}>読み込み中...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: theme === 'dark' ? '#181c20' : '#fff', borderRadius: 12, boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{ height: 180, background: theme === 'dark' ? '#222' : '#e3f2fd', position: 'relative' }}>
        {userData.coverURL && <img src={userData.coverURL} alt="cover" style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', left: 32, bottom: -48, borderRadius: '50%', border: '4px solid #fff', background: '#fff' }}>
          {userData.photoURL && <img src={userData.photoURL} alt="icon" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />}
        </div>
      </div>
      <div style={{ padding: '64px 32px 24px 32px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          {currentUser && currentUser.uid !== uid && (
            <>
              <button
                onClick={() => navigate(`/dm?recipientId=${uid}`)}
                style={{ background: 'none', border: '1px solid #ccc', borderRadius: 20, padding: '8px 12px', cursor: 'pointer' }}
                title="メッセージを送る"
              >
                <FaEnvelope />
              </button>
              <button
                onClick={handleFollow}
                style={{ background: isFollowing ? '#fff' : (theme === 'dark' ? '#23272f' : '#e3f2fd'), color: isFollowing ? '#1976d2' : (theme === 'dark' ? '#e3f2fd' : '#1976d2'), border: isFollowing ? '1px solid #1976d2' : 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                {isFollowing ? 'フォロー中' : 'フォロー'}
              </button>
            </>
          )}
        </div>
        <h2 style={{ margin: '8px 0 0 0', fontSize: 28, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>{userData.displayName || userData.email}</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>@{userData.email?.split('@')[0]}</div>
        {userData.bio && <div style={{ marginBottom: 16, color: theme === 'dark' ? '#e3f2fd' : '#222' }}>{userData.bio}</div>}
        <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
          <span style={{ marginRight: 16 }}>フォロー中 <b>{following.length}</b></span>
          <span>フォロワー <b>{followers.length}</b></span>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #eee', background: theme === 'dark' ? '#23272f' : '#fafbfc', padding: '24px 32px' }}>
        <h3 style={{ margin: 0, marginBottom: 16, color: theme === 'dark' ? '#e3f2fd' : '#1976d2', fontSize: 20 }}>投稿</h3>
        <TweetList tweets={userTweets} user={currentUser} onLike={onLike} onReply={onReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={onDelete} onImpression={onImpression} theme={theme} />
      </div>
    </div>
  );
};

export default UserProfile;