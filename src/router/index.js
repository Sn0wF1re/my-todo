import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabaseClient";
import Todo from '../views/Todo.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import UpdatePassword from '../views/UpdatePassword.vue';
import Reset from '../views/Reset.vue';
import Navigation from '../layouts/Navigation.vue';


let localUser;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tasks',
      name: 'Todo',
      component: Todo,
      meta: {
        layout: Navigation,
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'signup',
      component: Signup
    },
    {
      path: '/reset',
      name: 'reset-password',
      component: Reset
    },
    {
      path: '/update-password',
      name: 'update-password',
      component: UpdatePassword
    },
  ]
});

async function getUser(next) {
	localUser = await supabase.auth.getSession();
	if (localUser.data.session == null) {
		next('/login')
	}
	else {
		next();
	}
}

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		getUser(next);
	}
	else {
		next();
	}
})

export default router