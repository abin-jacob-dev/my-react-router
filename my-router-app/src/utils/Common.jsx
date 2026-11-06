const testfn = () => {
    console.log("Hello World");

}

const testObj = {
    'key1': 'value1',
    'key2': 'value2'
}

const saveUserInfo = (data) => {
    localStorage.setItem('cred', JSON.stringify(data))
}
const clearUserInfo = () => {
    localStorage.removeItem('cred')
}

const isLoggedIn = (data) => {
    try {
        var val = localStorage.getItem('cred')
        return !!val
    } catch (error) {
        return false
    }
}

export {
    testfn,
    saveUserInfo,
    clearUserInfo,
    isLoggedIn
}
export default testObj