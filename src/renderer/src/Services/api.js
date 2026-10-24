const API_URL = "http://127.0.0.1:3001/api";

// --- AUTENTICACIÓN Y USUARIOS ---
export const loginUsuario = async (usuario, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: "Error de conexión con el servidor: " + error.message };
  }
};

export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/usuarios`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const crearUsuario = async (datosUsuario) => {
  try {
    const response = await fetch(`${API_URL}/auth/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosUsuario)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: "DELETE"
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- ÓRDENES DE GRADUACIÓN ---
export const guardarOrden = async (datosOrden) => {
  try {
    const response = await fetch(`${API_URL}/ordenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(datosOrden)
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error || "Error en el servidor" };
    return data;
  } catch (error) {
    return { success: false, error: "No se pudo conectar con el servidor: " + error.message };
  }
};

export const obtenerOrdenes = async () => {
  try {
    const response = await fetch(`${API_URL}/ordenes`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const actualizarOrden = async (id, datosOrden) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(datosOrden)
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error || "Error al actualizar" };
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const eliminarOrden = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/${id}`, { method: "DELETE" });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- ABONOS ---
export const obtenerAbonos = async () => {
  try {
    const response = await fetch(`${API_URL}/ordenes/abonos`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const registrarAbono = async (id, monto, usuarioNombre) => {
  try {
    const response = await fetch(`${API_URL}/ordenes/${id}/abono`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monto, usuarioNombre })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- INVENTARIO Y STOCK ---
export const obtenerInventario = async () => {
  try {
    const response = await fetch(`${API_URL}/inventario`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const crearProductoInventario = async (producto) => {
  try {
    const response = await fetch(`${API_URL}/inventario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const actualizarProductoInventario = async (id, producto) => {
  try {
    const response = await fetch(`${API_URL}/inventario/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const eliminarProductoInventario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/inventario/${id}`, {
      method: "DELETE"
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const reducirStockInventario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/inventario/${id}/reducir`, {
      method: "PUT"
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- RESPALDO BD ---
export const generarRespaldoBD = async () => {
  try {
    const response = await fetch(`${API_URL}/respaldo`, { method: "POST" });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};
