import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../Firebase/Fire.config';
import 'tailwindcss/tailwind.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const TOdo = () => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [recurrence, setRecurrence] = useState('');
    const [tasks, setTasks] = useState([]);
    const [dueTodayTasks, setDueTodayTasks] = useState([]);
    const [tasksOrder, setTasksOrder] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

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
            // Query tasks based on user's email
            const q = query(
                collection(db, 'tasks'),
                where('userEmail', '==', currentUser.email)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasksList = [];
                querySnapshot.forEach((doc) => {
                    tasksList.push({ id: doc.id, ...doc.data() });
                });
                setTasks(tasksList);
                setTasksOrder(tasksList.map(task => task.id));

                // Check for tasks due today
                const today = new Date().toISOString().split('T')[0];
                const dueToday = tasksList.filter(task => task.dueDate === today && !task.completed);
                setDueTodayTasks(dueToday);
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }, []);

    // Show notifications for tasks due today
    useEffect(() => {
        if (dueTodayTasks.length > 0 && Notification.permission === 'granted') {
            dueTodayTasks.forEach(task => {
                new Notification(`Task due today: ${task.task}`);
            });
        }
    }, [dueTodayTasks]);

    // Handle task recurrence
    const handleTaskRecurrence = async () => {
        const tasksQuery = query(collection(db, 'tasks'), where('userEmail', '==', currentUser.email));
        const tasksSnapshot = await getDocs(tasksQuery);
        const today = new Date();

        tasksSnapshot.forEach(async (taskDoc) => {
            const task = taskDoc.data();

            // Calculate the next recurrence date based on the task recurrence setting
            let nextDueDate = new Date(task.dueDate);
            if (task.recurrence === 'daily') {
                nextDueDate.setDate(nextDueDate.getDate() + 1);
            } else if (task.recurrence === 'weekly') {
                nextDueDate.setDate(nextDueDate.getDate() + 7);
            } else if (task.recurrence === 'monthly') {
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            }

            // Check if the task should recur today
            if (task.recurrence && nextDueDate <= today) {
                // Create a new task with the same properties as the original task
                const newTask = {
                    ...task,
                    dueDate: nextDueDate.toISOString().split('T')[0],
                };
                delete newTask.id;

                await addDoc(collection(db, 'tasks'), newTask);

                // Update the last due date of the original task
                // You could add a field like 'lastDueDate' to track the last due date of the task
            }
        });
    };

    // Add a new task to Firestore with the user's email or username
    const addTask = async (e) => {
        e.preventDefault();
        if (task && currentUser) {
            const docRef = await addDoc(collection(db, 'tasks'), {
                task,
                priority,
                dueDate,
                category,
                notes,
                recurrence,
                completed: false,
                userEmail: currentUser.email,
                username: currentUser.displayName,
            });
            // Reset input fields
            setTask('');
            setPriority('Medium');
            setDueDate('');
            setCategory('');
            setNotes('');
            setRecurrence('');
            setTasksOrder([...tasksOrder, docRef.id]);
        }
    };

    // Update a task
    const updateTask = async (taskId, updatedData) => {
        const taskDoc = doc(db, 'tasks', taskId);
        await updateDoc(taskDoc, updatedData);
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        const taskDoc = doc(db, 'tasks', taskId);
        await deleteDoc(taskDoc);
        setTasksOrder(tasksOrder.filter(id => id !== taskId));
    };

    // Handle drag and drop reordering
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasksOrder);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        setTasksOrder(reorderedTasks);
    };

    // Schedule the function to run daily at midnight to handle task recurrence
    useEffect(() => {
        const checkRecurrenceInterval = setInterval(() => {
            const now = new Date();
            // Run the recurrence check every day at midnight
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                handleTaskRecurrence();
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkRecurrenceInterval);
    }, []);

    return (
        <div className="mx-auto py-10 px-4">
            <img src="" alt="" />
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-500">To-Do List</h1>

            {/* Notification for tasks due today */}
            {dueTodayTasks.length > 0 && (
                <div className="alert alert-warning mb-6">
                    <span>You have {dueTodayTasks.length} task(s) due today!</span>
                </div>
            )}

            {/* Form to add a new task */}
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
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input input-bordered input-primary w-full"
                        />
                    </div>

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

            {/* Task list with drag-and-drop functionality */}
            <div className="w-full max-w-md mx-auto">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="tasks">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {tasksOrder.map((taskId, index) => {
                                    const task = tasks.find(t => t.id === taskId);
                                    return (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className={`card card-bordered shadow-md mb-4 p-4 rounded-lg ${task.priority === 'High' ? 'border-red-500' : task.priority === 'Medium' ? 'border-yellow-500' : 'border-green-500'}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
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
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                                                        <p className="text-sm text-gray-600">Due Date: {task.dueDate}</p>
                                                        <p className="text-sm text-gray-600">Category: {task.category}</p>
                                                        <p className="text-sm text-gray-600">Notes: {task.notes}</p>
                                                        <p className="text-sm text-gray-600">Recurrence: {task.recurrence || 'None'}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default TOdo;
