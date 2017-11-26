const URL_OPTIONS = '/donation/options'
const URL_DETAILS = '/donation/details'
const URL_PAYMENT = '/donation/payment'
const URL_CONFIRMATION = '/donation/confirmation'

const ensureForm = (req) => {
    // TODO: ensure every page contain necessary information from previsous page's
    if (!req.session.hasOwnProperty('form')) {
        req.session.form = {steps: [false, false, false, false]}
    }
}

const ensureSteps = (form, index) => {
    var nextIndex = 0
    for(idx in form.steps) {
        if(!form.steps[idx]) {
            nextIndex = idx
            break
        }
    }
    if(nextIndex < index) {
        return nextIndex
    }
    return index
}

const OptionAction = (req, res) => {
    ensureForm(req)
    req.session.form.dtype = req.body.donation_type
    req.session.form.damount = req.body.donation_amount
    req.session.form.steps[0] = true
    res.redirect(URL_DETAILS)
}

const DetailsAction = (req, res) => {
    ensureForm(req)
    for (it of ['name', 'address', 'email', 'country', 'age', 'state', 'occupation', 'postcode']) {
        req.session.form[it] = req.body[it]
    }
    req.session.form.steps[1] = true
    res.redirect(URL_PAYMENT)
}

const PaymentAction = (req, res) => {
    ensureForm(req)
    var name = req.body.card_name
    var number = req.body.card_number
    var month = req.body.expire_month
    var year = req.body.expire_year
    var cvv = req.body.cvv

    var dtype = req.session.form.dtype
    var damount = req.session.form.damount
    var email = req.session.form.email

    if(name && number && month && year && cvv && dtype && damount && email) {
        var stripe = require("stripe")(
            "****" // secret key here
        );

        stripe.tokens.create({
            card: {
                "number": number,
                "exp_month": month,
                "exp_year": year,
                "cvc": cvv + ''
            }
        }, function (err, token) {
            if(err == null && token != null) {
                stripe.charges.create({
                    amount: parseInt(damount) * 100,    // amount is in cents, mul by 100
                    currency: "aud",
                    source: token.id,
                    description: "Charge for " + email,
                    receipt_email: email
                }, function (err, charge) {
                    if(err == null && charge != null && charge.paid) {
                        req.session.form.steps[2] = true
                        res.redirect(URL_CONFIRMATION)
                    } else {
                        res.redirect(URL_PAYMENT + '?message=' + encodeURIComponent(err.message))
                    }
                })
            } else {
                res.redirect(URL_PAYMENT + '?message=' + encodeURIComponent(err.message))
            }
        })
    } else {
        res.redirect(URL_PAYMENT + '?message=' + encodeURIComponent('Insufficient information'))
    }
}

const Actions = {
    'options': OptionAction,
    'details': DetailsAction,
    'payment': PaymentAction
}

// TODO: refactoring code to unify these variables
const StepsIndex = {
    'options': 0,
    'details': 1,
    'payment': 2,
    'confirmation': 3
}

const IndexToSteps = [
    'options',
    'details',
    'payment',
    'confirmation'
]

const URLs = {
    'options': URL_OPTIONS,
    'details': URL_DETAILS,
    'payment': URL_PAYMENT,
    'confirmation': URL_CONFIRMATION
}

exports.Actions = Actions
exports.StepsIndex = StepsIndex
exports.IndexToSteps = IndexToSteps
exports.URLs = URLs
exports.ensureSteps = ensureSteps
