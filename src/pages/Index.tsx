
import { TodoList } from "@/components/TodoList";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-8">
        <TodoList />
      </main>
    </div>
  );
};

export default Index;
