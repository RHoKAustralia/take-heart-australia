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
    console.log(form.steps);
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
    // TODO: payment using strip
    req.session.form.steps[2] = true
    res.redirect(URL_CONFIRMATION)
}

const Actions = {
    'options': OptionAction,
    'details': DetailsAction,
    'payment': PaymentAction
}

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
