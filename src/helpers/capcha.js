export const ASCIIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'x'];
export const DEFAULTS = {
    offSetMinSwipeExpand: -20,
    offSetMinSwipeEdit: 5,
    offSetMinSwipe: 15,
    offSetIncreaseSwipe: 4,
    offSetScrollInfinite: 100,
    lengthCaptcha: 6
}
export const generateCaptchaText = (length, sympol = '') => {
    sympol = sympol || '';

    let originalCaptcha = '';
    let displayCaptcha = '';

    let text = '';

    for (let i = 0; i < length; i++) {
        if (Math.round(Math.random()) === 0) {
            const number = Math.floor(Math.random() * 10).toString();

            originalCaptcha += number;
            displayCaptcha += number;

            if (i < length - 1) {
                displayCaptcha += sympol;
            }
        } else {
            text = ASCIIS[Math.floor(Math.random() * ASCIIS.length)];

            if (Math.round(Math.random()) === 0) {
                text = text.toUpperCase();
            } else {
                text = text.toLowerCase();
            }

            if (['j', 'J', 'i', 'I', 'l', 'L'].includes(text)) {
                i--;

                continue;
            }

            originalCaptcha += text;
            displayCaptcha += text;

            if (i < length - 1) {
                displayCaptcha += sympol;
            }
        }
    }

    return {
        originalCaptcha,
        displayCaptcha
    };
}