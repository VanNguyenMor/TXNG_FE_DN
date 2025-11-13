const currentPosition = () => {
    return new Promise(resolve => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                return resolve({
                    status: true,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            });
        } else {
            resolve({
                status: false,
                latitude: 0,
                longitude: 0
            });
        }
    });
}

export {
    currentPosition
}