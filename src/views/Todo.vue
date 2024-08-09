<template>
    <div class="user-">
        <h2>Welcome, {{ last_name }}! Here are the controls for your tasks &#128071</h2>
    </div>
    <div class="controls">
        <button @click="showForm=true" class="add-button">Add task</button>
        <button @click="setFilterType('all')" class="all">All</button>
        <button @click="setFilterType('favorites')" class="fav">Favorites</button>
        <button @click="setFilterType('completed')" class="complete">Completed</button>
        <button @click="setFilterType('pending')" class="pending">pending</button>
    </div>

    <div class="add-task" v-if="showForm">
        <input v-model="taskToAdd" type="text" placeholder="Add a task" />
        <button @click="createTask">Add task</button>
    </div>

    <div class="tasks">
        <TaskCard v-for="task in filteredTasks" :task="task" :key="task.id" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import TaskCard from '../components/TaskCard.vue';
import { useTaskStore } from '../stores/taskStore';


const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);
const taskToAdd = ref('');
const showForm = ref(false);
const filterType = ref('all');
const { last_name } = storeToRefs(taskStore);

const createTask = () => {
    taskStore.createTask(taskToAdd.value);
    taskToAdd.value = '';
    showForm.value = false;
};

const setFilterType = (type) => {
    filterType.value = type;
};

const filteredTasks = computed(() => {
    if (filterType.value === 'all') {
        return tasks.value;
    } else if (filterType.value === 'favorites') {
        return tasks.value.filter(task => task.favorite);
    } else if (filterType.value === 'completed') {
        return tasks.value.filter(task => task.completed);
    } else if (filterType.value === 'pending') {
        return tasks.value.filter(task => !task.completed);
    }
});

onMounted(async () => {
    await taskStore.fetchTasks();
    await taskStore.initializeUserId();
});
</script>

<style scoped>
.controls {
    .complete {
        background-color: green;
    }

    .pending {
        background-color: yellowgreen;
    }

    .fav {
        background-color: red;
    }

    .all {
        background-color: blue;
    }

    .add-button {
        background-color: blue;
    }
}

.add-task {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;

    input {
        padding: 0.5rem;
        margin-right: 1rem;
        outline: none;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: blue;
    }
}

.tasks {
    margin-top: 2rem;
}

button {
    margin: 0 0.5rem;
    color: #242424;
}

@media screen and (max-width: 850px) {
    .controls {
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        .all, .fav, .complete, .add-button {
            margin-bottom: 1rem;
        }
    }

    .add-task {
        flex-direction: column;
        justify-content: center;
        align-items: center;

        input {
            width: 80%;
            margin-right: 0;
            margin-bottom: 1rem;
        }
    }
}
</style>