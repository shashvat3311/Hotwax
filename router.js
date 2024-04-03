const express=require('express');
const router=express.Router();
const controller=require('./controllers/controller')
const db=require("./db");

// ----------- Previously created API's-------------------
// router.post("/createParty",controller.createParty);
// router.post("/createParty",controller.createParty)
// router.get('/getParty',controller.getParty)
// router.get('/getPerson',controller.getPerson)
// router.post('/createPerson',controller.createPerson)
// router.post('/addOrderItems',controller.addOrderItems)

// ------------ Newly prepared API's----------------------

router.post('/addOrderPart',controller.addOrderPart)
router.post('/createOrderItem',controller.createOrderItem)
router.post('/createOrder',controller.createOrder)
router.post('/createPersonandParty',controller.createPersonandParty)
router.get('/addOrderItems',controller.getOrderItems)
router.get('/getAllOrders',controller.getAllOrders)
router.get('/createPersonParty',controller.$createPersonParty)
router.put('/updateOrder',controller.updateOrder)

module.exports=router


