import HttpStatus from '../enums/httpsStatus.js';
import userRepository from '../repositories/userRepository.js';

const getUsers = async (req, res) => {
    const result = await userRepository.getAllUsers();
    res.status(HttpStatus.OK).json(result);
}

export default { getUsers };