export const UserService = {

    async createUserByAdmin({ email, password, fullName, phone, role }) {
        // Llamamos a nuestra API interna que corre del lado del servidor
        const response = await fetch('/api/admin/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, fullName, phone, role }),
        });

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.error || 'Error en la petición del servidor');
        }

        return resData;
    }
};