use ic_cdk::storage;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;

thread_local! {
    static COUNTER: RefCell<u32> = RefCell::new(0);
}

#[update]
fn increment_counter() {
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
    });
}

#[query]
fn get_counter() -> u32 {
    COUNTER.with(|counter| *counter.borrow())
}

#[update]
fn reset_counter() {
    COUNTER.with(|counter| *counter.borrow_mut() = 0);
}
