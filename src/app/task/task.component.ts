import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { Task1 } from './task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input()
  task!: Task1;
@Output() edit = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  
}
