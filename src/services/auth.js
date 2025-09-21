import { api } from "../api"; // ajustei o caminho (era `"..api/"`)

// Login e obter usuário
export async function loginAndGetUser({ email, password }) {
  const { data } = await api.post("/login", { email, password });
  const token = data.accessToken || data.token; // depende do que a API retorna
  const partialUser = data.user || {};

  // salva token
  localStorage.setItem("token", token);

  let user = partialUser;

  // caso o usuário não venha completo, busca pelo email
  if (!user.id) {
    const { data: users } = await api.get(
      `/users?email=${encodeURIComponent(email)}`
    );
    user = users?.[0] || partialUser;
  }

  // salva usuário
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}

// Logout
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Pegar usuário atual
export function getCurrentUser() {
  const str = localStorage.getItem("user");
  return str ? JSON.parse(str) : null;
}
