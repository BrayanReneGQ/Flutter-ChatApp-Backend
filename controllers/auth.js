const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const crearUsuario = async (req, res = response) => {
    const { AVC, cedula } = req.body;
    try {
        const existeAVC = await Usuario.findOne({ AVC });
        if (existeAVC) {
            return res.status(400).json({
                ok: false,
                msg: 'El AVC ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body);

        //Encriptar Contraseña:!!!
        const salt = bcrypt.genSaltSync();
        usuario.cedula = bcrypt.hashSync(cedula, salt);

        await usuario.save();

        // Generar mi JWT Jason Web Token
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin por favor!'
        });
    }
}
const login = async (req, res = response) => {
    const { AVC, cedula } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ AVC });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'AVC no encontrado!!'
            });
        }
        //Validar el password
        const validCedula = bcrypt.compareSync(cedula, usuarioDB.cedula);
        if (!validCedula) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida!!!!'
            });
        }
        // Generar el JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin Urgente'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}