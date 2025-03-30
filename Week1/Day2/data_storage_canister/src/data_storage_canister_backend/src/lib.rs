use ic_cdk::storage;
use ic_cdk::query;
use ic_cdk::init;
// use ic_cdk_macros::*;
use ic_cdk::update;

#[init]
fn init() {}

#[update]
fn set_data(value: String) {
    storage::stable_save((value,)).unwrap();
}

#[query]
fn get_data() -> String {
    storage::stable_restore::<(String,)>().unwrap().0
}
