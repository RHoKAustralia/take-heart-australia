const React = require('react')

const OptionsPage = (props) => {
    var typeHtml = [
        { dtype: 'One-time', value: '1' },
        { dtype: 'Monthly', value: '2' }
    ].map(it => {
        var isChecked = props.form.dtype == it.value ? "checked" : ""
        return (
            <div class="payment-selection col-sm-6">
                <span class="payment-style" id={it.dtype}>{it.dtype}
                    {/* <label for={it.dtype}>{it.dtype}</label> */}
                    
                </span>
            </div>
        )
    })

    var amountHtml = ['20', '50', '100', 'other'].map(it => {
        var isChecked = props.form.damount == it ? "checked" : ""
        return (
            <div><div id="react"></div>

                <label for={"amount_" + it}>${it}</label>
                <input type="radio" id={"amount_" + it} checked={isChecked} name="donation_amount" value={it} />
            </div>
        )
    })

    return (
        <div>
            {/* Inject react and load the client side script */}
            <script src="/js/donation.bundle.js"></script>
            <link rel="stylesheet" type="text/css" href="/css/donation.css"></link>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>
            <form action="/donation/options" method="post">

            <div class="container">

                <div class="row heading-style1">how will the funds be used?</div>

                <div class="row icon-block">

                    <div class="col-sm-4">
                        <div class="icon-outter-wrapper">
                            <img class="icon-wrapper" src="/imgs/noun_9392.png"></img>
                        </div>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        
                        
                    </div>

                    <div class="col-sm-4">
                        <div class="icon-outter-wrapper">
                            <img class="icon-wrapper" src="/imgs/noun_50450.png"></img>
                        </div>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        
                        
                    </div>

                    <div class="col-sm-4">
                        <div class="icon-outter-wrapper">
                            <img class="icon-wrapper" src="/imgs/noun_631120.png"></img>
                        </div>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>
                </div>
            </div>

            <div class="container">

                <div class="row heading-style1">how would you like to donate?</div>

                <div class="row">
                    {typeHtml}
                </div>
                <input type="hidden" class="input-selected" name="donation_type" />
                <div class="row">
                    {amountHtml}
                </div>
                <div><button type="submit">Continue</button></div>
            </div>
            </form>
        </div>
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
