CREATE DATABASE IF NOT EXISTS login_db;

USE login_db;


CREATE TABLE IF NOT EXISTS usuarios(

    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    senha VARCHAR(255) NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS tarefas(

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    data_tarefa DATE NOT NULL,

    horario TIME NOT NULL,

    status VARCHAR(20) DEFAULT 'pendente',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE

);
