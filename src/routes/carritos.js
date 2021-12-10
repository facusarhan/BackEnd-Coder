import express from 'express';
import Cart from '../classes/Cart.js';

const carrito = express.Router();
const carro = new Cart();

const administrador = true;

carrito.get('/', (req,res)=>{
    carro.getAll().then(result=>{
        res.send(result);
    })
});

if ( administrador = true){
    carrito.post('/', (req, res)=> {
        carro.addProduct().then(result=>{
            res.send(result);
        })
    })
}else{
    return {status:"error",message:"No eres Administrador"}
}


export default carrito;