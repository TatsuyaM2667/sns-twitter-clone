import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Timeline from './pages/Timeline';
import DM from './pages/DM';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collectionGroup, onSnapshot as onSnapshotReplies, addDoc as addReplyDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { FaHome, FaEnvelope, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import TweetList from './components/TweetList';
import './App.css';
import ProfileEditPage from './pages/ProfileEditPage';
import UserProfile from './pages/UserProfile';
import SearchBar from './components/SearchBar';
import TweetPostPage from './pages/TweetPostPage';
import NotificationList from './pages/NotificationList';

function Sidebar({ theme, setTheme }) {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: <FaHome />, label: 'タイムライン' },
    { to: '/dm', icon: <FaEnvelope />, label: 'DM' },
    { to: '/profile', icon: <FaUser />, label: 'プロフィール' },
  ];
  return (
    <aside style={{
      width: 220,
      minWidth: 180,
      background: theme === 'dark' ? '#181c20' : '#fff',
      borderRight: theme === 'dark' ? '1px solid #222' : '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '32px 0 0 0',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 200,
      boxShadow: theme === 'dark' ? '2px 0 8px rgba(0,0,0,0.24)' : '2px 0 8px rgba(0,0,0,0.04)'
    }}>
      <h1 style={{ textAlign: 'center', fontWeight: 700, color: theme === 'dark' ? '#e3f2fd' : '#1976d2', fontSize: 22, marginBottom: 32, letterSpacing: 1 }}>Tsubuyaki</h1>
      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: location.pathname === item.to ? (theme === 'dark' ? '#e3f2fd' : '#1976d2') : (theme === 'dark' ? '#aaa' : '#888'),
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: 18,
              fontWeight: location.pathname === item.to ? 'bold' : 'normal',
              padding: '12px 32px',
              background: location.pathname === item.to ? (theme === 'dark' ? '#23272f' : '#e3f2fd') : 'none',
              borderLeft: location.pathname === item.to ? `4px solid ${theme === 'dark' ? '#90caf9' : '#1976d2'}` : '4px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ marginRight: 16, fontSize: 22 }}>{item.icon}</span>
            {item.label}
            {item.count > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#e53935',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                {item.count}
              </span>
            )}
            {item.count > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#e53935',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          margin: 24,
          background: 'none',
          border: 'none',
          color: theme === 'dark' ? '#ffe082' : '#1976d2',
          fontSize: 24,
          cursor: 'pointer',
          alignSelf: 'center',
        }}
        aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      >
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>
    </aside>
  );
}

function App() {
  const [tweets, setTweets] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [repliesMap, setRepliesMap] = useState({});
  const [likedMap, setLikedMap] = useState({});

  useEffect(() => {
    document.body.style.background = theme === 'dark' ? '#121212' : '#fafbfc';
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'tweets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTweets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile({ displayName: '', photoURL: '' });
      }
    };
    fetchProfile();
  }, [user]);

  // いいね状態の管理
  useEffect(() => {
    if (!user) return;
    const liked = {};
    tweets.forEach(t => {
      if (t.likes && Array.isArray(t.likes)) {
        liked[t.id] = t.likes.includes(user.uid);
      }
    });
    setLikedMap(liked);
  }, [tweets, user]);

  // 返信のリアルタイム取得
  useEffect(() => {
    const unsubscribes = [];
    const map = {};
    tweets.forEach(tweet => {
      const q = collection(db, 'tweets', tweet.id, 'replies');
      const unsub = onSnapshotReplies(q, (snapshot) => {
        map[tweet.id] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRepliesMap(prev => ({ ...prev, [tweet.id]: map[tweet.id] }));
      });
      unsubscribes.push(unsub);
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [tweets]);

  const handleProfileUpdated = (newProfile) => {
    setProfile(newProfile);
  };

  const handleTweet = async (text, imageUrl) => {
    if (!user || !profile) return;
    const tweetData = {
      text,
      uid: user.uid,
      email: user.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      createdAt: serverTimestamp(),
    };
    if (imageUrl) {
      tweetData.imageUrl = imageUrl;
    }
    const newTweetRef = await addDoc(collection(db, 'tweets'), tweetData);

    // ツイート通知の作成
    // 1. 投稿者のフォロワーリストを取得
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const followers = userData.followers || []; // フォロワーのUID配列

      // 2. 各フォロワーに通知を作成
      for (const followerUid of followers) {
        await addDoc(collection(db, 'notifications'), {
          type: 'tweet',
          fromUid: user.uid,
          toUid: followerUid,
          tweetId: newTweetRef.id, // 新しく作成されたツイートのID
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    }
  };

  // いいねのトグル
  const handleLike = async (tweetId) => {
    if (!user) return;
    const tweetRef = doc(db, 'tweets', tweetId);
    const tweet = tweets.find(t => t.id === tweetId);
    if (!tweet) return;
    if (tweet.likes && tweet.likes.includes(user.uid)) {
      await updateDoc(tweetRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(tweetRef, { likes: arrayUnion(user.uid) });
    }
  };

  // 返信の追加
  const handleReply = async (tweetId, text) => {
    if (!user || !profile) return;
    const repliesRef = collection(db, 'tweets', tweetId, 'replies');
    await addReplyDoc(repliesRef, {
      text,
      uid: user.uid,
      email: user.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      createdAt: serverTimestamp(),
    });
  };

  // ツイート削除
  const handleDeleteTweet = async (tweetId) => {
    await deleteDoc(doc(db, 'tweets', tweetId));
  };

  // インプレッション数カウント
  const handleImpression = async (tweetId) => {
    if (!user) return;
    const tweet = tweets.find(t => t.id === tweetId);
    if (!tweet) return;
    if (!tweet.impressions || !Array.isArray(tweet.impressions) || !tweet.impressions.includes(user.uid)) {
      await updateDoc(doc(db, 'tweets', tweetId), {
        impressions: arrayUnion(user.uid)
      });
    }
  };

  const renderTweets = tweets.map(t => ({
    id: t.id,
    text: t.text,
    displayName: t.displayName || t.email,
    photoURL: t.photoURL || '',
    uid: t.uid,
    likes: t.likes || [],
    email: t.email,
    impressions: t.impressions || [],
    imageUrl: t.imageUrl || '',
  }));

  if (!authChecked) {
    return null;
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#121212' : '#fafbfc' }}>
        <div style={{ maxWidth: 400, width: '100%', padding: 32, borderRadius: 16, background: theme === 'dark' ? '#23272f' : '#fff', boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h1 style={{ textAlign: 'center', fontWeight: 700, color: theme === 'dark' ? '#e3f2fd' : '#1976d2', marginBottom: 24, fontSize: 28 }}>SNS つぶやき</h1>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'none',
              border: 'none',
              color: theme === 'dark' ? '#ffe082' : '#1976d2',
              fontSize: 24,
              cursor: 'pointer',
              zIndex: 200
            }}
            aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          <AuthForm user={null} />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: theme === 'dark' ? '#181c20' : '#fafbfc' }}>
        <Sidebar theme={theme} setTheme={setTheme} />
        <main style={{
          flex: 1,
          marginLeft: 220,
          padding: '40px 32px 32px 32px',
          minHeight: '100vh',
          background: theme === 'dark' ? '#23272f' : '#fafbfc',
          transition: 'background 0.2s',
          boxSizing: 'border-box',
        }}>
          <Routes>
            <Route path="/" element={<Timeline user={user} profile={profile} tweets={renderTweets} loading={loading} theme={theme} onLike={handleLike} onReply={handleReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={handleDeleteTweet} onImpression={handleImpression} />} />
            <Route path="/dm" element={<DM user={user} theme={theme} />} />
            <Route path="/profile" element={<Profile user={user} profile={profile} onProfileUpdated={handleProfileUpdated} tweets={renderTweets} theme={theme} onLike={handleLike} onReply={handleReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={handleDeleteTweet} />} />
            <Route path="/profile/edit" element={<ProfileEditPage user={user} profile={profile} onProfileUpdated={handleProfileUpdated} theme={theme} />} />
            <Route path="/user/:uid" element={<UserProfile currentUser={user} theme={theme} onLike={handleLike} onReply={handleReply} repliesMap={repliesMap} likedMap={likedMap} onDelete={handleDeleteTweet} onImpression={handleImpression} />} />
            <Route path="/tweet" element={<TweetPostPage onTweet={handleTweet} theme={theme} />} />
            <Route path="/notifications" element={<NotificationList user={user} theme={theme} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
