import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthForm = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (resetMode) {
      // パスワードリセット
      try {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      } catch (err) {
        setError(err.message);
      }
      return;
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <span>{user.email} でログイン中</span>
        <button onClick={handleLogout} style={{ marginLeft: 8 }}>ログアウト</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', marginBottom: 24 }}>
      <h2 style={{ textAlign: 'center' }}>{resetMode ? 'パスワードリセット' : isLogin ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        {!resetMode && (
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="パスワード"
              required
              style={{ width: '100%', padding: 8, paddingRight: 36 }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
              tabIndex={0}
              aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {resetMode ? (
          <>
            {resetSent ? (
              <div style={{ color: '#1976d2', marginBottom: 8 }}>リセットメールを送信しました</div>
            ) : null}
            <button type="submit" style={{ width: '100%', padding: 8 }}>
              パスワードリセットメール送信
            </button>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button type="button" onClick={() => { setResetMode(false); setResetSent(false); setError(''); }} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}>
                ログイン画面に戻る
              </button>
            </div>
          </>
        ) : (
          <>
            <button type="submit" style={{ width: '100%', padding: 8 }}>
              {isLogin ? 'ログイン' : '新規登録'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={() => setIsLogin(!isLogin)} type="button" style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}>
                {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <button type="button" onClick={() => { setResetMode(true); setError(''); setResetSent(false); }} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 13 }}>
                パスワードを忘れた方はこちら
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AuthForm; 