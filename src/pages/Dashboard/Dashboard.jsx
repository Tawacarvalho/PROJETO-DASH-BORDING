import React, { useState, useEffect } from "react";
import "./Dashboard.style.scss";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiSearch
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/auth";
import { getProducts } from "../../services/productService";

import LogoSidebar from "../../assets/logo-sidebar.svg";
import NotifIcon from "../../assets/NotifIcon.svg";
import NotifSign from "../../assets/NotifSign.svg";
import AvatarDefault from "../../assets/avatar.svg";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [produtos, setProdutos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega usuário logado
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) navigate("/login");
    else setUser(currentUser);
  }, [navigate]);

  // Carrega produtos
  useEffect(() => {
    if (!user) return;

    console.log("Token:", localStorage.getItem("token")); // Debug

    setLoading(true);
    setError(null);

    getProducts()
      .then((data) => setProdutos(data))
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleEdit = (produto) => { setEditingId(produto.id); setEditingData({ ...produto }); };
  const handleSave = (id) => { setProdutos((prev) => prev.map((p) => (p.id === id ? editingData : p))); setEditingId(null); setEditingData({}); };
  const handleDelete = (id) => setProdutos((prev) => prev.filter((p) => p.id !== id));
  const handleChange = (campo, valor) => setEditingData((prev) => ({ ...prev, [campo]: valor }));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo-sidebar">
          <img src={LogoSidebar} alt="Logo Sidebar" />
          <span className="logo-text">MeuGestor</span>
        </div>
        <nav className="menu-total">
          <h3 className="menu-title">Menu</h3>
          <ul className="menu">
            <li className={activeMenu === "Dashboard" ? "active" : ""} onClick={() => setActiveMenu("Dashboard")}><FiShoppingCart /> <span>Dashboard</span></li>
            <li className={activeMenu === "Produtos" ? "active" : ""} onClick={() => setActiveMenu("Produtos")}><FiPackage /> <span>Produtos</span></li>
            <li className={activeMenu === "Vendas" ? "active" : ""} onClick={() => setActiveMenu("Vendas")}><FiPackage /> <span>Vendas</span></li>
            <li className={activeMenu === "Materiais" ? "active" : ""} onClick={() => setActiveMenu("Materiais")}><FiPackage /> <span>Materiais</span></li>
          </ul>
          <h3 className="menu-title">Outros</h3>
          <ul className="outros">
            <li><FiSettings /> Configurações</li>
            <li><FiUsers /> Usuários</li>
            <li><FiPackage /> Empresas</li>
            <li onClick={handleLogout}><FiLogOut /> Sair</li>
          </ul>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="user-info">
            <img src={user?.avatar || AvatarDefault} alt="Avatar" className="avatar" />
            <span>Olá, {user?.fullname || "Usuário"}</span>
          </div>

          <div className="search-container">
            <input type="text" placeholder="Pesquisar..." />
            <FiSearch className="search-icon" />
          </div>

          <div className="dropdown">
            <button className="dropdown-btn" onClick={toggleDropdown}>
              <div className="avatar-container"><span className="emoji">🍔</span></div>
              <span className="user-name">Delicious Burger</span>
              <svg className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button>Perfil</button>
                <button>Configurações</button>
                <button onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>

          <div className="right-bar">
            <div className="notification-container">
              <img src={NotifIcon} alt="Notificação" className="notif-icon" />
              <img src={NotifSign} alt="Sinal de notificação" className="notif-sign" />
            </div>
          </div>
        </header>

        <section className="content">
          {activeMenu === "Dashboard" && <h2>Dashboard</h2>}

          {activeMenu === "Produtos" && (
            <div>
              <h2>Produtos</h2>
              {loading && <p>Carregando produtos...</p>}
              {error && <p>{error}</p>}
              {!loading && !error && (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Marca</th>
                        <th>Preço</th>
                        <th>Validade</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map(prod => (
                        <tr key={prod.id}>
                          <td>{editingId === prod.id ? <input type="text" value={editingData.nome} onChange={(e) => handleChange("nome", e.target.value)} /> : prod.nome}</td>
                          <td>{editingId === prod.id ? <input type="text" value={editingData.marca} onChange={(e) => handleChange("marca", e.target.value)} /> : prod.marca}</td>
                          <td>{editingId === prod.id ? <input type="text" value={editingData.preco} onChange={(e) => handleChange("preco", e.target.value)} /> : prod.preco}</td>
                          <td>{editingId === prod.id ? <input type="text" value={editingData.validade} onChange={(e) => handleChange("validade", e.target.value)} /> : prod.validade}</td>
                          <td>
                            {editingId === prod.id ? <button onClick={() => handleSave(prod.id)}>💾</button> : <>
                              <button onClick={() => handleEdit(prod)}>✏️</button>
                              <button onClick={() => handleDelete(prod.id)}>🗑️</button>
                            </>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};