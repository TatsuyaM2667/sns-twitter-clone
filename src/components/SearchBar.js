import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SearchBar = ({ theme }) => {
  const [mode, setMode] = useState('tweet'); // 'tweet' or 'user'
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'tweet') {
      const q = query(collection(db, 'tweets'), where('text', '>=', queryText), where('text', '<=', queryText + '\uf8ff'));
      const snap = await getDocs(q);
      setResults(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'tweet' })));
    } else {
      const q = query(collection(db, 'users'), where('displayName', '>=', queryText), where('displayName', '<=', queryText + '\uf8ff'));
      const snap = await getDocs(q);
      setResults(snap.docs.map(doc => ({ uid: doc.id, ...doc.data(), type: 'user' })));
    }
    setLoading(false);
  };

  return (
    <div style={{ background: theme === 'dark' ? '#23272f' : '#fff', borderRadius: 8, boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.16)' : '0 2px 8px rgba(0,0,0,0.06)', padding: 16, marginBottom: 24, maxWidth: 480, margin: '0 auto' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <select value={mode} onChange={e => setMode(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="tweet">ツイート検索</option>
          <option value="user">ユーザー検索</option>
        </select>
        <input
          type="text"
          value={queryText}
          onChange={e => setQueryText(e.target.value)}
          placeholder={mode === 'tweet' ? 'ツイート内容で検索' : 'ユーザー名で検索'}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none' }}>
          検索
        </button>
      </form>
      {loading && <div style={{ color: '#888', textAlign: 'center' }}>検索中...</div>}
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {results.map(r => (
            <li key={r.id || r.uid} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              {r.type === 'tweet' ? (
                <Link to={r.uid ? `/user/${r.uid}` : '#'} style={{ color: '#1976d2', textDecoration: 'none' }}>
                  {r.displayName || r.email}
                </Link>
              ) : (
                <Link to={`/user/${r.uid}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                  {r.displayName || r.email}
                </Link>
              )}
              <div style={{ color: '#222', marginTop: 2 }}>
                {r.type === 'tweet' ? r.text : r.bio}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;