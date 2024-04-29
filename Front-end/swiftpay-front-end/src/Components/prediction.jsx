import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Fire.config'; // Import Firebase configuration
import './B.css'; // Import CSS file

const BudgetApp = () => {
    // State variables
    const [budget, setBudget] = useState(() => {
        // Retrieve budget from local storage on initial load
        const savedBudget = localStorage.getItem('budget');
        return savedBudget ? parseFloat(savedBudget) : 0;
    });

    const [expenses, setExpenses] = useState([]);
    const [productTitle, setProductTitle] = useState('');
    const [productCost, setProductCost] = useState('');
    const [currentExpenseId, setCurrentExpenseId] = useState(null);
    const [budgetError, setBudgetError] = useState(false);
    const [titleError, setTitleError] = useState(false);

    // Calculate total expenditure
    const totalExpenditure = expenses.reduce((acc, expense) => acc + parseFloat(expense.cost), 0);

    // Calculate balance
    const balance = budget - totalExpenditure;

    // Retrieve expenses from Firestore based on user ID
    useEffect(() => {
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
            const expensesCollection = collection(db, 'expenses');
            const expensesQuery = query(expensesCollection, where('userId', '==', userId));

            const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
                const fetchedExpenses = [];
                snapshot.forEach((doc) => {
                    fetchedExpenses.push({ id: doc.id, ...doc.data() });
                });
                setExpenses(fetchedExpenses);
            });

            return () => unsubscribe();
        }
    }, []);

    // Set budget and save to local storage
    const handleSetBudget = () => {
        if (budget <= 0) {
            setBudgetError(true);
        } else {
            setBudgetError(false);
            localStorage.setItem('budget', budget); // Save budget to local storage
        }
    };

    // Add or update an expense
    const handleAddExpense = async () => {
        // Validate inputs
        if (productTitle === '' || productCost === '' || parseFloat(productCost) <= 0) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        const cost = parseFloat(productCost);
        if (isNaN(cost) || cost <= 0) {
            setTitleError(true);
            return;
        }

        const userId = auth.currentUser ? auth.currentUser.uid : null;

        try {
            if (currentExpenseId) {
                // Update existing expense
                const expenseDoc = doc(db, 'expenses', currentExpenseId);
                await updateDoc(expenseDoc, { title: productTitle, cost: cost });
                console.log('Expense updated successfully!');
                setCurrentExpenseId(null);
            } else {
                // Create new expense
                const newExpense = {
                    title: productTitle,
                    cost,
                    userId,
                };

                await addDoc(collection(db, 'expenses'), newExpense);
                console.log('Expense added successfully!');
            }
        } catch (error) {
            console.error('Error adding/updating expense:', error);
        }

        // Reset the input fields
        setProductTitle('');
        setProductCost('');
    };

    // Handle editing expense
    const handleEditExpense = (expense) => {
        setProductTitle(expense.title);
        setProductCost(expense.cost);
        setCurrentExpenseId(expense.id);
    };

    // Handle deleting expense
    const handleDeleteExpense = async (expenseId) => {
        try {
            const expenseDoc = doc(db, 'expenses', expenseId);
            await deleteDoc(expenseDoc);
            console.log('Expense deleted successfully!');
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <div className="wrapper">
            <div className="mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Budget Section */}
                    <div className="total-amount-container bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800">Set Budget</h3>
                        {budgetError && <p className="text-red-500">Value cannot be empty or negative</p>}
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:border-blue-500"
                            placeholder="Enter Total Amount"
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
                            onClick={handleSetBudget}
                        >
                            Set Budget
                        </button>
                    </div>
                    {/* Expenses Section */}
                    <div className="user-amount-container bg-white shadow-md p-4 rounded-lg">
                        <h3 class="text-xl font-bold text-gray-800">Add Expense</h3>
                        {titleError && <p className="text-red-500">Values cannot be empty or negative</p>}
                        <input
                            type="text"
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:border-blue-500"
                            placeholder="Enter Title of Product"
                        />
                        <input
                            type="number"
                            value={productCost}
                            onChange={(e) => setProductCost(parseFloat(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded mt-2 focus:border-blue-500"
                            placeholder="Enter Cost of Product"
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
                            onClick={handleAddExpense}
                        >
                            {currentExpenseId ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </div>
                </div>
                {/* Budget Information */}
                <div className="output-container flex justify-between mt-6 p-4 bg-blue-500 rounded-lg shadow-md">
                    <div>
                        <p className="text-white font-medium">Total Budget</p>
                        <span className="text-lg font-semibold">{budget.toFixed(2)}</span>
                    </div>
                    <div>
                        <p className="text-white font-medium">Total Expenses</p>
                        <span className="text-lg font-semibold">{totalExpenditure.toFixed(2)}</span>
                    </div>
                    <div>
                        <p className="text-white font-medium">Balance</p>
                        <span className="text-lg font-semibold">{balance.toFixed(2)}</span>
                    </div>
                </div>
                {/* Expense List */}
                <div className="list mt-6">
                    <h3 className="text-xl font-bold text-gray-800">Expense List</h3>
                    <div className="list-container mt-2">
                        {expenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2 hover:bg-gray-100 transition-all duration-300 ease-in-out"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{expense.title}</span>
                                    <span className="text-gray-600">${expense.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex space-x-2">
                                    {/* Edit button */}
                                    <button
                                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-600"
                                        onClick={() => handleEditExpense(expense)}
                                        title="Edit Expense"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M17.707 2.293a1 1 0 010 1.414L4.414 17H2v-2.414l13.293-13.293a1 1 0 011.414 0z" />
                                        </svg>
                                    </button>

                                    {/* Delete button */}
                                    <button
                                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-red-600"
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        title="Delete Expense"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 3a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 100-2h-1V4a1 1 0 00-1-1H6zm3 4a1 1 0 100 2h2a1 1 0 100-2H9zm3 0a1 1 0 100 2h2a1 1 0 100-2h-2zM8 11a1 1 0 011-1h2a1 1 0 100 2H9a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M5 5a1 1 0 00-1 1v11a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 00-1-1H5zm7 2a1 1 0 100 2h-2a1 1 0 000 2h2a1 1 0 100-2H8a1 1 0 01-1 1h1a1 1 0 100-2H7a1 1 0 00-1 1 1 1 0 100 2 1 1 0 01-1-1 1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetApp;
