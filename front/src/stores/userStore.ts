import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import  apiHelper from '../helpers/apiHelper';
import type { User } from '../interfaces/user';

export const useUserStore = defineStore('userStore', () => {
    const isLogedIn = ref(false); // This is a reactive variable that will be used to check if the user is logged in or not

    const currentUser:Ref<User | undefined> = ref(undefined);

    // Function to check if the user is logged in using the token (is used at the refresh of the page to keep the user logged in)
    const tokenLogin = async () => {
        const token = localStorage.getItem('token') as string;
        if(token) {
            const response = await apiHelper.kyPost('auth/token', {}, token);
            if(response.success) {
                isLogedIn.value = true;
                currentUser.value = response.data.user as User;
            }
        }
    }

    const getUserDetailsById = async (id?:number) => {
        if(!id) {
            return;
        }
        const response = await apiHelper.kyGet(`user/${id}`);
        if(response.success) {
            return response.data as unknown as User;
        }
    }

    

return { isLogedIn, tokenLogin, getUserDetailsById, currentUser}
})
