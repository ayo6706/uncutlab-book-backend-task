import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import DB_TABLE_NAMES from "../../helpers/constants";

class User extends Model {
    public firstname!: string;

    public lastname!: string;

    public email!: string;

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
                if (value !== undefined) {
                    this.setDataValue("firstname", value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
                }
            },
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value: string) {
                if (value !== undefined) {
                    this.setDataValue("lastname", value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
                }
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            set(value: string) {
                if (value !== undefined) {
                    this.setDataValue("email", value.toLowerCase());
                }
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
            afterFind(results: User) {
                if (results === null) {

                }
            },
        },
    });

    return User;
};

export default UserModel;
