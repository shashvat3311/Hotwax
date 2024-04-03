const db = require("../db")
const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const createOrderItem = async (req, res) => {
  try {
    const { order_id, order_item_seq_id, order_part_seq_id, product_id, item_description, quantity, unit_amount, item_type_enum_id, item_type_seq_id } = req.body
    const queryString = "Insert into order_item(order_id,order_item_seq_id,order_part_seq_id,product_id,item_description,quantity,unit_amount,item_type_enum_id,item_type_seq_id) values(?,?,?,?,?,?,?,?,?) "

    db.query(queryString, [order_id, order_item_seq_id, order_part_seq_id, product_id, item_description, quantity, unit_amount, item_type_enum_id, item_type_seq_id], (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          err: err
        })
      }
      if (result) {
        const queryString = 'select * from order_item where order_item_seq_id=?';
        db.query(queryString, [order_item_seq_id], (err, result) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err
            })
          }
          return res.status(200).send({
            success: true,
            result: result
          })
        })
      }
    })
  }
  catch (err) {
    res.status(500).send({
      success: false,
      err: err
    })
  }
}

const addOrderPart = async (req, res) => {
  try {
    const { order_id, order_part_seq_id, part_name, status_id, vendor_party_id, customer_party_id, part_total, facility_id, shipment_method_enum_id } = req.body;
    const queryString = "Insert into order_part(order_id,order_part_seq_id,part_name,status_id,vendor_party_id,customer_party_id,part_total,facility_id,shipment_method_enum_id) values (?,?,?,?,?,?,?,?,?)"

    db.query(queryString, [order_id, order_part_seq_id, part_name, status_id, vendor_party_id, customer_party_id, part_total, facility_id, shipment_method_enum_id], (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          err: err
        })
      }
      if (result) {
        const queryString = 'select * from order_part where order_part_seq_id =?'
        db.query(queryString, [order_part_seq_id], (err, result) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err
            })
          }
          return res.status(200).send({
            success: true,
            message: "Order Part crated successfully!",
            result: result
          })
        })
      }
    })

  }
  catch (err) {
    res.status(500).send({
      success: false,
      err: err
    })
  }
}

const createOrder = async (req, res) => {

  try {
    const { order_id, order_name, currency_uom_id, sales_channel_enum_id, status_id, product_store_id, placed_date, approoved_date } = req.body;

    const queryString = 'Insert into order_header (order_id,order_name,currency_uom_id ,sales_channel_enum_id,status_id,product_store_id,placed_date,approoved_date) values(?,?,?,?,?,?,?,?)'
    db.query(queryString, [order_id, order_name, currency_uom_id || "USD", sales_channel_enum_id, status_id, product_store_id, placed_date, approoved_date], (err, result) => {

      if (err) {
        res.status(400).send({
          success: false,
          err: err.message
        })
      }
      if (result) {

        const queryString = 'select * from order_header where order_id =?'
        db.query(queryString, [order_id], (err, result) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err
            })
          }
          if (result) {
            return res.status(200).send({
              success: true,
              message: 'Order created Successfully',
              result: result
            })
          }
        })
      }

    })
  }

  catch (err) {
    res.status(400).send({
      success: false,
      err: err
    })
  }
}

const createPersonandParty = async (req, res) => {
  try {

    const { party_id, party_typ_enum_id, salutation, first_name, middle_name, last_name, gender, birth_date, maritial_status_enum_id, occupation } = req.body

    const queryString_checkExistingParty = 'select * from person where party_id=?'
    const queryStringParty = "insert into party(party_id,party_typ_enum_id) values(?,?) ";
    db.query(queryStringParty, [party_id, party_typ_enum_id], (err, result) => {

      if (err) {
        return res.status(400).send({
          success: false,
          err: err,
          err_message: "Error creating party"
        })
      }
      const queryStringPerson = "insert into person(party_id,salutation,first_name,middle_name,last_name,gender,birth_date,maritial_status_enum_id,occupation) values(?,?,?,?,?,?,?,?,?)";


      db.query(queryStringPerson, [party_id, salutation, first_name, middle_name, last_name, gender, birth_date, maritial_status_enum_id, occupation], (err, result) => {

        if (err) {
          return res.status(400).send({
            success: false,
            err: err,
            err_message: "Error Creating person "
          })
        }
        return res.status(200).send({
          success: true,
          result: result
        })
      })
    })
  }
  catch (err) {
    return res.status(400).send({
      success: false,
      err: err
    })
  }
}
const getOrderItems = async (req, res) => {

  try {
    const queryString = "select order_id,part_name,facility_id,shipment_Method_Enum_Id,customer_party_id from order_part where order_part_seq_id=? "
    const { order_part_seq_id } = req.body

    db.query(queryString, [order_part_seq_id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          err: err
        })
      }
      if (result) {
        queryStringOder_item = "select * from order_item where order_part_seq_id=? "
        db.query(queryStringOder_item, [order_part_seq_id], (err, results) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err
            })
          }
          return res.status(200).send({
            success: true,
            result: [result, {
              item_details: results
            }]
          })
        })
      }

    })

  } catch (err) {
    return res.status(400).send({
      success: false,
      err: err
    }


    )
  }
}

const getAllOrders = async (req, res) => {
  try {
    const auth = req.headers.authorization.split(" ")[1]
    const decode = jwt.decode(auth)

    const decoded_Partyid = decode.data[0].party_id

    const queryString_order_header = "select order_id,order_name,currency_uom_id,sales_channel_enum_id,status_id,placed_date,grand_total from order_header where order_id = ?";

    const queryString_order_item = " select order_item_seq_id,product_id,item_description,quantity,unit_amount from order_item where order_id =?";

    const queryString_order_part = "select order_part_seq_id,part_name,facility_id,shipment_method_enum_id,part_total from order_part where order_id =? ";

    const queryString_person = "select customer_party_id,first_name,middle_name,last_name from order_item where order_id=?";

    const { order_id } = req.body;

    db.query(queryString_order_header, [order_id], (err, result_header) => {
      if (err) {
        return res.status(400).send({
          success: false,
          err: err
        })
      }
      db.query(queryString_order_part, [order_id], (err, result_part) => {
        if (err) {
          return res.status(400).send({
            success: false,
            err: err
          })
        }
        db.query(queryString_order_item, [order_id], (err, result_item) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err
            })
          }
          return res.status(200).send({
            success: true,
            result: {
              orders: result_header,
              order_parts: result_part,
              item_details: result_item
            }

          })
        })
      })

    })

  }
  catch (err) {
    res.status(401).send({
      success: false,
      err: err
    })
  }

}

const $createPersonParty = async (req, res) => {
  try {

    const { party_id, party_typ_enum_id, salutation, first_name, middle_name, last_name, gender, birth_date, maritial_status_enum_id, occupation } = req.body
    const queryStringCheck_isPartyExists = 'select * from party where party_id =?';
    const queryStringCreateNewPerson = "insert into person(party_id,salutation,first_name,middle_name,last_name,gender,birth_date,maritial_status_enum_id,occupation) values(?,?,?,?,?,?,?,?,?)";
    const queryStringcreateNewParty = "insert into party(party_id,party_typ_enum_id) values(?,?)"
    const queryString_getParty = "select * from party where party_id = ?";
    const queryString_getPerson = "select * from person where party_id =?";

    db.query(queryStringCheck_isPartyExists, [party_id], (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          err: err
        })
      }
      if (!result.length) {
        db.query(queryStringcreateNewParty, [party_id, party_typ_enum_id], (err, result) => {
          if (err) {
            return res.status(400).send({
              err: err,
              err_message: "error inserting party entry"
            })
          }
          console.log("Query 1 Executed")
          db.query(queryStringCreateNewPerson, [party_id, salutation, first_name, middle_name, last_name, gender, birth_date, maritial_status_enum_id, occupation], (err, result) => {
            if (err) {
              return res.status(400).send({
                success: false,
                err: err,
                err_message: "Error inserting in person"
              })
            }
            console.log("Query 2 Executed")
            db.query(queryString_getParty, [party_id], (err, resultParty) => {
              if (err) {
                return res.status(400).send({
                  success: false,
                  err: err,
                  err_message: "Error Fetching Party Table Entry "
                })
              }
              console.log("Query 3 Executed")
              db.query(queryString_getPerson, [party_id], (err, resultPerson) => {
                if (err) {
                  return res.status(400).send({
                    success: false,
                    err: err,
                    err_message: "Error Fetching Person Table Entry"
                  })
                }
                const token = jwt.sign({ data: [resultPerson[0]] }, process.env.HOTWAXSECRET)
                console.log("Query 4 Executed")
                return res.status(200).send({
                  success: true,
                  message: "Party and Person Created Successfully!",
                  party: resultParty,
                  person: resultPerson,
                  token: token
                })
              })

            })

          })
        })
      }
      else {
        db.query(queryStringCreateNewPerson, [party_id, salutation, first_name, middle_name, last_name, gender, birth_date, maritial_status_enum_id, occupation], (err, result) => {
          if (err) {
            return res.status(400).send({
              success: false,
              err: err,
              err_message: "Error creating new Person"
            })
          }
          db.query(queryString_getParty, [party_id], (err, resultParty) => {
            if (err) {
              res.status(400).send({
                success: false,
                err: err,
                err_message: "Error fetching party entry"
              })
            }
            db.query(queryString_getPerson, [party_id], (err, resultPerson) => {
              if (err) {
                return res.status(400).send({
                  success: false,
                  err: err,
                  err_message: "Error fetching Person entry"
                })
              }
              const token = jwt.sign({ data: [resultPerson[0]] }, process.env.HOTWAXSECRET)
              return res.status(200).send({
                success: true,
                message: "Successfuly created Person",
                person: resultPerson,
                token: token
              })
            })
          })
        })
      }
    })
  }
  catch (err) {
    return res.status(400).send({
      success: false,
      err: err
    })
  }
}

const updateOrder=async(req,res)=>{
  try{
     const queryString =' update order_header set order_name =? where order_id =?'
     const queryStringGetUpdatedRecord='select * from order_header  where order_id=? limit 1'
     const{order_id,order_name}=req.body

     db.query(queryString,[order_name,order_id],(err,result)=>{
      if(!order_id||!order_name){
        return res.status(404).send({
          success:false,
          message:"Please Enter order_id and order_name "
        })
      }
      if(err){
        return res.status(400).send({
          success:false,
          err:err
        })
      }
      db.query(queryStringGetUpdatedRecord,[order_id],(err,result)=>{
      if(err){
        return res.status(400).send({
          success:false,
          err:err
        })
      }
      return res.status(200).send({
        success:true,
        result:result
      })
      })
      
     })

  }
  catch(err){
    return res.status(400).send({
      success:false,
      err:err
    })
  }
}


module.exports = { createOrder, addOrderPart, createOrderItem, createPersonandParty, getOrderItems, getAllOrders, $createPersonParty ,updateOrder}