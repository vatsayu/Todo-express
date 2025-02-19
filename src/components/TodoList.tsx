
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Plus, Search, Trash2 } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate?: Date;
}

type FilterStatus = "all" | "active" | "completed";

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [streak, setStreak] = useState(0);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Calculate streak
  useEffect(() => {
    const completedToday = todos.some(
      (todo) => todo.completed && isToday(new Date(todo.dueDate || ""))
    );
    if (completedToday) {
      setStreak((prev) => prev + 1);
    }
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: "medium",
        category: "personal",
      },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && todo.completed) ||
      (filterStatus === "active" && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fadeIn">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              prefix={<Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              onClick={() => setFilterStatus("active")}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              onClick={() => setFilterStatus("completed")}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1"
          />
          <Button onClick={addTodo} size="icon">
            <Plus className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        {streak > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            🔥 {streak} day streak!
          </div>
        )}

        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              className={`p-4 hover-card ${
                todo.completed ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex-1 ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.text}
                  {todo.priority === "high" && (
                    <span className="ml-2 text-destructive">⚡</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <Check
                      className={`w-4 h-4 ${
                        todo.completed ? "text-primary" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      {todo.completed ? "Mark as incomplete" : "Mark as complete"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
