import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { Task1 } from './task/task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-fire';
  // todo: Task1[] = [
  //   { title: 'Buy Milk', description: 'Go to the store and buy milk' },
  //   { title: 'Crate Kanban Board', description: 'Develop a Kanban board' },
  // ]
  // inProgress: Task1[] = [];
  // done: Task1[] = [];
  todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task1[]>;
  inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task1[]>;
  done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task1[]>;

  constructor(private dialog: MatDialog , private store: AngularFirestore) {

  }
  editTask(list: 'done' | 'inProgress' | 'todo', task: Task1) {
    console.log(list);
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task, enableDelete: true
      }
    });
    const dataList = this[list];
  //  const taskIndex = dataList.indexOf(task);
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
      
  }
  drop(event: CdkDragDrop<any>): void { debugger
    if (event.previousContainer === event.container) {
      return;
    }
    console.log(event.previousContainer.data);
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
  
  newTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => this.store.collection('todo').add(result.task));

  }
}
