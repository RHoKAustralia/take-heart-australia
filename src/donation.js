var stripe = require("stripe")(
    "sk_test_sPgf3XjouxQvdAuFWsPH5lVd"
);

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

const doOneTimeDonation = (req, res, number, month, year, cvv, damount, email) => {
    stripe.tokens.create({
        card: {
            "number": number,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvv + ''
        }
    }, function (err, token) {
        if (err == null && token != null) {
            stripe.charges.create({
                amount: parseInt(damount) * 100,    // amount is in cents, mul by 100
                currency: "aud",
                source: token.id,
                description: "Charge for " + email,
                receipt_email: email
            }, function (err, charge) {
                if (err == null && charge != null && charge.paid) {
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
}

const subscribeMonthlyDonation = (req, res, plan, number, month, year, cvv, email) => {
    stripe.tokens.create({
        card: {
            "number": number,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvv + ''
        }
    }, function (err, token) {
        if (err == null && token != null) {
            stripe.customers.create({
                description: 'Customer for ' + email,
                source: token.id // obtained with Stripe.js
            }, function (err, customer) {
                if(err == null && customer != null) {
                    console.log('customer created')
                    stripe.subscriptions.create({
                        customer: customer.id,
                        items: [{plan: plan.id}]
                        }, function (err, subscription) {
                            if (err == null && subscription != null) {
                                console.log('subscription for plan ' + plan.id + ' created')
                                req.session.form.steps[2] = true
                                res.redirect(URL_CONFIRMATION)
                            } else {
                                res.redirect(URL_PAYMENT + '?message=' + err.message)
                            }
                        }
                    )
                } else {
                    res.redirect(URL_PAYMENT + '?message=' + err.message)
                }
            })
        } else {
            res.redirect(URL_PAYMENT + '?message=' + err.message)
        }
    })
}

const doMonthlyDonation = (req, res, damount, number, month, year, cvv, email) => {
    var planId = 'donate_monthly_' + damount
    stripe.plans.retrieve(
        planId,
        function (err, plan) {
            if(err == null && plan != null) {
                console.log('Got plan ' + planId)
                subscribeMonthlyDonation(req, res, plan, number, month, year, cvv, email)
            } else {
                if (err.message.indexOf('No such plan') >= 0) {
                    // didn't find a proper return code for non-existing plan
                    // create a new plan
                    console.log('Plan ' + planId + ' does not exist, create one')
                    stripe.plans.create({
                        amount: parseInt(damount) * 100,
                        interval: "month",
                        name: "Monthly donation AUD $" + damount,
                        currency: "aud",
                        id: planId
                    }, function (err, plan) {
                        if(err == null && plan != null) {
                            console.log('Plan created ' + planId)
                            subscribeMonthlyDonation(req, res, plan, number, month, year, cvv, email)
                        } else {
                            res.redirect(URL_PAYMENT + '?message=' + encodeURIComponent(err.message))
                        }
                    })
                } else {
                    res.redirect(URL_PAYMENT + '?message=' + encodeURIComponent(err.message))
                }
            }
        }
    )
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

    if(name && number && month && year && cvv && dtype && damount && email && (dtype == '1' || dtype == '2')) {
        if(dtype == '1') {
            doOneTimeDonation(req, res, number, month, year, cvv, damount, email)
        } else {
            doMonthlyDonation(req, res, damount, number, month, year, cvv, email)
        }
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
