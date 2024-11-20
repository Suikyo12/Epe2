
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 3000;

//Configuracion de MYSQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'testeo',
    password: 'permiso',
    database: 'urgencias_medicas',
});

//Conectar a la base de datos.
db.connect((error) => {
    if (error) throw error;
    console.log('Conectado a la base de datos Urgencias Medicas');
});

//Configuracion para recibir datos en formato JSON
app.use(express.json());
app.use(cors());

//Ruta de prueba
app.get('/',(req, res) => {
    res.send('Servidor y base de datos estan configurados correctamente. ');
});

//Ruta para listar todas las atenciones.
app.get('/atenciones', (req, res) => {
    const query = `
    SELECT a.id_atencion, p.nombre AS paciente, p.apellido AS paciente_apellido,
    m.nombre AS medico, m.apellido AS medico_apellido,
    e.nombre_especialidad, act.nombre_actividad,
    a.fecha_ingreso, a.fecha_alta, a.diagnostico
    FROM Atenciones a
    JOIN Pacientes p ON a.paciente_id = p.id_paciente
    JOIN Medicos m ON a.medico_id = m.id_medico
    JOIN Especialidades e ON a.especialidad_id = e.id_especialidad
    JOIN Actividades act ON a.actividad_id = act.id_actividad;
    `;
    db.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//POST atenciones.
app.post('/atenciones', async (req, res) => {
    const { pacienteNombre, medicoNombre, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico } = req.body;

    try {
        let [pacienteResult] = await db.promise().query('SELECT id_paciente FROM Pacientes WHERE nombre = ?', [pacienteNombre]);
        let id_paciente;
        if (pacienteResult.length) {
            id_paciente = pacienteResult[0].id_paciente;
        } else {
            // Insertar nuevo paciente
            const insertPacienteResult = await db.promise().query('INSERT INTO Pacientes (nombre) VALUES (?)', [pacienteNombre]);
            id_paciente = insertPacienteResult[0].insertId; // Obtener el ID del nuevo paciente
        }

        let [medicoResult] = await db.promise().query('SELECT id_medico FROM Medicos WHERE nombre = ?', [medicoNombre]);
        let id_medico;
        if (medicoResult.length) {
            id_medico = medicoResult[0].id_medico;
        } else {
            // Insertar nuevo médico (sin apellido)
            const insertMedicoResult = await db.promise().query('INSERT INTO Medicos (nombre) VALUES (?)', [medicoNombre]); // Removed medicoApellido
            id_medico = insertMedicoResult[0].insertId; // Obtener el ID del nuevo médico
        }

        // Insertar la atención
        await db.promise().query(
            'INSERT INTO Atenciones (paciente_id, medico_id, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_paciente, id_medico, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico]
        );

        res.status(201).json({ message: "Atención registrada exitosamente" });
    } catch (error) {
        console.error("Error al registrar la atención:", error);
        res.status(500).json({ error: "Error al registrar la atención" });
    }
});

app.put('/atenciones/:id', async (req, res) => {
    const { id } = req.params;
    const { pacienteNombre, medicoNombre, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico } = req.body;
 
    try {
        const [pacienteResult] = await db.promise().query('SELECT id_paciente FROM Pacientes WHERE nombre = ?', [pacienteNombre]);
        const id_paciente = pacienteResult.length ? pacienteResult[0].id_paciente : null;
 
        const [medicoResult] = await db.promise().query('SELECT id_medico FROM Medicos WHERE nombre = ?', [medicoNombre]);
        const id_medico = medicoResult.length ? medicoResult[0].id_medico : null;
 
        if (!id_paciente || !id_medico) {
            return res.status(404).json({ error: "Paciente o médico no encontrado" });
        }
 
        await db.promise().query(
            'UPDATE Atenciones SET paciente_id = ?, medico_id = ?, especialidad_id = ?, actividad_id = ?, fecha_ingreso = ?, fecha_alta = ?, diagnostico = ? WHERE id_atencion = ?',
            [id_paciente, id_medico, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico, id]
        );
 
        res.json({ message: "Atención actualizada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la atención" });
    }
 });

 app.delete('/atenciones/:id', async (req, res) => {
    const { id } = req.params;
 
    try {
        await db.promise().query('DELETE FROM Atenciones WHERE id_atencion = ?', [id]);
        res.json({ message: "Atención eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la atención" });
    }
 });


app.get('/atenciones/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT a.id_atencion, p.nombre AS paciente, p.apellido AS paciente_apellido,
               m.nombre AS medico, m.apellido AS medico_apellido,
               e.nombre_especialidad, act.nombre_actividad,
               a.fecha_ingreso, a.fecha_alta, a.diagnostico
        FROM Atenciones a
        JOIN Pacientes p ON a.paciente_id = p.id_paciente
        JOIN Medicos m ON a.medico_id = m.id_medico
        JOIN Especialidades e ON a.especialidad_id = e.id_especialidad
        JOIN Actividades act ON a.actividad_id = act.id_actividad
        WHERE a.id_atencion = ?;
    `;
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error en la consulta de la atención' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Atención no encontrada' });
        } else {
            res.json(results[0]);
        }
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});