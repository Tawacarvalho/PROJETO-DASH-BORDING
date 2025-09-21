import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../../users';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find(u => u.login === email && u.senha === senha);

    if (user) {
      alert(`Bem-vindo(a), ${user.aluno}!`);
      navigate('/dashboard'); // redireciona para o dashboard
    } else {
      alert('Login ou senha incorretos.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
