import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from '../lib/supabaseClient';

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
                console.log('No user found');
            }
        }catch (error){
            console.log(error);
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
                    alert('Task created successfully');
                  }
            } else {
                alert('Task description is too short');
            }
        } catch (error) {
            console.error('Error creating task', error);
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
                console.error('Error fetching tasks', error);
            } else {
                tasks.value = data;
                console.log('tasks', tasks.value);
            }
        } catch (error) {
            console.error('Error fetching tasks', error);
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
                alert('Task deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting task', error);
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
                console.error('Error toggling fav', error);
            } else {
                fetchTasks();
                console.log('Task status after toggle:',updatedStatus);
            }
        } catch (error) {
            console.error('Error toggling fav', error);
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
                console.error('Error marking task as done', error);
            }else {
                fetchTasks();
                console.log('Task status after completed toggle:', updatedStatus);
            }
        } catch (error) {
            console.error('Error marking task as done', error);
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