import warning from 'warning';
const warned = {};
export default (valid, component, message) => {
    if (!valid && !warned[message]) {
        warning(false, `[antd: ${component}] ${message}`);
        warned[message] = true;
    }
};
