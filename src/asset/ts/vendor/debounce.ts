export const debounce = (func: any, threshold: number, execAsap?: boolean) => {
    let timeout;

    return function debounced(...args: any[]) {
        const obj = this;

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
