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

            // Delete task if completed
            if (updatedData.completed) {
                await deleteDoc(taskDoc);
            }
        } catch (error) {
            console.error('Error updating task:', error);
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
                            <Link to="/mainpage">
                                <a href="#" className="text-blue-500 hover:text-blue-700 mx-4 relative hover:text-shadow text-shadow-blur-2" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>Home<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <span className="text-gray-400 mx-2">|</span>
                           <a href="https://www.wikihow.com/Keep-Track-of-Your-Personal-Finances" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Learn more
                                <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span>
                            </a>
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
                    <Link to="/mainpage">
                                <a href="#" className="text-blue-500 hover:text-blue-700 mx-4 relative hover:text-shadow text-shadow-blur-2" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }}>Home<span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span></a>
                            </Link>
                            <a href="https://www.wikihow.com/Keep-Track-of-Your-Personal-Finances" className="text-blue-500  hover:text-shadow text-shadow-blur-2 hover:text-blue-700 mx-4 relative" onMouseEnter={(e) => { e.target.style.borderBottom = '2px solid blue' }} onMouseLeave={(e) => { e.target.style.borderBottom = 'none' }} >Learn more
                                <span className="absolute bottom-0 left-0 w-full border-b-2 border-blue-500 opacity-0 transition-opacity duration-300"></span>
                            </a>
                    </div>
                    <Link to="/To">
                        <div className="bg-gray-100 py-4 px-4 flex justify-center">
                            <button className="text-black bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 transition duration-300">Back</button>
                        </div>
                    </Link>
                </div>
            </nav>

            <div className=" mx-auto px-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
                    <div className="flex items-center space-x-2">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Others">Others</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="asc">Sort by Due Date (Ascending)</option>
                            <option value="desc">Sort by Due Date (Descending)</option>
                        </select>
                    </div>
                </div>

                <form onSubmit={addTask} className="mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Task"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <select
                            value={recurrence}
                            onChange={(e) => setRecurrence(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">No Recurrence</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add Task
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border-gray-300 border rounded">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Task
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Due Date & Time
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Recurrence
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className={isTaskOverdue(task) ? 'bg-red-100' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                                                className="mr-2 form-checkbox h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="text-sm font-medium text-gray-900">{task.task}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.priority}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate} {task.dueTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.notes}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.recurrence}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default TOdo;
