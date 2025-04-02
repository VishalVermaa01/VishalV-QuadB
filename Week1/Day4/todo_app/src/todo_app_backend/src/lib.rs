use ic_cdk::storage;
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use candid::CandidType;


#[derive(Clone, Serialize, Deserialize, CandidType)]
struct Todo {
    id: u64,
    text: String,
    completed: bool,
}

thread_local! {
    static TODOS: std::cell::RefCell<Vec<Todo>> = std::cell::RefCell::new(Vec::new());
    static NEXT_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(0);
}

#[update]
pub fn add_todo(text: String) -> u64 {
    let id = NEXT_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let current_id = *next_id;
        *next_id += 1;
        current_id
    });

    let todo = Todo {
        id,
        text,
        completed: false,
    };
    
    TODOS.with(|todos| {
        todos.borrow_mut().push(todo);
    });
    
    id
}

#[query]
pub fn get_todos() -> Vec<Todo> {
    TODOS.with(|todos| todos.borrow().clone())
}

#[update]
pub fn toggle_todo(id: u64) -> bool {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        for todo in todos.iter_mut() {
            if todo.id == id {
                todo.completed = !todo.completed;
                return true;
            }
        }
        false
    })
}

#[update]
pub fn delete_todo(id: u64) -> bool {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        let initial_len = todos.len();
        todos.retain(|todo| todo.id != id);
        todos.len() < initial_len
    })
}