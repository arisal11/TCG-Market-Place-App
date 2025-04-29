const model = require('../models/user') 
const Item = require('../models/item')
const Offer = require('../models/offers')

exports.new = (req, res) =>{
    return res.render('./users/new');
}

exports.login = (req, res) =>{
    return res.render('./users/login')
}
exports.profile = (req, res, next) =>{
    let id = req.session.user;
    Promise.all([model.findById(id), Item.find({seller: id}) , Offer.find({userId: id}).populate('itemId', 'title')])
    .then(results =>{
        const [user, items, offers] = results
        res.render('./users/profile', {user, items, offers})
    })
    .catch(err => next(err))
}

exports.createUser = (req, res, next)=>{  
    let user = new model(req.body);
    user.save()
    .then(user=> {
        req.flash('success', 'Successfully registered')
        req.session.save(() =>{
            res.redirect('/users/login')
        })
    })
    .catch(err=>{
        if(err.code === 11000){
            req.flash('error', 'Email Address has already been used');
            req.session.save(() =>{
                return res.redirect('./users/new');
            })
        }
        else{
            next(err)
        }
    });
};

exports.loginUser = (req, res, next) =>{
    let email = req.body.email;
    let password = req.body.password
    
    model.findOne({email: email})
    .then(user =>{
        if(user){
            user.comparePassword(password)
            .then(result =>{
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in')
                    req.session.save(() =>{
                        res.redirect('/users/profile')
                    })
                }else{
                    console.log('wrong password')
                    req.flash('error', 'Wrong Password!')
                    req.session.save(() =>{
                        res.redirect('/users/login')
                    })
                }
            })
            .catch()
        } else{
            console.log('wrong email address')
            req.flash('error', 'Wrong Email Address!')
            req.session.save(() =>{
                res.redirect('/users/login')
            })
        }
    })
    .catch(err => next(err))
}

exports.logOut = (req, res, next) =>{
    req.session.destroy(err =>{
        if(err){
            next(err)
        } else{
            res.redirect('/');
        }
    })
}