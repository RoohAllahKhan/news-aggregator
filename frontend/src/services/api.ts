export const getApi = async (url: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(url, {
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
