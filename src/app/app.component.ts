import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterService } from './service/master.service';
import { ApiResponseModel, ITask, Task } from './model/task';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ang-todo';
  taskObj: Task = new Task();
  taskList: ITask[] = [];
  masterService = inject(MasterService);
  ngOnInit(): void {
    this.loadAllTask();
  }
  loadAllTask() {
    this.masterService.getAllTaskList().subscribe((res: ApiResponseModel) => {
      this.taskList = res.data;
    });
  }
  addTask() {
    this.masterService.addNewTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task added successfully');
          this.loadAllTask();
          this.taskObj = new Task();
        }
      },
      (error) => {
        alert('something went wrong on api call');
      }
    );
  }
  onEdit(item: Task) {
    this.taskObj = item;
    setTimeout(() => {
      const dat = new Date(this.taskObj.dueDate);
      const day = ('0' + dat.getDate()).slice(-2);
      const month = ('0' + (dat.getMonth() + 1)).slice(-2);
      const today = dat.getFullYear() + '-' + month + '-' + day;
      (<HTMLInputElement>document.getElementById('textDate')).value = today;
    }, 1000);
  }
  updateTask() {
    this.masterService.updateTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task updated successfully');
          this.loadAllTask();
          this.taskObj = new Task();
        }
      },
      (error) => {
        alert('something went wrong on api call');
      }
    );
  }
  onDelete(id: number) {
    const isConfirm = confirm('Are you sure want to delete');
    if (isConfirm) {
      this.masterService.deleteTask(id).subscribe(
        (res: ApiResponseModel) => {
          if (res.result) {
            alert('Task Deleted successfully');
            this.loadAllTask();
          }
        },
        (error) => {
          alert('something went wrong on api call');
        }
      );
    }
  }
}
