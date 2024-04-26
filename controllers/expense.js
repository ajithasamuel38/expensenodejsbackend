const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../config/db')

exports.postexpense = async(req, res, next) =>{
    const t = await sequelize.transaction();
    console.log(req.body);
    try {
        const [expense, user] = await Promise.all([
            Expense.create({ ...req.body, signupId: req.user.id }, { transaction: t }),
            User.findOne({ where: { id: req.user.id }, transaction: t })
        ]);

        const totalExpense = Number(user.totalexpense) + Number(req.body.amount);
        await user.update({ totalexpense: totalExpense }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Expense Added Successfully", expense: expense });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getexpense = async(req, res, next) =>{
    console.log(req.body)
    try{
        const response = await Expense.findAll({where : { signupId: req.user.id}});
        res.status(200).json(response);
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
     }
}

exports.deleteexpense = async(req, res, next) =>{
    const t = await sequelize.transaction();
    
    try {
        const id = req.params.id;

        const [expensetodelete, user] = await Promise.all([
            Expense.findOne({ where: { id: id, signupId: req.user.id } }),
            User.findOne({ where: { id: req.user.id }, include: 'expense' })
        ]);

        if (!expensetodelete) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const amount = expensetodelete.amount;
        await expensetodelete.destroy({ transaction: t });

        if (user.expense.length === 1) {

            await user.update({ totalexpense: 0 }, { transaction: t });
        } else {
            
            const updatedexpense = Number(user.totalexpense) - Number(amount);
            await user.update({ totalexpense: updatedexpense }, { transaction: t });
        }
        
        t.commit();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        t.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}