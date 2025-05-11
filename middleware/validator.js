const Item = require('../models/item')
const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) =>{
    let id = req.params.id
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        Item.findById(id)
        .then(item =>{
            if(item){
                    return next();
            } else{
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err))
    }
    else{
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
}

exports.validateItem = [
    body('condition', 'Condition cannot be empty').notEmpty().bail().isIn(['New', 'Like New', 'Good', 'Used', 'Other']).withMessage('Conditions can only be New, Like New, Good, Used, or Other').escape(),
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Price cannot be empty').notEmpty().isCurrency({allow_negatives: false, digits_after_decimal: [2], thousands_separator: ',' }).withMessage('Not a valid price').trim().escape(),
    body('details', 'Details cannot be empty').notEmpty().trim().escape(),
    body('image').custom((value, {req}) =>{
        if(!req.file){
            throw new Error('Image cannot be empty');
        }
        const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
        if(!allowed.includes(req.file.mimetype)){
            throw new Error('Only JPEG, PNG, or JPG images are allowed');
        }
        return true
    })
]

exports.validatorSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email cannot be empty').notEmpty().bail().isEmail().withMessage('Email must be valid email address').trim().escape().normalizeEmail(),
    body('password', 'Password cannot be empty').notEmpty().bail().isLength({min: 8, max: 64}).withMessage('Password must be atleast 8 characters and at most 64 characters')
];

exports.validateLogin = [body('email', 'Email cannot be empty').notEmpty().bail().isEmail().withMessage('Email must be valid email address').trim().escape().normalizeEmail(),
    body('password', 'Password cannot be empty').notEmpty().bail().isLength({min: 8, max: 64}).withMessage('Password must be atleast 8 characters and at most 64 characters')];

exports.validateOffer = [body('amount', 'You must specify an amount to offer').notEmpty().bail().trim().isCurrency({allow_negatives: false, digits_after_decimal: [2], thousands_separator: ',' }).withMessage('Not a valid offer amount').escape()]

exports.validateResult = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        })
        res.redirect('back');
    }
    return next();
}
