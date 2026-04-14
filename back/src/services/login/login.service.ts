import userService from "../user/user.service.js";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

class LoginService {
    async login(email: string, password: string) {
        const [user] = await userService.findBy({ emails: [email] });

        const canLogin = await bcrypt.compare(password, user.password);

        return canLogin
            ? ([
                  jwt.sign(
                      {
                          id: user.id,
                          email: user.email,
                          name: user.name
                      },
                      null
                  ),
                  user
              ] as const)
            : ([null, null] as const);
    }
}

export default new LoginService();
