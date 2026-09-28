var express = require("express");
var bodyParser = require('body-parser');
const path = require('path')

const session = require('express-session');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require('mysql');

app.use(session({
    secret: 'NovaGypsyKey234&#',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // set to true if using HTTPS
        maxAge: 60000 * 60 * 5// session timeout in milliseconds
    }
}));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

const db = mysql.createConnection({
    host: 'bank_db',
    user: 'root',
    password: 'Nss$awh$node',
    database: 'banking',
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    else {
        res.render("index.ejs");
    }
});

app.get('/index', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    else {
        res.render("index.ejs");
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    else {
        res.render("login.ejs")
    }
})

app.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    else {
        res.render("register.ejs")
    }
})

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        db.query('SELECT firstname, balance, account_number FROM users where email = ?', [req.session.user.email], (error, results, fields) => {
            if (error) throw error;
            res.render("dashboard.ejs", {
                details1: results
            })
        });
    } else {
        res.redirect('/login');
    }
})

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/login');
    });
});

app.post("/register", urlencodedParser, (req, res) => {
    try {
        db.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) => {
            if (results.length === 0) {
                const account_number = Math.floor(Date.now() + Math.random() * 900000);
                const sql = 'INSERT INTO users (firstname, lastname, email, password, currency, account_number, balance) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const values = [req.body.firstname, req.body.lastname, req.body.email, req.body.password, 'GBP', account_number, '500'];

                db.query(sql, values, function (err, data) {
                    if (err) throw err;
                    res.redirect("/login")
                });
            }
            else {
                res.status(500).send('User with same email already register <a href="/register">Click here</a> to go back to the register');
            }
        });
    } catch (err) {
        res.redirect("/register")
    }
})

app.post('/login', urlencodedParser, (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
        if (error) {
            console.error(error);
        } else {
            if (results.length == 1) {
                req.session.user = { email };
                res.redirect('/dashboard');
            } else {
                res.status(500).send('Invalid username and password provided <a href="/login">Click here</a> to go back to the login');
            }
        }
    });
})



app.post("/addpayee", urlencodedParser, (req, res) => {
    if (req.session.user) {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const ifsc = req.body.ifsc;
        const toAccountNumber = req.body.accoutnumber;
        try {
            db.query('SELECT account_number FROM users where account_number = ?', [toAccountNumber], (error, results, fields) => {
                if (error) throw error;

                if (results.length === 0) {
                    res.status(500).send('Account Number not found <a href="/dashboard">Click here</a> to go back to the Dashboard');
                } else {
                    const sql = 'INSERT INTO payees (payor_email, firstname, lastname, ifsc_code, account_number) VALUES (?, ?, ?, ?, ?)';
                    const values = [req.session.user.email, firstname, lastname, ifsc, toAccountNumber];
                    db.query(sql, values, function (err, data) {
                        if (err) throw err;
                        res.redirect("/dashboard")
                    });
                }
            });
        } catch (err) {
            res.redirect("/register")
        }
    } else {
        res.redirect('/login');
    }
})

app.get('/addpayee', (req, res) => {
    if (req.session.user) {
        res.render("addpayee.ejs")
    } else {
        res.redirect('/login');
    }
})

app.get('/transactions', (req, res) => {
    if (req.session.user) {
        db.query('SELECT DISTINCT payees.firstname, payees.lastname, transactions.to_account_number, transactions.amount, transactions.date FROM transactions INNER JOIN payees ON payees.account_number=transactions.to_account_number where transactions.payor_email = ?', [req.session.user.email], (error, results, fields) => {
            if (error) throw error;
            res.render('transactions.ejs', { transactions: results });
        });
    } else {
        res.redirect('/login');
    }
})

app.get('/fundtransfer', (req, res) => {
    if (req.session.user) {
        db.query('SELECT firstname, lastname, account_number FROM payees where payor_email = ?', [req.session.user.email], (error, results, fields) => {
            if (error) throw error;
            res.render('fundtransfer.ejs', { accnos: results });
        })
    } else {
        res.redirect('/login');
    }
})

app.post("/fundtransfer", urlencodedParser, (req, res) => {
    if (req.session.user) {
        const amountToTransfer = parseInt(req.body.amount);

        if (amountToTransfer == null || isNaN(amountToTransfer) || amountToTransfer <= 0) {
            res.status(500).send('You have entered an invalid amount. <a href="/fundtransfer">Click here</a> to go back to the Fund Transfers');
        } else {
            db.query('SELECT account_number from payees where payor_email = ? and account_number = ?', [req.session.user.email, req.body.accountnumber], (error, results, fields) => {
                if (error) throw error;
                if (results.length === 0) {
                    res.status(500).send('Details not found <a href="/dashboard">Click here</a> to go back to the Dashboard');
                }
                else {
                    db.query('SELECT balance, account_number FROM users where email = ?', [req.session.user.email], (error, userBalanceResult, fields) => {
                        if (error) throw error;

                        var fromAccountBalance = parseInt(userBalanceResult[0].balance);
                        var fromAccountNumber = userBalanceResult[0].account_number;

                        if (fromAccountBalance >= amountToTransfer) {
                            db.query("UPDATE users set balance = balance - ? where email = ?", [amountToTransfer, req.session.user.email], function (err, data) {
                                if (err) throw err;
                            });

                            db.query("UPDATE users set balance = balance + ? where account_number = ?", [amountToTransfer, req.body.accountnumber], function (err, data) {
                                if (err) throw err;
                            });

                            db.query("INSERT INTO transactions (payor_email, from_account_number, to_account_number, amount, date) VALUES (?,?,?,?,?)", [req.session.user.email, fromAccountNumber, req.body.accountnumber, amountToTransfer, new Date()], function (err, data) {
                                if (err) throw err;
                            });

                            res.redirect('/dashboard');
                        } else {
                            res.status(500).send('Insufficient Balance! <a href="/dashboard">Click here</a> to go back to the Dashboard');
                        }
                    });
                }
            });
        }
    } else {
        res.redirect('/login');
    }
})

app.listen(9001, '0.0.0.0');

