/*
    path: /api/login
*/



const { Router } = require('express');
const { check } = require('express-validator');


const { crearUsuario } = require('../controllers/auth');
const { login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('AVC', 'El AVC es obligatorio').not().isEmpty(),
    check('cedula', 'La Cedula de identidad es obligatoria').not().isEmpty(),
    validarCampos
], crearUsuario);

router.post('/', [
    check('AVC', 'El AVC es obligatorio').not().isEmpty(),
    check('cedula', 'La Cedula de identidad es obligatoria').not().isEmpty(),

], login);

//validar JWT
router.get('/renew', validarJWT,renewToken);


module.exports = router;