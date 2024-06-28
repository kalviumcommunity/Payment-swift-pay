import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc,
    getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../Firebase/Fire.config';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Bull from './../images/Bull.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


const TOdo = () => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [recurrence, setRecurrence] = useState('');
    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [filterCategory, setFilterCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Monitor authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                navigate('/signIn-signUp');
            }
        });
        return unsubscribe;
    }, [navigate]);

    // Fetch tasks from Firestore filtered by user's email
    useEffect(() => {
        if (currentUser) {
            const tasksCollection = collection(db, 'tasks');
            const tasksQuery = query(tasksCollection, where('userEmail', '==', currentUser.email));
            const unsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
                const tasksList = [];

                querySnapshot.forEach((doc) => {
                    const task = { id: doc.id, ...doc.data() };
                    tasksList.push(task);
                });

                const filteredAndSortedTasks = filterAndSortTasks(tasksList);
                setTasks(filteredAndSortedTasks);
                updatePendingTasks(filteredAndSortedTasks);
                checkTasksDueToday(filteredAndSortedTasks);
            });

            return () => unsubscribe();
        }
    }, [currentUser, filterCategory, sortOrder]);

    // Function to filter and sort tasks
    const filterAndSortTasks = (tasksList) => {
        let filteredTasks = tasksList;

        if (filterCategory) {
            filteredTasks = filteredTasks.filter(task => task.category === filterCategory);
        }

        filteredTasks.sort((a, b) => {
            const dateA = new Date(`${a.dueDate}T${a.dueTime || '00:00'}`);
            const dateB = new Date(`${b.dueDate}T${b.dueTime || '00:00'}`);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filteredTasks;
    };

    // Function to update the pending tasks list based on due time
    const updatePendingTasks = (tasksList) => {
        const currentDateTime = new Date();
        const overdueTasks = tasksList.filter(task => {
            const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '00:00'}`);
            return !task.completed && dueDateTime < currentDateTime;
        });
        setPendingTasks(overdueTasks);

        if (overdueTasks.length > 0) {
            toast.warn(`You have ${overdueTasks.length} pending task(s).`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Check for tasks due today and send email notifications
    const checkTasksDueToday = (tasksList) => {
        const today = new Date().toISOString().split('T')[0];
        const dueTodayTasks = tasksList.filter(task => task.dueDate === today && !task.completed);
        if (dueTodayTasks.length > 0) {
            sendEmailNotification(dueTodayTasks);
        }
    };

    // Add a new task
    const addTask = async (e) => {
        e.preventDefault();
        if (task && currentUser) {
            const newTask = {
                task,
                priority,
                dueDate,
                dueTime,
                category,
                notes,
                recurrence,
                completed: false,
                userEmail: currentUser.email,
                username: currentUser.displayName,
            };

            try {
                await addDoc(collection(db, 'tasks'), newTask);
                setTask('');
                setPriority('Medium');
                setDueDate('');
                setDueTime('');
                setCategory('');
                setNotes('');
                setRecurrence('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    // Update a task
    const updateTask = async (taskId, updatedData) => {
        const taskDoc = doc(db, 'tasks', taskId);
        try {
            await updateDoc(taskDoc, updatedData);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        const taskDoc = doc(db, 'tasks', taskId);
        try {
            await deleteDoc(taskDoc);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Check if a task is overdue
    const isTaskOverdue = (task) => {
        const currentDateTime = new Date();
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '00:00'}`);
        return !task.completed && dueDateTime < currentDateTime;
    };

    // Handle task recurrence at midnight
    useEffect(() => {
        const handleMidnight = () => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                handleTaskRecurrence();
            }
        };

        const intervalId = setInterval(handleMidnight, 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Handle task recurrence
    const handleTaskRecurrence = async () => {
        const tasksQuery = query(collection(db, 'tasks'), where('userEmail', '==', currentUser.email));
        const tasksSnapshot = await getDocs(tasksQuery);
        const today = new Date();

        tasksSnapshot.forEach(async (taskDoc) => {
            const task = taskDoc.data();
            const nextDueDate = calculateNextRecurrenceDate(task);

            if (task.recurrence && nextDueDate <= today) {
                const newTask = { ...task, dueDate: nextDueDate.toISOString().split('T')[0] };
                delete newTask.id;

                try {
                    await addDoc(collection(db, 'tasks'), newTask);
                } catch (error) {
                    console.error('Error adding recurrent task:', error);
                }
            }
        });
    };

    // Calculate the next recurrence date
    const calculateNextRecurrenceDate = (task) => {
        let nextDueDate = new Date(task.dueDate);
        switch (task.recurrence) {
            case 'daily':
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
            case 'weekly':
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
            case 'monthly':
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
            default:
                nextDueDate = null;
        }
        return nextDueDate;
    };

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
                            <Link to="/About">
                                <a href="#" className="text-blue-500 hover:text-blue-700 mx-4 relative hover:text-shadow text-shadow-blur-2" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>About Us<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <span className="text-gray-400 mx-2">|</span>
                            <Link to='/Service'>
                                <a href="#" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Services<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <span className="text-gray-400 mx-2">|</span>
                            <Link to="/contact"><a href="#" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Contact Us
                                <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span>
                            </a></Link>
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <Link to="/">
                                <button className="text-black bg-transparent border border-blue-500 px-4 py-2 transition duration-300 transform hover:scale-105 hover:shadow-md hover:bg-blue-500 hover:text-white">Back</button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="bg-gray-50 py-4">
                        <Link to='/About'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`}>About</a></Link>
                        <Link to='/Service'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} >Services</a></Link>
                        <Link to='contact'><a href="#" className={`block py-2 px-4 text-sm text-blue-500 hover:bg-gray-100`} >Contact Us</a></Link>
                    </div>
                    <Link to="/">
                        <div className="bg-gray-100 py-4 px-4 flex justify-center">
                            <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Back</button>
                        </div>
                    </Link>
                </div>
            </nav>
        
        <div className="mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">Fiscal Focus</h1>

            {/* React Toastify container */}
            <ToastContainer />

            {/* Task addition form */}
            <form onSubmit={addTask} className="w-full max-w-md mx-auto mb-6 p-4 rounded-lg bg-white shadow-lg">
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Add a new task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="select select-primary w-full"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input input-bordered input-primary w-full"
                        />
                    </div>

                    {/* Time input below date input */}
                    <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input input-bordered input-primary w-full"
                    />

                    <textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="textarea textarea-bordered textarea-primary w-full"
                    />

                    <select
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value)}
                        className="select select-primary w-full"
                    >
                        <option value="">No recurrence</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>

                    <button type="submit" className="btn btn-primary w-full mt-4">Add Task</button>
                </div>
            </form>

            {/* Category filter and sort order selection */}
            <div className="w-full max-w-md mx-auto mb-4">
                <div className="flex justify-between items-center">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="select select-primary"
                    >
                        <option value="">All Categories</option>
                        {tasks.map((task, index) => (
                            <option key={index} value={task.category}>{task.category}</option>
                        ))}
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="select select-primary"
                    >
                        <option value="asc">Sort by Date: Ascending</option>
                        <option value="desc">Sort by Date: Descending</option>
                    </select>
                </div>
            </div>

            {/* Task table */}
            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-4 py-2">Task</th>
                                <th className="px-4 py-2">Priority</th>
                                <th className="px-4 py-2">Due Date</th>
                                <th className="px-4 py-2">Due Time</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Notes</th>
                                <th className="px-4 py-2">Recurrence</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => {
                                const overdue = isTaskOverdue(task);
                                return (
                                    <tr key={task.id} className={`border-t ${overdue ? 'bg-red-300' : ''}`}>
                                        <td className="px-4 py-2">{task.task}</td>
                                        <td className="px-4 py-2">{task.priority}</td>
                                        <td className="px-4 py-2">{task.dueDate}</td>
                                        <td className="px-4 py-2">{task.dueTime || '00:00'}</td>
                                        <td className="px-4 py-2">{task.category}</td>
                                        <td className="px-4 py-2">{task.notes}</td>
                                        <td className="px-4 py-2">{task.recurrence || 'None'}</td>
                                        <td className="px-4 py-2 flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => updateTask(task.id, { completed: !task.completed })}
                                                className="checkbox checkbox-primary mr-2"
                                            />
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
    );
};

export default TOdo;
