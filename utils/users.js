const users = [];

function userJoin(id, username, room)
{
    const user = {id, username, room};
    users.push(user);
    return user;
}

function getCurrentUser(id)
{
    return users.find(user => user.id == id);
}


function userLeft(id)
{
    const index = users.findIndex(user => user.id === id);

    if(index !== -1)
    {
        return users.splice(index, 1)[0];
    }
}
function getRoomUsers(room)
{
    //get me only those users which's room is passed
    return users.filter(user => user.room === room);
}

module.exports ={
    userJoin, 
    getCurrentUser,
    userLeft,
    getRoomUsers
}