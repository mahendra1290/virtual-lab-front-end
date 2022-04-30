import { io } from 'socket.io-client';


// const serverUrl = "http://159.65.148.48"
const serverUrl = import.meta.env.VITE_SOCKET_BASE_URL


const socket = io(serverUrl, {
  autoConnect: false,
})

export { socket }
