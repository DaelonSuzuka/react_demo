from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()


tasks = {}


class Task(BaseModel):
    id: str
    name: str
    completed: bool


@app.get("/api/tasks")
def get_tasks() -> list[Task]:
    return [t for t in tasks.values()]


@app.get("/api/task/{task_id}")
def get_task(task_id) -> Task | None:
    if task := tasks.get(task_id, None):
        return task

    raise HTTPException(status_code=404, detail="Task not found")


@app.post("/api/task/{task_id}")
def post_task(task_id, task: Task):
    tasks[task_id] = task


@app.delete("/api/task/{task_id}")
def delete_task(task_id):
    tasks.pop(task_id, None)


app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="site")
