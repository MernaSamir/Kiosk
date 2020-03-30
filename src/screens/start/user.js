export default (token)=>{
    return {
        auths__user: {
            filter: {
                auth_token__key: token
            }
        },
        auths__roles: {
            filter: {
                role_users__auth_token__key: token
            }
        },
        auths__pos_functions: {
            filter: {
                role__role_users__auth_token__key: token
            }
        },
        financials__cash_settlement: {
            filter: {
                cashier__auth_token__key: token
            }
        }
    }
}