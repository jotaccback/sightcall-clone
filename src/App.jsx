import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDox1zys5KhscmkmTZlm_LovFoNhfybGlw",
  authDomain: "magic-16b98.firebaseapp.com",
  projectId: "magic-16b98",
  storageBucket: "magic-16b98.appspot.com",
  messagingSenderId: "25247864597",
  appId: "1:25247864597:web:813f85fc5b48ab5105bb1c"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [history, setHistory] = useState([]);
  const [uploadUrl, setUploadUrl] = useState(null);
  const sessionId = uuidv4().slice(0, 6);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchUserHistory(currentUser.uid);
    });
  }, []);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchUserHistory = async (uid) => {
    const listRef = ref(storage, `relatorios/${uid}`);
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
    setHistory(urls);
  };

  const exportDummyPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatório de ${user.email}`, 10, 10);
    doc.text(`Sessão: ${sessionId}`, 10, 20);

    const pdfBlob = doc.output('blob');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1];
      const storageRef = ref(storage, `relatorios/${user.uid}/${sessionId}.pdf`);
      await uploadString(storageRef, base64data, 'base64');
      const url = await getDownloadURL(storageRef);
      setUploadUrl(url);
      fetchUserHistory(user.uid);
      alert('Relatório enviado com sucesso!');
    };
    reader.readAsDataURL(pdfBlob);
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>SightCall 2.0</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '8px', margin: '5px', width: '200px' }}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '8px', margin: '5px', width: '200px' }}
        />
        <br />
        <button onClick={handleAuth} style={{ padding: '10px 20px', marginTop: '10px' }}>
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
        <br />
        <a
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: 'blue', cursor: 'pointer', display: 'block', marginTop: '10px' }}
        >
          {isLogin ? 'Criar conta' : 'Já tenho conta'}
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bem-vindo, {user.email}</h2>
      <button onClick={() => signOut(auth)} style={{ marginRight: '10px' }}>Sair</button>
      <button onClick={exportDummyPDF}>Exportar Relatório</button>
      {uploadUrl && (
        <p><a href={uploadUrl} target="_blank" rel="noreferrer">Ver Relatório</a></p>
      )}
      <h3>Seus relatórios:</h3>
      <ul>
        {history.map((url, idx) => (
          <li key={idx}>
            <a href={url} target="_blank" rel="noreferrer">
              Relatório {idx + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
