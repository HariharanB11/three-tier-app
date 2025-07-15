const apiUrl = "http://<APP_SERVER_IP>:5000";  // Replace with your app server IP

function getBalance() {
  fetch(`${apiUrl}/balance`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('balance').innerText = `$${data.balance.toFixed(2)}`;
    })
    .catch(err => alert("Error fetching balance"));
}

function deposit() {
  const amount = parseFloat(document.getElementById('amount').value);
  fetch(`${apiUrl}/deposit`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({amount: amount})
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    getBalance();
  });
}

function withdraw() {
  const amount = parseFloat(document.getElementById('amount').value);
  fetch(`${apiUrl}/withdraw`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({amount: amount})
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    getBalance();
  });
}
