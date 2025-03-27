<template>
    <div class="user-name">
        <h2>Welcome, {{ last_name }}! Here are the controls for your tasks &#128071</h2>
    </div>
    <div class="controls">
        <button @click="showForm = true" class="add-button">Add task</button>
        <button @click="setFilterType('all')" class="all">All</button>
        <button @click="setFilterType('favorites')" class="fav">Favorites</button>
        <button @click="setFilterType('completed')" class="complete">Completed</button>
        <button @click="setFilterType('pending')" class="pending">Pending</button>
    </div>

    <q-dialog v-model="showForm">
        <q-card style="width: 30rem; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Create Task</div>
            </q-card-section>

            <q-card-section>
                <q-input v-model="taskToAdd" label="Name" />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Add" color="primary" @click="createTask" />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <div class="tasks">
        <TaskCard v-for="task in filteredTasks" :task="task" :key="task.id" />
    </div>

    <div class="pagination">
        <q-pagination
            v-model="currentPage"
            :max="totalPages"
            @update:model-value="onPageChange"
            boundary-numbers
            boundary-links
            color="primary"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import TaskCard from '../components/TaskCard.vue';
import { useTaskStore } from '../stores/taskStore';

// Access the task store
const taskStore = useTaskStore();
const { tasks, totalPages, currentPage, pageSize, last_name } = storeToRefs(taskStore);

// Local state
const taskToAdd = ref('');
const showForm = ref(false);
const filterType = ref('all');

// Create a new task
const createTask = async () => {
    await taskStore.createTask(taskToAdd.value);
    taskToAdd.value = '';
    showForm.value = false;
    await taskStore.getTotalPages(); // Recalculate total pages
};

// Set the filter type for tasks
const setFilterType = (type) => {
    filterType.value = type;
};

// Filter tasks based on the selected filter type
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

// Handle page change
const onPageChange = async (page) => {
    currentPage.value = page;
    await taskStore.fetchTasks(page, pageSize.value);
};

// Fetch tasks and total pages on component mount
onMounted(async () => {
    await taskStore.initializeUserId();
    await taskStore.fetchTasks(currentPage.value, pageSize.value);
    await taskStore.getTotalPages(); // Ensure total pages are calculated
});
</script>

<style scoped>
.user-name {
    h2 {
        font-size: 1.5rem;
    }
}
.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .complete {
        background-color: #6DCFA4;
    }

    .pending {
        background-color: #C9CF6D;
    }

    .fav {
        background-color: #D26A73;
    }

    .all {
        background-color: #736DCF;
    }

    .add-button {
        background-color: #736DCF;
    }
}

.tasks {
    margin-top: 2rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}
</style>