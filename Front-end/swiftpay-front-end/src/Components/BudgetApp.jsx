import React, { useState, useEffect } from 'react';
import './bud.css';
import { db, auth } from '../../Firebase/Fire.config';
import { toast } from "react-toastify";
import Bull from "./../images/Bull.png"
import { Link } from 'react-router-dom';
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
import { onAuthStateChanged } from 'firebase/auth';

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
        fetchExpensesAndBudget(user.uid);
      } else {
        setCurrentUser(null);
        toast.error("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchExpensesAndBudget = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(db, `users/${uid}/expenses`));
      const fetchedExpenses = [];
      querySnapshot.forEach((doc) => {
        fetchedExpenses.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(fetchedExpenses);
      setTotalExpenses(fetchedExpenses.reduce((acc, expense) => acc + expense.amount, 0));

      const budgetDoc = await getDoc(doc(db, `users/${uid}/budget`, 'userBudget'));
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
        await setDoc(doc(db, `users/${currentUser.uid}/budget`, 'userBudget'), { amount: newBudget });
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
        const docRef = await addDoc(collection(db, `users/${currentUser.uid}/expenses`), newExpense);
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
      await deleteDoc(doc(db, `users/${currentUser.uid}/expenses`, expenseId));
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
        const expenseRef = doc(db, `users/${currentUser.uid}/expenses`, editId);
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
                <div className="mx-auto px-4 py-2 max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img src={Bull} alt="" className="h-10 w-auto" />
                            <a href="#" className="text-blue-500 text-lg font-bold ml-2 hover:text-shadow text-shadow-blur-2">Financial hub</a>
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
                        <div className="hidden md:flex md:items-center md:justify-center flex-1">
                          
                                <a href="https://harmonious-swan-71ba72.netlify.app"  target="_blank" className="text-blue-500 hover:text-blue-700 mx-4 relative hover:text-shadow text-shadow-blur-2" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>Talk with Expert<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                       
                            <span className="text-gray-400 mx-2">|</span>
                          
                                <a href="https://www.bing.com/search?q=how+to+make+a+budget&form=ANNTH1&refig=F9B9D5F5326E4186A3DDD1F78FA596B1" target='_blank' className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Learn More<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                      
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <Link to="/mainpage">
                                <button className="text-black bg-transparent border border-blue-500 px-4 py-2 transition duration-300 transform hover:scale-105 hover:shadow-md hover:bg-blue-500 hover:text-white">Back</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="bg-gray-50 py-4">
                      <a href="https://www.bing.com/search?q=how+to+make+a+budget&form=ANNTH1&refig=F9B9D5F5326E4186A3DDD1F78FA596B1" target='_blank' className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`}>Learn more</a>
                        <a href="https://harmonious-swan-71ba72.netlify.app" target='_blank' className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} >Tal with expert</a>
                    </div>
                    <Link to="/mainpage">
                        <div className="bg-gray-100 py-4 px-4 flex justify-center">
                            <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Back</button>
                        </div>
                    </Link>
                </div>
            </nav>
      <div className="budget-app__wrapper">
        <div className="budget-app__container">
          <div className="budget-app__sub-container">
            <div className="budget-app__input-wrapper">
              <h2 className="text-2xl font-bold mb-2">Total Budget</h2>
              <input
                type="number"
                className="budget-app__input"
                id="total-amount"
                placeholder="Enter total budget"
              />
              {budgetError && <p className="text-red-500">{budgetError}</p>}
                  <button
                  className="budget-app__button mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  onClick={handleSetBudget}
                >
                Set Budget
              </button>
            </div>
            <div className="budget-app__input-wrapper">
              <h2 className="text-2xl font-bold mb-2">Add Expense</h2>
              <input
                type="text"
                className="budget-app__input"
                id="product-title"
                placeholder="Enter product title"
              />
              <input
                type="number"
                className="budget-app__input"
                id="user-amount"
                placeholder="Enter amount"
              />
              <select
                className="budget-app__input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="bills">Bills</option>
                <option value="other">Other</option>
              </select>
              {productTitleError && (
                <p className="text-red-500">{productTitleError}</p>
              )}
              <button
                className="budget-app__button mt-2"
                onClick={isEditing ? handleUpdateExpense : handleAddExpense}
              >
                {isEditing ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
          <div className="budget-app__output-container flex justify-around mt-8">
            <div className="budget-app__output-item">
              <h3 className="text-lg font-bold">Total Budget</h3>
              <p id="amount">{budget}</p>
            </div>
            <div className="budget-app__output-item">
              <h3 className="text-lg font-bold">Total Expenses</h3>
              <p id="expenditure-value">{totalExpenses}</p>
            </div>
            <div className="budget-app__output-item">
              <h3 className="text-lg font-bold">Balance</h3>
              <p id="balance-amount">{budget - totalExpenses}</p>
            </div>
          </div>
        </div>
        <div className="budget-app__list mt-8" id="list">
          <div className="budget-app__filter-container">
            <label htmlFor="category-filter" className="font-bold mr-2">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              className="budget-app__input"
              value={filterCategory}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="bills">Bills</option>
              <option value="other">Other</option>
            </select>
          </div>
          <h3 className="mt-4">Expense List</h3>
          <ul>
            {filteredExpenses.map((expense) => (
              <li
                key={expense.id}
                className="budget-app__list-item flex justify-between items-center mt-2"
              >
                <span className="font-bold">{expense.title}</span>
                <span className="font-bold">{expense.amount}</span>
                <span className="font-bold">{expense.category}</span>
                <div className="flex items-center">
                  <button
                    className="budget-app__button mr-2"
                    onClick={() =>
                      handleEditExpense(expense.id, expense.title, expense.amount)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="budget-app__button"
                    onClick={() => handleDeleteExpense(expense.id, expense.amount)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BudgetApp;
