CREATE database urgencias_medicas;
USE urgencias_medicas;

CREATE TABLE Medicos (
id_medico INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
especialidad_id INT,
FOREIGN KEY (especialidad_id) REFERENCES Especialidades(id_especialidad));


INSERT INTO Medicos (nombre, apellido, especialidad_id)
VALUES
("Benjamin", "Soto", "1"),
("Eduardo", "Cortes", "2"),
("Claudio", "Gomez", "3"),
("Shaka", "Falcon", "4"),
("Ymir", "Palacios", "5"),
("Mikasa", "Vidal", "6")
;

CREATE TABLE Pacientes (
id_paciente INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
fecha_nacimiento DATE
);

INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento)
VALUES
("Pedro", "Perez", "1990-01-02"),
("Carlos", "Solar", "1986-02-04"),
("Luis", "Rojas", "1999-03-05"),
("Robin", "Nico", "1994-04-06"),
("Usop", "Sogeking", "1980-05-07"),
("Satoru", "Goyo", "1997-06-08")
;
CREATE TABLE Especialidades (
id_especialidad INT PRIMARY KEY AUTO_INCREMENT,
nombre_especialidad VARCHAR(70) NOT NULL
);

INSERT INTO Especialidades(nombre_especialidad)
VALUES
("Cirugia"),
("Pediatria"),
("Medicina General"),
("Fonoaudiologia"),
("Kinesiologia"),
("Terapia Ocupacional");


CREATE TABLE Actividades (
id_actividad INT PRIMARY KEY AUTO_INCREMENT,
nombre_actividad VARCHAR(50) NOT NULL
);
INSERT INTO Actividades(nombre_actividad)
VALUES
("Curaciones"),
("Toma de examenes"),
("Lectura de recetas"),
("Terapia"),
("Atencion");


CREATE TABLE Atenciones (
id_atencion INT PRIMARY KEY AUTO_INCREMENT,
paciente_id INT NOT NULL,
medico_id INT NOT NULL,
especialidad_id INT NOT NULL,
actividad_id INT NOT NULL,
fecha_ingreso DATE NOT NULL,
fecha_alta DATE NOT NULL,
diagnostico VARCHAR(50),
FOREIGN KEY (paciente_id) REFERENCES Pacientes(id_paciente),
FOREIGN KEY (medico_id) REFERENCES Medicos(id_medico),
FOREIGN KEY (especialidad_id) REFERENCES Especialidades(id_especialidad),
FOREIGN KEY (actividad_id) REFERENCES Actividades(id_actividad)
);

SELECT * FROM Actividades;
INSERT INTO Atenciones(paciente_id, medico_id, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico)
VALUES
("1", "1", "1", "1", "2024-03-07", "2024-05-07", "Fiebre del mono"),
("2", "2", "2", "2", "2024-07-03", "2024-03-07", "Covid"),
("3", "3", "3", "3", "2024-11-12", "2024-12-11", "Estress"),
("4", "4", "4", "4", "2023-09-01", "2023-09-28", "Ulcera"),
("5", "5", "5", "5", "2023-09-02", "2023-09-27", "Bronquitis"),
("6", "6", "6", "3", "2023-09-03", "2023-09-26", "Hernia");
