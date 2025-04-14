"use client";

import {useEffect, useMemo, useState} from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiCheck,
    FiClock,
    FiDollarSign,
    FiMoon,
    FiPlus,
    FiSun,
    FiUsers,
    FiX,
} from "react-icons/fi";

interface Expense {
    id: number;
    description: string;
    totalAmount: number;
    payer: string;
    date: Date;
    split: { [key: string]: number };
}

interface Balance {
    [key: string]: number;
}

interface SplitState {
    [key: string]: number | "";
}

interface FormErrors {
    [key: string]: string;
}

// Utility function to generate conditional class names based on dark mode
const getClassName = (darkMode: boolean, darkClass: string, lightClass: string) =>
    darkMode ? darkClass : lightClass;

const SplitwiseClone = () => {
    // Define the list of people as a constant array using useMemo to prevent unnecessary recalculations.
    const people = useMemo(() => ["Alice", "Bob", "Charlie"], []);

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState<number | "">("");
    const [payer, setPayer] = useState("");
    const [split, setSplit] = useState<SplitState>({});
    const [darkMode, setDarkMode] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [splitEvenlyError, setSplitEvenlyError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    // Initialize split amounts for each person as an empty string.
    const initializeSplit = (): SplitState => {
        const initialSplit: SplitState = {};
        people.forEach((person) => {
            initialSplit[person] = "";
        });
        return initialSplit;
    };

    useEffect(() => {
        setSplit(initializeSplit());
    }, [people]);

    // Auto-dismiss success message after 3 seconds.
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    /**
     * Handles changes to an individual split amount field.
     * This function now only updates the field for the specified person,
     * leaving other fields unchanged so that users can manually adjust each share.
     */
    const handleSplitChange = (person: string, value: string) => {
        const newValue = value === "" ? "" : parseFloat(parseFloat(value).toFixed(2));
        // Update only the changed split amount without auto-distributing the remainder.
        setSplit((prevSplit) => ({ ...prevSplit, [person]: newValue }));
    };

    // Calculate the total of all split amounts.
    const calculateSplitTotal = (splitState: SplitState): number => {
        return Object.values(splitState).reduce(
            (sum: number, val) => sum + (val !== "" ? Number(val) : 0),
            0
        );
    };

    // Validate form inputs and provide user-friendly error messages.
    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!description.trim()) {
            errors.description = "Description is required.";
        }

        if (totalAmount === "") {
            errors.totalAmount = "Total amount is required.";
        } else if (Number(totalAmount) <= 0) {
            errors.totalAmount = "Please enter an amount greater than zero.";
        }

        if (!payer) {
            errors.payer = "Please select who paid.";
        }

        const splitSum = calculateSplitTotal(split);
        const hasEmptySplit = Object.values(split).some((val) => val === "" || val === undefined);

        if (hasEmptySplit) {
            errors.split = "Please fill in all split amounts for each person.";
        } else if (totalAmount !== "" && Math.abs(splitSum - Number(totalAmount)) > 0.001) {
            errors.split =
                "The sum of individual splits must equal the total expense amount. Please review and adjust your splits.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add a new expense to the list after successful validation.
    const addExpense = () => {
        if (!validateForm()) return;

        const splitNumbers: { [key: string]: number } = {};
        for (const person in split) {
            splitNumbers[person] = Number(split[person]);
        }

        const newExpense: Expense = {
            id: expenses.length + 1,
            description,
            totalAmount: Number(totalAmount),
            payer,
            date: new Date(),
            split: splitNumbers,
        };

        setExpenses([...expenses, newExpense]);
        setDescription("");
        setTotalAmount("");
        setPayer("");
        setSplit(initializeSplit());
        setFormErrors({});
        setSuccessMessage(`Expense "${description}" added successfully!`);
    };

    /**
     * Calculates an even split of the total amount among all participants.
     * This memoized calculation uses only totalAmount as a dependency because the list of people is constant.
     * Adjusts the first person's share if there is a rounding difference.
     */
    const evenSplit = useMemo(() => {
        if (totalAmount === "" || Number(totalAmount) <= 0 || people.length === 0) {
            return null;
        }
        const evenAmount = Number(totalAmount) / people.length;
        const newSplit: SplitState = {};
        people.forEach((person) => {
            newSplit[person] = parseFloat(evenAmount.toFixed(2));
        });
        const splitSum = calculateSplitTotal(newSplit);
        const diff = Number(totalAmount) - splitSum;
        // Adjust for rounding differences by updating the first person's share.
        if (Math.abs(diff) > 0.001 && people.length > 0) {
            const firstPerson = people[0];
            newSplit[firstPerson] = parseFloat((Number(newSplit[firstPerson]) + diff).toFixed(2));
        }
        return newSplit;
    }, [totalAmount]);

    /**
     * Manually distribute the total amount evenly among all participants when the user clicks the "Split Evenly" button.
     * Clears any previous split-even errors.
     */
    const calculateEvenSplit = () => {
        if (!evenSplit) {
            setSplitEvenlyError("Please enter a valid total amount before splitting.");
            return;
        }
        setSplitEvenlyError("");
        setSplit(evenSplit);
    };

    // Calculate the balance for each person based on all expenses.
    const balances = useMemo(() => {
        const calculateBalances = (): Balance => {
            const balances: Balance = {};
            people.forEach((person) => {
                balances[person] = 0;
            });

            expenses.forEach((expense) => {
                const { payer, split, totalAmount } = expense;
                // Add the total amount to the payer's balance.
                balances[payer] += totalAmount;
                // Subtract each person's share from their balance.
                for (const person in split) {
                    balances[person] -= split[person];
                }
            });

            return balances;
        };

        return calculateBalances();
    }, [expenses, people]);

    // Format a JavaScript Date object into a readable string.
    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    // Format a number into a USD currency string.
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Check if the form is valid to enable the Add Expense button.
    const isFormValid = (): boolean => {
        return (
            description.trim() !== "" &&
            totalAmount !== "" &&
            Number(totalAmount) > 0 &&
            payer !== "" &&
            Object.values(split).every(
                (val) => val !== "" && (typeof val === "number" ? val >= 0 : false)
            )
        );
    };

    // Remove an expense with a two-step confirmation.
    const removeExpense = (id: number) => {
        if (confirmDelete === id) {
            const expenseToRemove = expenses.find((expense) => expense.id === id);
            setExpenses(expenses.filter((expense) => expense.id !== id));
            setConfirmDelete(null);
            setSuccessMessage(`Expense "${expenseToRemove?.description}" removed successfully!`);
        } else {
            setConfirmDelete(id);
            // Auto-cancel the delete confirmation after 3 seconds.
            setTimeout(() => {
                setConfirmDelete(null);
            }, 3000);
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };

    // Define common styling functions for cards and inputs.
    const cardStyle = (darkMode: boolean) =>
        `p-6 rounded-lg shadow-md ${getClassName(
            darkMode,
            "bg-gray-800",
            "bg-white"
        )} transition-colors duration-300`;

    const inputStyle = (darkMode: boolean, isError: boolean = false) =>
        `w-full p-3 rounded-lg border transition-colors duration-200 ${getClassName(
            darkMode,
            "bg-gray-700 border-gray-600 text-white focus:border-blue-500",
            "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
        )} ${isError ? "border-red-500" : ""}`;

    return (
        // The outer container applies the dark mode class based on state.
        <div className={darkMode ? "dark" : ""}>
        <div
            className={`min-h-screen transition-colors duration-300 ${getClassName(
            darkMode,
            "bg-gray-900 text-white",
            "bg-gray-50 text-gray-900"
        )}`}
>
    {/* Header */}
    <header
        className={`py-4 ${getClassName(darkMode, "bg-gray-800", "bg-blue-600")} text-white shadow-lg`}
>
    <div className="container mx-auto px-4 flex justify-between items-center">
    <div className="flex items-center">
    <FiDollarSign className="text-2xl mr-2" />
    <h1 className="text-2xl font-bold">Splitwise Clone</h1>
    </div>
    <button
    onClick={() => setDarkMode(!darkMode)}
    className={`p-2 rounded-full ${
        darkMode
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-blue-500 hover:bg-blue-400"
    } transition-colors duration-200`}
    aria-label="Toggle dark mode"
        >
        {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>
        </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-3xl space-y-8">
        {/* Success Message */}
    {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 flex items-center animate-fadeIn">
        <FiCheck className="mr-2 flex-shrink-0" />
            <span>{successMessage}</span>
            </div>
    )}

    {/* Balances Summary Card */}
    <section className={cardStyle(darkMode)}>
    <h2 className="text-xl font-bold mb-4 flex items-center">
    <FiUsers className="mr-2" />
        Balance Summary
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {people.map((person) => {
                const balance = balances[person] || 0;
                const isPositive = balance >= 0;
                return (
                    <div
                        key={person}
                className={`p-4 rounded-lg transition-colors duration-200 ${
                    isPositive
                        ? darkMode
                            ? "bg-green-900/30 text-green-200"
                            : "bg-green-50 text-green-800"
                        : darkMode
                            ? "bg-red-900/30 text-red-200"
                            : "bg-red-50 text-red-800"
                }`}
            >
                <div className="font-medium mb-1">{person}</div>
                    <div className="flex items-center text-lg font-bold">
                    {isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                {formatCurrency(Math.abs(balance))}
                </div>
                <div className="text-sm mt-1">{isPositive ? "is owed" : "owes"}</div>
                    </div>
            );
            })}
        </div>
        </section>

    {/* Add New Expense Card */}
    <section className={cardStyle(darkMode)}>
    <h2 className="text-xl font-bold mb-4 flex items-center">
    <FiPlus className="mr-2" />
        Add New Expense
    </h2>
    <div className="space-y-4">
    <div>
        <label htmlFor="description" className="block mb-1 font-medium">
        Description
        </label>
        <input
    id="description"
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="What was the expense for?"
    className={inputStyle(darkMode, !!formErrors.description)}
    />
    {formErrors.description && (
        <p className="mt-1 text-red-500 text-sm">{formErrors.description}</p>
    )}
    </div>

    <div>
    <label htmlFor="amount" className="block mb-1 font-medium">
        Total Amount
    </label>
    <div className="relative">
    <span className="absolute left-3 top-3 text-gray-500">$</span>
        <input
    id="amount"
    type="number"
    value={totalAmount}
    onChange={(e) => {
        const value = e.target.value;
        // Validate and allow up to two decimal places.
        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
            setTotalAmount(value === "" ? "" : Number(value));
        }
    }}
    placeholder="0.00"
    min="0"
    step="0.01"
    className={inputStyle(darkMode, !!formErrors.totalAmount)}
    />
    </div>
    {formErrors.totalAmount && (
        <p className="mt-1 text-red-500 text-sm">{formErrors.totalAmount}</p>
    )}
    </div>

    <div>
    <label htmlFor="payer" className="block mb-1 font-medium">
        Who Paid?
        </label>
        <select
        id="payer"
    value={payer}
    onChange={(e) => setPayer(e.target.value)}
    className={inputStyle(darkMode, !!formErrors.payer)}
>
    <option value="">Select who paid</option>
    {people.map((person) => (
        <option key={person} value={person}>
        {person}
        </option>
    ))}
    </select>
    {formErrors.payer && (
        <p className="mt-1 text-red-500 text-sm">{formErrors.payer}</p>
    )}
    </div>

    {/* Split Amount Section */}
    <div>
        <div className="flex justify-between items-center mb-1">
    <label className="block font-medium">Split Amount</label>
    <button
    type="button"
    onClick={calculateEvenSplit}
    title="Distribute the total amount evenly among all people."
    className={`text-base px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
        darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-200 hover:bg-blue-300 text-blue-800"
    }`}
>
    Split Evenly
    </button>
    </div>
    {splitEvenlyError && (
        <p className="mt-2 text-red-500 text-sm">{splitEvenlyError}</p>
    )}
    <div className="space-y-3">
        {people.map((person) => (
                <div key={person}>
                <label htmlFor={`split-${person}`} className="block mb-1 text-sm">
        {person}
        </label>
        <div className="relative">
    <span className="absolute left-3 top-3 text-gray-500">$</span>
        <input
    id={`split-${person}`}
    type="number"
    value={split[person]}
    onChange={(e) => handleSplitChange(person, e.target.value)}
    placeholder="0.00"
    min="0"
    step="0.01"
    className={`w-full p-3 pl-8 rounded-lg border transition-colors duration-200 ${
        darkMode
            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
    }`}
    />
    </div>
    </div>
))}
    </div>
    {formErrors.split && (
        <p className="mt-2 text-red-500 text-sm">{formErrors.split}</p>
    )}
    </div>

    <button
    onClick={addExpense}
    disabled={!isFormValid()}
    className={`mt-4 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors duration-200 ${
        isFormValid()
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
    }`}
>
    <FiPlus className="mr-2" />
        Add Expense
    </button>
    </div>
    </section>

    {/* Recent Expenses Card */}
    <section className={cardStyle(darkMode)}>
    <h2 className="text-xl font-bold mb-4 flex items-center">
    <FiClock className="mr-2" />
        Recent Expenses
    </h2>

    {expenses.length === 0 ? (
        <div
            className={`p-8 text-center rounded-lg transition-colors duration-200 ${getClassName(
            darkMode,
            "bg-gray-700",
            "bg-gray-100"
        )}`}
    >
        <p>No expenses yet. Add your first expense above!</p>
    </div>
    ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
                    <li key={expense.id} className="py-4">
                <div className="flex justify-between mb-2">
                <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <p className={`${getClassName(
                    darkMode,
                    "text-gray-400",
                    "text-gray-500"
                )} text-sm`}>
            {formatDate(expense.date)}
        </p>
        </div>
        <div className="text-right">
    <div className="font-bold">{formatCurrency(expense.totalAmount)}</div>
    <p className={`${getClassName(
        darkMode,
        "text-gray-400",
        "text-gray-500"
    )} text-sm`}>
        paid by {expense.payer}
        </p>
        </div>
        </div>
        <div className={`p-3 rounded-lg text-sm ${getClassName(darkMode, "bg-gray-700", "bg-gray-100")}`}>
        {Object.entries(expense.split).map(([person, amount]) => (
            <div key={person} className="flex justify-between mb-1 last:mb-0">
            <span>{person}</span>
            <span>{formatCurrency(amount)}</span>
            </div>
        ))}
        </div>
        <div className="mt-2 flex">
    {confirmDelete === expense.id ? (
        <>
            <button
                onClick={() => removeExpense(expense.id)}
        className="mr-2 text-sm flex items-center text-red-500 hover:text-red-700"
        >
        <FiCheck className="mr-1" /> Confirm
            </button>
            <button
        onClick={cancelDelete}
        className="text-sm flex items-center text-gray-500 hover:text-gray-700"
        >
        <FiX className="mr-1" /> Cancel
            </button>
            </>
    ) : (
        <button
            onClick={() => removeExpense(expense.id)}
        className="text-sm text-red-500 hover:text-red-700"
            >
            Remove
            </button>
    )}
        </div>
        </li>
    ))}
        </ul>
    )}
    </section>
    </main>

    <footer
    className={`mt-12 py-6 transition-colors duration-300 ${getClassName(
        darkMode,
        "bg-gray-800 text-gray-400",
        "bg-gray-100 text-gray-600"
    )}`}
>
    <div className="container mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Splitwise Clone. All rights reserved.</p>
    </div>
    </footer>
    </div>
    </div>
);
};

export default SplitwiseClone;