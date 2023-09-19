const Usuario = require('../models/user.model');
const jwt = require("jsonwebtoken");
//const { checkout } = require('../../OneDrive/Área de Trabalho/mern 2 back up/src/routes');
const secret = "mysecret";

module.exports = {
    async index(req,res){
        const user = await Usuario.find();
        res.json(user);
    },
    async create(req,res){
        const {nome_usuario, email_usuario, tipo_usuario,senha_usuario,iduser} = req.body;
        let data = {};
        let user =  await Usuario.findOne({email_usuario});
        
        if(!user){
            data = {nome_usuario,email_usuario,tipo_usuario,senha_usuario, iduser };

            user = await Usuario.create(data);
            return res.status(200).json(user);
        }else{
            return res.status(500).json(user);
        }
    },
    async details(req,res){
        const {_id} = req.params;
        const user = await Usuario.findOne({_id});
        res.json(user);
    },
    async delete(req,res){
        const { _id } = req.params;
        const user = await Usuario.findByIdAndDelete({_id});
        return res.json(user);
    },
    async update(req,res){
        const { _id, nome_usuario, email_usuario, senha_usuario,tipo_usuario } = req.body;
        const data = {nome_usuario,email_usuario,senha_usuario,tipo_usuario};
        const user = await Usuario.findOneAndUpdate({_id},data,{new:true});
        res.json(user);
    },
    async login(req,res){
        const { email, senha } = req.body;
            
            try {
                const user = await Usuario.findOne({ email_usuario: email });

                if (!user) {
                return res.status(200).json({ status: 2, error: 'E-mail não encontrado no banco de dados' });
                }

                const isPasswordCorrect = await user.isCorrectPassword(senha);

                if (!isPasswordCorrect) {
                return res.status(200).json({ status: 2, error: 'A senha não confere' });
                }

                const payload = { email };
                const token = jwt.sign(payload, secret, {
                expiresIn: '24h'
                });

                res.cookie('token', token, { httpOnly: true });
                res.status(200).json({
                status: 1,
                auth: true,
                token: token,
                id_client: user._id,
                user_name: user.nome_usuario,
                user_type: user.tipo_usuario,
                iduser: user.iduser
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro no servidor. Por favor, tente novamente' });
            }
    },
    async checkToken(req,res){
        const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
        if(!token){
            res.json({status:401,msg:'Não autorizado: Token inexistente!'});
        }else{
            jwt.verify(token, secret, function(err, decoded){
                if(err){
                    res.json({status:401,msg:'Não autorizado: Token inválido!'});
                }else{
                    res.json({status:200})
                }
            })
        }
    },
    async destroyToken(req,res){
        const token = req.headers.token;
        if(token){
            res.cookie('token',null,{httpOnly:true});
        }else{
            res.status(401).send("Logout não autorizado!")
        }
        res.send("Sessão finalizada com sucesso!");
    }
}