<template>
    <div class="card">
        <form @submit.prevent="handleUpdate">
            <h2>Update Password</h2>
            <input type="text" id="password" v-model="newPassword" placeholder="Your new password" required>
            <button type="submit">Update</button>
            <router-link to="/">Go to login</router-link>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';

const newPassword = ref('');
const router = useRouter();

const handleUpdate = async () => {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword.value
        })


        if (error) {
            console.log(error.message);
        } else {
            console.log('data:', data);
            router.push('/');
        }
    } catch (error) {
        console.log('Error encountered while updating password:', error);
    }

};
</script>

<style scoped>
</style>