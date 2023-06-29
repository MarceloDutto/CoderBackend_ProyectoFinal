import passport from "passport";

const handlePolicies = (policies) => {
    if(policies.includes('PUBLIC')) {
        return (req, res, next) => {
            if(req.headers.cookie) {
                const cookies = req.headers.cookie.split('; ');
                const authCookie = cookies.find(cookie => cookie.startsWith('authToken='))
                if(authCookie) return res.redirect('/products'); 
            }
            next();
        }
    };
    return async (req, res, next) => {
        passport.authenticate('jwt', function(err, user, info) {
            if(err) return next(err);

            if(!user) {
                return res.status(401).json({status: 'error', message: 'Debes ser un usuario registrado para ver esta página'});
            }

            if(!policies.includes(user.userData.role.toUpperCase())) {
                return res.status(403).json({status: 'error', message: 'No tiene autorización para ver esta página'});
            }

            req.user = user.userData;
            next();
        }) (req, res, next);
    };
};

export default handlePolicies;