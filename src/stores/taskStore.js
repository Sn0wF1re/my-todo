import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from '../lib/supabaseClient';
import { Dialog } from "quasar";

export const useTaskStore = defineStore('taskStore', () => {
    const tasks = ref([]);
    const user_id = ref(null);
    const last_name = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref(0);

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
            fetchTasks(currentPage.value, pageSize.value);
        } else {
            Dialog.create({
                title: 'Pagination Error',
                message: 'You are already on the last page.',
            });
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
            fetchTasks(currentPage.value, pageSize.value);
        } else {
            Dialog.create({
                title: 'Pagination Error',
                message: 'You are already on the first page.',
            });
        }
    };

    const initializeUserId = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                user_id.value = user.id;
                last_name.value = user.user_metadata.last_name;
            } else {
                Dialog.create({
                    title: 'User Error',
                    message: 'No user found',
                });
            }
        } catch (error) {
            Dialog.create({
                title: 'User Error',
                message: 'Error fetching user',
            });
        }
    };

    const createTask = async (task_description) => {
        try {
            await initializeUserId();
            if (task_description && task_description.length > 5) {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert({ task_description, user_id: user_id.value })
                    .select();

                if (error) {
                    alert('Error creating task');
                } else {
                    fetchTasks(currentPage.value, pageSize.value);
                    await getTotalPages(); // Update total pages
                    Dialog.create({
                        title: 'Task Description',
                        message: 'Task created successfully',
                    });
                }
            } else {
                Dialog.create({
                    title: 'Task Description',
                    message: 'Task description is too short',
                });
            }
        } catch (error) {
            Dialog.create({
                title: 'Task Error',
                message: 'Error creating task',
            });
        }
    };

    const getTotalTasks = async () => {
        const { count } = await supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('user_id', user_id.value);
        return count || 0;
    };

    const getTotalPages = async () => {
        const totalTasks = await getTotalTasks();
        totalPages.value = Math.ceil(totalTasks / pageSize.value);
    };

    const fetchTasks = async (page = 1, pageSize = 10) => {
        try {
            await initializeUserId();
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            const { data, error } = await supabase
                .from('tasks')
                .select()
                .eq('user_id', user_id.value)
                .range(from, to);

            if (error) {
                Dialog.create({
                    title: 'Task Error',
                    message: 'Error fetching tasks',
                });
            } else {
                tasks.value = data;
            }
        } catch (error) {
            Dialog.create({
                title: 'Task Error',
                message: 'Error fetching tasks',
            });
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await supabase
              .from('tasks')
              .delete()
              .eq('id', id);
            if (!response.error) {
                fetchTasks();
                Dialog.create({
                    title: 'Task Deletion',
                    message: 'Task deleted successfully',
                });
            }
        } catch (error) {
            Dialog.create({
                title: 'Task Error',
                message: 'Error deleting task',
            });
        }
    };

    const toggleFav = async (task) => {
        try {
            const updatedStatus = !task.favorite;
            const { error } = await supabase
              .from('tasks')
              .update({ favorite: updatedStatus })
              .eq('id', task.id);
            
            if (error) {
                Dialog.create({
                    title: 'Task Error',
                    message: 'Error toggling fav',
                });
            } else {
                fetchTasks();
            }
        } catch (error) {
            Dialog.create({
                title: 'Task Error',
                message: 'Error toggling fav',
            });
        }
    };

    const toggleComplete = async (task) => {
        try {
            const updatedStatus = !task.completed;
            const { error } = await supabase
              .from('tasks')
              .update({ completed: updatedStatus })
              .eq('id', task.id);
            
            if (error) {
                Dialog.create({
                    title: 'Task Error',
                    message: 'Error marking task as done',
                });
            }else {
                fetchTasks();
            }
        } catch (error) {
            Dialog.create({
                title: 'Task Error',
                message: 'Error marking task as done',
            });
        }
    }

    return {
        tasks,
        user_id,
        last_name,
        currentPage,
        pageSize,
        totalPages,
        nextPage,
        prevPage,
        initializeUserId,
        createTask,
        getTotalTasks,
        getTotalPages,
        fetchTasks,
        deleteTask,
        toggleFav,
        toggleComplete
    }
});