import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, onSnapshot, addDoc, doc, setDoc, serverTimestamp, updateDoc, getDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import DMThreadList from '../components/DMThreadList';
import DMThread from '../components/DMThread';

function getThreadId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

const DM = ({ user, theme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [pinned, setPinned] = useState([]);

  // 全ユーザー取得
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  // スレッド一覧取得
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'dms'));
    const unsub = onSnapshot(q, async (snap) => {
      const allThreads = [];
      for (const d of snap.docs) {
        const data = d.data();
        if (!data.users || !data.users.includes(user.uid)) continue;
        // 相手情報
        const partners = data.users.filter(uid => uid !== user.uid).map(uid => users.find(u => u.uid === uid)).filter(Boolean);
        // 最新メッセージ取得
        let lastMessage = null;
        let unreadCount = 0;
        const msgSnap = await getDocs(query(collection(db, 'dms', d.id, 'messages'), orderBy('createdAt', 'desc')));
        if (!msgSnap.empty) {
          lastMessage = msgSnap.docs[0].data();
          // 未読数計算
          unreadCount = msgSnap.docs.filter(m => !(m.data().readBy || []).includes(user.uid) && m.data().uid !== user.uid).length;
        }
        allThreads.push({
          id: d.id,
          partners,
          lastMessage,
          unreadCount,
          pinned: data.pinnedBy?.includes(user.uid) || false,
        });
      }
      // ピン留めスレッドを上に
      allThreads.sort((a, b) => (b.pinned - a.pinned) || (b.lastMessage?.createdAt?.toMillis?.() || 0) - (a.lastMessage?.createdAt?.toMillis?.() || 0));
      setThreads(allThreads);
      setPinned(allThreads.filter(t => t.pinned).map(t => t.id));
    });
    return () => unsub();
  }, [user, users]);

  // メッセージ取得
  useEffect(() => {
    if (!user || !selectedThread) return;
    const q = query(collection(db, 'dms', selectedThread.id, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    // パートナー情報セット
    if (selectedThread.partners && selectedThread.partners.length > 0) {
      setPartner(selectedThread.partners[0]);
    }
    return () => unsub();
  }, [user, selectedThread]);

  // メッセージ送信
  const handleSend = useCallback(async (text, imageUrl) => {
    if (!user || !selectedThread) return;
    const msgRef = collection(db, 'dms', selectedThread.id, 'messages');
    await addDoc(msgRef, {
      text,
      imageUrl: imageUrl || '',
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      readBy: [user.uid],
    });
    // スレッドの更新
    await setDoc(doc(db, 'dms', selectedThread.id), {
      users: [user.uid, partner.uid],
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [user, selectedThread, partner]);

  // 既読管理
  const handleRead = useCallback(async () => {
    if (!user || !selectedThread) return;
    const q = query(collection(db, 'dms', selectedThread.id, 'messages'));
    const snap = await getDocs(q);
    snap.docs.forEach(async (docSnap) => {
      const data = docSnap.data();
      if (!(data.readBy || []).includes(user.uid)) {
        await updateDoc(doc(db, 'dms', selectedThread.id, 'messages', docSnap.id), {
          readBy: [...(data.readBy || []), user.uid],
        });
      }
    });
  }, [user, selectedThread]);

  // メッセージ削除
  const handleDeleteMessage = async (msgId) => {
    if (!user || !selectedThread) return;
    await deleteDoc(doc(db, 'dms', selectedThread.id, 'messages', msgId));
  };

  // スレッドピン留め
  const handlePinThread = async (threadId, pin) => {
    if (!user) return;
    const threadRef = doc(db, 'dms', threadId);
    await updateDoc(threadRef, {
      pinnedBy: pin ? arrayUnion(user.uid) : arrayRemove(user.uid)
    });
  };

  // URLクエリからrecipientIdを取得してスレッドを開く
  useEffect(() => {
    if (!user || !users.length) return;
    const params = new URLSearchParams(location.search);
    const recipientId = params.get('recipientId');
    if (recipientId) {
      const recipient = users.find(u => u.uid === recipientId);
      if (recipient) {
        const threadId = getThreadId(user.uid, recipientId);
        const existingThread = threads.find(t => t.id === threadId);
        if (existingThread) {
          setSelectedThread(existingThread);
        } else {
          // 新規スレッドを作成して選択
          const newThread = {
            id: threadId,
            partners: [recipient],
            lastMessage: null,
            unreadCount: 0,
            pinned: false,
          };
          setDoc(doc(db, 'dms', threadId), { users: [user.uid, recipientId] });
          setThreads([newThread, ...threads]);
          setSelectedThread(newThread);
        }
        // URLからクエリを削除
        navigate('/dm', { replace: true });
      }
    }
  }, [user, users, threads, location.search, navigate]);

  // 通知バッジ（未読数合計）
  const unreadTotal = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  return (
    <div style={{ display: 'flex', height: '70vh', minHeight: 400, background: theme === 'dark' ? '#23272f' : '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: theme === 'dark' ? '0 2px 16px rgba(0,0,0,0.24)' : '0 2px 16px rgba(0,0,0,0.06)' }}>
      <DMThreadList threads={threads} currentUser={user} onSelect={setSelectedThread} selectedThreadId={selectedThread?.id} onPin={handlePinThread} pinned={pinned} theme={theme} />
      <DMThread messages={messages} onSend={handleSend} partner={partner} currentUser={user} onRead={handleRead} onDelete={handleDeleteMessage} theme={theme} selectedThread={selectedThread} />
      {unreadTotal > 0 && (
        <div style={{ position: 'fixed', left: 16, top: 16, background: '#e53935', color: '#fff', borderRadius: 16, padding: '4px 12px', fontSize: 14, zIndex: 999 }}>
          新着DM {unreadTotal}
        </div>
      )}
    </div>
  );
};

export default DM; 