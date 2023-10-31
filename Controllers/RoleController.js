const User = require('../Models/Users');
const Role = require('../Models/Roles');


async function getRoleIdsByNames(roleNames) {
    try {
        const roles = await Role.find({ name: { $in: roleNames } }); // Assuming 'Role' is your Mongoose model
        return roles.map((role) => role._id);
    } catch (error) {
        console.error('Error getting role IDs:', error);
        return [];
    }
}
async function assignRolesToUser(userId, roleNames) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found');
            return;
        }
        const roles = await getRoleIdsByNames(roleNames);
        await User.findOneAndUpdate({_id: user._id},{roles})
        console.log('Roles assigned to user successfully');
    } catch (error) {
        console.error('Error assigning roles to user:', error);
    }
}

module.exports = assignRolesToUser