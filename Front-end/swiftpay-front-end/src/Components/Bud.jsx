import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    getDoc,
    setDoc,
    query,
} from 'firebase/firestore';
import { db } from '../../Firebase/Fire.config';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const ExpenseTracker = () => {
    // State variables
    const [expenses, setExpenses] = useState([]);
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [editingExpense, setEditingExpense] = useState(null);
    const [budget, setBudget] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch budget and expenses data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch budget data
                const budgetDoc = await getDoc(doc(db, 'budget', 'budgetDoc'));
                if (budgetDoc.exists()) {
                    const budgetData = budgetDoc.data();
                    setBudget(budgetData.budget);
                    setRemainingBudget(budgetData.budget);
                }

                // Listen to changes in expenses collection
                const expensesRef = collection(db, 'expenses');
                const expensesQuery = query(expensesRef);
                const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
                    const expensesList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setExpenses(expensesList);

                    // Calculate total expenses and update remaining budget
                    const totalExpenses = expensesList.reduce((acc, expense) => acc + expense.amount, 0);
                    setRemainingBudget(budget - totalExpenses);
                });

                return () => {
                    // Unsubscribe from the listener when the component unmounts
                    unsubscribe();
                };
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [budget]);

    // Handle adding a new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        const amount = parseFloat(newExpenseAmount);

        if (isNaN(amount)) {
            console.error("Invalid amount for expense.");
            return;
        }

        const newExpense = {
            name: newExpenseName,
            amount,
            createdAt: new Date(),
        };

        try {
            const docRef = await addDoc(collection(db, 'expenses'), newExpense);
            setExpenses((prevExpenses) => [{ id: docRef.id, ...newExpense }, ...prevExpenses]);

            // Update remaining budget
            setRemainingBudget((prevRemainingBudget) => prevRemainingBudget - newExpense.amount);

            // Clear input fields
            setNewExpenseName('');
            setNewExpenseAmount('');
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    // Handle editing an expense
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
    };

    // Handle updating an expense
    const handleUpdateExpense = async (e) => {
        e.preventDefault();

        try {
            const { id, name, amount } = editingExpense;

            // Update expense in Firestore
            await updateDoc(doc(db, 'expenses', id), { name, amount });

            // Update expenses in state
            setExpenses((prevExpenses) => prevExpenses.map((expense) =>
                expense.id === id ? editingExpense : expense
            ));

            // Recalculate remaining budget
            const originalExpense = expenses.find((expense) => expense.id === id);
            const difference = amount - originalExpense.amount;
            setRemainingBudget((prevRemainingBudget) => prevRemainingBudget - difference);

            // Clear editing state
            setEditingExpense(null);
        } catch (error) {
            console.error("Error updating expense:", error);
        }
    };

    // Handle deleting an expense
    const handleDeleteExpense = async (id, amount) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));

            // Update remaining budget
            setRemainingBudget((prevRemainingBudget) => prevRemainingBudget + amount);
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    // Handle setting a new budget
    const handleSetBudget = async (e) => {
        e.preventDefault();

        try {
            await setDoc(doc(db, 'budget', 'budgetDoc'), { budget });

            // Update remaining budget
            setRemainingBudget(budget);
        } catch (error) {
            console.error("Error setting budget:", error);
        }
    };

    // Filter expenses based on the search query
    const filteredExpenses = expenses.filter(expense => {
        const name = expense.name || ''; // Fallback to empty string if undefined
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Bar chart data
    const barChartData = {
        labels: filteredExpenses.map((expense) => expense.name),
        datasets: [
            {
                label: 'Amount',
                data: filteredExpenses.map((expense) => expense.amount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Bar chart options
    const barChartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                ticks: {
                    display: true,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    // Render the Expense Tracker component
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Expense Tracker</h1>

                {/* Budget section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Set Budget</h2>
                    <form onSubmit={handleSetBudget} className="space-y-4">
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            required
                            placeholder="Set your budget"
                            className="form-input w-full border border-gray-300 rounded py-2 px-3"
                        />
                        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">
                            Set Budget
                        </button>
                    </form>
                    <p className="mt-2 text-gray-700">
                        Remaining Budget: ${remainingBudget.toFixed(2)}
                    </p>
                </div>

                {/* Add and edit expense form */}
                {editingExpense ? (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Edit Expense</h2>
                        <form onSubmit={handleUpdateExpense} className="space-y-4 mt-2">
                            <input
                                type="text"
                                value={editingExpense.name}
                                onChange={(e) =>
                                    setEditingExpense({
                                        ...editingExpense,
                                        name: e.target.value,
                                    })
                                }
                                required
                                className="form-input w-full border border-gray-300 rounded py-2 px-3"
                            />
                            <input
                                type="number"
                                value={editingExpense.amount}
                                onChange={(e) =>
                                    setEditingExpense({
                                        ...editingExpense,
                                        amount: parseFloat(e.target.value),
                                    })
                                }
                                required
                                className="form-input w-full border border-gray-300 rounded py-2 px-3"
                            />
                            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">
                                Update Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingExpense(null)}
                                className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Add Expense</h2>
                        <form onSubmit={handleAddExpense} className="space-y-4 mt-2">
                            <input
                                type="text"
                                value={newExpenseName}
                                onChange={(e) => setNewExpenseName(e.target.value)}
                                required
                                placeholder="Expense Name"
                                className="form-input w-full border border-gray-300 rounded py-2 px-3"
                            />
                            <input
                                type="number"
                                value={newExpenseAmount}
                                onChange={(e) => setNewExpenseAmount(parseFloat(e.target.value))}
                                required
                                placeholder="Expense Amount"
                                className="form-input w-full border border-gray-300 rounded py-2 px-3"
                            />
                            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded">
                                Add Expense
                            </button>
                        </form>
                    </div>
                )}

                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search expenses"
                        className="form-input w-full border border-gray-300 rounded py-2 px-3"
                    />
                </div>

                {/* List of expenses */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Expenses</h2>
                    <ul className="space-y-4">
                    {filteredExpenses.map((expense) => (
    <li key={expense.id} className="flex justify-between p-4 bg-gray-100 rounded shadow">
        <div>
            <span className="font-semibold">{expense.name}</span>
            <span className="ml-2 text-gray-600">
                ({`$${(expense.amount != null ? expense.amount : 0).toFixed(2)}`})
            </span>
        </div>
        <div className="flex space-x-2">
            <button
                onClick={() => handleEditExpense(expense)}
                className="bg-blue-500 text-white py-1 px-3 rounded"
            >
                Edit
            </button>
            <button
                onClick={() => handleDeleteExpense(expense.id, expense.amount)}
                className="bg-red-500 text-white py-1 px-3 rounded"
            >
                Delete
            </button>
        </div>
    </li>
))}

                    </ul>
                </div>

                {/* Bar chart for spending trends */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Spending Trends</h3>
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
