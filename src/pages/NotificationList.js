import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const NotificationList = ({ user, theme }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('toUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = async (notification) => {
    // 通知を既読にする
    await updateDoc(doc(db, 'notifications', notification.id), { read: true });

    // 通知の種類に応じてリダイレクト
    if (notification.type === 'tweet') {
      // ツイート詳細ページがあればそこに、なければタイムラインへ
      navigate(`/tweet/${notification.tweetId}`); // 仮のパス
    } else if (notification.type === 'dm') {
      navigate(`/dm?recipientId=${notification.fromUid}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, background: theme === 'dark' ? '#181c20' : '#fff', borderRadius: 12, boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)' }}>
      <h2 style={{ color: theme === 'dark' ? '#e3f2fd' : '#222', marginBottom: 20 }}>通知</h2>
      {notifications.length === 0 ? (
        <p style={{ color: theme === 'dark' ? '#aaa' : '#555' }}>通知はありません。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                padding: '15px',
                borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                background: notification.read ? (theme === 'dark' ? '#222' : '#f9f9f9') : (theme === 'dark' ? '#3a3a3a' : '#e6f7ff'),
                cursor: 'pointer',
                borderRadius: 8,
                marginBottom: 10,
                color: theme === 'dark' ? '#e3f2fd' : '#222',
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>
                {notification.type === 'tweet' && (
                  <span>新しいツイートがあります。</span>
                )}
                {notification.type === 'dm' && (
                  <span>新しいDMが届きました。</span>
                )}
              </p>
              <span style={{ fontSize: 12, color: theme === 'dark' ? '#aaa' : '#888' }}>
                {notification.createdAt?.toDate().toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
