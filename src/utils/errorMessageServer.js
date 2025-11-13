const getErrorMessageServer = (response, getCountError) => {
    let message = response.message;
    
    if (!message) {
        message = (response.data || {}).message;

        if (message) {
            return message;
        }

        message = '';

        let data = (((response.error || {}).response || {}).data || {}).errors || {};

        if (!data) {
            data = ((response.error || {}).response || {}).data || {};
        }

        getCountError = getCountError || 1;

        const errors = Object.keys(data);

        getCountError = errors.length < getCountError ? errors.length : getCountError;

        let temp = '';
        
        for (let i = 0; i < getCountError; i++) {
            temp = data[errors[i]];

            if (Array.isArray(temp)) {
                message += temp[0] + "\n";
            } else {
                message += temp + "\n";
            }
        }
    }

    return message || '';
}

export {
    getErrorMessageServer
}