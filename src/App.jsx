import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDox1zys5KhscmkmTZlm_LovFoNhfybGlw",
  authDomain: "magic-16b98.firebaseapp.com",
  projectId: "magic-16b98",
  storageBucket: "magic-16b98.appspot.com",
  messagingSenderId: "25247864597",
  appId: "1:25247864597:web:813f85fc5b48ab5105bb1c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const sessionId = uuidv4().slice(0, 6);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

  const exportDummyPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatório de ${user?.email || "Usuário"}`, 10, 10);
    doc.text(`Sessão ID: ${sessionId}`, 10, 20);
    doc.save(`relatorio-${sessionId}.pdf`);
  };

  // Permite acesso livre à /join
  if (!user && window.location.pathname !== "/join") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>SightCall 2.0</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", margin: "5px", width: "200px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", margin: "5px", width: "200px" }}
        />
        <br />
        <button
          onClick={handleAuth}
          style={{ padding: "10px 20px", marginTop: "10px" }}
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </button>
        <br />
        <a
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "blue",
            cursor: "pointer",
            display: "block",
            marginTop: "10px",
          }}
        >
          {isLogin ? "Criar conta" : "Já tenho conta"}
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Bem-vindo, {user?.email}</h2>
      <button onClick={() => signOut(auth)} style={{ marginRight: "10px" }}>
        Sair
      </button>
      <button onClick={exportDummyPDF}>Exportar Relatório</button>
      <br />
      <button onClick={() => navigate("/create")} style={{ marginTop: "10px" }}>
        Iniciar Sessão de Vídeo
      </button>
      <br />
      <button onClick={() => navigate("/join")} style={{ marginTop: "10px" }}>
        Entrar em Sessão de Vídeo
      </button>
    </div>
  );
}
