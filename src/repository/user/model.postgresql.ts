import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import { DB_TABLE_NAMES } from "../../helpers/constants";

class User extends Model {
    public firstname!: string;

    public lastname!: string;

    public email!: string;

    public username!: string;

    public password!: string;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;

  // Your sequelize logic here
}

const UserModel = (sequelizeInstance: Sequelize) => {
    User.init({
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value: string) {
                this.setDataValue("firstname", value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
            },
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value: string) {
                this.setDataValue("lastname", value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            set(value: string) {
                this.setDataValue("email", value.toLowerCase());
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            set(value: string) {
                this.setDataValue("username", value.toLowerCase());
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize: sequelizeInstance,
        tableName: DB_TABLE_NAMES.USER,
        hooks: {
            async beforeSave(user: any) {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(user.password, salt);
                    user.password = hash;
                }
            },
            afterFind(results: any) {
                if (results instanceof Array) {
                    for (const result of results) {
                        delete result.dataValues.password;
                    }
                } else {
                    delete results.dataValues.password;
                }
            },
        },
    });

    return User;
};

export default UserModel;
