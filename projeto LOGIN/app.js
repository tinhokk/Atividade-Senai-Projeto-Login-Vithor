const express = require("express");
const session = require("express-session");
const path = require("path");

const auth = require("./routes/auth");
const tarefas = require("./routes/tarefas");


const app = express();


const PORTA = 3000;


app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


app.use(express.urlencoded({
    extended:true
}));


app.use(express.static(
    path.join(__dirname,"public")
));


app.use(session({

    secret:"segredo123",

    resave:false,

    saveUninitialized:false

}));


app.use("/",auth);

app.use("/",tarefas);



app.use((err,req,res,next)=>{

    console.log(err);

    res.status(500)
    .send("Erro interno");

});



app.listen(PORTA,()=>{

console.log(
`Rodando em: http://localhost:${PORTA}`
);

});
