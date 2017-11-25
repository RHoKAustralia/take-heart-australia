const ensureForm = (req) => {
    // TODO: ensure every page contain necessary information from previsous page's
    if (!req.session.hasOwnProperty('form')) {
        req.session.form = {}
    }
}

const OptionAction = (req, res) => {
    ensureForm(req)
    req.session.form.dtype = req.body.donation_type
    req.session.form.damount = req.body.donation_amount
    res.redirect('/donation/details')
}

const DetailsAction = (req, res) => {
    ensureForm(req)
    for (it of ['name', 'address', 'email', 'country', 'age', 'state', 'occupation', 'postcode']) {
        req.session.form[it] = req.body[it]
    }
    res.redirect('/donation/payment')
}

const PaymentAction = (req, res) => {
    ensureForm(req)
    res.redirect('/donation/confirmation')
}

const Actions = {
    'options': OptionAction,
    'details': DetailsAction,
    'payment': PaymentAction
}

exports.Actions = Actions
