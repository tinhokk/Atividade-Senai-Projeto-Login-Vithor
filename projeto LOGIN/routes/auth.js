const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");

const router = express.Router();



router.get("/", (req,res)=>{
    res.redirect("/login");
});



router.get("/login",(req,res)=>{
    res.render("login");
});



router.get("/register",(req,res)=>{
    res.render("register");
});





router.post("/register", async(req,res)=>{

try{


const {nome,email,senha}=req.body;


const existe = await db.query(
"SELECT * FROM usuarios WHERE email=?",
[email]
);



if(existe.length > 0){

return res.render("erro",{

mensagem:"Este e-mail já possui cadastro.",

voltar:"/register"

});

}



const senhaCriptografada =
await bcrypt.hash(senha,10);



await db.query(

"INSERT INTO usuarios(nome,email,senha) VALUES(?,?,?)",

[
nome,
email,
senhaCriptografada
]

);



res.render("sucesso",{

nome:nome

});



}

catch(erro){


console.log(erro);


res.render("erro",{

mensagem:"Erro ao criar conta.",

voltar:"/register"

});


}



});









router.post("/login",async(req,res)=>{


try{


const {email,senha}=req.body;



const usuario = await db.query(

"SELECT * FROM usuarios WHERE email=?",

[email]

);



if(usuario.length===0){


return res.render("erro",{

mensagem:"Usuário não encontrado.",

voltar:"/login"

});



}




const senhaCorreta =
await bcrypt.compare(

senha,

usuario[0].senha

);





if(!senhaCorreta){


return res.render("erro",{

mensagem:"Senha incorreta.",

voltar:"/login"

});


}





req.session.usuario = usuario[0];



// depois do login vai para tarefas

res.redirect("/tarefas");



}


catch(erro){


console.log(erro);


res.render("erro",{

mensagem:"Erro ao realizar login.",

voltar:"/login"

});


}



});












// TELA PRINCIPAL

router.get("/tarefas",async(req,res)=>{


if(!req.session.usuario){

return res.redirect("/login");

}



const tarefas = await db.query(

`

SELECT *

FROM tarefas

WHERE usuario_id=?

AND status='pendente'

ORDER BY data_tarefa, horario

`

,

[

req.session.usuario.id

]

);



res.render("tarefas",{

tarefas:tarefas,

nome:req.session.usuario.nome

});


});









// TELA DE ADICIONAR

router.get("/tarefas/nova",(req,res)=>{


if(!req.session.usuario){

return res.redirect("/login");

}


res.render("nova-tarefa");


});









// SALVAR

router.post("/tarefas/nova",async(req,res)=>{


if(!req.session.usuario){

return res.redirect("/login");

}




const {

titulo,

descricao,

data,

horario


}=req.body;





await db.query(

`

INSERT INTO tarefas

(

usuario_id,

titulo,

descricao,

data_tarefa,

horario

)

VALUES(?,?,?,?,?)

`

,

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











// CONCLUIR

router.get("/tarefas/concluir/:id",async(req,res)=>{


await db.query(

`

UPDATE tarefas

SET status='concluida'

WHERE id=?

`

,

[

req.params.id

]

);



res.redirect("/tarefas");


});









router.get("/logout",(req,res)=>{


req.session.destroy(()=>{

res.redirect("/login");

});


});




module.exports = router;
