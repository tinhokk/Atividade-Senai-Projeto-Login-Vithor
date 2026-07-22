const mariadb = require("mariadb");


const pool = mariadb.createPool({

    host: "127.0.0.1",

    port: 3306,

    user: "login_app",

    password: "123456",

    database: "login_db",

    connectionLimit: 5

});


pool.getConnection()

.then(conexao => {

    console.log("Banco conectado com sucesso!");

    conexao.release();

})

.catch(erro => {

    console.log("Erro ao conectar no banco:");

    console.log(erro.message);

});


module.exports = pool;
