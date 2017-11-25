const React = require('react')

const OptionsPage = (props) => {
    var typeHtml = [
        { dtype: 'One-time', value: '1' },
        { dtype: 'Monthly', value: '2' }
    ].map(it => {
        var isChecked = props.form.dtype == it.value ? "checked": ""
        return (
            <div>
                <label for={it.dtype}>{it.dtype}</label>
                <input type="radio" id={it.dtype} checked={isChecked} name="donation_type" value={it.value} />
            </div>
        )
    })

    var amountHtml = ['20', '50', '100', 'other'].map(it => {
        var isChecked = props.form.damount == it ? "checked" : ""
        return (
            <div>
                <label for={"amount_" + it}>${it}</label>
                <input type="radio" id={"amount_" + it} checked={isChecked} name="donation_amount" value={it} />
            </div>
        )
    })
    
    return (
        <form action="/donation/options" method="post">
            <div>
                <div>How do you like to donate?</div>
                <div>
                    {typeHtml}
                </div>
                <div>
                    {amountHtml}
                </div>
                <div><button type="submit">Continue</button></div>
            </div>
        </form>
    )
}

const DetailsPage = (props) => {
    var formHtml = [
        { label: 'Name', name: 'name', required: true },
        { label: 'Address', name: 'address', required: false },
        { label: 'Email', name: 'email', required: true },
        { label: 'Country', name: 'country', required: false },
        { label: 'Age', name: 'age', required: false },
        { label: 'State', name: 'state', required: false },
        { label: 'Occupation', name: 'occupation', required: false },
        { label: 'Postcode', name: 'postcode', required: false }
    ].map(it => {
        return (
            <div>
                <div>{it.label}</div>
                <div><input type="text" name={it.name} value={props.form[it.name]} /></div>
            </div>
        )
    })
    return (
        <form action="/donation/details" method="post">
            <div><a href="/donation/options">Back</a></div>
            <div>Please provide us your details</div>
            <div>
                {formHtml}
            </div>
            <div><button type="submit">Continue</button></div>
        </form>
    )
}

const PaymentPage = (props) => {
    return (
        <form action="/donation/payment" method="post">
            <div><a href="/donation/details">Back</a></div>
            <div>Please provide us your peyment details</div>
            <div>
                <div>
                    <div>Name on card</div>
                    <div><input type="text" name="card_name" /></div>
                </div>
                <div>
                    <div>Card number</div>
                    <div><input type="text" name="card_number" /></div>
                </div>
                <div>
                    <div>Expire date</div>
                    <div><input type="text" name="expire_month" /></div>
                    <div><input type="text" name="expire_year" /></div>
                </div>
                <div>
                    <div>CVV</div>
                    <div><input type="text" name="cvv" /></div>
                </div>
            </div>
            <div><button type="submit">Confirm</button></div>
        </form>
    )
}

const ConfirmationPage = (props) => {
    return (
        <div>
            <div>Thanks for your donation.</div>
            <div>A receipt has been sent to your email</div>
        </div>
    )
}

const Steps = {
    'options': OptionsPage,
    'details': DetailsPage,
    'payment': PaymentPage,
    'confirmation': ConfirmationPage
}

exports.Steps = Steps
