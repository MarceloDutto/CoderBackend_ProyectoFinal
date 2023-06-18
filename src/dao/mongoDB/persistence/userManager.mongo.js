import User from "../models/user.models.js";

class UserManager {

    getAll = async () => {
        try {
            const data = await User.find();
            return data? data : [];
        } catch(error) {
            throw error;
        }
    };

    getById = async (uid) => {
        try {
            const data = await User.findById(uid);
            return data? data : {};
        } catch(error) {
            throw error;
        }
    };

    getByQuery = async (query) => {
        try {
            const data = await User.findOne(query);
            return data? data: {};
        } catch(error) {
            throw error;
        }
    };

    create = async (userInfo) => {
        try {
            const data = await User.create(userInfo);
            return data;
        } catch(error) {
            throw error;
        }
    };

    update = async (uid, update) => {
        try {
            const data = await User.findByIdAndUpdate(uid, update);
            return data;
        } catch(error) {
            throw error;
        }
    };

    delete = async (uid) => {
        try {
            const data = await User.findByIdAndDelete(uid);
            return data;
        } catch(error) {
            throw error;
        }
    };

    deleteAll = async () => {
        try {
            await User.deleteMany();
            return 'Todos los usuarios fueron eliminados de la base de datos';
        } catch(error) {
            throw error;
        }
    };
};

export default UserManager;