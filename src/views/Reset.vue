<template>
    <div class="card">
        <form @submit.prevent="handleReset">
            <h2>Reset Password</h2>
            <input type="email" id="email" v-model="email" placeholder="Your email" required>
            <button type="submit">Reset</button>
            <router-link to="/">Go back to login</router-link>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();

const handleReset = async () => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
            redirectTo: 'http://localhost:5173/update-password',
        })

        if (error) {
            console.log(error.message);
        } else {
            console.log('data:', data);
            router.push('/login');
        }
    } catch (error) {
        console.log('Error encountered while resetting password:', error);
    }

};
</script>

<style scoped>
</style>