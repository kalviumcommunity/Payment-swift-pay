import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Fire.config';
import bull from "./../images/Bull.png";

const BudgetApp = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [productTitle, setProductTitle] = useState('');
  const [productCost, setProductCost] = useState('');
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [budgetError, setBudgetError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Food'); // Default category
  const [filteredCategory, setFilteredCategory] = useState('All'); // Default filter option
  const [tipQuestion, setTipQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState(false);
  
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;

        const budgetDocRef = doc(db, 'budgets', userEmail);
        const unsubscribeBudget = onSnapshot(budgetDocRef, (doc) => {
          if (doc.exists()) {
            setBudget(doc.data().budget);
          }
        });

        const expensesCollection = collection(db, 'expenses');
        const expensesQuery = query(expensesCollection, where('userEmail', '==', userEmail));
        const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
          const fetchedExpenses = [];
          snapshot.forEach((doc) => {
            fetchedExpenses.push({ id: doc.id, ...doc.data() });
          });
          setExpenses(fetchedExpenses);
        });

        return () => {
          unsubscribeBudget();
          unsubscribeExpenses();
        };
      } else {
        setBudget(0);
        setExpenses([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSetBudget = async () => {
    if (budget <= 0) {
      setBudgetError(true);
      return;
    }

    setBudgetError(false);

    try {
      const userEmail = auth.currentUser.email;
      const budgetDocRef = doc(db, 'budgets', userEmail);
      await setDoc(budgetDocRef, { budget });
      console.log('Budget set successfully in Firestore!');
    } catch (error) {
      console.error('Error setting budget in Firestore:', error);
    }
  };

  const handleAddExpense = async () => {
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

    try {
      const userEmail = auth.currentUser.email;
      if (currentExpenseId) {
        const expenseDoc = doc(db, 'expenses', currentExpenseId);
        await updateDoc(expenseDoc, { title: productTitle, cost, category: selectedCategory });
        console.log('Expense updated successfully!');
        setCurrentExpenseId(null);
      } else {
        const currentDate = new Date(); // Include the current date/time
        const newExpense = {
          title: productTitle,
          cost,
          userEmail,
          category: selectedCategory,
          date: currentDate, // Include the current date/time
        };

        await addDoc(collection(db, 'expenses'), newExpense);
        console.log('Expense added successfully!');
      }
    } catch (error) {
      console.error('Error adding/updating expense:', error);
    }

    setProductTitle('');
    setProductCost('');
  };

  const handleEditExpense = (expense) => {
    setProductTitle(expense.title);
    setProductCost(expense.cost);
    setCurrentExpenseId(expense.id);
    setSelectedCategory(expense.category);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const expenseDoc = doc(db, 'expenses', expenseId);
      await deleteDoc(expenseDoc);
      console.log('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilteredCategory(category);
  };

  const handleSubmitTipQuestion = async () => {
    if (tipQuestion.trim() === '') {
      return; // Don't submit empty questions
    }

    try {
      await addDoc(collection(db, 'tipQuestions'), { question: tipQuestion });
      setSubmittedQuestion(true);
      setTipQuestion(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error submitting tip question:', error);
    }
  };

  return (
    <div className="mx-auto px-4">
      <div className="flex items-center justify-between">
        <img className='w-10 h-10 mt-10 mr-4' src={bull} alt="" />
        <h1 className="text-3xl font-bold text-center text-blue-500">Finance Buddy</h1>
        <div className="w-10 h-10"></div> {/* Placeholder for right side content */}
      </div>
      <div className="lg:w-3/4 xl:w-1/2 lg:mx-auto mt-8">
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
            className="w-full bg-blue-500 text-white py-2 mt-2 rounded hover:bg-blue-700"
            onClick={handleSetBudget}
          >
            Set Budget
          </button>
        </div>

        <div className="user-amount-container bg-white shadow-md p-4 rounded-lg mt-4">
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
          <select
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Health Care">Health Care</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            <option value="Clothing">Clothing</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
          </select>
          <button
            className="w-full bg-blue-500 text-white py-2 mt-2 rounded hover:bg-blue-700"
            onClick={handleAddExpense}
          >
            {currentExpenseId ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>

        <div className="output-container flex justify-between mt-6 p-4 bg-blue-500 rounded-lg shadow-md">
          <div>
            <p className="text-white font-medium">Total Budget</p>
            <span className="text-lg font-semibold">{budget.toFixed(2)}</span>
          </div>
          <div>
            <p className="text-white font-medium">Total Expenses</p>
            <span className="text-lg font-semibold">{expenses.reduce((acc, expense) => acc + expense.cost, 0).toFixed(2)}</span>
          </div>
          <div>
            <p className="text-white font-medium">Balance</p>
            <span className="text-lg font-semibold">{(budget - expenses.reduce((acc, expense) => acc + expense.cost, 0)).toFixed(2)}</span>
          </div>
        </div>

        <div className="category-filter-container mt-6">
          <h3 className="text-xl font-bold text-gray-800">Filter Expenses</h3>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-2 focus:border-blue-500"
            value={filteredCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Health Care">Health Care</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            <option value="Clothing">Clothing</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
          </select>
        </div>

        <div className="list mt-6">
          <h3 className="text-xl font-bold text-gray-800">Expense List</h3>
          <ul className="mt-4">
            {expenses
              .filter((expense) => filteredCategory === 'All' || expense.category === filteredCategory)
              .map((expense) => (
                <li key={expense.id} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md mb-2">
                  <div>
                    <span>{expense.title}</span>
                    <p className="text-gray-500 text-sm mt-1">{expense.category}</p>
                    {/* Add date here */}
                    {expense.date && expense.date.seconds && (
                      <p className="text-gray-500 text-sm mt-1">{new Date(expense.date.seconds * 1000).toLocaleDateString()}</p>
                    )}
                  </div>
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
      <div className="flex justify-center mt-8">
      </div>
    </div>
  );
};

export default BudgetApp;
