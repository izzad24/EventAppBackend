import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken"

const SECRET_KEY = "secretkey23456";

interface UserInterface{
    name?: string,
    password?: string
}

export class UserController {

    private userRepository = getRepository(User);

    async register(request: Request, response: Response, next: NextFunction){
        const user = {
            name  :  request.body.name,
            email  :  request.body.email  ,      
            password  :  bcrypt.hashSync(request.body.password)
        }

        console.log(user);

        this.userRepository.save(user)
        .then(user =>{
            return response.status(200).send(`User ${user.name} added succesfully`);
        })
        .catch(error =>{
            console.log(error.message);
            return response.send(error.detail);
        })
        
        
        
    }

    async login(request: Request, response: Response, next: NextFunction){
        const email = request.body.email;
        const password = request.body.password;
        
        await this.userRepository.findOne({email: email})
        .then(user => {
            console.log(user);
            const result = bcrypt.compareSync(password, user.password);
            if (result){
                const  expiresIn  =  24  *  60  *  60;
                const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                    expiresIn:  expiresIn
                });
                return response.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
            }else{
                return response.send(`Wrong password!`);
            }
        })
        .catch(error =>{
            console.log(error.message);
            return response.send(error.detail);
        });
       
        // const result = bcrypt.compareSync(password, user.password)

    }

    /* async all(request: Request, response: Response, next: NextFunction) {
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
    } */

}