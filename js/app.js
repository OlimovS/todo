// CODE EXPLAINED channel
const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

function eventListeners() {
  const todoList = document.querySelector('#todo-list')
  const addTodoBtn = document.querySelector('.add-todo-btn');
  const todoInputElem = document.querySelector('#input');
  const date = document.querySelector('#date');
  const clearAll = document.querySelector('#clear-all');
  const modal = document.querySelector('.modal')

  const startMessage = document.createElement('h2')


  const currentDate = new Date();
  date.innerText = currentDate.getDate() + ' ' + months[currentDate.getMonth()];

  // Initial showing ui
  todoInputElem.focus()
  let id;
  const ui = new UI();

  let todos = ui.retrieveLocalStorage();
  if(todos.length > 0) {
    id = todos[todos.length - 1].id + 1;
  } else {
    id = 1;

   startTodoMessage()
  }
  todos.forEach(todo => {
    ui.showTodo(todoList, todo);
  })


  clearAll.addEventListener('click', function(){
    if(todos.length === 0) {
       return;
    }
    ui.showElement(modal)
  })

  modal.addEventListener('click', function(){
    if(event.target.classList.contains('red')) {
      ui.clearLocalStorage()
      todos = [];
      todoList.innerHTML = '';
      startTodoMessage()
      ui.hideElement(modal)
    } else if(event.target.classList.contains('green')) {
      ui.hideElement(modal)
    }
  })

  todoList.addEventListener('click', function(event) {
    let filteredTodos, handlingId;
    if(event.target.classList.contains('delete')) {
      todoList.removeChild(event.target.parentElement)
      handlingId = parseInt(event.target.dataset.id);
      filteredTodos = todos.filter(todo => todo.id !== handlingId );
      todos = filteredTodos;
      ui.saveTodosLocalStorage(todos);

      if(todos.length === 0) {
        startTodoMessage()
      }
    }

    else if(event.target.classList.contains('complete')) {
      handlingId = parseInt(event.target.dataset.id);
      let indexOfChecked = todos.findIndex(todo => todo.id === handlingId)
      todos[indexOfChecked].done = true;
      ui.saveTodosLocalStorage(todos);
      ui.makeTodoChecked(event.target)
    }

  })

  addTodoBtn.addEventListener('click', function(){
    removeStartMessage()
    handleTodoInput()
  });

  todoInputElem.addEventListener('keyup', function(event) {
    if(event.keyCode === 13){
      removeStartMessage()
      handleTodoInput()
    }
  })

  function handleTodoInput() {
    const todoInputText = todoInputElem.value;
    if(todoInputText.trim() === ''){
      console.log('fill todo')
      ui.handleEmtyInput(todoInputElem, 'Start typing...')
    } else {
      const todo = new Todo(id, todoInputText);
      id++;
      todos.push(todo);
      ui.saveTodosLocalStorage(todos);
      ui.showTodo(todoList, todo)
      ui.clearField(todoInputElem)
      ui.handleEmtyInput(todoInputElem, 'Add todo')
    }
  }

  function startTodoMessage() {
    startMessage.innerText = 'Start adding todos!'
    startMessage.style.textAlign = 'center'
    todoList.append(startMessage);
  }
  function removeStartMessage(){
    if(todoList.contains(startMessage)){
      todoList.removeChild(startMessage)
    }
  }
  // End of eventListeners
}

function UI() {

}

UI.prototype.retrieveLocalStorage = function() {
   const data = localStorage.getItem('todos');
   if(data) {
     return JSON.parse(data);
   } else {
     return [];
   }
}
UI.prototype.saveTodosLocalStorage = function(data){
   localStorage.clear()
   localStorage.setItem('todos', JSON.stringify(data))
}

UI.prototype.clearField = function(input) {
  input.value = '';
}

UI.prototype.showTodo = function(parent, todo) {
  parent.prepend(makeLiItem(todo))
}

UI.prototype.handleEmtyInput = function(inputElem, placeMessage) {
  inputElem.placeholder = placeMessage;
  inputElem.focus();
}

UI.prototype.makeTodoChecked = function(elemNode, todo) {
  elemNode.classList.remove('fa-circle-thin', 'complete')
  elemNode.classList.add('fa-check', 'checked')
  elemNode.nextElementSibling.classList.add('done-todo-text')
}

UI.prototype.clearLocalStorage = function(){
  localStorage.clear();
}

function makeLiItem(todo){
  const listItem = document.createElement('li');
  listItem.classList.add('item');
  listItem.innerHTML = `
    ${todo.done ? '<i class="fa fa-check checked"></i>' : `<i class="fa fa-circle-thin complete" data-id="${todo.id}"></i>`}
    <p class="text ${todo.done ? 'done-todo-text' : ''}">${todo.text}</p>
    <i class="fa fa-trash-o delete" data-id="${todo.id}"></i>
  `;
  return listItem;
}

UI.prototype.showElement = function(elem) {
  elem.style.display = 'block'
}

UI.prototype.hideElement = function(elem) {
  elem.style.display = 'none'
}

function Todo(id, text) {
  this.id = id;
  this.text = text;
  this.done = false;
}

document.addEventListener("DOMContentLoaded", function(){
  eventListeners()
})
