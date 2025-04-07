module counter::counter {
    use std::signer;
    use std::error;

    struct Counter has key {
        value: u64,
    }

    public entry fun init(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<Counter>(addr), error::already_exists(0));
        move_to(account, Counter { value: 0 });
    }

    public entry fun increment(account: &signer) acquires Counter {
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + 1;
    }

    public fun get_count(addr: address): u64 acquires Counter {
        borrow_global<Counter>(addr).value
    }
}
