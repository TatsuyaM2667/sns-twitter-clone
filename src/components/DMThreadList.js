import React from 'react';
import { FaThumbtack } from 'react-icons/fa';

const DMThreadList = ({ threads, currentUser, onSelect, selectedThreadId, onPin, pinned }) => (
  <div style={{ borderRight: '1px solid #eee', minWidth: 220, maxWidth: 300, height: '100%', overflowY: 'auto' }}>
    <h3 style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid #eee', fontSize: 16 }}>DMスレッド</h3>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {threads.map(thread => {
        const partner = thread.partners?.find(u => u.uid !== currentUser?.uid) || {};
        const isPinned = thread.pinned;
        return (
          <li
            key={thread.id}
            onClick={() => onSelect(thread)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: selectedThreadId === thread.id ? '#e3f2fd' : 'none',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #f0f0f0',
              position: 'relative',
            }}
          >
            {partner.photoURL && <img src={partner.photoURL} alt="icon" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{partner.displayName || partner.email}</div>
              <div style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {thread.lastMessage?.text ? thread.lastMessage.text : '[画像]'}
              </div>
            </div>
            {thread.unreadCount > 0 && (
              <span style={{ background: '#e53935', color: '#fff', borderRadius: 12, fontSize: 12, padding: '2px 8px', marginLeft: 8 }}>
                {thread.unreadCount}
              </span>
            )}
            <button
              onClick={e => { e.stopPropagation(); onPin(thread.id, !isPinned); }}
              style={{ background: 'none', border: 'none', color: isPinned ? '#1976d2' : '#aaa', cursor: 'pointer', marginLeft: 8 }}
              title={isPinned ? 'ピンを外す' : 'ピン留め'}
            >
              <FaThumbtack />
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

export default DMThreadList;