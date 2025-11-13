import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";
import { getCookie } from "../helpers/cookie";
import { HUB_LISTENS, URL_HUBS, HUB_EMITS, AUTHENTICATE_LOGIN_SUCCESS, DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE } from "../services/Common";
import audioFile from "../assets/audioFile/notification.mp3";

let isConnected = false;

const signalRMiddleware = ({ getState }) => next => async (action) => {
    const authenInfo = getCookie('AUTHEN_INFO');

    let authenInfoJSON = null;

    if (authenInfo) {
        authenInfoJSON = JSON.parse(authenInfo);
    }

    const id = (authenInfoJSON || {}).id;

    if (!isConnected && (action.type == AUTHENTICATE_LOGIN_SUCCESS || id)) {
        isConnected = true;

        const connectionMessageHub = new HubConnectionBuilder()
            .withUrl(URL_HUBS.message, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        connectionMessageHub
            .start()
            .then(() => {
                console.log('SignalR Connected');

                connectionMessageHub.send(HUB_EMITS.connect, id);

                connectionMessageHub.on(HUB_LISTENS.receiveMessage, res => {
                    console.log(res);

                    let totalAlert = ((getState().DashboardStore || {}).data || {}).getTotalAlert || 0;

                    totalAlert = totalAlert + 1;

                    const audio = new Audio(audioFile);
                    if (res) {
                        if (!audio.isPlaying) {
                            audio.play();
                        }
                    }

                    next({
                        type: DASHBOARD_GET_TOTAL_ALERTS_SUCCESS_TYPE, data: { getTotalAlert: totalAlert } 
                        
                    });
                    
                    console.log('****** NOTIFICATION ******', res);
                });
            })
            .catch(err => {
                console.log('SignalR Error', err);
            });
    }

    return next(action);
};

export default signalRMiddleware;