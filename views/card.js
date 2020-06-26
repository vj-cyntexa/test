const stripe = Stripe('pk_test_cpavqkvHKukifq3zixaAncGf00w1wjeAsB'); // Your Publishable Key
const elements = stripe.elements();

// Create our card inputs
var style = {
  base: {
    color: "#fff"
  }
};

const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

// Give our token to our form
const stripeTokenHandler = token => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  form.submit();
}

// Create token from card data
form.addEventListener('submit', e => {
  e.preventDefault();

  stripe.createToken(card).then(res => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  })
})
app.post("/charge", (req, res) => {
  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken
      })
      .then(customer =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: "usd",
          customer: customer.id
        })
      )
      .then(() => res.render("completed.html"))
      .catch(err => console.log(err));
  } catch (err) {
    res.send(err);
  }
});
