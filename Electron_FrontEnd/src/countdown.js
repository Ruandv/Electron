module.exports = function countdown(tick) {
    let count = 10;
    let timer = setInterval(() => {
        count--;
        tick(count);
        if (count == 0)
            clearInterval(timer);
    }, (1000));
}