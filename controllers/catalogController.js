const catalogController = require("express").Router();
const { hasUser } = require("../middlewares/guards");
const { getAll, createProduct, getById, editProduct, deleteProduct, getByUserId } = require("../services/productService");
const parseError = require("../util/parser");
const storage = require("../middlewares/storage");

catalogController.get('/', async (req, res) => {
    let products = [];
    if(req.query.where) {

        const userId = JSON.parse(req.query.where.split('=')[1])
        products = await getByUserId(userId);    
        
    } else {
        products = await getAll();    
    } 
    res.json(products);
})

catalogController.post('/', hasUser(), storage,  async (req, res) => {
    try {
        // console.log(req.user._id,  '\n ID And req.body \n', req.body, '\n here ? \n ', req.body.imgFile);
        const data = Object.assign({ _ownerId: req.user._id, imgFile: `http://localhost:3030/image/${req.file.filename}`}, req.body );
        console.log({data}, '\n And the old data \n', req.body);
        let product = await createProduct(data);
        console.log(product);
        res.json(product);
    } catch (error) {
        let message = parseError(error);
        console.log(message);
        res.status(400).json({ message })
    }
})

catalogController.get('/:id', async (req, res) => {
    let product = await getById(req.params.id);
    res.json(product);
})

catalogController.put('/:id', hasUser(), storage, async (req, res) => {
    let product = await getById(req.params.id);
    if(req.user._id != product._ownerId._id){
        console.log(req.user._id, '  ==  ',product._ownerId._id)
        return res.status(403).json({ message: 'You cannot modify this record' });
    }
    
    try{
        const data = Object.assign({ imgFile: `http://localhost:3030/image/${req.file.filename}`}, req.body );
        console.log('what we have here >',data);
        const result = await editProduct(req.params.id, data);
        res.json(result);
    } catch (error) {
        let message = parseError(error);
        console.log(message);
        res.status(400).json({ message })
    }
})

catalogController.delete('/:id', hasUser(), async(req, res) => {
    let product = await getById(req.params.id);

    if(req.user._id != product._ownerId._id){
        console.log(req.user._id, '  ? = ?  ',  product._ownerId._id)
        return res.status(403).json({ message: 'You cannot modify this record' });
    }
    try{
        await deleteProduct(req.params.id);
        res.status(204).end()
    } catch (error) {
        let message = parseError(error);
        res.status(400).json({ message })
    }
})

module.exports = catalogController;