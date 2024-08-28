export const getApi = async (url: string, params?: Record<string, string>) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const queryString = params 
        ? '?' + new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined)).toString()
        : '';

    console.log(queryString);    
    const response = await fetch(`${url}${queryString}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const getApiWithoutToken = async (url: string, params?: Record<string, string | string[]>) => {
    const buildQueryString = (params: Record<string, string | string[]>) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(val => {
                    searchParams.append(`${key}[]`, val);
                });
            } else {
                searchParams.append(key, value);
            }
        });

        return searchParams.toString();
    };

    const queryString = params ? '?' + buildQueryString(params) : '';


    const response = await fetch(`${url}${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};


export const postApi = async (url: string, data: object) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const putApi = async (url: string, data: object) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const deleteApi = async (url: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};
