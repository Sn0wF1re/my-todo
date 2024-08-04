import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from './lib/supabaseClient';

export const useTaskStore = defineStore('taskStore', () => {
    const tasks = ref([]);
    const fav = ref(false);

    const createTask = async (task) => {
        try {
            await supabase
              .from('tasks')
              .insert([
                  { task_name: task },
              ])
              .select()
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const data = await supabase
              .from('tasks')
              .select('*')
            tasks.value = data;
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await supabase
              .from('tasks')
              .delete()
              .eq('id', id)
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const toggleFav = async (id) => {
        try {
            await supabase
              .from('tasks')
              .update({ fav: !fav.value })
              .eq('id', id)
        } catch (error) {
            console.error('Error toggling fav', error);
        }
    };


    return {
        tasks,
        createTask,
        fetchTasks,
        deleteTask,
        toggleFav
    }
});