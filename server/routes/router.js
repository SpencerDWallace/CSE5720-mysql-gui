var express = require('express');
const router = express.Router();
const {queryDB, deleteItem, updateItem, addItem} = require('../controllers/query');

router.get('/db', queryDB);
router.post('/db/delete', deleteItem);
router.post('/db/update', updateItem);
router.post('/db/add', addItem);


module.exports = router;