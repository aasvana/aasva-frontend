import React from "react";
import { format } from 'date-fns';

const AuthFooter = () => {
    const year = format(new Date(), 'yyyy');
    return (
        <div className='p-4 text-primary-700 text-center'>
            © {year} {process.env.NEXT_PUBLIC_APP_NAME} All rights reserved.
        </div>
    );
};

export default AuthFooter;
