import ky from 'ky'

interface ApiResponse {
    success: boolean
    data: Record<string, unknown>
}

//create ky instance with api key and base url
const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY as string
  }
})

//function to make a post request with token
const kyPost = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.post(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
};

//kyPost with long timeout
const kyPostLongTimeout = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.post(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeout: 600000
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
};

//function to make a put request with token
const kyPut = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.put(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

//function to make a delete request with token
const kyDelete = async (url: string, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.delete(url, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

//function to make a get request
const kyGet = async (url: string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.get(url).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}
const kyGetWithToken = async (url: string, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.get(url, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

//function to make a post request without token
const kyPostWithoutToken = async (url: string, data: any): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.post(url, { json: data }).json();
        return { success: true, data: response } as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

const kyPutWithoutToken = async (url: string, data: any): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.put(url, { json: data }).json();
        return { success: true, data: response } as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

//function to get cat from the cat api
const getCat = async (): Promise<string> => {
    try {
        const response = await ky.get('https://api.thecatapi.com/v1/images/search').json() as Array<{ url: string }>;
        return response[0].url;
    } catch (error) {
        console.error(error);
        return '';
    }
}

export default { kyPost, kyPut, kyDelete, kyGet, kyPostWithoutToken,kyPutWithoutToken, getCat,kyGetWithToken, kyPostLongTimeout}
