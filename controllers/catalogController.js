const catalogController = require("express").Router();
const { hasUser } = require("../middlewares/guards");
const { getAll, createProduct, getById, editProduct, deleteProduct, getByUserId } = require("../services/productService");
const parseError = require("../util/parser");


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

catalogController.post('/', hasUser(), async (req, res) => {
    try {
        const data = Object.assign({ _ownerId: req.user._id}, req.body );
        // console.log(data, '\n And the old data \n', req.body);
        let product = await createProduct(data);
        res.json(product);
    } catch (error) {
        let message = parseError(error);
        res.status(400).json({ message })
    }
})

catalogController.get('/:id', async (req, res) => {
    let product = await getById(req.params.id);
    res.json(product);
})

catalogController.put('/:id', hasUser(), async (req, res) => {
    let product = await getById(req.params.id);
    if(req.user._id != product._ownerId){
        return res.status(403).json({ message: 'You cannot modify this record' });
    }
    
    try{
        const result = await editProduct(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        let message = parseError(error);
        res.status(400).json({ message })
    }
})

catalogController.delete('/:id', hasUser(), async(req, res) => {
    let product = await getById(req.params.id);
    if(req.user._id != product._ownerId){
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