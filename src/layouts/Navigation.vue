<template>
    <nav class="nav">
        <h1>What's Next?</h1>
        <button @click="handleLogOut">Log out</button>
    </nav>

    <slot />
</template>

<script setup>
import { supabase } from '../lib/supabaseClient';
import router from '../router';

const handleLogOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log('Error encountered while logging out:', error);
        } else {
            router.push('/login');
        }
    } catch (error) {
        console.log('Error encountered while logging out:', error);
    }
};
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1rem;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.1);

    button {
        background-color: #E75559;
        color: #242424;
    }
}
</style>