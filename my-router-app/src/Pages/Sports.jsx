import React from 'react'

function Sports({user}) {
    return (
        <>
        <div>High Jump : {user.sports.highjump}</div>
        <div>Long Jump : {user.sports.longjump}</div>
        </>
    )
}

export default Sports