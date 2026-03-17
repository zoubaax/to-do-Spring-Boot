package spring.crud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.crud.Model.Task;
import spring.crud.Service.TaskService;

import java.util.List;

/**
 * @RestController: Tells Spring this class will handle RESTful HTTP requests (like GET, POST).
 * @RequestMapping("/api/tasks"): All endpoints in this class will start with this URL.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allows your frontend (like React or Vue) to talk to the backend.
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * GET method to retrieve all tasks.
     * URL: http://localhost:8080/api/tasks
     */
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    /**
     * GET method to retrieve a single task by ID.
     * We use ResponseEntity for better control over the HTTP Response (Status codes, Body).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok) // If task exists, return 200 OK
                .orElse(ResponseEntity.notFound().build()); // If not, return 404 Not Found
    }

    /**
     * POST method to create a new task.
     * @RequestBody: This tells Spring to take the JSON from the request and turn it into a Task object.
     */
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    /**
     * PUT method to update an existing task.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            return ResponseEntity.ok(taskService.updateTask(id, taskDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE method to remove a task.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build(); // 204 No Content is standard for successful deletion.
    }
}
