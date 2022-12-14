const form = document.getElementById('form')
const taskInput = document.getElementById('task')
const taskList = document.getElementById('task-list')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()
// let tasks = {
//     '32443435': {
//         id: '32443435',
//         title: 'Task 1',
//         status: false
//     },
//     '324468482': {
//         id: '324468482',
//         title: 'Task 2',
//         status: false
//     }
// }

let tasks = {}

document.addEventListener('DOMContentLoaded', (e) => {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    loadTask()
})


form.addEventListener('submit', (e) => {
    e.preventDefault()
    setTask(e)
})

taskList.addEventListener('click', (e) => {
    btnAction(e)
})

const setTask = (e) => {
    if (taskInput.value.trim() === '') {
        alert('this is empty!')
        return
    }

    const task = {
        id: Date.now(),
        title: taskInput.value,
        status: false
    }

    tasks[task.id] = task

    form.reset()
    taskInput.focus()
    loadTask(tasks)
}

const loadTask = () => {

    localStorage.setItem('tasks', JSON.stringify(tasks))

    if (Object.values(tasks).length === 0) {
        taskList.innerHTML = `
            <div class="empty-tasklist">There is not tasks to do 😎</div>
        `
        return
    }

    taskList.innerHTML = ''
    Object.values(tasks).forEach(task => {
        const clone = template.cloneNode(true)
        clone.querySelector('.title').textContent = task.title

        if (task.status) {
            clone.querySelector('.task-card').classList.replace('task-active', 'task-deactivate')
            clone.querySelector('.title').style.textDecoration = 'line-through'
            clone.querySelector('.btn-success').textContent = '🔄'
            clone.querySelector('.btn-success').classList.add('btn-undo')
        }

        clone.querySelector('.btn-success').dataset.id = task.id
        clone.querySelector('.btn-delete').dataset.id = task.id
        fragment.appendChild(clone)
    });
    taskList.appendChild(fragment)
}

const btnAction = (e) => {
    if (e.target.classList.contains('btn-success')) {
        tasks[e.target.dataset.id].status = true
        loadTask()
    }
    if (e.target.classList.contains('btn-delete')) {
        delete tasks[e.target.dataset.id]
        loadTask()
    }
    if (e.target.classList.contains('btn-undo')) {
        tasks[e.target.dataset.id].status = false
        loadTask()
    }

    e.stopPropagation()
}
