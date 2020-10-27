export const debounce = (func: any, threshold: number, execAsap?: boolean) => {
    let timeout;

    return function debounced() {
        const obj = this;
        const args = arguments;

        function delayed() {
            if (!execAsap) func.apply(obj, args);
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        } else if (execAsap) {
            func.apply(obj, args);
        }

        timeout = setTimeout(delayed, threshold || 100);
    };
};
