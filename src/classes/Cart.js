import fs from 'fs';
import Contenedor from './Contenedor.js';

export default class Cart{

    async addProduct(number, productoAdd){
        try{
            let archivo = await fs.promises.readFile('./files/productos.txt', 'utf-8');
            let carritos = JSON.parse(archivo);
            let index = carritos.findIndex(cart => cart.id === number);
            if (index === -1){
                return { status: "success", message: "El id no existe"}
            }else{
                let carritoElegido = carritos[index];
                let producto = new Contenedor();
                let agregar = (await producto.getById(productoAdd.id)).message;
                agregar.stock = productoAdd.stock;
                carritoElegido.producto.push(agregar);
                let carritoNuevo = carritos.map( (cart)=> {
                    if (cart.id === number){
                        return carritoElegido;
                    }else{
                        return cart;
                    }
                })
                await fs.promises.writeFile("./files/productos.txt", JSON.stringify(productos, null, 2))      
                return {status: "success", message: `se agrego el producto al carrito`}
            }

        }            
        catch{
            return {status: "error", message: "No se pudo agregar el producto al carrito"}
        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile("./files/productos.txt", 'utf-8')
            let productos = JSON.parse(data)
            return {status: "succes", productos}
        }
        catch{
            return {status:"error", message:"No se pudo recuperar los productos"}
        }
    }

}