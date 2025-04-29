const model = require('../models/offers');
const Item = require('../models/item');

exports.makeOffer = (req, res, next) =>{
    let offer = new model(req.body);
    offer.itemId = req.params.id
    offer.userId = req.session.user;
    offer.save()
    .then(offer=> {
        req.flash('success', 'Successfully extended offer')
        Item.findByIdAndUpdate(offer.itemId, {$inc: { totalOffers: 1 }, $max: { highestOffer: offer.amount }})
        .then(() =>{
            req.session.save(() =>{
                res.redirect(`/items/${offer.itemId}`)
            })
        })
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            req.session.save(() =>{
                return res.redirect(`./${offer.itemId}`)
            })
        }
        else{
            next(err)
        }
    });
}

exports.getOffers = (req, res, next) =>{
    let id = req.params.id;
    model.find({itemId: id}).populate('itemId', 'title active').populate('userId', 'firstName lastName')
    .then(offers => {
        if(offers){
            return res.render('./offers/offer', {offers});
        } else{
            let err = new Error("Cannot find an offer with id " +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.acceptOffer = (req, res, next) =>{
    let id = req.params.id;
    let offerId = req.body.offerId;
    model.findByIdAndUpdate(offerId, { status: 'Accepted' })
    .then(() => {
        model.updateMany({ itemId: id, status: 'Pending' }, { $set: { status: 'Rejected' } })
        .then(() => {
            Item.findByIdAndUpdate(id, { active: false })
            .then(() => {
                req.flash('success', 'Successfully accepted offer');
                req.session.save(() => res.redirect(`/items/${id}/offers`));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}