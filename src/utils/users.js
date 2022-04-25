const users = []

const addUser = ({ id, username, address }) => {

    // Check for exsiting user
    const existingUser = users.find((user) => {
        return user.username == username
    })

    // Validate username
    if (existingUser) {
        const S_user = getUserByName(username)
        S_user.id = id
        S_user.address = address
        return S_user
    }

    if (!existingUser) {
    // Store user
    const S_user = { id, username, address }
    users.push(S_user)
    return S_user
    }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id == id)

    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id == id)
}

const getUserByName = (username) => {
    return users.find((user) => user.username == username)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByName
}