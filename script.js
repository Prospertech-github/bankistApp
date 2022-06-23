'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////

//Implementing Login and Display Features
let currentAccount;

btnLogin.addEventListener('click', function (e) {
	e.preventDefault();
	currentAccount = accounts.find(
		acc => acc.userName === inputLoginUsername.value
	);

	if (currentAccount && currentAccount?.pin === Number(inputLoginPin.value)) {
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;
		containerApp.style.opacity = 100;

		//Display UI
		UIDisplay(currentAccount);

		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();
	}
});

//// Implementing Transfer
btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();

	const transferAmount = +inputTransferAmount.value;
	const receiver = accounts.find(
		acc => acc.userName === inputTransferTo.value.toLowerCase()
	);
	inputTransferTo.value = inputTransferAmount.value = '';
	inputTransferAmount.blur();

	if (
		receiver &&
		receiver?.userName !== currentAccount.userName &&
		transferAmount > 0 &&
		transferAmount <= currentAccount.balance
	) {
		currentAccount.movements.push(-transferAmount);
		receiver.movements.push(transferAmount);

		//Display UI
		UIDisplay(currentAccount);
	}
});

//// Implementing Account Closure
btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	if (
		inputCloseUsername?.value === currentAccount.userName &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const index = accounts.findIndex(
			acc => acc.userName === inputCloseUsername.value
		);
		// Delete account from the accounts array
		accounts.splice(index, 1);
		containerApp.style.opacity = 0;
	}
	inputClosePin.value = inputCloseUsername.value = '';
});

//Implementing Loan Request
btnLoan.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Number(inputLoanAmount.value);

	if (
		amount > 0 &&
		currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    //Display UI
    UIDisplay(currentAccount);
  }
  
  inputLoanAmount.value = '';
});


//// Implementing the sort movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

//Calculating Usernames for Various accounts
const createUsername = function (accs) {
	accs.forEach(function (acc) {
		acc.userName = acc.owner
			.toLowerCase()
			.split(' ')
			.map(name => name[0])
			.join('');
	});
};
createUsername(accounts);

// Display Balance Summary Function
const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter(deposit => deposit > 0)
		.reduce((acc, curr) => acc + curr, 0);

	const withdraws = acc.movements
		.filter(out => out < 0)
		.reduce((acc, curr) => acc + curr, 0);

	const interest = acc.movements
		.filter(deposit => deposit > 0)
		.map(deposit => (deposit * 1.2) / 100)
		.filter(int => int > 1)
		.reduce((acc, rates) => acc + rates, 0);

	labelSumIn.textContent = `${incomes}€`;
	labelSumOut.textContent = `${withdraws}€`;
	labelSumInterest.textContent = `${interest}€`;
};

// Display Balance Function
const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce(function (acc, cur) {
		return acc + cur;
	}, 0);

	labelBalance.textContent = `${acc.balance}€`;
};

// Display Movement Function
const displayMovements = function (movements, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
			i + 1
		} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>    
    `;

		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const UIDisplay = acc => {
	//Display Movements
	displayMovements(acc.movements);

	//Display Balance
	calcDisplayBalance(acc);

	//Display Summary
	calcDisplaySummary(acc);
};
