const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "empleados_crud"
});

// Manejar la conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

app.post("/create", (req, res) => {
    const { nombre, edad, pais, cargo, anios } = req.body;

    db.query(
        'INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?, ?, ?, ?, ?)',
        [nombre, edad, pais, cargo, anios],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar el empleado");
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/empleados", (req, res) => {
    db.query(
        'SELECT * FROM empleados',
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener la lista de empleados");
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/update", (req, res) => {
    const { id, nombre, edad, pais, cargo, anios } = req.body;

    db.query(
        'UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, anios=? WHERE id=?',
        [nombre, edad, pais, cargo, anios, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar el empleado");
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/delete/:id", (req, res) => {
    const { id } = req.params; // Corregido para extraer correctamente el id

    db.query(
        'DELETE FROM empleados WHERE id=?',
        [id], // Array de parámetros para la consulta SQL
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al eliminar el empleado");
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});