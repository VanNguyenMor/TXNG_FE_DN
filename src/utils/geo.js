const currentPosition = () => {
    return new Promise(resolve => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    return resolve({
                        status: true,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                function (error) {
                    return resolve({
                        status: false,
                        latitude: 0,
                        longitude: 0,
                        error: error && error.message
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
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
