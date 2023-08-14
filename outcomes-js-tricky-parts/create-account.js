function createAccount(pin, amount) {
    const account = {};
    const INVALID_PIN = "Invalid PIN.";
    let balance = amount ? amount : 0;

    account.checkBalance = (enteredPin) => {
        if (enteredPin != pin) {
            return INVALID_PIN;
        } else {
            return "$" + balance;
        }
    }

    account.deposit = (enteredPin, amount) => {
        if (enteredPin != pin) {
            return INVALID_PIN;
        } else {
            balance += amount;
            return `Succesfully deposited $${amount}. Current balance: $${balance}.`;
        }
    }

    account.withdraw = (enteredPin, amount) => {
        if (enteredPin != pin) {
            return INVALID_PIN;
        } else if (amount <= balance) {
            balance -= amount;
            return `Succesfully withdrew $${amount}. Current balance: $${balance}.`;
        } else {
            return "Withdrawal amount exceeds account balance. Transaction cancelled.";
        }
    }

    account.changePin = (enteredPin, newPin) => {
        if (enteredPin != pin) {
            return INVALID_PIN;
        } else {
            pin = newPin;
            return "PIN successfully changed!"
        }
    }

    return account;
}

module.exports = { createAccount };
