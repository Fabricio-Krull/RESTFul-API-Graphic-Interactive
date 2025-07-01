import express from 'express';
import sequelize from './database/index.js';
import Dado from './models/Dado.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/dados", async (req, res) => {

    try {
        const { p1, p2, p3 } = req.body;
        if (p1.trim() && p2.trim() && p3.trim()) {
            const stringId = `${p1.trim()}_${p2.trim()}_${p3.trim()}`;
            const createdData = await Dado.create({ p1, p2, p3, stringId });
            console.log("Objeto JSON salvo no banco: ", createdData.toJSON());
            res.json({mensagem: "Dados armazenados com sucesso!"});
        }
        else{
            return res.status(400).json({ erro: "Todos os campos são obrigatórios e devem ser strings não vazias." });
        }
    }
    catch(error){
        console.log("Erro ao salvar no banco", error);
        res.status(500).json({erro: "Erro ao salvar os dados"});
    }
});

app.patch("/dados/:id", async (req, res) => {
    const id = req.params.id;
    try{
        
        const p1 = String(req.body.p1 ?? "").trim();
        const p2 = String(req.body.p2 ?? "").trim();
        const p3 = String(req.body.p3 ?? "").trim();

        // agui
        if (!p1 && !p2 && !p3) {
            return res.status(400).json({ erro: "Ao menos um campo deve estar preenchido para a atualização dos dados." });
        }
        const data = await Dado.findByPk(id);

        if (!data) {
            return res.status(404).json({ erro: "Dado não encontrado." });
        }

        if(p1 !== data.p1 && p1 !== ""){
            data.p1 = p1.trim();
        }
        if(p2 !== data.p2 && p2 !== ""){
            data.p2 = p2.trim();
        }
        if(p3 !== data.p3 && p3 !== ""){
            data.p3 = p3.trim();
        }

        data.stringId = `${data.p1}_${data.p2}_${data.p3}`;
    
        await data.save();
    
        res.status(200).json({ mensagem: "Dado atualizado com sucesso!", data });
    }

    catch(error){
        console.log("Erro ao atualizar dados", error);
        res.status(500).json({erro: "Erro ao atualizar os dados"});
    }

});

app.get("/dados", async (req, res) => {
    try {
        const data = await Dado.findAll({
            order: [["createdAt", "DESC"]]
        });

        if(data.length === 0){
            return res.status(404).json({erro: "Nenhum dado registrado ainda."});
        }

        res.json(data);
        return;
    }
    catch(error){
        console.log("Erro ao buscar dados: ", error);
        res.status
    }
});

app.get("/dados/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Dado.findByPk(id);

        if (!data) {
            return res.status(404).json({ erro: "Dado não encontrado." });
        }

        res.json(data);
        return;
    }
    catch(error){
        console.log("Erro ao buscar dado: ", error);
        res.status
    }
});

app.delete("/dados/:id", async (req, res) => {

    const id = req.params.id;

    try{
        const data = await Dado.findByPk(id);
        if(!data){
            console.log("Erro ao apagar dado");
            res.status(400).json({erro:"Não foi possível encontrar dado."});
            return;
        }
        await Dado.destroy({where: { id: id } });
        console.log("Dado apagado com sucesso!");
        res.status(200).json({mensagem: "Dado apagado com sucesso!"});
        return;
    }
    catch(error){
        console.log("Erro ao apagar dado");
        res.status(400).json({erro: "Não foi possível apagar dado"});
    }

});

async function startApp(){
    
    sequelize.sync().then(() => {
        console.log("Banco de dados sincronizado");
    });
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

startApp();
