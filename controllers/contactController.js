const express = require('express');
const  mongoose   = require('mongoose');
var router = express.Router();

var Contact=require('../models/contact')
router.get('/',(req,res)=>{
    	

    res.render("contact/addOrEdit",{
        viewTitle:"Insert Contacts"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req,res){
    var contact = new Contact();
    contact.fullname=req.body.fullname;
    contact.email=req.body.email;
    contact.mobile=req.body.mobile;
    contact.city=req.body.city;
    contact.save((err,doc)=>{
        if(!err)
        res.redirect('contact/list');
        else{
            	if(err.name=='ValidationError'){
                            handleValidationError(err,req.body);
                           res.render("contact/addOrEdit",{
                                viewTitle:"Insert Contacts",
                           contact:req.body
    	            })}	            else
               console.log('Error during record insertion:'+err)
                
                
        }
    })
}

function updateRecord(req, res) {
    Contact.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            
            res.redirect('contact/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("contact/addOrEdit", {
                    viewTitle: 'Update Contact',
                    contact: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    }).lean();
}

router.get('/view/:id',(req,res)=>{
    Contact.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("contact/view", {
                contact: doc
            });
        }
    }).lean()
})


router.get('/list',(req,res)=>{
   Contact.find((err,docs)=>{
    
    if(!err){
        
        res.render('contact/list',{
            list:docs,
           
        });
    }
    else{
        console.log('Error in retrieving contact list:'+err)
    }
   }).lean()
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullname':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;            
        }
    }

}

router.get('/:id', (req, res) => {
    Contact.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("contact/addOrEdit", {
                viewTitle: "Update Contact",
                contact: doc
            });
        }
    }).lean()
});

router.get('/delete/:id', (req, res) => {
    Contact.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/contact/list');
        }
        else { console.log('Error in employee delete :' + err); }
    }).lean();
});


module.exports = router;