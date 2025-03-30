use ic_cdk::update;
use std::cell::RefCell;

thread_local! {
    static COUNTER: RefCell<u32> = RefCell::new(0);
}

#[update]
fn increment() {
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
    });
}

#[update]
fn get_value() -> u32 {
    COUNTER.with(|counter| *counter.borrow())
}
