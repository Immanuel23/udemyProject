import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercixe.model';
import { TrainingService } from '../training.service';

import { Subscription } from "rxjs";

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginarot: MatPaginator;
  private exChangedSub: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exChangedSub = this.trainingService.finishedExChanged.subscribe(
      ((exercise: Exercise[])=>{
        this.dataSource.data = exercise;
      })
    )
    this.trainingService.fetchCompletedOrCancelledExercises()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginarot;
  }
  ngOnDestroy(){
    this.exChangedSub.unsubscribe()
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase()
  }

}
