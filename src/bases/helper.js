const EXTENSION_FILE_IMAGE = ['jpeg', 'jpg', 'png', 'bmp', 'webp', 'gif'];
const EXTENSION_FILE_UPLOAD = ['jpeg', 'jpg', 'png', 'bmp', 'webp', 'gif', 'xls', 'xlsx', 'docx', 'doc', 'pdf'];
const MAX_FILE_IMAGE_SIZE = 5;
const EXTENSION_FILE_WORD = ['doc', 'docm', 'dotx', 'dotm', 'dot'];
const EXTENSION_FILE_PDF = ['pdf'];
const EXTENSION_FILE_EXCEL = ['csv'];
const EXTENSION_FILE_TXT = ['txt'];

const validPhone = value => {
    const phoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if ((value || '').match(phoneNo)) {
        return true;
    } else {
        return false;
    }
}

const validEmail = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(value).toLowerCase());
}

const replaceComma = (value, replace) => {
    return (value || '').toString().replace(/,/g, replace);
}

const generateStyleTableCol = (tableBody, length, displayCountRow = 15) => {
    if (tableBody) {
        if (displayCountRow <= 0) {
            displayCountRow = 1;
        }

        const table = tableBody.parentElement;

        const header = table.querySelector('thead');

        let offsetHeightHeader = 0;

        if (header) {
            offsetHeightHeader = header.clientHeight;
        }

        const clientHeight = table.clientHeight - offsetHeightHeader;

        const heightRow = clientHeight / displayCountRow;

        return {
            height: `${heightRow}px`
        }
    }
}

const findParentElementByClass = (element, classes) => {
    if (!classes || !element) {
        return null;
    }

    const parent = element;

    if (!parent) {
        return null;
    }

    const classesSplit = (classes || '').split(' ');

    const check = Array.from(parent.classList).filter(p => classesSplit.filter(m => m == p).length > 0).length > 0;

    if (check) {
        return parent;
    }

    return findParentElementByClass(parent.parentElement, classes);
}

const validSize = (sizeFile, limitSize) => {
    sizeFile = sizeFile || 0;

    const sizeFileMB = sizeFile / 1024 / 1024;

    return sizeFileMB <= limitSize ? true : false;
}

const validExtensionFileImage = (fileName) => {
    const extension = (fileName || '').split('.').pop();

    return EXTENSION_FILE_IMAGE.find(p => p == extension) ? true : false;
}

const validExtensionFileUpload = (fileName) => {
    const extension = (fileName || '').split('.').pop();

    return EXTENSION_FILE_UPLOAD.find(p => p == extension) ? true : false;
}

const getFileName = value => {
    return (value || '').split(/(\\|\/)/g).pop();
}

const getExtensionFile = fileName => {
    return (fileName || '').split('.').pop();
}

const isUpper = value => {
    
    // return !/[a-z]/.test(value) && /[A-Z]/.test(value);
    for (let i = 0; i < value.length; i++) {
        if (value[i] === value[i].toUpperCase()) {
            return true;
        }
    }
    return false;
}

const replaceCommaDot = (value, replace) => {
    return (value || '').toString().replace(/\./g, replace);
}

const numberWithCommas = (value, coma) => {
    value = value || '';
    coma = coma || '.';

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, coma);
}

export {
    validPhone,
    validEmail,
    replaceComma,
    generateStyleTableCol,
    findParentElementByClass,
    validSize,
    getExtensionFile,
    getFileName,
    validExtensionFileImage,
    validExtensionFileUpload,
    EXTENSION_FILE_TXT,
    EXTENSION_FILE_PDF,
    MAX_FILE_IMAGE_SIZE,
    EXTENSION_FILE_IMAGE,
    EXTENSION_FILE_WORD,
    EXTENSION_FILE_EXCEL,
    EXTENSION_FILE_UPLOAD,
    isUpper,
    replaceCommaDot,
    numberWithCommas
}