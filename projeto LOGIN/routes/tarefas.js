const express = require("express");

const db = require("../database");

const router = express.Router();



function verificar(req,res,next){

if(!req.session.usuario){

return res.redirect("/login");

}


next();

}





router.get("/tarefas",verificar,async(req,res)=>{


const lista =
await db.query(

"SELECT * FROM tarefas WHERE usuario_id=? AND status='pendente'",

[req.session.usuario.id]

);



res.render("tarefas",{

tarefas:lista

});


});





router.get("/tarefas/nova",verificar,(req,res)=>{


res.render("nova-tarefa");


});





router.post("/tarefas/nova",verificar,async(req,res)=>{


const {

titulo,

descricao,

data,

horario

}=req.body;



await db.query(

`INSERT INTO tarefas
(usuario_id,titulo,descricao,data_tarefa,horario)
VALUES(?,?,?,?,?)`,

[
req.session.usuario.id,
titulo,
descricao,
data,
horario
]

);



res.redirect("/tarefas");


});





router.get("/tarefas/concluir/:id",verificar,async(req,res)=>{


await db.query(

"UPDATE tarefas SET status='concluida' WHERE id=?",

[req.params.id]

);



res.redirect("/tarefas");


});



module.exports=router;
