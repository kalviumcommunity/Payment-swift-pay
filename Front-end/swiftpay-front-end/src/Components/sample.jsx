import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../Firebase/Fire.config';
import bull from "./../images/Bull.png";

const BudgetApp = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetValue, setBudgetValue] = useState(0);
  const [budgetError, setBudgetError] = useState(false);
  
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;

        const budgetsCollection = collection(db, 'budgets');
        const budgetsQuery = query(budgetsCollection, where('userEmail', '==', userEmail));
        const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
          const fetchedBudgets = [];
          snapshot.forEach((doc) => {
            fetchedBudgets.push({ id: doc.id, ...doc.data() });
          });
          setBudgets(fetchedBudgets);
        });

        return () => {
          unsubscribeBudgets();
        };
      } else {
        setBudgets([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSetBudget = async () => {
    if (budgetValue <= 0) {
      setBudgetError(true);
      return;
    }

    setBudgetError(false);

    try {
      const userEmail = auth.currentUser.email;
      await addDoc(collection(db, 'budgets'), { budget: budgetValue, userEmail });
      console.log('Budget set successfully in Firestore!');
      setBudgetValue(0);
    } catch (error) {
      console.error('Error setting budget in Firestore:', error);
    }
  };

  const handleSelectBudget = (budget) => {
    setSelectedBudget(budget);
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
            value={budgetValue}
            onChange={(e) => setBudgetValue(parseFloat(e.target.value))}
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

        <div className="budget-list mt-6">
          <h3 className="text-xl font-bold text-gray-800">Budgets</h3>
          <ul className="mt-4">
            {budgets.map((budget) => (
              <li key={budget.id} className={`cursor-pointer p-4 border rounded-lg mb-2 ${selectedBudget && selectedBudget.id === budget.id ? 'bg-blue-200' : 'bg-white'}`} onClick={() => handleSelectBudget(budget)}>
                <span>{`Budget: ${budget.budget.toFixed(2)}`}</span>
              </li>
            ))}
          </ul>
        </div>

        {selectedBudget && (
          <div className="output-container flex justify-between mt-6 p-4 bg-blue-500 rounded-lg shadow-md">
            <div>
              <p className="text-white font-medium">Total Budget</p>
              <span className="text-lg font-semibold">{selectedBudget.budget.toFixed(2)}</span>
            </div>
            {/* Other calculations based on selectedBudget */}
          </div>
        )}

        {/* Additional components for handling expenses, filtering, etc. */}
        {/* Placeholder */}
      </div>
      <div className="flex justify-center mt-8">
      </div>
    </div>
  );
};

export default Sample;
