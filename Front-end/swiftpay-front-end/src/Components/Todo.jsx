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
import bull from './../images/Bull.png';
import sgMail from '@sendgrid/mail';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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

                setTasks(tasksList);
                updatePendingTasks(tasksList);
                checkTasksDueToday(tasksList);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

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
        <div className="mx-auto py-10 px-4">
            <img className="w-10 h-10 " src={bull} alt="" />
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

            {/* Task list */}
            <div className="w-full max-w-md mx-auto">
                {tasks.map((task) => {
                    const overdue = isTaskOverdue(task);
                    return (
                        <div
                            key={task.id}
                            className={`card card-bordered shadow-md mb-4 p-4 rounded-lg ${
                                task.priority === 'High' ? 'border-red-500' :
                                task.priority === 'Medium' ? 'border-yellow-500' :
                                'border-green-500'
                            } ${overdue ? 'bg-red-300' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => updateTask(task.id, { completed: !task.completed })}
                                        className="checkbox checkbox-primary mr-2"
                                    />
                                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                        {task.task}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </div>

                            {overdue && (
                                <div className="text-xs text-red-600 font-bold mb-2">Pending</div>
                            )}
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                                <p className="text-sm text-gray-600">Due Date: {task.dueDate}</p>
                                <p className="text-sm text-gray-600">Due Time: {task.dueTime || '00:00'}</p>
                                <p className="text-sm text-gray-600">Category: {task.category}</p>
                                <p className="text-sm text-gray-600">Notes: {task.notes}</p>
                                <p className="text-sm text-gray-600">Recurrence: {task.recurrence || 'None'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TOdo;
