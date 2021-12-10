import express from 'express';
import Contenedor from '../classes/Contenedor.js';
import upload from '../services/uploader.js';
import {io} from '../app.js';

const router = express.Router();
const contenedor  = new Contenedor();

//GETS
router.get('/',(req,res)=>{
    contenedor.getAll().then(result=>{
        res.send(result);
    })
})
router.get('/:pid',(req,res)=>{
    let id = parseInt(req.params.pid);
    contenedor.getById(id).then(result=>{
        res.send(result);
    })
})
//POSTS
router.post('/',upload.single('image'),(req,res)=>{
    let file = req.file;
    let prod = req.body;
    prod.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/imagenes/'+file.filename;
    contenedor.saveObject(prod).then(result=>{
        res.send(result);
        if(result.status==="success"){
            contenedor.getAll().then(result=>{
                console.log(result);
                io.emit('deliverProds',result);
            })
        }
    })
})
//PUTS
router.put('/:pid',(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.pid);
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})
//DELETES
router.delete('/:pid',(req,res)=>{
    let id= parseInt(req.params.pid);
    contenedor.deleteById(id).then(result=>{
        res.send(result)
    })
})
export default router;