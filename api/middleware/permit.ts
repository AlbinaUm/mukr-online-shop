import {NextFunction, Request, Response} from "express";
import {RequestWithUser} from "./auth";

const permit = (...roles: string[]) => {
    return (expressReq: Request, res: Response, next: NextFunction) => {
        const req = expressReq as RequestWithUser;

        if (!req.user) {
            res.status(401).send({message: 'Unauthentication'});
            return;
        }


        if (!roles.includes(req.user.role)) {
            res.status(403).send({message: 'Unathorized'});
            return;
        }

        next();
    }
};

export default permit;