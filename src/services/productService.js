export const getProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado. Usuário não está logado.");

    const response = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text}`);
    }

    const data = await response.json();

    const formatted = data.map((prod, index) => ({
      id: prod.id || index,
      nome: prod.name || "",
      marca: prod.brand || "",
      preco:
        prod.price !== undefined
          ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.price)
          : "",
      validade: prod.expirationDate
        ? (() => {
            const d = new Date(prod.expirationDate);
            return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
          })()
        : "",
    }));

    return formatted;
  } catch (err) {
    console.error("Erro detalhado no getProducts:", err);
    throw err;
  }
};
