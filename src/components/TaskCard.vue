<template>
    <main>
        <div class="task-card">
            <p>{{ task.task_description }}</p>
            <div class="icons">
                <span
                @click="toggleFavorite"
                class="material-symbols-sharp"
                :style="{ color: task.favorite ? 'red' : '' }"
                >
                favorite
                </span>

                <span
                @click="toggleComplete"
                class="material-symbols-sharp"
                :style="{ color: task.completed ? 'green' : '' }" 
                >
                check_box
                </span>

                <span
                @click="deleteTask"
                class="material-symbols-sharp"
                >
                delete
                </span>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore';

const props = defineProps({
    task: Object
});

console.log('task', props.task);

const taskStore = useTaskStore();

const deleteTask = () => {
    taskStore.deleteTask(props.task.id);
};

const toggleFavorite = () => {
    taskStore.toggleFav(props.task);
    console.log('toggled');
};

const toggleComplete = () => {
    taskStore.toggleComplete(props.task);
    console.log('completed toggled');
};
</script>

<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    .task-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 50vw;
        padding: 0.5rem 1rem;
        box-shadow: 0 0 10px 7px rgba(0, 0, 0, 0.1);
    
        p {
            margin-right: 1rem;
        }

        .icons {
            .material-symbols-sharp {
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                color: black;
                cursor: pointer;
                margin-right: 1rem;
            }
        
            .favorite {
                color: black;
            }
        }    
    }
}

@media screen and (max-width: 850px) {
    main {
        .task-card {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
    }
}
</style>