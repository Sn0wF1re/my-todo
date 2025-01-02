<template>
    <div class="card">
        <form @submit.prevent="handleLogin">
            <h2>Log In</h2>
            <input type="email" id="email" v-model="email" placeholder="Your email" required>
            <input type="password" id="password" v-model="password" placeholder="Your password" required>
            <button type="submit">Log in</button>

            <div class="alternatives">
                <router-link to="/reset">Reset password</router-link>
                <router-link to="/register">Sign up instead</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })

        if (error) {
            console.log(error.message);
            alert('Wrong email or password');
        } else {
            console.log('data:', data)
            router.push('/tasks');
        }
    } catch (error) {
        console.log('Error encountered while logging in:', error);
    }
};
</script>

<style scoped>
.alternatives {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>