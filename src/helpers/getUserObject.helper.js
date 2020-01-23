const getUserObject = user => ({
    id: user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    avatar: user.avatar,
    email: user.email,
    active: user.active,
    admin: user.admin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

export default getUserObject;
