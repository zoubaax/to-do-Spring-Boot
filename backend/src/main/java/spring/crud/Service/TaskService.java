package spring.crud.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spring.crud.Model.Task;
import spring.crud.Repository.TaskRepository;

import java.util.List;
import java.util.Optional;

/**
 * @Service: This marks this class as a Service Bean.
 * This is where we write our "Business Logic" - what the app actually does with the data.
 */
@Service
public class TaskService {

    /**
     * @Autowired: This is Dependency Injection! Spring automatically gives us an instance
     * of TaskRepository when we need it.
     */
    @Autowired
    private TaskRepository taskRepository;

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get one task by its ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Save a new task or update an existing one
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Update a task
    public Task updateTask(Long id, Task taskDetails) {
        // We first find the task, then update it.
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.isCompleted());
        
        return taskRepository.save(task);
    }

    // Delete a task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
