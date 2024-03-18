import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";

async function request(url, data, method = "POST") {
	const response = await fetch(url, {
		method: method,
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify(data),
	});
}

const FILTER_MAP = {
	All: () => true,
	Active: (task) => !task.completed,
	Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
	const [filter, setFilter] = useState("All");

	const filterList = FILTER_NAMES.map((name) => (
		<FilterButton
			key={name}
			name={name}
			isPressed={name === filter}
			setFilter={setFilter}
		/>
	));

	const [tasks, setTasks] = useState(props.tasks);

	useEffect(() => {
		fetch("/api/tasks")
			.then((res) => res.json())
			.then((data) => {
				setTasks(data);
			});
	}, []);

	function toggleTaskCompleted(id) {
		const updatedTasks = tasks.map((task) => {
			// if this task has the same ID as the edited task
			if (id === task.id) {
				const newTask = { ...task, completed: !task.completed };
				request(`/api/task/${id}`, newTask);
				return newTask;
			}
			return task;
		});
		setTasks(updatedTasks);
		request(`/api/task/${id}`, updatedTasks[id]);
	}

	function deleteTask(id) {
		request(`/api/task/${id}`, tasks[id], "DELETE");
		const remainingTasks = tasks.filter((task) => id !== task.id);
		setTasks(remainingTasks);
	}

	function editTask(id, newName) {
		const editedTaskList = tasks.map((task) => {
			// if this task has the same ID as the edited task
			if (id === task.id) {
				const newTask = { ...task, name: newName };
				request(`/api/task/${id}`, newTask);
				return newTask;
			}
			// Return the original task if it's not the edited task
			return task;
		});
		setTasks(editedTaskList);
	}

	const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => {
		return (
			<Todo
				id={task.id}
				name={task.name}
				completed={task.completed}
				key={task.id}
				toggleTaskCompleted={toggleTaskCompleted}
				editTask={editTask}
				deleteTask={deleteTask}
			/>
		);
	});

	function addTask(name) {
		const newTask = { id: `todo-${nanoid()}`, name, completed: false };
		setTasks([...tasks, newTask]);
		request(`/api/task/${newTask.id}`, newTask);
	}

	const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
	const headingText = `${taskList.length} ${tasksNoun} remaining`;

	return (
		<div className="todoapp stack-large">
			<h1>David's To-Do App</h1>
			<p>
				This is a simple to-do app, built with React and served with FastAPI.
                Tasks are stored on the server and updated using a REST API.
                <br/>
                API docs are available <a href="https://react.daelon.net/docs">here</a>
                <br/>
                Project repository is <a href="https://github.com/DaelonSuzuka/react_demo">here</a>
			</p>
			<Form addTask={addTask} />
			<div className="filters btn-group stack-exception">{filterList}</div>
			<h2 id="list-heading">{headingText}</h2>
			<ul
				role="list"
				className="todo-list stack-large stack-exception"
				aria-labelledby="list-heading"
			>
				{taskList}
			</ul>
		</div>
	);
}

export default App;
