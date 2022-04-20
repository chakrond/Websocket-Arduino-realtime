const users = []

const addUser = ({ id, username, address }) => {

    // Check for exsiting user
    const existingUser = users.find((user) => {
        return user.username == username
    })

    // Validate username
    if (existingUser) {
        const { id } = getUser(username)
        removeUser(id)
    }


    // Store user
    const S_user = { id, username, address }
    users.push(S_user)
    return S_user

}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id == id)

    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}


const getUser = (username) => {
    return users.find((user) => user.username == username)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room == room.trim().toLowerCase())
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}