import React, { useState, useRef, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

const CLOUD_NAME = 'demo'; // サンプル値
const UPLOAD_PRESET = 'ml_default'; // サンプル値

const DMThread = ({ messages, onSend, partner, currentUser, onRead, onDelete }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (messages.length > 0 && onRead) {
      onRead();
    }
    // eslint-disable-next-line
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.secure_url;
    }
    onSend(text, imageUrl);
    setText('');
    setImage(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: 16 }}>
        {partner ? (partner.displayName || partner.email) : 'ユーザーを選択してください'}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f7fafd' }}>
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            style={{
              marginBottom: 12,
              textAlign: msg.uid === currentUser?.uid ? 'right' : 'left',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: msg.uid === currentUser?.uid ? '#1976d2' : '#fff',
                color: msg.uid === currentUser?.uid ? '#fff' : '#222',
                borderRadius: 16,
                padding: '8px 16px',
                maxWidth: 320,
                wordBreak: 'break-word',
                fontSize: 15,
                position: 'relative',
              }}
            >
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="img" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, marginBottom: 4, display: 'block' }} />
              )}
              {msg.text}
              {currentUser && msg.uid === currentUser.uid && (
                <button onClick={() => onDelete(msg.id)} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', marginLeft: 8, position: 'absolute', right: -32, top: 0 }} title="削除">
                  <FaTrash />
                </button>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              {msg.displayName || msg.email}・{msg.createdAt && msg.createdAt.toDate ? msg.createdAt.toDate().toLocaleString() : ''}
              {msg.readBy && msg.readBy.includes(partner?.uid) && (
                <span style={{ color: '#1976d2', marginLeft: 8 }}>既読</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {partner && (
        <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', padding: 12, background: '#fff', alignItems: 'center' }}>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="メッセージを入力..."
            style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc', marginRight: 8 }}
          />
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ marginRight: 8 }} />
          <button type="submit" style={{ padding: '8px 16px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none' }}>
            送信
          </button>
        </form>
      )}
    </div>
  );
};

export default DMThread;