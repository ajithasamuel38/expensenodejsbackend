const express = require('express');

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth');

const router = express.Router();

 router.post('/expense/expensetable', userauthentication.authenticate, expenseController.postexpense);

 router.get('/expense/expensetable', userauthentication.authenticate, expenseController.getexpense);

 router.delete('/expense/expensetable/:id', userauthentication.authenticate, expenseController.deleteexpense)

 module.exports = router;