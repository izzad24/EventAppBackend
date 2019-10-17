import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import * as bcrypt from "bcryptjs";

const SECRET_KEY = "secretkey23456";

export class UserController {

    private userRepository = getRepository(User);

    async register(request: Request, response: Response, next: NextFunction){
        const user = {
            name  :  request.body.name,
            email  :  request.body.email  ,      
            password  :  bcrypt.hashSync(request.body.password)
        }

        console.log(user);

        this.userRepository.save(user).catch(error =>{
            console.log(error.message);
            return response.send(error.message);
        });
        
    }

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}