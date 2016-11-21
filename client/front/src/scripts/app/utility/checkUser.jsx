import * as React from 'react';
import Axios from 'axios';

export function checkUser() {
    return Axios.get("/api/auth/check")
        .then((response) => {
            response = response.data;
            if (response.status == 0) {
                return true;
            } else {
                return false;
            }
        })
        .catch((err) => {
            return false;
        });
}

export function forbiddenGenerator() {
    return <main>
        <h1>Error 403</h1>
        <h2>You are not logged</h2>
    </main>
}