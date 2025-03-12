import { logout } from "./login.js";

export const fetchGraphQL = async (query) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication token not found');
    }

    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`GraphQL request failed: ${error}`);
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return data.data;
    } catch (error) {
        console.error('GraphQL error:', error);
        logout();
    }
}

export const formatXP = (xp) => {
    if (xp >= 1000000) {
        return `${(xp / 1000000).toFixed(2)} MB`;
    } else if (xp >= 1000) {
        return `${(xp / 1000).toFixed(1)} kB`;
    }
    return xp.toString();
};
