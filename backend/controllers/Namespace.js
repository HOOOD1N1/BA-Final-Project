const { pool } = require("../config/db/db");
const Sessions = require("../controllers/Sessions");
const socketIo = require("socket.io");
const http = require("http");
const cryptoRandomString = require("crypto-random-string");

module.exports = {
    create: async(params, io) => {
        const { userId } = params;
        const validSession = await Sessions.validate(params);
        if (validSession === true) {
            io.of(`/${userId}`).on("connection", async(socket) => {
                console.log("New user connected");
                const authorizationObject = JSON.parse(
                    socket.handshake.headers.authorization
                );
                if (authorizationObject) {
                    const validSession = await Sessions.validate(authorizationObject);
                    console.log("validSession returned", validSession);
                    if (validSession === true) {
                        io.of(`/${userId}`).emit(
                            "started_listening",
                            `Listening to the ${userId}`
                        );
                    }
                }

                //io.of('user');

                socket.on("enter", async(payload) => {
                    const { user1, user2 } = JSON.parse(payload);
                    console.log("Connection solved");
                    console.log("user1", user1, "user2", user2);
                    //socket.leave()
                    socket.join(`${user1}-${user2}`);
                    let key1 = `${user1}-${user2}`;
                    let key2 = `${user2}-${user1}`;
                    let result = await pool.query(
                        "SELECT sender,message FROM messages WHERE chatroom_id=$1 OR chatroom_id=$2", [key1, key2]
                    );
                    console.log(result.rows[0]);
                    if (result.rowCount > 0)
                        io.of(`/${userId}`)
                        .to(`${user1}-${user2}`)
                        .emit("messages", JSON.stringify({ messages: result.rows }));
                });
                socket.on("send", async(payload) => {
                    const { user1, user2, message } = JSON.parse(payload);
                    const resultSelect = await pool.query(
                        'select username from "Users" where id=$1', [user1]
                    );
                    let key1 = `${user1}-${user2}`;
                    let key2 = `${user2}-${user1}`;
                    let chatroomSelect = await pool.query(
                        "SELECT chatroom_id FROM messages WHERE chatroom_id=$1 OR chatroom_id=$2", [key1, key2]
                    );
                    const result = await pool.query(
                        "INSERT INTO messages(chatroom_id, sender, receiver, message) VALUES($1, $2, $3, $4)", [chatroomSelect.rows[0].chatroom_id, user1, user2, message]
                    );
                    io.of(`/${user2}`).emit(
                        "notify",
                        JSON.stringify({
                            authorUsername: resultSelect.rows[0].username,
                            message: message.substring(0, 64),
                        })
                    );
                });
                socket.on("disconnect", () => {
                    console.log("Client disconnected");
                });
            });
            return true;
        } else {
            return false;
        }
    },
    read: async(params) => {},
    update: async(params) => {},
    remove: async(params) => {},
};