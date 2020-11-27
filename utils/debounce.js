export default function debounce(fn, delay) {
    let blocked = false

    return (...args)  => {
        if(blocked) {
            return
        }
        fn(...args)
        blocked = true

        setTimeout(() => {
            blocked = false
        }, delay)
    }
}