const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Healthcheck
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "API en Render", ts: new Date().toISOString() });
});

// Hora del sistema (requisito de endpoint simple)
app.get("/api/hora", (_req, res) => {
  res.json({ fecha: new Date().toISOString() });
});

// Listar usuarios
app.get("/api/usuarios", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario ASC");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/usuarios ->", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Insertar usuario
app.post("/api/usuarios", async (req, res) => {
  const { nombre, correo, password } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "nombre, correo y password son obligatorios" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3) RETURNING *",
      [nombre, correo, password]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/usuarios ->", err);
    // Manejo simple de UNIQUE violation en correo
    if (err.code === "23505") {
      return res.status(409).json({ error: "El correo ya existe" });
    }
    res.status(500).json({ error: "Error al insertar usuario" });
  }
});

// Obtener un usuario por id
app.get("/api/usuarios/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/usuarios/:id ->", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Actualizar usuario
app.put("/api/usuarios/:id", async (req, res) => {
  const { nombre, correo, password } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nombre = COALESCE($1, nombre),
           correo = COALESCE($2, correo),
           password = COALESCE($3, password)
       WHERE id_usuario = $4
       RETURNING *`,
      [nombre ?? null, correo ?? null, password ?? null, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/usuarios/:id ->", err);
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// Eliminar usuario
app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1",
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: "No encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/usuarios/:id ->", err);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
