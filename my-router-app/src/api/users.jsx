import data from './data.json'
import { saveUserInfo } from "../utils/Common";

const dummyApi = (user) => {
    if (data[user]) {
        return Promise.resolve(data[user].role)
    }
    return Promise.reject("Invalid User")
}
const login = (user, password) => {
    return dummyApi(user, password)
        .then((role) => {
            saveUserInfo({
                user,
                role
            })
            return {
                status: 'success',
                data: role
            }
        })

}

export {
    login
}