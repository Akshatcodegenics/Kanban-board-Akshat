import { KanbanBoard } from '@/components/KanbanBoard/KanbanBoard';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { mockColumns, mockTasks } from '@/data/mockData';

const Index = () => {
  const {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  } = useKanbanBoard(mockColumns, mockTasks);

  return (
    <div className="min-h-screen bg-background">
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export default Index;
