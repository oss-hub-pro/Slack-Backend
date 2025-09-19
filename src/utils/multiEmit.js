const multiEmit = (socketList, memebers, action, data = {}) => {
    memebers.forEach(v => {
        socketList[v] && socketList[v].forEach(s => s.emit(action, data))
    })
}
module.exports = multiEmit