import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from '../lib/supabaseClient';
import { Dialog } from "quasar";

export const useTaskStore = defineStore('taskStore', () => {
    const tasks = ref([]);
    const user_id = ref(null);
    const last_name = ref(null);

    const initializeUserId = async() => {
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
        }catch (error){
            Dialog.create({
                title: 'User Error',
                message: 'Error fetching user',
            });
        }
    };

    const createTask = async (task_description) => {
        try {
            await initializeUserId();
            if (task_description !== '' && task_description !== null && task_description !== undefined && task_description.length > 5) {
                const { data, error } = await supabase
                  .from('tasks')
                  .insert(
                      { task_description: task_description, user_id: user_id.value },
                  )
                  .select();
    
                  if (error) {
                    alert('Error creating task');
                  } else {
                    fetchTasks();
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

    const fetchTasks = async () => {
        try {
            await initializeUserId();
            const { data, error } = await supabase
              .from('tasks')
              .select()
              .eq('user_id', user_id.value);

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
        initializeUserId,
        createTask,
        fetchTasks,
        deleteTask,
        toggleFav,
        toggleComplete
    }
});