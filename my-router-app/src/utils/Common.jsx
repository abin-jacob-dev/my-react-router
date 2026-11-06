import { matchPath } from 'react-router-dom';
import routeConfig from './route-config-main.json'
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
const getRoles = () => {
    try {
        const val = JSON.parse(localStorage.getItem('cred')) || {}
        const role = val.role
        return role

    } catch (error) {
        return []
    }

}

const isRouteRoleMatches = (roles) => {
    if (!roles) {
        return true
    }
    const userRoles = getRoles()
    const filtered = roles.filter((item) => userRoles.includes(item))

    return !!filtered.length
}
const getRolesForPath = (pathname) => {
    for (const [path, obj] of Object.entries(routeConfig)) {
        if (matchPath(path, pathname)) {
            return obj.roles
        }
    }
    return null
}

const isPathAllowed = (pathname) => {
    const roles = getRolesForPath(pathname)
    return isRouteRoleMatches(roles)
}

export {
    testfn,
    saveUserInfo,
    clearUserInfo,
    isLoggedIn,
    isPathAllowed,
    getRolesForPath
}
export default testObj