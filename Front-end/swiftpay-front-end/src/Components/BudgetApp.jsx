import React, { useState, useEffect } from 'react';
import './bud.css';
import { db,auth } from '../../Firebase/Fire.config';
import { toast } from "react-toastify";
import logo from "./../images/Bull.png"
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

const BudgetApp = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budgetError, setBudgetError] = useState('');
  const [productTitleError, setProductTitleError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [category, setCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
        fetchExpensesAndBudget();
      } else {
        setCurrentUser(null);
        // Redirect to login or show login UI
        toast.error("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchExpensesAndBudget = async () => {
    try {
      // Fetch expenses
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const fetchedExpenses = [];
      querySnapshot.forEach((doc) => {
        fetchedExpenses.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(fetchedExpenses);
      setTotalExpenses(fetchedExpenses.reduce((acc, expense) => acc + expense.amount, 0));

      // Fetch budget
      const budgetDoc = await getDoc(doc(db, 'budget', 'userBudget'));
      if (budgetDoc.exists()) {
        setBudget(budgetDoc.data().amount);
        document.getElementById('amount').innerText = budgetDoc.data().amount;
        document.getElementById('balance-amount').innerText = budgetDoc.data().amount - fetchedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Error fetching data");
    }
  };

  const handleSetBudget = async () => {
    const budgetInput = document.getElementById('total-amount').value;
    if (budgetInput === '' || budgetInput <= 0) {
      setBudgetError('Value cannot be empty or negative');
    } else {
      const newBudget = parseFloat(budgetInput);
      try {
        await setDoc(doc(db, 'budget', 'userBudget'), { amount: newBudget });
        setBudget(newBudget);
        setBudgetError('');
        document.getElementById('amount').innerText = newBudget;
        document.getElementById('balance-amount').innerText = newBudget - totalExpenses;
        document.getElementById('total-amount').value = '';
      } catch (e) {
        console.error('Error setting budget: ', e);
        toast.error('Error setting budget');
      }
    }
  };

  const handleAddExpense = async () => {
    const title = document.getElementById('product-title').value;
    const amount = document.getElementById('user-amount').value;
    if (title === '' || amount === '' || amount <= 0) {
      setProductTitleError('Values cannot be empty or negative');
    } else {
      const newExpense = { title, amount: parseFloat(amount), category };
      try {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        setExpenses([...expenses, { id: docRef.id, ...newExpense }]);
        const newTotalExpenses = totalExpenses + parseFloat(amount);
        setTotalExpenses(newTotalExpenses);
        setProductTitleError('');
        document.getElementById('expenditure-value').innerText = newTotalExpenses;
        document.getElementById('balance-amount').innerText = budget - newTotalExpenses;
        document.getElementById('product-title').value = '';
        document.getElementById('user-amount').value = '';
        setCategory('');
      } catch (e) {
        console.error('Error adding document: ', e);
        toast.error('Error adding expense');
      }
    }
  };

  const handleDeleteExpense = async (expenseId, amount) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
      const newExpenses = expenses.filter(expense => expense.id !== expenseId);
      const newTotalExpenses = totalExpenses - parseFloat(amount);
      setExpenses(newExpenses);
      setTotalExpenses(newTotalExpenses);
      document.getElementById('balance-amount').innerText = budget - newTotalExpenses;
      document.getElementById('expenditure-value').innerText = newTotalExpenses;
    } catch (e) {
      console.error('Error removing document: ', e);
      toast.error('Error deleting expense');
    }
  };

  const handleEditExpense = (id, title, amount) => {
    setIsEditing(true);
    setEditId(id);
    setEditTitle(title);
    setEditAmount(amount);
    document.getElementById('product-title').value = title;
    document.getElementById('user-amount').value = amount;
  };

  const handleUpdateExpense = async () => {
    if (editTitle === '' || editAmount === '' || editAmount <= 0) {
      setProductTitleError('Values cannot be empty or negative');
    } else {
      const updatedExpense = { title: editTitle, amount: parseFloat(editAmount), category };
      try {
        const expenseRef = doc(db, 'expenses', editId);
        await updateDoc(expenseRef, updatedExpense);
        const updatedExpenses = expenses.map(expense => expense.id === editId ? { id: editId, ...updatedExpense } : expense);
        setExpenses(updatedExpenses);
        const newTotalExpenses = updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpenses(newTotalExpenses);
        setIsEditing(false);
        setEditId(null);
        setEditTitle('');
        setEditAmount('');
        document.getElementById('expenditure-value').innerText = newTotalExpenses;
        document.getElementById('balance-amount').innerText = budget - newTotalExpenses;
        document.getElementById('product-title').value = '';
        document.getElementById('user-amount').value = '';
        setCategory('');
      } catch (e) {
        console.error('Error updating document: ', e);
        toast.error('Error updating expense');
      }
    }
  };
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredExpenses = filterCategory
    ? expenses.filter(expense => expense.category === filterCategory)
    : expenses;

  return (
    <>
<nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <img src={logo} alt="Logo" className="h-10 w-auto" />
                            <Link to="/" className="text-blue-500 text-lg font-bold ml-2 hover:text-blue-700">
                                Financial Hub
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-500 hover:text-blue-700 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                    )}
                                </svg>
                            </button>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Learn
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Talk with experts
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Contact Us
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center">
                            <Link to="">
                                <button className="text-black bg-transparent border border-blue-500 px-4 py-2 transition duration-300 transform hover:scale-105 hover:shadow-md hover:bg-blue-500 hover:text-white">
                                    Back
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="hidden md:flex items-center space-x-4">
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Learn
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Talk with experts
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link to="" className="text-blue-500 hover:text-blue-700 relative hover:border-b-2 hover:border-blue-500">
                                Contact Us
                            </Link>
                        </div>
                    <Link to="">
                        <div className="bg-gray-100 py-4 px-4 flex justify-center">
                            <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">
                                Back
                            </button>
                        </div>
                    </Link>
                </div>
            </nav>
      <div className="budget-app__wrapper">
        <div className="budget-app__container">
          <div className="budget-app__sub-container">
            <div className="budget-app__total-amount-container">
              <h3>Budget</h3>
              {budgetError && <p className="budget-app__error">{budgetError}</p>}
              <input type="number" id="total-amount" placeholder="Enter Total Amount" className="bg-gray-100 border border-gray-300 rounded-md p-2 my-2" />
              <button className="budget-app__submit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleSetBudget}>Set Budget</button>
            </div>
            <div className="budget-app__user-amount-container">
              <h3>Expenses</h3>
              {productTitleError && <p className="budget-app__error">{productTitleError}</p>}
              <input type="text" className="budget-app__product-title bg-gray-100 border border-gray-300 rounded-md p-2 my-2" id="product-title" placeholder="Enter Title of Product" />
              <input type="number" id="user-amount" placeholder="Enter Cost of Product" className="bg-gray-100 border border-gray-300 rounded-md p-2 my-2" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-100 border border-gray-300 rounded-md p-2 my-2 cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Others">Others</option>
              </select>
              {isEditing ? (
                <button className="budget-app__submit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleUpdateExpense}>Update Expense</button>
              ) : (
                <button className="budget-app__submit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleAddExpense}>Add Expense</button>
              )}
            </div>
          </div>
          <div className="budget-app__output-container flex justify-around mt-8">
            <div className="text-center">
              <p className="text-gray-600">Total Budget</p>
              <span id="amount" className="text-2xl font-semibold">${budget}</span>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Expenses</p>
              <span id="expenditure-value" className="text-2xl font-semibold">${totalExpenses}</span>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Balance</p>
              <span id="balance-amount" className="text-2xl font-semibold">${budget - totalExpenses}</span>
            </div>
          </div>
        </div>
        <div className="budget-app__list mt-8" id="list">
          <div className="budget-app__filter-container">
            <select
              value={filterCategory}
              onChange={handleFilterChange}
              className="bg-gray-100 border border-gray-300 rounded-md p-2 my-2 cursor-pointer"
            >
              <option value="">Filter by Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <h3 className="mt-4">Expense List</h3>
          {filteredExpenses.map(expense => (
            <div
              className="sublist-content p-4 bg-gray-50 border-l-4 border-blue-500 mb-4 grid grid-cols-3 items-center rounded-lg shadow relative mt-12"
              key={expense.id}
              data-id={expense.id}
            >
              <p className="product font-medium">{expense.title} ({expense.category})</p>
              <div className="amount text-center text-gray-700">${expense.amount.toFixed(2)}</div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  className="edit text-green-500 hover:text-blue-700"
                  onClick={() => handleEditExpense(expense.id, expense.title, expense.amount)}
                >
                  Edit
                </button>
                <button
                  className="delete text-red-500 hover:text-blue-700"
                  onClick={() => handleDeleteExpense(expense.id, expense.amount)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BudgetApp;
