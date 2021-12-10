import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import Contenedor from './classes/Contenedor.js';
import router from './routes/productos.js';
import upload from './services/uploader.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';
import carrito from './routes/carritos.js';

export const io = new Server(server);

const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor();

const server = app.listen(PORT,()=>{
    console.log("Listening on port: ",PORT)
})

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
app.use(express.static(__dirname+'/public'));
app.use('/api/productos', router);
app.use('api/carrito', carrito);

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})

app.get('/view/prod',(req,res)=>{
    contenedor.getAll().then(result=>{
        let info = result.payload;
        let preparedObject ={
            prod : info
        }
        res.render('prod',preparedObject)
    })
})

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let prods = await contenedor.getAll();
    socket.emit('deliverProds',prods);

})