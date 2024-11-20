const atencionForm = document.getElementById('atencionForm');
const atencionesTable = document.getElementById('atencionesTable').getElementsByTagName('tbody')[0];

// Función para obtener y mostrar las atenciones
function obtenerAtenciones() {
    fetch('http://localhost:3000/atenciones')
    .then(response => response.json())
    .then(data => {
        atencionesTable.innerHTML = ''; // Limpia la tabla antes de llenarla
        data.forEach(atencion => {
            const row = `
                <tr data-id="${atencion.id_atencion}">
                    <td>${atencion.paciente}</td>
                    <td>${atencion.medico}</td>
                    <td>${atencion.nombre_especialidad}</td>
                    <td>${atencion.nombre_actividad}</td>
                    <td>${atencion.fecha_ingreso}</td>
                    <td>${atencion.fecha_alta}</td>
                    <td>${atencion.diagnostico}</td>
                    <td>
                        <button onclick="editarAtencion(${atencion.id_atencion})">Editar</button>
                        <button onclick="eliminarAtencion(${atencion.id_atencion})">Eliminar</button>
                    </td>
                </tr>`;
            atencionesTable.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
}

// Manejo del envío del formulario
atencionForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el envío del formulario por defecto

    const formData = {
        pacienteNombre: document.getElementById('pacienteNombre').value,
        medicoNombre: document.getElementById('medicoNombre').value,
        especialidad_id: document.getElementById('especialidad').value,
        actividad_id: document.getElementById('actividad').value,
        fecha_ingreso: document.getElementById('fecha_ingreso').value,
        fecha_alta: document.getElementById('fecha_alta').value,
        diagnostico: document.getElementById('diagnostico').value,
        atencion_id: document.getElementById('atencion_id').value // Para editar
    };

    const method = formData.atencion_id ? 'PUT' : 'POST'; // Determina si es una inserción o actualización
    const url = formData.atencion_id ? `http://localhost:3000/atenciones/${formData.atencion_id}` : 'http://localhost:3000/atenciones';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            alert(data.error); // Muestra un mensaje de error al usuario
            return;
        }
        
        obtenerAtenciones(); // Llama a la función para actualizar la lista
        atencionForm.reset(); // Resetea el formulario
        document.getElementById('atencion_id').value = ''; // Limpia el ID
    })
    .catch(error => console.error('Error:', error));
});

// Función para editar una atención
function editarAtencion(id) {
    fetch(`http://localhost:3000/atenciones/${id}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('pacienteNombre').value = data.paciente; // Asigna los valores al formulario
        document.getElementById('medicoNombre').value = data.medico;
        document.getElementById('especialidad').value = data.especialidad_id; // Asigna el ID correspondiente
        document.getElementById('actividad').value = data.actividad_id; // Asigna el ID correspondiente
        document.getElementById('fecha_ingreso').value = data.fecha_ingreso;
        document.getElementById('fecha_alta').value = data.fecha_alta;
        document.getElementById('diagnostico').value = data.diagnostico;
        
        // Guarda el ID en un campo oculto para usarlo al actualizar
        document.getElementById('atencion_id').value = id;
    })
    .catch(error => console.error('Error:', error));
}

// Función para eliminar una atención
function eliminarAtencion(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta atención?")) { // Confirmación antes de eliminar
        fetch(`http://localhost:3000/atenciones/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            obtenerAtenciones(); // Actualiza la lista después de eliminar
            alert(data.message); // Muestra un mensaje de éxito
        })
        .catch(error => console.error('Error:', error));
    }
}

// Llama a la función para cargar las atenciones al iniciar
obtenerAtenciones();