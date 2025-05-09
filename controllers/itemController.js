const model = require('../models/item');
const Offer = require('../models/offers');

exports.index = (req, res, next) =>{
    model.find()
    .then((items) => {
        if(req.query.query){
            items = items.filter(item => item.details.toLowerCase().includes(req.query.query.toLowerCase()) || item.title.toLowerCase().includes(req.query.query.toLowerCase()));
        } 
        if(items.length !== 0){
            items.sort(function (a, b) {
                return a.price - b.price;
            });
            res.render('./items/index', {items})
        }
        else{
            let err = new Error("There is no item that matches your search criteria");
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.new = (req, res) =>{
    res.render('./items/new');
}

exports.create = (req, res, next) =>{
    let item = new model(req.body);
    item.seller = req.session.user
    if(req.file){
        item.image = req.file.path;
    }
    item.save()
    .then((item) => {
        req.flash('success', 'Successfully created an item')
            req.session.save(() =>{
                res.redirect('/items')
            })
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });
}

exports.show = (req, res, next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item id')
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item => {
        if(item){
            return res.render('./items/show', {item});
        } else{
            let err = new Error("Cannot find an item with id " +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.edit = (req, res, next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item id')
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(item => {
        if(item){
            return res.render('./items/edit', {item});
        } else{
            let err = new Error("Cannot find an item with id " +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.update = (req, res, next) =>{
    let item = req.body;
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item id')
        err.status = 400;
        return next(err);
    }
    if(req.file){
        item.image = req.file.filename
    }
    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item => {
        if(item){
            req.flash('success', 'Successfully updated an item')
            req.session.save(() =>{
                res.redirect('/items/' + id);
            })
        }else{
            req.flash('error', 'Error with updating item')
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });
}

exports.delete = (req, res, next) =>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item id')
        err.status = 400;
        return next(err);
    }

    Offer.deleteMany({itemId: id})
    .then(() => {
        model.findByIdAndDelete(id)
        .then(item => {
            if(item){
                req.flash('success', 'Successfully deleted an item')
                req.session.save(() =>{
                    res.redirect('/users/profile');
                })
            } else{
                req.flash('error', 'Error with deleting item')
                let err = new Error('Cannot find a item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}