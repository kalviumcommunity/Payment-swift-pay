import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../../Firebase/Fire.config'; // Import Firebase configuration
import './B.css'; // Import CSS file

const BudgetApp = () => {
  // State variables
  const [budget, setBudget] = useState(() => {
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

  // Set budget and save to Firestore or local storage
  const handleSetBudget = async () => {
    if (budget <= 0) {
      setBudgetError(true);
    } else {
      setBudgetError(false);
      localStorage.setItem('budget', budget); // Save budget to local storage
      
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      
      // Save budget to Firestore for authenticated users
      if (userId) {
        try {
          const budgetDocRef = doc(db, 'budgets', userId);
          await setDoc(budgetDocRef, { budget });
          console.log('Budget set successfully in Firestore!');
        } catch (error) {
          console.error('Error setting budget in Firestore:', error);
        }
      }
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
        await updateDoc(expenseDoc, { title: productTitle, cost });
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

      // After adding or updating an expense, re-fetch the expenses from Firestore
      const expensesCollection = collection(db, 'expenses');
      const expensesQuery = query(expensesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(expensesQuery);
      
      const fetchedExpenses = [];
      snapshot.forEach((doc) => {
        fetchedExpenses.push({ id: doc.id, ...doc.data() });
      });
      
      setExpenses(fetchedExpenses);
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

      // After deleting an expense, re-fetch the expenses from Firestore
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      const expensesCollection = collection(db, 'expenses');
      const expensesQuery = query(expensesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(expensesQuery);

      const fetchedExpenses = [];
      snapshot.forEach((doc) => {
        fetchedExpenses.push({ id: doc.id, ...doc.data() });
      });

      setExpenses(fetchedExpenses);
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
            <h3 className="text-xl font-bold text-gray-800">Add Expense</h3>
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
          <ul className="mt-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md mb-2">
                <span>{expense.title}</span>
                <span>{expense.cost.toFixed(2)}</span>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                    onClick={() => handleEditExpense(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BudgetApp;
